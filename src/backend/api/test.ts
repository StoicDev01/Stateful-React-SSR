import { Request, Response } from "express"

export default function Test(req : Request, res : Response){

    res.send("TESTED!");
}