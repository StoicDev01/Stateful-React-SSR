import React from "react";
import TextFieldAttribute from "./attribute/GeneratorTextAttribute"
import CharacteristicField, {Characteristic} from "./attribute/GeneratorCharacteristicAttribute"
import { isEqual } from "lodash-es";

// Interfaces 
interface Props {
    name : string ;
    choiceType : string | undefined;
    value : string | number | Characteristic[];
    type : string;
    onEditValue? : (key : string, value : unknown) => void;
    onRegenerate? : (key : string, index? : number) => void;
    onAddCharacteristic? : (attrKey : string) => void
    onRemoveCharacteristic? : (attrKey : string, index : number) => void;
}


/// Main Component wrapper
export default class GeneratorAttributeField extends React.Component<Props>{

    constructor(props : Props){
        super(props);

        this.state = {
            value : this.props.value
        }
    }

    render(): React.ReactNode {        
        return (
            <>
                { (this.props.choiceType === undefined || this.props.choiceType === "string") && (
                    <TextFieldAttribute
                        name={this.props.name}
                        onRegenerate={this.props.onRegenerate}
                        onEditValue={this.props.onEditValue}
                        value={this.props.value}
                        type={this.props.type}
                    />
                )}
    
                { (
                    this.props.choiceType !== undefined && this.props.choiceType === "characteristic") &&
                    Array.isArray(this.props.value)
                && (
                    <CharacteristicField
                        name={this.props.name}
                        value={this.props.value}
                        onEditValue={this.props.onEditValue}
                        onRegenerate={this.props.onRegenerate}
                        onAdd={this.props.onAddCharacteristic}
                        onRemove={this.props.onRemoveCharacteristic}
                    />
                )}
            </>
        );
    }
};
