import { ServerData } from "../ServerData.js"
import { Request, Response } from "express";

export default function serverStatus(req : Request, res : Response){

    if ( req.method === "GET"){
        res.status(200).json({ result : "SUCCESS!!", status : ServerData.getStatus()})
        return;
    }

    res.status(400).json({result : "INVALID HTTP METHOD"})
}