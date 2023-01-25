import React from "react";
import { Link as Link_ } from "react-router-dom";

interface Props{
    children : React.ReactNode;
    to : string;
}

export default function Link(props : Props){

    return (
        <Link_ to={props.to}
            style={{
                color : "unset",
                textDecoration : "none"
            }}
        >
        {props.children}
        </Link_>
    )
}