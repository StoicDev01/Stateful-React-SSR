import { AttributeTypes } from "../../src/attributes/Attribute";
import { CharacterBaseData } from "../../src/CharacterBase";
import fs from "fs"

const MockBase : CharacterBaseData = JSON.parse(
    fs.readFileSync("test/mockData/mockCharacterBase.json", "utf-8")
);

export default MockBase;