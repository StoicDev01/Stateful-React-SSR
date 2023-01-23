import {
    Grid, Typography, TextField, IconButton, Container, Stack
}
from "@mui/material"
import React, { useState, useRef, useEffect, createRef } from "react";
import { isEqual } from "lodash";

import { BiRotateRight, BiPlusCircle } from "react-icons/bi"

interface Props {
    name : string;
    value : any;
    onEditValue? : (key : string, value : unknown) => void;
    onRegenerate? : (key : string, index? : number) => void;
    type : string;
}

interface State {
    value : string | number; 
    timer : number | undefined;
}

export default class TextFieldAttribute extends React.Component<Props, State>{

    constructor(props : Props){
        super(props);

        this.state = {
            value : this.props.value,
            timer : undefined
        };

        this.onEditInput = this.onEditInput.bind(this);
        this.onRegenerate = this.onRegenerate.bind(this);
    }

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
        if (nextState.value !== this.state.value){
            return true;
        }

        if (nextProps !== this.props){
            return true;
        }

        return false;
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (!isEqual(prevProps.value, this.props.value) ){
            this.setState({
                value  : this.props.value
            });
        }
    }

    onEditInput(event : React.ChangeEvent<HTMLInputElement> ): void{
        const attributeKey = event.target.id;
        const attributeValue = event.target.value;
        const numberRegex = /^[0-9]+\.?[0-9]*?$/;
        let isNumber = false;

        if (typeof this.props.value === "number"){
            isNumber = true;
        }

        if (isNumber){
            if (attributeValue === "" || numberRegex.test(attributeValue)){
                this.setState({ value : attributeValue});
            }
        }
        else{
            this.setState({ value : attributeValue});
        }

        if (this.state.timer !== undefined) {
            window.clearTimeout(this.state.timer);
        }

        const timerId  : number = window.setTimeout( () => {
            if (this.props.onEditValue){
                if (isNumber){
                    this.props.onEditValue(attributeKey, Number(attributeValue));
                }
                else{
                    this.props.onEditValue(attributeKey, attributeValue);
                }
            }
        }, 1000)

        this.setState({
            timer : timerId
        })
    }

    onRegenerate(event : React.MouseEvent<HTMLLabelElement>) : void {
        const attributeKey = this.props.name;

        if (this.props.onRegenerate){
            this.props.onRegenerate(attributeKey);
        }
    }

    render(): React.ReactNode {
        return (
            <Grid container>
                <Grid item xs={6} sm={6}>
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
    
                <Grid item xs={5} sm={5}>
                    <TextField 
                        id={this.props.name} label="Standard" variant="standard"
                        value={
                            typeof this.state.value === "number" ? 
                            this.state.value.toPrecision(3) : (this.state.value || "")
                        }
                        onChange={this.onEditInput}
                        sx={{
                            margin : 0,
                            padding : 0
                        }}
                    />
                </Grid>
    
                <Grid item xs={1} sm={1}
                >
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
                            onClick={this.onRegenerate}
                        >
                            <BiRotateRight
                            />
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
        );
    }
};