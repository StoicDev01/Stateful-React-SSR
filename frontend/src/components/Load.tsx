import { useEffect, useState } from "react";
import  {Container} from "@mui/material";
import { Typography } from "@mui/material"
import getServerStatus from "../ServerStatus";
import React from "react";

export default function Load(){
    const [ counter, setCounter] = useState(0);
    const [ intervalID, setIntervalID] = useState<any>(undefined);
  
    useEffect( () => {
      const intervalID = setInterval(  async () => {
        setCounter( (counter) => ( counter + 1))
        const serverStatus = await getServerStatus();

        console.log("SERVER STATUS: ", serverStatus);
        if ( serverStatus === "loaded"){
            document.location.reload();
        }

      }, 500)
  
      setIntervalID(intervalID);
      return () => ( clearInterval(intervalID));
    }, [])
  
    return (
        <Container>
            <Typography
                sx={{
                    textAlign : "center",
                    marginTop : "200px"
                }}
            >
                Server Loading{".".repeat((counter % 3) + 1)}
            </Typography>
        </Container>
    )
}