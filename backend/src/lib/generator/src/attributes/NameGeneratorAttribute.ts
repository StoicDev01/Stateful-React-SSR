import Attribute, { AttributeGroup, AttributeTypes, AttributeValues} from "./Attribute.js"
import { BaseAttribute, NameGeneratorGenderGroup, NameGeneratorBaseAttr} from "../CharacterBase.js";
import { CharacterData } from "../Character.js";

export default class NameGeneratorAttribute extends Attribute<NameGeneratorBaseAttr> {
    constructor(baseAttr: NameGeneratorBaseAttr, character : CharacterData){
        super("", baseAttr, character);
    }

    generate(): void {
        const attrGroups = this.character.AttributeGroups;
        const config = this.character["Config"];
        const mainAttrGroup = attrGroups["Main_Attributes"] as AttributeGroup;

        if (typeof config !== "object"){
            return;
        }

        const nameGenerators = config.nameGenerators as NameGeneratorGenderGroup;

        if (typeof nameGenerators !== "object"){
            return;
        }

        const neuterNameGenerator = nameGenerators.neuter;
        const femaleNameGenerator = nameGenerators.female;
        const maleNameGenerator = nameGenerators.male;

        let gender = "Undefined";

        if (mainAttrGroup){
            if (mainAttrGroup["gender"]){
                gender = mainAttrGroup.toString();
            }
        }

        if (
            neuterNameGenerator && 
            !femaleNameGenerator &&
            !maleNameGenerator
        ){
            const names = neuterNameGenerator.generate(20);
            this.value = names[0];
        }
        else if (
            femaleNameGenerator && 
            gender == "female"
        ){
            const names = femaleNameGenerator.generate(20);
            this.value = names[0];
        }
        else if (
            maleNameGenerator &&
            gender == "male"
        ){
            const names = maleNameGenerator.generate(20);
            this.value = names[0];
        }
    }
}