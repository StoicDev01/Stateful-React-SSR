import Attribute, { AttributeGroup, AttributeTypes, AttributeValues} from "./Attribute";
import { BaseAttribute, NormalDistrBaseAttr } from "../CharacterBase"
import NumberGenerator from "../NumberGenerator";
import { clamp } from "../Utils";
import { CharacterData } from "../Character";

export default class NormalDistribuitionAttribute extends Attribute<NormalDistrBaseAttr>{
    constructor(baseAttr: NormalDistrBaseAttr, character: CharacterData){
        super(0, baseAttr, character);
    }

    generate(){
        // Generate A random height with normal distribution
        const attrGroups = this.character.AttributeGroups;
        const mainAttrGroup = attrGroups["Main Attributes"];

        if (this.baseAttr.type !== AttributeTypes.normalDistribution){
            return;
        }

        let distr = 0;

        if (this.baseAttr.med  && this.baseAttr.variation){
            distr = NumberGenerator.gaussianDist(
                this.baseAttr.med , this.baseAttr.variation 
            );
        }
        
        if ( this.baseAttr.min && this.baseAttr.max){
            distr = clamp(
                distr, this.baseAttr.min, this.baseAttr.max
            );
        }

        if (this.baseAttr.distributionType == "height" && mainAttrGroup){
            const age = mainAttrGroup["age"];

            if (age && typeof age.value === "number"){
                // calculate current height based on max height and age
                const currentHeight = 0.50 + ( distr - 0.50 ) * ( age.value / 18  )
                    
                this.value = clamp(currentHeight, 0.50, distr);
            }

            return;
        }
        this.value = distr;
    }
}