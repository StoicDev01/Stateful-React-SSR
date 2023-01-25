import React from "react"
import { Box, Paper } from "@mui/material"

interface Props  { 
    children : React.ReactNode, 
}

export default function GeneratorFooter(props : Props){
    return (

        <Paper
            elevation={12}
            sx={{
                width : "100%",
                height: "50px",
                borderRadius: "0 0 0 0",
                padding: "10px",               
            }}
        >
            <div
                style={{
                    height : "100%",
                    display : "flex",
                }}
            >
                {props.children}
            </div>

        </Paper>
    );
}