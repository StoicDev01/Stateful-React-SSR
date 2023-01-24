import { ReactNode } from "react";
import { Grid, Box, Typography, Skeleton, Select, SelectChangeEvent } from "@mui/material"
import React from "react";
import GeneratorAttributeField from "./GeneratorAttribute"

interface Props {
    attributes : {[key : string ] : object} | undefined;
    onGenerateAttribute : (groupKey : string, attrKey : string, characteristicIndex? : number) => void;
    onEditAttribute : (groupKey : string , attrKey : string,  newValue : unknown, characteristicIndex? : number) => void;
}

export default class GeneratorAttributes extends React.Component<Props>{

    constructor(props : Props){
        super(props);
    }

    createSkeleton(){
        const skeletons: React.ReactNode[] = [];

        for (let i = 0; i < 2   ; i++){
            skeletons.push(
                <Box key={`Skeleton-${i}`}>

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
 
                </Box>
            );
        }

        return skeletons;
    }

    render(): ReactNode {
        const skeletons = this.createSkeleton();

        return (
            <Grid
                item
            >
                { this.props.attributes === undefined && (
                    <>
                        {skeletons}
                    </>
                )}
        
                <Box>
                    {  this.props.attributes && Object.entries(this.props.attributes).map( ([attrGroupKey, attrGroup]) => (
                        <Box key={attrGroupKey}>

                            { /* ATTRIBUTE GROUP TITLE */} 
                            <Typography
                                variant="h2"
                            >
                                {attrGroupKey}
                            </Typography>


                            <Box
                                margin="0px 10px 25px"
                            >
                                {
                                    typeof attrGroup == "object" && 
                                    Object.entries(attrGroup).map(([attrKey, attr]) => (
                                        <GeneratorAttributeField 
                                            key={attrKey} 
                                            name={attrKey}
                                            choiceType={attr.choicesType}
                                            value={attr.value}
                                            onEditValue={ (attrKey, value) => {
                                                this.props.onEditAttribute(attrGroupKey, attrKey, value);
                                            }}
                                            onRegenerate={ (attrKey_, index) => {
                                                this.props.onGenerateAttribute(attrGroupKey, attrKey_, index);
                                            }}
                                            type={attr.type}
                                        />
                                    ))
                                }
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Grid>
        )
    }
}