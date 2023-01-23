import * as Generator from "../../components/Generator"
import { Config } from "../../components/generator/GeneratorConfigList"
import React from "react"
import ReactDOMServer from "react-dom/server";
import {  Grid, Button, Box, MenuItem } from "@mui/material"
import { BiRotateRight, BiDownload } from "react-icons/bi"
import { merge } from "lodash"
import { saveAs } from "file-saver"
import { Select } from "@mui/material"

import { frontendURL, backendURL } from "../../../config"

interface Props{

}

// interfaces
interface State {
    description : { [ key : string ] : string[]};
    character : CharacterData | undefined;
    characterID: string;
    baseName : string;
    characterJsonURL? : string;
    characterPdfURL? : string;
    characterHTMLURL? : string;
    base? : object;
    bases: string[];
}

interface AttributeGroup {
    [key : string ] : any
}

interface AttributeGroups {
    [key : string ] : AttributeGroup
}

interface CharacterData {
    AttributeGroups : AttributeGroups,
    config : Config;
}

interface EditOptions {
    editType : "regenerate" | "edit";
    attrKey? : string ;
    attrGroupKey? : string ;
    newValue? : unknown ;
    charIndex? : number ;
}

// BACKEND REQUESTS
async function getBases() : Promise<Array<string> | undefined>{
    const options : RequestInit = {
        method : "GET",
        headers : new Headers({
            'Content-Type' : "application/json",
            Accept : "application/json"
        })
    };

    const result = await (await fetch(`${backendURL}/api/bases`, options)).json();
    return result.bases;
}

async function createCharacter(baseName : string) : 
    Promise< { characterID : string, character : CharacterData} | undefined>
{
    /// get character prototype
    const options: RequestInit = {
        method : "POST",
        body : JSON.stringify({
            baseName : baseName
        }),
        headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }),
    }

    const result = await (await fetch(`${backendURL}/api/create/character`, options)).json();
    return result;
}


async function editCharacter(characterID : string, editOptions : EditOptions) : 
    Promise< {patch : object, description : { [key : string] : string[] }} | undefined>
{
    const options: RequestInit = {
        method : "POST",
        body : JSON.stringify({
            characterID : characterID,
            editOptions : editOptions
        }),
        headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }),
    }

    const result = await (await fetch(`${backendURL}/api/edit/character`, options)).json();
    return result;
}

export default class CharacterGeneratorPage extends React.Component<Props, State>{
    descriptionComponentRef : React.RefObject<Generator.Description>;

    constructor(props : Props){
        super(props);

        this.createCharacter            =   this.createCharacter.bind(this);
        this.onGenerate                 =   this.onGenerate.bind(this);
        this.onGenerateAttribute        =   this.onGenerateAttribute.bind(this);
        this.onEditAttribute            =   this.onEditAttribute.bind(this);
        this.onEditBase                 =   this.onEditBase.bind(this);
        this.onAddCharacteristic        =   this.onAddCharacteristic.bind(this);
        this.onRemoveCharacteristic     =   this.onRemoveCharacteristic.bind(this);

        this.state = {
            description : {},
            character : undefined,
            characterID : "",
            baseName : "undefined",
            bases : [],
            base : {}
        }

        this.descriptionComponentRef = React.createRef();

    }

    async componentDidMount() {
        const bases = await getBases();

        if ( bases){
            const firstBase = bases[0];
    
            this.setState({
                bases : bases,
                baseName : firstBase
            });

            await this.createCharacter(firstBase);
        }
    }

    async createCharacter(baseName : string){
        const result = await createCharacter(baseName);

        if (result){
            this.setState({
                characterID : result.characterID,
                character : result.character
            })

            this.createCharacterJsonUrl(result.character);
        }
    }

    clientDownloadURI(uri : string, fileName: string){
        const a = document.createElement("a");
        a.href = uri;
        a.setAttribute("download", fileName);
        document.body.appendChild(a);
        a.click();
    }

    createCharacterJsonUrl(character : object){
        if (this.state.characterJsonURL){
            URL.revokeObjectURL(this.state.characterJsonURL);
        }

        let characterJson = new Blob([JSON.stringify(character, undefined, 4)], {
            type : "application/json"
        });

        this.setState({
            characterJsonURL : URL.createObjectURL(characterJson)
        });
    }

    createCharacterHTML( description : React.ReactElement<any, string>){
        if (this.state.characterHTMLURL){
            URL.revokeObjectURL(this.state.characterHTMLURL)
        }

        const html = ReactDOMServer.renderToStaticMarkup(description);
        const blob = new Blob([html], { type : "application/html"})

        this.setState({
            characterHTMLURL : URL.createObjectURL(blob)
        });   
    }
    // EVENTS
    async onGenerate(){
        if (this.state.characterID){
            const result = await editCharacter(this.state.characterID, { editType : "regenerate"});

            if (result){
                const characterPatch = result.patch;
                let currentCharacter = this.state.character;

                if ( currentCharacter !== undefined){
                    const newCharacter = merge(currentCharacter, characterPatch);

                    this.setState({
                        character : newCharacter,
                        description : result.description
                    })

                }
            }
        }
    }

    async onEditBase(newBase : string) {
        const result = await createCharacter(newBase);

        if (result){
            this.setState({
                character : result.character,
                characterID : result.characterID,
                baseName : newBase
            });
        }
    }

