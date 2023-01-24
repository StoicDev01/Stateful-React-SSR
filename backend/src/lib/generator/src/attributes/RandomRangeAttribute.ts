import Attribute, { AttributeTypes} from "./Attribute.js";
import  { BaseAttribute, RandomRangeBaseAttr} from "../CharacterBase.js"
import NumberGenerator from "../NumberGenerator.js";
import { CharacterData } from "../Character.js";

export default class RandomRangeAttribute extends Attribute<RandomRangeBaseAttr>{
    constructor(baseAttr: RandomRangeBaseAttr, character: &CharacterData){
        super(0, baseAttr, character);
    }

    generate(){


        this.value = NumberGenerator.getRandomFloat(
            this.baseAttr.min as number, this.baseAttr.max as number
        );
    }
}