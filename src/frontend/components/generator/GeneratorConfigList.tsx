import { SelectChangeEvent, Typography,Grid, Box, Select, MenuItem } from "@mui/material"
import { isEqual } from "lodash-es";
import React, { ReactNode, useState } from "react";

export interface Config { values : string[], value : string, onEdit : (value : string ) => void; }

interface Props {
    base : Config;
}

interface FieldProps {
    keyName : string;
    values : string[];
    value : string;
    onEdit : ( key : string, value : string) => void;
}

function ConfigField(props : FieldProps){

    return (

        <Grid container>
            <Grid item xs={6} sm={6}>
                <Typography
                    sx={{
                        marginTop : "16px"
                    }}
                >
                    {props.keyName}
                </Typography>

            </Grid>

            <Grid item xs={5} sm={5}>
                <Select
                    value={props.value}
                    onChange={ (event ) => {
                        props.onEdit(props.keyName, event.target.value);
                    }}
                    sx={{
                        height : "30px",
                    }}
                >
                    {props.values && props.values.map( (string) => (
                        <MenuItem key={string} value={string}>{string}</MenuItem>
                    ))}
                </Select>
            </Grid>
        </Grid>
    )
}


export default class ConfigList extends React.Component<Props>{

    constructor(props : Props){
        super(props)
    }

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
        if (! isEqual(this.props, nextProps)){
            return true;
        }
        return false;
    }

    render(): ReactNode {
        return (
            <>
                <Grid
                    item
                >
            
                    <Box>
                        <Box>
                            <Typography
                                variant="h2"
                            >
                                Config
                            </Typography>
    
                            <Box
                                margin="10px 10px 25px"
                            >
                                <ConfigField
                                    keyName="Base"
                                    value={this.props.base.value}
                                    values={this.props.base.values}
                                    onEdit={ (base,newValue) => this.props.base.onEdit(newValue)}
                                />
                            </Box>
                        </Box>
                    </Box>
    
                </Grid>
            </>
        )
    }


}