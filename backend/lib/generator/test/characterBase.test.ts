import { test, describe, expect } from "@jest/globals"
import CharacterBase from "../src/CharacterBase"
import fs from "fs"
import path from "path"

import MockBaseObject from "./mockData/mockBaseCharacter"

describe("Character base", () => {

    test("structure analysis TRUE", () => {
        const base = new CharacterBase();
        const analysis = base.loadJson(MockBaseObject);
        expect(analysis.result).toBe(true);
    })

    test("Load Json", () => {
        const base = new CharacterBase();

        base.loadJson(MockBaseObject);
        expect(base.data).toStrictEqual(MockBaseObject);
    })

    test("Load Path", () => {
        const base = new CharacterBase();

        base.loadPath("test/mockData/mockCharacterBase.json");
        expect(base.data).toStrictEqual(MockBaseObject);
    })
})