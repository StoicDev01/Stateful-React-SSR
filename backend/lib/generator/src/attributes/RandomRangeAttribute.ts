import Attribute, { AttributeTypes} from "./Attribute";
import  { BaseAttribute, RandomRangeBaseAttr} from "../CharacterBase"
import NumberGenerator from "../NumberGenerator";
import { CharacterData } from "../Character";

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