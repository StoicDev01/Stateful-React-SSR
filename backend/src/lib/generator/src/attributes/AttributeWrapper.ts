import { BaseAttribute}  from "../CharacterBase.js";
import { CharacterData } from "../Character.js";

import NameGeneratorAttribute from "./NameGeneratorAttribute.js";
import NormalDistribuitionAttribute from "./NormalDistributionAttribute.js";
import RandomChoiceAttribute from "./RandomChoiceAttribute.js";
import RandomRangeAttribute from "./RandomRangeAttribute.js";
import RandomWeightAttribute from "./RandomWeightAttribute.js";
import {AttributeTypes}  from "./Attribute.js";

/*
    FUNCTION TO CREATE NEW ATTRIBUTES BASED ON ATTRIBUTE TYPE
*/
export default function AttributeFactory(baseAttr : BaseAttribute, character : CharacterData){
    switch (baseAttr.type) {
        case AttributeTypes.randomRange:
            return new RandomRangeAttribute(baseAttr, character);
    
        case AttributeTypes.normalDistribution:
            return new NormalDistribuitionAttribute(baseAttr, character);
    
        case AttributeTypes.randomWeight:
            return new RandomWeightAttribute(baseAttr, character);
    
        case AttributeTypes.randomChoice:
            return new RandomChoiceAttribute(baseAttr, character);
    
        case AttributeTypes.nameGenerator:
            return new NameGeneratorAttribute(baseAttr, character);
    
        default:
            break;
    }    
}