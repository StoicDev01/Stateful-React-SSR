import { Container, Typography } from "@mui/material"
import React from "react"

export default function Another(){

    return <div>

        <Container
            sx={{
                marginTop : "50px",
                maxWidth : {
                    sm : "900px"
                }
            }}
        >


            <Typography
                variant="h1"
                sx={{
                    color : "primary.main"
                }}
            >
                Another page 1

                
            </Typography>

            <p>
                This is an another page
            </p>
        </Container>

    </div>
}