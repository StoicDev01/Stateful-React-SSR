import { test, describe, expect, beforeEach, beforeAll } from "vitest"
import Character from "../src/Character"
import CharacterBase, { CharacterBaseData } from "../src/CharacterBase"
import path from "path"
import { AttributeTypes } from "../src/attributes/Attribute"
import RandomRangeAttribute from "../src/attributes/RandomRangeAttribute"
import RandomChoiceAttribute from "../src/attributes/RandomChoiceAttribute"

import MockBase from "./mockData/mockBaseCharacter"
import { ArrayContains } from "../src/Utils"


describe("Character", () => {
    const mockAttributeGroups = MockBase.AttributeGroups;
    const mockMainAttributes = mockAttributeGroups["Main Attributes"];

    const base = new CharacterBase();
    base.loadJson(MockBase);

    let character : Character;

    beforeEach(() => {
        character = new Character(base);
    })

    test("Generate Character Prototype", () => {
        expect(character.data).toHaveProperty("AttributeGroups.Main Attributes");
        expect(character.data).toHaveProperty("Config.name");

        for (const mockAttribute in MockBase.AttributeGroups["Main Attributes"]){
            expect(character.data).toHaveProperty(`AttributeGroups.Main Attributes.${mockAttribute}`);
            expect(character.data).toHaveProperty(`AttributeGroups.Main Attributes.${mockAttribute}.baseAttr`)
            expect(character.data).toHaveProperty(`AttributeGroups.Main Attributes.${mockAttribute}.value`)

            const characterAttribute = character.data.AttributeGroups["Main Attributes"][mockAttribute];
            const attributeValueType = typeof characterAttribute.value;

            expect(ArrayContains([attributeValueType], ["number", "object", "string"]));
        }
    })

    test("Generate Character", () => {
        character.generate();

        const attributeGroups = character.data.AttributeGroups;
        const mainAttributes = attributeGroups["Main Attributes"];
        expect(mainAttributes).not.toBe(undefined);

        for (const baseAttr in mockMainAttributes){
            expect(mainAttributes[baseAttr]).not.toBe(undefined);
        }

        const testAge = mainAttributes["test Age"];
        expect(testAge.value).toBeGreaterThanOrEqual(0);
        expect(testAge.value).toBeLessThanOrEqual(10);

        const testChoice = mainAttributes["test choice"];
        expect(Array.isArray(testChoice.value)).toBe(true);
        expect(ArrayContains(testChoice.value as Array<unknown>, ["A", "B", "C"]));
    });

    test("to JSON", () => {
        character.generate();

        const jsonWithouBaseAttr = character.toJson(true) as unknown;
        const jsonWithBaseAttr = character.toJson(false) as unknown;

        expect(typeof jsonWithouBaseAttr === "object").toBe(true);

        for (const baseAttr in mockMainAttributes){
            expect(jsonWithouBaseAttr).not.toHaveProperty(`AttributeGroups.Main Attributes.${baseAttr}.baseAttr`);
            expect(jsonWithBaseAttr).toHaveProperty(`AttributeGroups.Main Attributes.${baseAttr}.baseAttr`);

            const attribute = character.data.AttributeGroups["Main Attributes"][baseAttr];
            attribute.value
        }
    });

    test("Edit character" , () => {

        // REGENERATE ALL
        const regenerate = character.edit({
            editType : "regenerate"
        });

        expect(regenerate.status).toBe(true);

        for (const baseAttr in mockMainAttributes){
            expect(regenerate.patch).toHaveProperty(`AttributeGroups.Main Attributes.${baseAttr}`);
        }
        
        // EDIT ATTRIBUTE
        const editAttr = character.edit({
            editType : "edit",
            attrGroupKey : "Main Attributes",
            attrKey : "test choice",
            newValue : ["L"]
        })
        expect(editAttr.status).toBe(true);

        const testChoice = character.data.AttributeGroups["Main Attributes"]["test choice"];
        expect(editAttr.patch).toHaveProperty("AttributeGroups.Main Attributes.test choice.value");
        expect(testChoice.value).toEqual(["L"]);

        // ERROR EDIT
        const errorEdit1 = character.edit({
            editType : "edit"
        })
        const errorEdit2 = character.edit({
            editType : "edit",
            attrGroupKey : "None"
        })

        expect(errorEdit1.status).toBe(false);
        expect(errorEdit2.status).toBe(false);
    });
})