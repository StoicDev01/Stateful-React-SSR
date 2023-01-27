import React, { MouseEventHandler, MouseEvent } from "react";
import { Link as Link_ } from "react-router-dom";

interface Props{
    children : React.ReactNode;
    to? : string;
    onclick? : (event : MouseEvent) => void;
}

export default function Link(props : Props){

    return (
        <Link_ to={props.to} onClick={props.onclick}
            style={{
                color : "unset",
                textDecoration : "none"
            }}
        >
        {props.children}
        </Link_>
    )
}