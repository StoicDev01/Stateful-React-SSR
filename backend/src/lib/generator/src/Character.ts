import { toJson } from "./Utils.js";
import { getCircularReplacer } from "./Utils.js";
import  Attribute, { AttributeGroup, AttributeValues } from "./attributes/Attribute.js";
import CharacterBase, { BaseAttribute, CharacterBaseConfig} from "./CharacterBase.js";
import AttributeFactory from "./attributes/AttributeWrapper.js";
import { createPatch } from "./CreatePatch.js";

// JSON CHARACTER DATA INTERFACE
export interface AttributeJson {
    value : AttributeValues;
    type : string;
    baseAttr? : BaseAttribute;
}

export interface AttributeGroupJson {
    [ key : string ] : AttributeJson; 
}

export interface AttributeGroupListJson{
    [ key : string ] : AttributeGroupJson
}

export interface CharacterDataJson{
    AttributeGroups :  AttributeGroupListJson;
    Config : CharacterBaseConfig;
}

// OBJECT CHARACTER DATA INTERFACE
export interface AttributeGroupList{
    [ key : string ] : AttributeGroup
}

export interface CharacterData {
    AttributeGroups : AttributeGroupList
    Config : CharacterBaseConfig
}

export interface EditOptions {
    editType : "regenerate" | "edit";
    attrKey? : string ;
    attrGroupKey? : string ;
    newValue? : AttributeValues;
    charIndex? : number;
}

export interface EditResult {
    status : boolean;
    message : string;
    patch? : object;
}


export function jsonBaseAttrReplacer() {
    const seen = new WeakSet();

    return (key : string, value : unknown) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }

        if (key == "baseAttr"){
            return;
        }

        seen.add(value);
      }
      return value;
      
    }
}



export default class Character implements toJson{
    public data : CharacterData;

    constructor(
        base : CharacterBase | undefined
    ){
        this.data = {
            AttributeGroups : {},
            Config : {}
        }

        if (base){
            this.generatePrototype(base);
        }
    }

    loadData(object : CharacterData){
        this.data = object;
    }

    edit(editOptions : EditOptions) : EditResult{
        const editType = editOptions.editType;
        const attrGroupKey = editOptions.attrGroupKey;
        const attrKey = editOptions.attrKey;
        const attrGroups = this.data.AttributeGroups;
        const newValue = editOptions.newValue;
        const beforeEdit = this.toJson(true);
        const charIndex = editOptions.charIndex;

        if (
            typeof attrGroupKey === "string" && 
            typeof attrKey == "string"
        ){
            const attrGroup = attrGroups[attrGroupKey];
    
            if (attrGroup === undefined){
                return {
                    status : false,
                    message : "Error Attribute Group does not Exist."
                };
            }

            const attribute = attrGroup[attrKey]
            if (attribute === undefined){
                return {
                    status : false,
                    message : "Error Attribute Key does not exist."
                };
            }

            if (editType === "edit" &&  newValue !== undefined ){
                attribute.value = newValue;

                const afterEdit = this.toJson(true);
                const newPatch = createPatch(beforeEdit, afterEdit);

                return {
                    status : true,
                    message : `Attribute on Group: ${attrGroupKey} with key ${attrKey} has been edited successfully.`,
                    patch : newPatch
                }
            }
    
            if (editType === "regenerate"){

                if (charIndex !== undefined){
                    if ( 
                        Array.isArray(attribute.value) &&
                        attribute.value.length -1 >= charIndex &&
                        charIndex >= 0
                    ){
                        attribute.generate(charIndex)
                        const afterEdit = this.toJson(true);
                        const newPatch = createPatch(beforeEdit, afterEdit)
                        
                        return {
                            status : true,
                            message : `characteristic on attribute Group : ${attrGroupKey} with key ${attrKey} and index ${charIndex} has been regenerated successfully.`,
                            patch : newPatch
                        };
                    }
                }
                else{
                    // Regenerate attribute
                    attribute.generate();
    
                    const afterEdit = this.toJson(true);
                    const newPatch = createPatch(beforeEdit, afterEdit)
    
                    return {
                        status : true,
                        message : `Attribute on Group : ${attrGroupKey} with key ${attrKey} has been regenerated successfully.`,
                        patch : newPatch
                    };
                }

            }
        }
        
        if (editType === "regenerate"){
            this.generate();
            const afterEdit = this.toJson(true);
            const newPatch = createPatch(beforeEdit, afterEdit);
    
            return {
                status : true,
                message : "Character regenerated successfully.",
                patch : newPatch
            }
        }


    
        return {
            status : false,
            message : "Could not edit character with this EditOptions."
        }
    }
    
    generatePrototype(base : CharacterBase){
        this.data.Config = base.data.Config;
        const baseAttributeGroups = base.data.AttributeGroups;
        const dataAttributeGroups = this.data.AttributeGroups;

        for (const baseAttrGroupKey of Object.keys(baseAttributeGroups)){
            // create a new attribute group on character data
            const baseAttrGroup = baseAttributeGroups[baseAttrGroupKey];
            
            dataAttributeGroups[baseAttrGroupKey] = {};

            const dataAttrGroup = dataAttributeGroups[baseAttrGroupKey];

            // SET GENERAL ATTRIBUTES BASED ON THE BASE
            for (const baseAttrKey of Object.keys(baseAttrGroup)){
                const baseATtr = baseAttrGroup[baseAttrKey];
                
                const newAttr = AttributeFactory(baseATtr, this.data);

                if (newAttr){
                    dataAttrGroup[baseAttrKey] = newAttr;
                }
            }
        }
    }

    generate(){
        const attributeGroups = this.data.AttributeGroups;

        for (const attrGroupKey of Object.keys(attributeGroups)){
            const attrGroup = attributeGroups[attrGroupKey];

            // GENERATE ALL ATTRIBUTES
            for (const attrKey of Object.keys(attrGroup)){
                const attribute = attrGroup[attrKey];
                attribute.generate();
            }
        }
    }

    toJson(withoutBaseAttributes= false) : CharacterDataJson{

        if (withoutBaseAttributes){
            return JSON.parse(
                JSON.stringify(this.data, jsonBaseAttrReplacer(), 4)
            )
        }
        else{
            return JSON.parse(
                JSON.stringify(this.data, getCircularReplacer(), 4)
            );
        }
    }

    toStr(){
        return JSON.stringify(this.data, getCircularReplacer(), 4 );
    }
}