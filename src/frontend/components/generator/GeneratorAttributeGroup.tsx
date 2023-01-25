import React from "react";
import { ReactNode } from "react";
import { Grid, Box, Typography, Skeleton, Select, SelectChangeEvent } from "@mui/material"
import GeneratorAttributeField from "./GeneratorAttribute"
import { isEqual } from "lodash-es";

interface Props {
    attributeGroup : object ;
    attributeGroupKey : string;
    onGenerateAttribute : (groupKey : string, attrKey : string, characteristicIndex? : number) => void;
    onEditAttribute : (groupKey : string , attrKey : string,  newValue : unknown, characteristicIndex? : number) => void;
    onAddCharacteristic : (groupKey : string, attrKey : string) => void;
    onRemoveCharacteristic : (groupKey : string, attrKey : string, characteristicIndex : number) => void;
}

export default class GeneratorAttributeGroup extends React.Component<Props>{

    constructor(props : Props){
        super(props);
    }


    static createSkeleton(){
        const skeletons: React.ReactNode[] = [];

        return (
            <>
                <Skeleton variant="rounded" height={28} width={"200px"}/>
                <Box
                    margin="0px 10px 25px"
                >          
                    { [1,2,3,4,5].map( ( value) => (                          
                        <Grid key={value} container>
                            <Grid item xs={6} sm={6}>
                                <Skeleton 
                                    variant="rounded"
                                    height="25px"
                                    width="240px"
                                    sx={{
                                        marginTop : "16px"
                                    }}
                                />
                            </Grid>

                            <Grid item xs={5} sm={5}>
                                <Skeleton 
                                    sx={{
                                        marginTop : "16px"
                                    }}
                                    variant="rounded" 
                                    height="25px"
                                    width="220px"
                                />
                            </Grid>

                            <Grid item xs={1} sm={1}
                            >
                                <div
                                    style={{
                                        marginTop : "16px",
                                        height : "40px",
                                        width : "100%"
                                    }}
                                >
                                    <Skeleton 
                                        variant="circular"
                                        height="30px"
                                        width="30px"
                                        sx={{
                                            marginTop : "0",
                                            padding : 0,
                                            marginLeft : "auto",
                                            marginRight : "auto"
                                        }}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    ))} 
                </Box>
            </>
        )
    }

    render(): ReactNode {
        const skeletons = GeneratorAttributeGroup.createSkeleton();

        return (
            <Box>
                { /* ATTRIBUTE GROUP TITLE */} 
                <Typography
                    variant="h2"
                >
                    {this.props.attributeGroupKey}
                </Typography>

                { /* ATTRIBUTE FIELDS */ } 
                <Box
                    margin="0px 10px 25px"
                >
                    { /*  ONLY STRING */ } 
                    {  Object.entries(this.props.attributeGroup)
                        .filter( ([key, value]) => (value.choicesType === "string" || value.choicesType === undefined) )
                        .map(([attrKey, attr]) => (
                            <GeneratorAttributeField 
                                key={attrKey} 
                                name={attrKey}
                                choiceType={attr.choicesType}
                                value={attr.value}

                                onEditValue={ (attrKey, value) => {
                                    this.props.onEditAttribute(this.props.attributeGroupKey, attrKey, value);
                                }}

                                onRegenerate={ (attrKey_, index) => {
                                    this.props.onGenerateAttribute(this.props.attributeGroupKey, attrKey_, index);
                                }}

                                type={attr.type}
                            />
                        ))
                    }

                    { /*  ONLY CHARACTERISTICS */ } 
                    {  Object.entries(this.props.attributeGroup)
                        .filter( ([key, value]) => value.choicesType === "characteristic" )
                        .map(([attrKey, attr]) => (

                            <GeneratorAttributeField 
                                key={attrKey} 
                                name={attrKey}
                                choiceType={attr.choicesType}
                                value={attr.value}

                                onEditValue={ (attrKey, value) => {
                                    this.props.onEditAttribute(this.props.attributeGroupKey, attrKey, value);
                                }}

                                onRegenerate={ (attrKey_, index) => {
                                    this.props.onGenerateAttribute(this.props.attributeGroupKey, attrKey_, index);
                                }}

                                onAddCharacteristic={ (attrKey ) => { 
                                    this.props.onAddCharacteristic(this.props.attributeGroupKey, attrKey)
                                }}

                                onRemoveCharacteristic={ (attrKey, index) => {
                                    this.props.onRemoveCharacteristic(this.props.attributeGroupKey, attrKey, index)
                                }}

                                type={attr.type}
                            />
                        ))
                    }
                </Box>
            </Box>
        
        )
    }
}