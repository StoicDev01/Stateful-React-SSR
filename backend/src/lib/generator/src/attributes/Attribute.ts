import { BaseAttribute}  from "../CharacterBase.js";
import { CharacterData } from "../Character.js";

/*
    An Character Attribute Characteristic
    the Characteristic has name description and value
*/
export interface Characteristic {
    name : string;
    description : string;
    type : string | undefined;
}

export type AttributeValues = string | number | Characteristic | Characteristic[] | string[];

export enum AttributeTypes {
    randomChoice = "randomChoice", // Makes {count} random choice(s) based on the choices list
    randomRange = "randomRange",  // gets a random number between {min} and {max}
    nameGenerator = "nameGenerator", // generates a name based on the {generatorName}
    normalDistribution = "normalDistribution", // gets an dormal distribution between {med} and {variation} based on {distributionType}
    randomWeight = "randomWeight"// gets random weight based on height
}

export interface AttributeGroup{
    [key : string ] : Attribute<BaseAttribute>;
}

export interface AttributeGroupList{
    [key : string] : AttributeGroupList
}

export default abstract class Attribute<Base extends BaseAttribute> { 
    public type : AttributeTypes;

    constructor (
        public value : AttributeValues, 
        protected baseAttr: Base, 
        protected character: CharacterData){
        this.type = baseAttr.type;
    }

    abstract generate(index? : number ) : void;
    
    toString(){
        if (typeof this.value == "string"){
            return this.value;
        }
        else if (typeof this.value == "number"){
            return this.value.toPrecision(3);
        }
        else if (typeof this.value == "object"){

            if (this.value instanceof Array){
                
                let str = "";
                for ( let v = 0; v <  this.value.length; v++){
                    const value = this.value[v];

                    if (typeof value == "object" ){
                        str += value.name
                        if (v < this.value.length - 1){
                            str += ", ";
                        }
                    }
                    else if (typeof value === "string"){
                        str += value;
                        if (v < this.value.length - 1){
                            str += ", ";
                        }
                    }
                }
                return str;
            }

            else if ( typeof this.value == "object"){
                return this.value.name;
            }
        }
    }
    toDescription(){
        if (typeof this.value == "object"){

            if (this.value instanceof Array<unknown>){
                let str = "";

                for ( const v of this.value){
                    if (typeof v == "object"){
                        str += v.description + "\n";
                    }
                    else if (typeof v == "string"){
                        str += v + "\n";
                    }
                }
                return str.trim();
            }
            else if ( typeof this.value == "object"){
                return this.value.description;
            }
        }

        return "";
    }
}
