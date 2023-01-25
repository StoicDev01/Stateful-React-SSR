import {Grid, Paper} from "@mui/material"
import React from "react"

interface Props{ 
    children : React.ReactNode
} 

export default function GeneratorContainer({ children }: Props){
    return (
        <Paper
            elevation={1}
            sx={{
                width: "100%",
                height: "auto",
                borderRadius: "0 0 0 0",
                overflow : "auto"
            }}
        >
            <Grid 
                container
                spacing={1}
                sx={{
                    padding: "10px"
                }}
            >
                    {children}
            </Grid>
        </Paper>
    );
}