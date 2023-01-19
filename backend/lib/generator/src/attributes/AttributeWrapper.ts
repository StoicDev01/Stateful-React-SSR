import { BaseAttribute}  from "../CharacterBase";
import { CharacterData } from "../Character";

import NameGeneratorAttribute from "./NameGeneratorAttribute";
import NormalDistribuitionAttribute from "./NormalDistributionAttribute";
import RandomChoiceAttribute from "./RandomChoiceAttribute";
import RandomRangeAttribute from "./RandomRangeAttribute";
import RandomWeightAttribute from "./RandomWeightAttribute";
import {AttributeTypes}  from "./Attribute";

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