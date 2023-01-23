import CharacterBase, { NameGeneratorGenderGroup } from "../../lib/generator/src/CharacterBase"
import Character from '../../lib/generator/src/Character';
import { v4 as uuid } from "uuid"
import { ServerData } from "../../ServerData";
import { Request, Response } from "express";

type Data = {
    result : string;
    character? : object;
    characterID?: string;
    description? : object;
}


export default async function createCharacter(
  req: Request,
  res: Response<Data>
) {

    if (req.headers['content-type'] != "application/json"){
        res.status(400).json({result : "Content type must be JSON!"});
        return;
    }

    if (req.method == "POST"){
        if (typeof req.body === "object" && typeof req.body.baseName == "string"){
            const characterBases = ServerData.characterBases;
            const nameGenerators = ServerData.nameGenerators;
            const baseName = req.body.baseName;

            if (characterBases && nameGenerators && characterBases.has(baseName)){
                const loadedBase = characterBases.get(baseName) as CharacterBase;
                const nameGenerator = nameGenerators.get("USNames") as NameGeneratorGenderGroup;

                loadedBase.loadConfig({
                    nameGenerators : nameGenerator
                })
                const character = new Character(loadedBase);
                const characterId = uuid();

                ServerData.generatedCharacters.AddToQueue(characterId, character);

                res.status(200).json({ 
                    result : "Success!", 
                    characterID: characterId,
                    character : character.toJson(true)
                });

                return;
            }
            else{
                res.status(400).json({ result : "This base or name generator doesnt exist" })
                return;
            }
        }
        else {
            res.status(400).json({result : "ERROR Needs a base name!"})
            return;
        }
    }

    res.status(400).json({ result : "invalid method"});
}