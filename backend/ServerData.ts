import CharacterBase, { NameGeneratorGenderGroup } from "./lib/generator/src/CharacterBase"
import NameGenerator from "./lib/generator/src/NameGenerator";
import Fauna from "faunadb"
import Character from "./lib/generator/src/Character";
import Schedule from "node-schedule"
import { GlobalRef } from "./GlobalRef";

dotenv.config();

console.log(process.env.FAUNADB_SERVER);

interface DataLoad {
    load : (faunadbClient : Fauna.Client) => void;
}

interface CharacterQueueData {
    character : Character;
    time : number;
}

interface Feedback{ 
    user : string;
    message : string;
}

class CharacterBasesData extends Map<string, CharacterBase> implements DataLoad {
    constructor(){
        super();
    }

    async load(faunadbClient : Fauna.Client){
        console.log("> Loading Bases")
        const basesRef : any = await faunadbClient.query(
            Fauna.Paginate(
                Fauna.Documents(
                    Fauna.Collection("CharacterBases")
                )
            )
        )

        const queriesPromises = [];

        for (const baseRef of basesRef.data as Array<any>){
            const promise =  faunadbClient.query(
                Fauna.Get(baseRef)
            );

            queriesPromises.push(promise);
        }

        await Promise.all(queriesPromises).then((queries) => {
            for ( const query of queries){
                const data = (query as any ).data;
                const baseName = data.Config.name;
                const base = new CharacterBase();
    
                console.log(`> Loading base : ${baseName}`);
    
                base.loadJson(data);
                this.set(baseName, base);
            }
        })
    }
}

class NameGeneratorsData extends Map<string,  NameGeneratorGenderGroup>  implements DataLoad{
    constructor(){
        super();
    }

    async load(faunadbClient : Fauna.Client){
        console.log("> Loading NameGenerators");
        const namesDatasets : any = await faunadbClient.query(
            Fauna.Paginate(
                Fauna.Documents(
                    Fauna.Collection("NamesDatasets")
                )
            )
        )

        let queriesPromises : Promise<Object>[] = new Array<Promise<Object>>();

        for (const nameDatasetRef of namesDatasets.data as Array<any>){
            const promise  = faunadbClient.query(
                Fauna.Get(nameDatasetRef)
            );
            queriesPromises.push(promise);
        }

        await Promise.all(queriesPromises).then( ( queries : any[]) => {
            queries.forEach( (query) => {
                const data = query.data;
                const datasetName = data.name;
        
                const nameGeneratorData : NameGeneratorGenderGroup = {
                    neuter : undefined,
                    male : undefined,
                    female : undefined
                }
        
                console.log(`> Loading Names Dataset : ${datasetName}`);
                
                if (data.neuterNames){
                    const newNameGenerator = new NameGenerator();
                    newNameGenerator.loadText(data.neuterNames);
                    nameGeneratorData.neuter = newNameGenerator;
                }
                
                if (data.maleNames){
                    const newNameGenerator = new NameGenerator();
                    newNameGenerator.loadText(data.maleNames);
                    nameGeneratorData.male = newNameGenerator;            
                }
        
                if (data.femaleNames){
                    const newNameGenerator = new NameGenerator();
                    newNameGenerator.loadText(data.femaleNames);
                    nameGeneratorData.female = newNameGenerator;            
                }
        
                this.set(datasetName, nameGeneratorData);
            });
        });

    }
}

class CharacterGenerationQueue{
    data : Map<string,  CharacterQueueData>

    constructor(){
        this.data = new Map<string, CharacterQueueData>();

        // create a new job that executes every 1 hour
        Schedule.scheduleJob("Clean Character Generation QUeue", "* * */1 * *", async () => this.cleanJob);
    }

    cleanJob(){
        console.log("> Running Clean Characters Job");
        const now = Date.now();

        for (const [ id, characterQueue] of this.data){
            const createdDate = characterQueue.time;
            const elapsedMs = now - createdDate;
            const elapsedHours = elapsedMs / 1000 / 60 / 60;

            if ( elapsedHours >= 2 ){
                console.log(`Cleaning character ID ${id} created ${elapsedHours} hours before`);
                this.data.delete(id);
            }
        }
    }

    AddToQueue(key: string, value: Character): this {
        const CharacterQueueData : CharacterQueueData = {
            character : value,
            time : Date.now()
        };
 
        this.data.set(key, CharacterQueueData);
        return this;
    }
}

export class ServerDataClass{
    private faunaClient : Fauna.Client;
    private status : "loaded" | "unloaded" | "loading";

    public characterBases : CharacterBasesData;
    public nameGenerators : NameGeneratorsData ;
    public generatedCharacters : CharacterGenerationQueue;

    constructor(){
        this.status = "unloaded";
        this.faunaClient = new Fauna.Client({ secret : process.env.FAUNADB_SERVER || ""});    
        this.characterBases = new CharacterBasesData();
        this.generatedCharacters = new CharacterGenerationQueue();
        this.nameGenerators = new NameGeneratorsData();

        console.log("> CONNECTED TO FAUNADB!");
    }

    async load(){
        console.log("> LOADING SERVER DATA...");
        const p1 = this.characterBases.load(this.faunaClient);
        const p2 = this.nameGenerators.load(this.faunaClient);
        this.status = "loading";

        await Promise.all([p1, p2]);

        this.status = "loaded";
        console.log("> ServerData Loaded Successfully!");
    }

    getStatus(){
        return this.status;
    }

    async postFeedBack(feedback : Feedback){
        const hasCollection = await this.faunaClient.query(
            Fauna.Exists(
                Fauna.Collection("Feedbacks")
            )
        )

        let collectionRef;

        if (!hasCollection){
            const createdCollection : any = await this.faunaClient.query(
                Fauna.CreateCollection({
                    name : "Feedbacks"
                })
            )

            collectionRef = createdCollection.ref;
        }
        else{
            const collection : any = await this.faunaClient.query(
                Fauna.Get(
                    Fauna.Collection("Feedbacks")
                )
            )
            collectionRef = collection.ref;
        }

        await this.faunaClient.query(
            Fauna.Create(
                collectionRef,
                {
                    data : feedback
                }
            )
        )
    }
}

import dotenv from "dotenv"

dotenv.config();

const serverData = new GlobalRef<ServerDataClass>("ServerData");

if (!serverData.value){
    serverData.value = new ServerDataClass();
}

export const ServerData = serverData.value;