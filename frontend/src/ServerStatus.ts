import { backendURL } from "../config.js";

export default async function getServerStatus() : Promise<string>{

    try {
      const result = await fetch(`${backendURL}/api/status`, 
      {
        method : "GET", headers : new Headers({
          type : "application/json"
        })
      });
    
    
      const json = await result.json();
    
      console.log("RESULT ", json);
    
      if (result.status === 200 && typeof json.status === "string"){
        return json.status;
      }
    }
    catch (error){
      console.log("Server not started")
    }
  
    return "unloaded";
  }