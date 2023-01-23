import Paper from '@mui/material/Paper';
import React from "react"
import { IconType } from "react-icons"
import {Grid, Typography} from "@mui/material"
import Link from './Link';

interface itemProps {
    type : string,
    description : string,
    icon? : IconType,
    href : string
  }
  
export default function HomeItem( props : itemProps){
    return (
        <Grid key={1} item>
            <Paper
                sx={{
                    height: {xs : 220, md : 250},
                    width: {xs : 180, md : 200},
                }}
                >
                
                <Link to={props.href}>
                    {
                        props.icon  && ( 
                            <props.icon
                                style={{
                                    marginTop : "20px",
                                    marginLeft : "auto" ,
                                    marginRight : "auto",
                                    marginBottom: "0px",
                                    width : "100%",
                                    height : "80px"
                                }}
                            />
                        )
                    }

                    <Typography
                        sx={{
                            textAlign :"center",
                            marginTop : "10px",
                            marginBottom : "10px"
                        }}
                        variant="h3"
                    >
                        {props.type}
                    </Typography>

                </Link>


                <Typography
                    sx={{
                        textAlign : "center",
                        marginBottom : 0,
                        marginTop : 0
                    }}
                >
                    {props.description} 
                </Typography>
        </Paper>
        </Grid>

    );
}