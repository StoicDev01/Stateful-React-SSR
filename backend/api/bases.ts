import {ServerData} from "../ServerData";
import { Request, Response } from "express";

export default async function handler(req : Request, res : Response){

    if (req.method == "GET"){
        const characterBases = ServerData.characterBases;

        if ( characterBases ){
            console.log(characterBases);
            const basesNames = Array.from(characterBases.keys());
            res.status(200).json({result : "Success!", bases : basesNames})
            return;
        }

        res.status(400);
    }
    else {
        res.status(400).json({bases : [], result: "ERROR, INVALID REQUEST METHOD"});
        return;
    }
}