import type { NextApiRequest, NextApiResponse } from "next"
import { GlobalRef } from "../../src/GlobalRef";
import { serverData, ServerData } from "../../src/ServerData";

export default async function handler(req : NextApiRequest, res : NextApiResponse){

    if (req.method == "GET"){
        const characterBases = serverData.characterBases;

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