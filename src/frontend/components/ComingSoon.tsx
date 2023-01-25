import { Container, Typography } from "@mui/material"
import React from "react"

interface Props {
    description? : string
}

export default function ComingSoon(props : Props){
    return (
    <div>
        <Container>
            <Typography
                textAlign={"center"}
                sx={{
                    marginTop : "100px"
                }}
                variant="h2"
            >
                Coming Soon!
            </Typography>

            <Typography
                textAlign={"center"}
                sx={{
                    marginTop : "10px"
                }}
                variant="h3"
            >
                {props.description}
            </Typography>

        </Container>
    </div>)
}