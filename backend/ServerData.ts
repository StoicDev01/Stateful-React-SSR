import CharacterBase, { NameGeneratorGenderGroup } from "../frontend/components/lib/generator/src/CharacterBase";
import NameGenerator from "../frontend/components/lib/generator/src/NameGenerator";

import Fauna from "faunadb"
import Character from "../frontend/components/lib/generator/src/Character";

import Schedule from "node-schedule"
import { GlobalRef } from "./GlobalRef";

interface DataLoad {
    load : (faunadbClient : Fauna.Client) => void;
}

interface CharacterQueueData {
    character : Character;
    time : number;
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

        for (const baseRef of basesRef.data as Array<any>){
            const { data } : any = await faunadbClient.query(
                Fauna.Get(baseRef)
            );
                
            const baseName = data.Config.name;
            const base = new CharacterBase();

            console.log(`> Loading base : ${baseName}`);

            base.loadJson(data);
            this.set(baseName, base);
        }
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

        for (const nameDatasetRef of namesDatasets.data as Array<any>){
            const { data } : any = await faunadbClient.query(
                Fauna.Get(nameDatasetRef)
            );
                
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
                nameGeneratorData.neuter = newNameGenerator;            
            }

            if (data.femaleNames){
                const newNameGenerator = new NameGenerator();
                newNameGenerator.loadText(data.femaleNames);
                nameGeneratorData.neuter = newNameGenerator;            
            }

            this.set(datasetName, nameGeneratorData);
        }
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

export class ServerData{
    private faunaClient : Fauna.Client;
    characterBases : CharacterBasesData;
    nameGenerators : NameGeneratorsData;
    generatedCharacters : CharacterGenerationQueue;

    constructor(){
        console.log("> Starting Server Data!")
        this.faunaClient = new Fauna.Client();
        this.characterBases = new CharacterBasesData();
        this.nameGenerators = new NameGeneratorsData();
        this.generatedCharacters = new CharacterGenerationQueue();
    }

    static async create(){
        const serverData = new ServerData()
        serverData.connect();
        await serverData.load();
        return serverData;
    }

    connect(){
        this.faunaClient = new Fauna.Client({ secret : process.env.FAUNADB_SERVER || ""});
        console.log("> CONNECTED TO FAUNADB!");
    }

    async load(){
        const p1 = this.characterBases.load(this.faunaClient);
        const p2 = this.nameGenerators.load(this.faunaClient);

        await p1;
        await p2;

        console.log("> ServerData Loaded Successfully!");
    }
}

const ServerDataRef = new GlobalRef<ServerData>("ServerData");

if (!ServerDataRef.value){
    ServerDataRef.value = new ServerData();
    ServerDataRef.value.connect();
    ServerDataRef.value.load();
}

export const serverData = ServerDataRef.value;