import { NextApiRequest, NextApiResponse } from "next";
import {CharacterData} from "../../../lib/generator/src/Character";
import { CharacterDescription } from "../../../lib/generator/src/Description";

interface Data {
    result : string;
    description : object;
}

export default function Description(req : NextApiRequest, res : NextApiResponse<Data>){
    if (req.method == "POST"){
        if (typeof req.body.character === "object"){
            const description = new CharacterDescription(req.body.character);
            description.generate();

            res.status(200).json({result : "Success!", description: description.toJson()});
        }
    }
    else {
        res.status(400).json({ result : "INVALID REQUEST METHOD", description : {}});
    }
}