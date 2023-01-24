import fs from "fs"
import { includes, isEqual } from "lodash-es";
import { json } from "stream/consumers";
import { Characteristic, AttributeTypes } from "./attributes/Attribute.js";

import NameGenerator from "./NameGenerator.js";


/*
    BASE ATTRIBUTES
*/
export type BaseAttribute = 
    RandomRangeBaseAttr | 
    NormalDistrBaseAttr | 
    RandomCharacteristicChoiceBaseAttr | 
    RandomStringChoiceBaseAttr | 
    NameGeneratorBaseAttr |
    RandomWeightBaseAttr;

export interface RandomRangeBaseAttr{
    min : number;
    max : number;
    type : AttributeTypes.randomRange;
}

export interface NormalDistrBaseAttr{
    min : number; 
    max : number;
    type : AttributeTypes.normalDistribution;
    med : number;
    variation : number;
    distributionType? : "height" | "default";
}

export interface RandomCharacteristicChoiceBaseAttr{
    min? : number;
    max? : number;
    type : AttributeTypes.randomChoice;
    choices : Characteristic[];
    choicesType : "characteristic";
}

export interface RandomStringChoiceBaseAttr{
    min? : number;
    max? : number;
    type : AttributeTypes.randomChoice;
    choices : string[];
    choicesType : "string";
}

export interface NameGeneratorBaseAttr{
    nameGenerator : NameGenerator;
    generatorName? : string;
    type : AttributeTypes.nameGenerator;
}

export interface RandomWeightBaseAttr{
    type : AttributeTypes.randomWeight;
    min : number;
    max : number;
}



export interface BaseAttributeGroup{
    [key : string] : BaseAttribute

}

export interface BaseAttributeGroupList{
    [key : string] : BaseAttributeGroup
}

export interface CharacterBaseData {
    AttributeGroups : BaseAttributeGroupList
    Config : CharacterBaseConfig
}


export interface NameGeneratorGenderGroup {
    neuter? : NameGenerator;
    male? : NameGenerator;
    female? : NameGenerator;
}


export interface CharacterBaseConfig {
    nameGenerators? : NameGeneratorGenderGroup;
    [ key : string] : NameGeneratorGenderGroup | string | number | undefined;
}


export default class CharacterBase{
    data : CharacterBaseData;

    constructor(path : string | undefined = undefined, config? : CharacterBaseConfig){
        this.data = {
            AttributeGroups  : {},
            Config : {}
        };

        if (path){
            this.loadPath(path);
        }

        if (config){
            this.loadConfig(config);
        }

    }

    loadConfig(config : CharacterBaseConfig){
        this.data.Config = config;
    }

    loadPath(path : string){
        const data = fs.readFileSync(path, "utf8");
        const json = JSON.parse(data);
        return this.loadJson(json);
    }

    loadJson(object_ : CharacterBaseData){
        const analysis = this.structureAnalysis(object_);

        if (analysis.result === true){
            this.data = object_;
        }

        return analysis;
    }

    structureAnalysis(object : CharacterBaseData){
        if (typeof object !== "object"){
            return {
                result : false,
                message : "Invalid Object type"
            }
        }

        if (typeof object.Config !== "object"){
            return {
                result : false,
                message : "Base doesn't have an config object"
            }
        }

        if (typeof object.Config.name !== "string"){
            return {
                result : false,
                message: "Object config doesnt have name."
            }
        }

        const attributeGroups =  object.AttributeGroups

        // iterate all attributeGroups
        for (const baseAttrGroupKey in attributeGroups){
            const baseAttrGroup = attributeGroups[baseAttrGroupKey];
            
            // iterate all Attributes
            for (const baseAttrKey in baseAttrGroup){
                const baseAttribute = baseAttrGroup[baseAttrKey];
                const repeatingChoices = Array<unknown>();

                if (baseAttribute.type !== AttributeTypes.randomChoice)
                    continue;

                // validade choices
                if (Array.isArray(baseAttribute.choices)){
                    for (let choiceIndex = 0; choiceIndex < baseAttribute.choices.length; choiceIndex++){
                        const choice = baseAttribute.choices[choiceIndex];

                        if (repeatingChoices.filter(e => isEqual(e, choice)).length > 0) {
                            return {
                                result : false,
                                message : `Choice with index ${choiceIndex} : on attribute ${baseAttrKey} on group ${baseAttrGroupKey} is duplicated.`
                            };
                        }
    
                        repeatingChoices.push(choice);
                    }
                }


                // validade type
                if (typeof baseAttribute.type !== "string"){
                    return {
                        result : false,
                        message : `Attribute ${baseAttrKey} does'nt have a type`
                    }
                }
                else {
                    if (!(baseAttribute.type in AttributeTypes) ){
                        return {
                            result : false,
                            message : `Attribute ${baseAttrKey} has an invalid type ${baseAttribute.type}\nValid Types: ${Object.keys(AttributeTypes).join(", ")}`
                        }
                    }
                }
            }
        }

        return {
            result: true,
            message : "Succes!"
        }
    }
}