import { Container, Typography } from "@mui/material"
import React from "react"
import Link from "../components/Link"
import {useTheme} from "@mui/material"

export default function About(){
    const theme = useTheme();

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
                About

                
            </Typography>

            <p>
                ChaoticForge A website that offers a variety of creative generators to help writers, RPG players, and other storytellers bring their ideas to life. 
                With character, name, and world generators, you can have insight's to create complex characters, imaginary worlds, and epic stories. 
            </p>
            <a
                style={{
                    color: theme.palette.primary.main
                }}

                target="_blank"

                href="https://github.com/izkeas/ChaoticForge"
            >
                See the project on Github!
            </a>
        </Container>

    </div>
}