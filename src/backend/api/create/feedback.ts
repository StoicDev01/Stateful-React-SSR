import { Request, Response} from "express"
import {ServerData} from "../../../ServerData"

export default function createFeedback(req : Request, res : Response) {

    if (req.method === "POST"){
        if (typeof req.body.description === "string"){

            ServerData.postFeedBack({
                name : req.body.name,
                description : req.body.description    
            })

            res.status(200).json({
                "result" : "success!"
            })
            return;
        }

        return res.status(400).json({
            "result" : "invalid description, must be string!"
        })
    }
    else {
        return res.status(400).json({
            "result" : "Invalid Method, must be POST!"
        })
    }
}