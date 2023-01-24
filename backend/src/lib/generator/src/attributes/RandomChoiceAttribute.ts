import Attribute, { AttributeTypes} from "./Attribute.js";
import { BaseAttribute, RandomCharacteristicChoiceBaseAttr, RandomStringChoiceBaseAttr} from "../CharacterBase.js"
import NumberGenerator from "../NumberGenerator.js";
import { multRandomChoice } from "../Choice.js";
import { Characteristic } from "./Attribute.js";
import { CharacterData } from "../Character.js";

export default class RandomChoiceAttribute extends Attribute<RandomStringChoiceBaseAttr | RandomCharacteristicChoiceBaseAttr>{
    choicesType : string;

    constructor(baseAttr: RandomStringChoiceBaseAttr | RandomCharacteristicChoiceBaseAttr, character: &CharacterData){
        super([], baseAttr, character);
        this.choicesType = "";
        if (baseAttr.choicesType){
            this.choicesType = baseAttr.choicesType;
        }
    }

    generate(index? : number){
        let has = true;
        let min : number;
        let max : number;
        let count  : number;

        this.baseAttr.min? min = this.baseAttr.min : min = 1;
        this.baseAttr.max? max = this.baseAttr.max : max = min;

        count = NumberGenerator.getRandomInt(min, max);

        if (
            index != undefined && 
            Array.isArray(this.baseAttr.choices) &&
            this.baseAttr.choicesType === "characteristic"
        ){
            // Generate only one characteristic
            let newCharacteristic : Characteristic| undefined = undefined;

            while (newCharacteristic === undefined){
                const result =  multRandomChoice<any>(this.baseAttr.choices, 1);
                const characteristics = this.value as Characteristic[];
                const newCharacteristic_ = result[0] as Characteristic;   

                // do not repeat
                if (!characteristics.includes(newCharacteristic_)){
                    newCharacteristic = newCharacteristic_;
                }
            }

            if (index !== undefined && index >= 0 && (this.value as Array<unknown>).length > index ){
                if (this.value instanceof Array){
                    this.value[index] = newCharacteristic;
                }
                return;
            }
            
        }

        else{
            const result =  multRandomChoice<unknown>(this.baseAttr.choices, count);

            if (this.baseAttr.choicesType === "characteristic"){
                this.value = result as Characteristic[];
            }
            else if (this.baseAttr.choicesType === "string"){
                this.value = result as string[];
            }
        }
    }
}
