import Attribute, {AttributeGroup} from "./attributes/Attribute.js";
import Character, { CharacterData} from "./Character.js";
import { toJson, toString } from "./Utils.js";
import fs from "fs"
import RandomChoiceAttribute from "./attributes/RandomChoiceAttribute.js";

export type DescriptionResult = {
    [key : string ] : string[]
};

export default class Description implements toJson, toString{
    subject : CharacterData;
    descriptionResult : DescriptionResult;

    constructor (characterData : CharacterData){
        this.subject = characterData;
        this.descriptionResult = {};
    }

    toJson(){
        return this.descriptionResult;
    }

    toString(){
        return "";
    }

    saveJson(output : string): void {
        fs.writeFileSync(output, JSON.stringify(this.descriptionResult));
    }
}

export class CharacterDescription extends Description{
    constructor(character :  Character){
        super(character.data);
        this.generate();
    }

    getNoun(gender : string, age : number){
        if (gender === "Female"){
            if (age >= 18 ){
                return "woman";
            }
            else{
                return "girl";
            }
        } else {
            if (age >= 18){
                return "man";
            }
            else {
                return "boy"   
            }
        }
    }

    getPronoun(gender : string){
        return {
            standard_pronoun : (gender === "Female" ? "she" : "he"),
            object_pronoun : (gender === "Female" ? "her" : "him"),
            possessive_pronoun : (gender === "Female" ? "her" : "his")
        }
    }

    generate(){
        const attributeGroups = this.subject.AttributeGroups;
        const mainAttributes = attributeGroups["Main Attributes"];
        const appearenceAttributes = attributeGroups["Appearence"];

        if (!mainAttributes && !appearenceAttributes){
            return;
        }

        const gender = mainAttributes["gender"].toString() || "";
        const age = mainAttributes["age"].value as number || 0;
        const name = mainAttributes["name"].toString() || ""
        const profession = mainAttributes["profession"].toString() || ""
        const pronoun = this.getPronoun(gender);
        const noun = this.getNoun(gender, age);
        const descriptionResult : DescriptionResult= {}

        // is the first attr group
        // generate general description
        const weight = mainAttributes["weight"].value as number || 0;
        const height = mainAttributes["height"].value as number || 0;
        const hairColor = appearenceAttributes["hair color"]?.toString() || "black";
        const eyeColor = appearenceAttributes["eye color"]?.toString() || "black";
        const faceShape = appearenceAttributes["face shape"]?.toString() || "";
        const skinColor = appearenceAttributes["skin color"]?.toString() || "";
        const bodyShape = appearenceAttributes["body shape"]?.toString() || "";
        const standard_pronoun = pronoun.standard_pronoun;

        let generalDescription = "";
            
        generalDescription += `${name} is a ${age.toPrecision(3)} year old ${noun}.`

        if (profession){
            generalDescription += ` ${standard_pronoun} is a ${profession}, `;
        }

        generalDescription += `${standard_pronoun} is ${height.toPrecision(3)} meters tall and weighs ${weight.toPrecision(3)} kilograms.\n`;
        generalDescription += `${standard_pronoun} has ${hairColor} hair, ${eyeColor} eyes and a ${faceShape} face shape, `;
        generalDescription += `${name} has a ${skinColor} skin tone and a ${bodyShape} body type.`;
        
        descriptionResult["Main Attributes"] = []
        descriptionResult["Main Attributes"].push(generalDescription);
    
        for ( const attrGroupKey of Object.keys(attributeGroups)){

            if ( descriptionResult[attrGroupKey] === undefined){
                descriptionResult[attrGroupKey] = [];
            }
            
            const attrGroup = attributeGroups[attrGroupKey];
            const currentDescriptionList = descriptionResult[attrGroupKey];

            // Describe all other attributes
            for (const attributeKey of Object.keys(attrGroup)){
                const attribute = attrGroup[attributeKey];

                // iterate all characteristics
                if (attribute.type === "randomChoice"){
                    const attribute_ = attribute as RandomChoiceAttribute;

                    if (attribute_.choicesType == "characteristic"){
                        let description = attribute.toDescription();
                        description = description.replace(/<pronoun>/g, pronoun.standard_pronoun);
                        description = description.replace(/<object_pronoun>/g, pronoun.object_pronoun);
                        description = description.replace(/<possessive_pronoun>/g, pronoun.possessive_pronoun);
                        description = description.replace(/<noun>/g, noun);

                        const description_arr = description.split("\n");
                        currentDescriptionList.push(...description_arr);
                    }
                }
            }
        }

        this.descriptionResult = descriptionResult;
    }

    toString(){
        let stringDescription = "";

        for (const attrGroupKey in this.descriptionResult){
            const attrGroup = this.descriptionResult[attrGroupKey];

            stringDescription += attrGroupKey + "\n";

            for (const entry of attrGroup){
                stringDescription += entry + "\n\n";
            }

            stringDescription += "\n";
        }

        return stringDescription;
    }

    saveStr(output : string){
        fs.writeFileSync(output, this.toString());
    }
}
