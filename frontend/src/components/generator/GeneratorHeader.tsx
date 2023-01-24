import React from "react"
import { 
    Box, Paper, Typography, Select, Stack,
    MenuItem
}
from "@mui/material";

interface Props {
    name : string;
    bases : string[];
    value : string;
}

interface States {
}

export default class GeneratorHeader extends React.Component<Props, States>{    

    constructor(props : Props){
        super(props);
        
        this.state = {

        };
    }

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<States>, nextContext: any): boolean {
        if (this.props.name != nextProps.name){
            return true;
        }
        return false;
    }

    render(): React.ReactNode {
        return (
            <Box
                sx={{
                    width: "100%",
                    minHeight: "50px",
                    marginTop: "40px"
                }}
            >
                <Paper
                    elevation={12}
                    sx={{
                        width : "100%",
                        height: "100%",
                        borderRadius: "0 0 0 0"                        
                    }}
                >
                    <Stack
                        spacing={2}
                        direction={"row"}
                        sx={{
                            padding: "10px",
                            display : "flex",
                        }}
                    >
                        {/*TITLE */}
                        <Typography
                            variant="h1"
                            fontWeight={600}
                        >
                            CHARACTER CREATOR
                        </Typography>
    

                    </Stack>
    
                </Paper>
            </Box>
        );   
    }
}