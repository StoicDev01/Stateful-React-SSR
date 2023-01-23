import { CharacterDescription } from '../../lib/generator/src/Description';
import {ServerData} from '../../ServerData';
import { Request, Response } from 'express';

type Data = {
    result : string;
    patch? : object;
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
        const characterQueue = ServerData.generatedCharacters;
        const characterID = req.body.characterID;
        const editOptions = req.body.editOptions;

        if (editOptions === undefined){
            res.status(400).send({result : "ERROR NEEDS EDIT OPTIONS!"});
            return;
        }

        if (!(characterID) ){
            res.status(400).send({ result : "ERROR NEEDS CHARACTER ID!"});
            return;
        }

        const character = characterQueue.data.get(characterID)?.character;
        
        if (character === undefined){
            res.status(400).send({ result : "ERROR THIS CHARACTER ID DOESNT EXIST"});
            return;
        }

        const editResult = character.edit(editOptions);
        console.log("MESSAGE:  ", editResult.message);

        console.log("EDIT RESULT: ", character.toJson(true));
                
        if (editResult.status === true && editResult.patch){
            const description = new CharacterDescription(character);
    
            res.status(200).json({ 
                result : "Success!", 
                patch: editResult.patch,
                description : description.toJson()
            });
        }
        else{
            res.status(400).json({
                result : editResult.message
            })
        }

        return;
    }

    res.status(400).json({ result : "invalid method"});
}