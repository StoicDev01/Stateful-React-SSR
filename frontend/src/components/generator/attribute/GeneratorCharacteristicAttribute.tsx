import {
    Grid, Typography, TextField, IconButton, Container, Stack
}
from "@mui/material"
import React, { useState, useRef, useEffect } from "react";

import { BiRotateRight, BiPlusCircle, BiMinus } from "react-icons/bi/index.js"
import { clone, isEqual } from "lodash-es";

export interface Characteristic {
    name : string, description : string
}

interface Props {
    name : string;
    value : Characteristic[];
    onEditValue? : (key : string, new_value : {name : string, description : string}[]) => void;
    onRegenerate? : (key : string, index? : number) => void;
    onAdd? : (key : string) => void
    onRemove? : (key : string, index : number) => void;
}

interface State {
    timer : undefined | number;
    value : Characteristic[];
}

/// Component to view and edit characteristics attributes
export default class CharacteristicField extends React.PureComponent<Props, State>{

    constructor(props : Props){
        super(props);

        this.state = {
            value : clone(this.props.value),
            timer : undefined
        };

        this.onEditDescription = this.onEditDescription.bind(this);
        this.onEditName = this.onEditName.bind(this);

    }

    onEditName(index : number, value : string) : void {
        const characteristics_ = Array.from(this.state.value);

        // set name
        characteristics_[index] = {
            name : value, description : characteristics_[index].description
        }

        if (this.state.timer) {
            clearTimeout(this.state.timer);
        }

        this.setState({
            value : characteristics_
        })

        const timerId = window.setTimeout(() => {
            if (this.props.onEditValue){
                this.props.onEditValue(this.props.name, characteristics_);
            }
        }, 
        1000);

        this.setState({
            timer : timerId
        });
    }

    onEditDescription(index : number, value : string) : void {
        const characteristics_ = Array.from(this.state.value);

        // set description
        characteristics_[index] = {
            name : characteristics_[index].name, description : value
        }

        if (this.state.timer) {
            clearTimeout(this.state.timer);
        }

        this.setState({
            value : characteristics_
        });

        const timerId = window.setTimeout(() => {
            if (this.props.onEditValue){
                this.props.onEditValue(this.props.name, characteristics_);
            }
        }, 
        1000);

        this.setState({
            timer : timerId
        });
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (this.props !== prevProps){
            this.setState({
                value : this.props.value
            });
        }
    }

    render(): React.ReactNode {
        
        return (
            <>
                <Grid item xs={12} container
                >
                    <Grid item xs={11} sm={11}>
                        <Typography
                            fontSize={20}
                            textAlign="unset"
                            sx={{
                                marginTop : "16px"
                            }}
                        >
                        {this.props.name}
                        </Typography>
                    </Grid>
    
                    <Grid item xs={1} sm={1}>
                        <div
                            style={{
                                marginTop : "16px"
                            }}
                        >
                            <IconButton component="label"
                                id={this.props.name}
                                sx={{
                                    marginTop : "0",
                                    padding : 0,
                                    width : "100%",
                                    height : "40px"
                                }}
                                onClick={ (event) => {
                                    if (this.props.onRegenerate){
                                        this.props.onRegenerate(this.props.name) 
                                    } 
                                }}
                            >
                                <BiRotateRight
                                />
                            </IconButton>
                        </div>
                    </Grid>
    
                    <Container>
                        <Grid container spacing={2}>
                            { this.state.value.map( ( characteristic, index) => (
                                <Grid key={this.props.name + index} container item>
    
                                    {/*  REMOVE CHARACTERISTIC BUTTON */}
                                    <Grid item xs={0.5}>
                                        <div
                                            style={{
                                                marginTop : "16px"
                                            }}
                                        >
                                            <IconButton component="label"
                                                sx={{
                                                    marginTop : "0",
                                                    padding : 0,
                                                    width : "100%",
                                                    height : "40px"
                                                }}
                                                onClick={ 
                                                    ( event : React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
                                                        if (this.props.onRemove){
                                                            this.props.onRemove(this.props.name, index);
                                                        }
                                                    }
                                                }
                                            >
                                                <BiMinus/>
                                            </IconButton>
                                        </div>
                                    </Grid>
    
                                    { /* CHARACTERISTIC FIELD */}
                                    <Grid item xs={10.5}>
                                        <Stack
                                            direction="column"
                                        >
                                            <TextField 
                                                name={this.props.name}
                                                value={characteristic.name || ""}
                                                onChange={ (event ) => { this.onEditName(index, event.target.value) }}
                                                sx={{
                                                    margin : 0,
                                                    padding : 0
                                                }}
                                            />
                    
                                            <TextField 
                                                name={this.props.name}
                                                id={`${index}-description`} label="description"
                                                value={characteristic.description || ""}
                                                onChange={ ( event ) => { this.onEditDescription(index, event.target.value) }}
                                                sx={{
                                                    margin : 0,
                                                    padding : 0,
                                                }}
                                                variant="filled"
                                                multiline
                                            />
                                        </Stack>
                                    </Grid>
                                    
                                    {/* REGENERATE BUTTON */}
                                    <Grid item xs={1}>
                                        <div
                                            style={{
                                                marginTop : "16px"
                                            }}
                                        >
                                            <IconButton component="label"
                                                sx={{
                                                    marginTop : "0",
                                                    padding : 0,
                                                    width : "100%",
                                                    height : "40px"
                                                }}
                                                onClick={ 
                                                    ( event : React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
                                                        if (this.props.onRegenerate){
                                                            this.props.onRegenerate(this.props.name, index);
                                                        }
                                                    }
                                                }
                                            >
                                                <BiRotateRight/>
                                            </IconButton>
                                        </div>
                                    </Grid>
                                </Grid>
                            ))}
                            
                            { /* ADD ICON BUTTON */}
                            <IconButton
                                style={{
                                    width : "50px",
                                    height : "50px",
                                    margin : "auto"
                                }}
                                onClick={ (event : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                    if (this.props.onAdd){
                                        this.props.onAdd(this.props.name);
                                    }
                                }}
                            >
                                <BiPlusCircle/>                                
                            </IconButton>
                        </Grid>
                    </Container>
    
                </Grid>
            </>
        );
    }
}
