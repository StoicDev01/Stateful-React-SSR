import { toJson } from "./Utils.js";
import { CharacterData, CharacterDataJson } from "./Character.js";
import { getCircularReplacer } from "./Utils.js";
import { after, isEqual } from "lodash-es";

export function createPatch(beforeDataJson : CharacterDataJson, afterDataJson : CharacterDataJson) {
    const data : CharacterDataJson = {
        AttributeGroups : {},
        Config : {}
    };

    for ( const attrGroupKey of Object.keys(afterDataJson.AttributeGroups)){
        const AfterAttrGroup = afterDataJson["AttributeGroups"][attrGroupKey];
        const BeforeAttrGroup = beforeDataJson["AttributeGroups"][attrGroupKey];

        if (BeforeAttrGroup == undefined){
            continue;
        }

        for (const attributeKey of Object.keys(AfterAttrGroup)){
            const afterATtribute = AfterAttrGroup[attributeKey];
            const beforeAttribute = BeforeAttrGroup[attributeKey];

            if (beforeAttribute == undefined){
                continue;
            }

            if (!(isEqual( afterATtribute, beforeAttribute ))){
                if (data.AttributeGroups[attrGroupKey] === undefined){
                    data.AttributeGroups[attrGroupKey] = {};
                }

                data.AttributeGroups[attrGroupKey][attributeKey] = afterATtribute;
            }
        }
    }

    return data;
}