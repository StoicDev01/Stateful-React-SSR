import { ReactNode } from "react";
import { Grid, Box, Typography, Skeleton, Select, SelectChangeEvent } from "@mui/material"
import React from "react";
import GeneratorAttributeGroup from "./GeneratorAttributeGroup"

interface Props {
    attributes : {[key : string ] : object} | undefined;
    onGenerateAttribute : (groupKey : string, attrKey : string, characteristicIndex? : number) => void;
    onEditAttribute : (groupKey : string , attrKey : string,  newValue : unknown, characteristicIndex? : number) => void;
    onAddCharacteristic : (groupKey : string, attrKey : string) => void;
    onRemoveCharacteristic : (groupKey : string, attrKey : string, characteristicIndex : number) => void;

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
                    <GeneratorAttributeGroup.createSkeleton/>
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
                            <GeneratorAttributeGroup
                                attributeGroup={attrGroup}
                                attributeGroupKey={attrGroupKey}
                                onAddCharacteristic={this.props.onAddCharacteristic}
                                onEditAttribute={this.props.onEditAttribute}
                                onGenerateAttribute={this.props.onGenerateAttribute}
                                onRemoveCharacteristic={this.props.onRemoveCharacteristic}
                            />
                        </Box>
                    ))}
                </Box>
            </Grid>
        )
    }
}