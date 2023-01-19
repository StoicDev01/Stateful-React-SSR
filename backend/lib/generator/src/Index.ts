// Load a base
import Character from "./Character"
import NameGenerator from "./NameGenerator";
import CharacterBase from "./CharacterBase"
import { CharacterDescription } from "./Description";
import { CharacterData } from "./Character";
import util from "util"

const nameGenerator = new NameGenerator("./data/character/names/FantasyNames.txt")

const base = new CharacterBase("./data/character/bases/contemporany.json", {
    nameGenerators : {
        neuter : nameGenerator
    }
});

const character = new Character(base);
const description = new CharacterDescription(character);

const result = character.edit({
    editType : "regenerate"
});


console.log(util.inspect(result, false, null));