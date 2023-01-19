import React from "react";
import { Typography, Box } from "@mui/material"

interface Props {
    description : { [key : string ] : string[]}
}

export default class GeneratorDescription extends React.Component<Props>{

    constructor(props : Props){
        super(props);
    }   

    render(){

        return (
            <div>
                { Object.entries(this.props.description).map( ( [AttrGroupKey, attrGroup]) => (
                    Array.isArray(attrGroup) && (attrGroup.length > 0) && (
                        <Box key={AttrGroupKey}>
                            <Typography variant="h3" fontSize={20} textAlign="center">
                                {AttrGroupKey}
                            </Typography>

                            { typeof attrGroup === "object" && Object.entries(attrGroup).map( ( [attrKey, Attr]) => (
                                <p key={attrKey}>
                                    {Attr}
                                </p>
                            ))}
                        </Box>
                    )
                ))}
                
            </div>
        )
    }
}