    async onGenerateAttribute(groupKey: string, attrKey: string, characteristicIndex?: number){

        if (this.state.characterID){
            const result = await editCharacter(this.state.characterID, {
                editType : "regenerate",
                attrGroupKey : groupKey,
                attrKey : attrKey,
                charIndex : characteristicIndex
            })


            if (result && this.state.character){
                let character = this.state.character;
                const AttrGroup = character.AttributeGroups[groupKey]

                if ( AttrGroup){
                    const attribute = AttrGroup[attrKey];

                    if (typeof attribute === "object"){
                        // clear last attribute to merge
                        attribute["value"] = [];
    
                        const newCharacter = merge(this.state.character, result.patch);
    
                        this.setState({
                            character : newCharacter,
                            description : result.description
                        });
                    }
                }
            }
        }
    }

    async onEditAttribute(groupKey : string, attrKey : string, newValue : unknown){
        if (this.state.characterID){
            const result = await editCharacter(this.state.characterID, {
                editType : "edit",
                attrGroupKey : groupKey,
                attrKey : attrKey,
                newValue : newValue
            })
            
            if (result){
                const newCharacter = merge(this.state.character, result.patch)
                this.setState({
                    character : newCharacter,
                    description : result.description
                });
            }
        }
    }

    async onAddCharacteristic(groupKey : string, attrKey : string){
        const attributeGroups = this.state.character?.AttributeGroups;

        if (attributeGroups){
            const attrGroup = attributeGroups[groupKey];
            const attribute = attrGroup[attrKey];
            
            if (typeof attribute === "object" && Array.isArray(attribute.value)){
                let newValue = attribute.value as Array<Object>;
                newValue.push({ name : "new Characteristic", description : "new Characteristic" });

                if (this.state.characterID){
                    const result = await editCharacter(this.state.characterID, {
                        editType : "edit",
                        attrGroupKey : groupKey,
                        attrKey : attrKey,
                        newValue : newValue
                    })
                    
                    if (result){
                        const newCharacter = merge(this.state.character, result.patch)
                        this.setState({
                            character : newCharacter,
                            description : result.description
                        });

                    }
                }
            }
        }
    }

    async onRemoveCharacteristic(groupKey : string, attrKey : string, characteristicIndex : number){
        const attributeGroups = this.state.character?.AttributeGroups;

        if (attributeGroups){
            const attrGroup = attributeGroups[groupKey];
            const attribute = attrGroup[attrKey];
            
            if (typeof attribute === "object" && Array.isArray(attribute.value)){
                let newValue = attribute.value as Array<Object>;
                newValue.splice(characteristicIndex, 1);

                if (this.state.characterID){
                    const result = await editCharacter(this.state.characterID, {
                        editType : "edit",
                        attrGroupKey : groupKey,
                        attrKey : attrKey,
                        newValue : newValue
                    })
                    
                    if (result){
                        const newCharacter = merge(this.state.character, result.patch)
                        this.setState({
                            character : newCharacter,
                            description : result.description
                        });
                    }
                }
            }
        }
    }

    render(){
        return (
            <Box
                sx={{
                    margin : "auto",
                    width : "90%",
                    paddingBottom : "40px"
                }}
            >
                <Generator.Header
                    name="CHARACTER GENERATOR"
                    bases={this.state.bases}
                    value={this.state.baseName}
                />

                <Generator.Container>

                    { /* ATTRIBUTES CONTAINER */} 
                    <Generator.ContainerItem>
                        <Generator.ConfigList
                            base={{
                                onEdit : this.onEditBase,
                                values : this.state.bases,
                                value : this.state.baseName
                            }}
                        />

                        <Generator.AttributesList
                            attributes={this.state.character?.AttributeGroups}
                            onGenerateAttribute={this.onGenerateAttribute}
                            onEditAttribute={this.onEditAttribute}
                            onAddCharacteristic={this.onAddCharacteristic}
                            onRemoveCharacteristic={this.onRemoveCharacteristic}
                        />
                    </Generator.ContainerItem>

                    { /* DOCUMENT TEXT CONTAINER */ } 
                    <Generator.ContainerItem>
                        <Generator.Description description={this.state.description}/>
                    </Generator.ContainerItem>

                </Generator.Container>

                <Generator.Footer>
                    <div style={{
                        width : "100%",
                    }}>
                        {/* SAVE HTML */}
                        <Grid container spacing={2}>
                            <Grid item>
                                <Button variant="contained"
                                    onClick={ () => {
                                        const html = ReactDOMServer.renderToStaticMarkup(
                                            <Generator.Description description={this.state.description}/>
                                        );
                                        
                                        console.log("HTML : ", html);

                                        const test = new Blob([html], {
                                            type : "application/html"
                                        })

                                        saveAs(test, "character.html");
                                    }}>

                                    <BiDownload
                                        style={{
                                            marginTop : "0",
                                            width : "100%",
                                            height : "20px"
                                        }}
                                    />
                                    HTML
                                </Button>
                            </Grid>

                            { /* SAVE JSON */}
                            <Grid item>
                                <Button variant="contained"
                                    onClick={ () => {
                                        const json = JSON.stringify(this.state.character);
                                        const blob = new Blob([json], { type : "application/json"});
                                        saveAs(blob, "character.json");
                                    }}
                                >
                                    <BiDownload
                                        style={{
                                            marginTop : "0",
                                            width : "100%",
                                            height : "20px"
                                        }}
                                    />
                                    JSON
                                </Button>
                            </Grid>
                        </Grid>
                    </div>

                    <Grid item>
                        <Button 
                            variant="contained"
                            onClick={this.onGenerate}
                        >
                            <BiRotateRight
                                style={{
                                    marginTop : "0",
                                    width : "100%",
                                    height : "20px"
                                }}
                            />
                            ALL
                        </Button>
                    </Grid>
                </Generator.Footer>
            </Box>
        );
    }
}