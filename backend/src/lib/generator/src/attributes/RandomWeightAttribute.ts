import Attribute, {AttributeGroup, AttributeTypes} from "./Attribute.js";
import  { BaseAttribute, RandomWeightBaseAttr } from "../CharacterBase.js"
import { CharacterData } from "../Character.js";

export default class RandomWeightAttribute extends Attribute<RandomWeightBaseAttr>{
    constructor(baseAttr: RandomWeightBaseAttr, character: &CharacterData){
        super(0, baseAttr, character);
    }

    generate() {
        // set weight
        const attrGroups = this.character.AttributeGroups;
        const mainAttrGroup = attrGroups["Main Attributes"];

        if (typeof mainAttrGroup === "object"){
            const gender    = mainAttrGroup["gender"]   ? mainAttrGroup["gender"].toString()        : undefined;
            const age       = mainAttrGroup["age"]      ? mainAttrGroup["age"].value as number      : 0;
            const height    = mainAttrGroup["height"]   ? mainAttrGroup["height"].value as number   : 0;
    
            let currentWeight = 0;
            if (gender == "Female"){
                currentWeight = (( (height * 100) - 100 + ( age / 10) )) * 0.9
                currentWeight = currentWeight - (currentWeight * 0.10)
            }
            else if (gender == "Male"){
                currentWeight = ( ( height * 100) - 100 + (age / 10)) * 0.9 
            }

            this.value = currentWeight;
        }
    }
}
