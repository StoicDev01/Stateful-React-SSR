import React, { useRef, useState } from "react"
import { Box, Paper, TextField, Button, Container, Stack } from "@mui/material"
import { BiX } from "react-icons/bi/index.js"
import { url } from "../../config"

interface Props {
    visible? : boolean
    onClose? : ( event : React.MouseEvent) => void;
};


export default function Feedback(props : Props){
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [trySubmit, setTrySubmit] = useState(false);

    async function SubmitFeedback(name : string, description : string){
        const result = await fetch(`${url}/api/create/feedback`, {
            method : "POST",
            body : JSON.stringify({
                name : name,
                description : description
            }),
            headers : new Headers({
                'Content-Type' : "application/json",
                Accept : "application/json"
            })
        })
    
        return result;
    }

    return (
        <div id="feedbackbackground"
            style={{
                position : "absolute",
                height : "100vh",
                width : "100vw",
                top : 0,
                display : props.visible ? "block" : "none",
                backdropFilter : "blur(2px)"
            }}
        >
            <Container
                sx={{
                    filter : "blur(0)",
                    zIndex : 10,
                    marginTop : "40px",
                    width : {
                        "sm" : "800px"
                    }
                }}
            >

                <Paper
                    sx={{
                        width : "100%",
                        height : "100%"
                    }}
                >
                    <div
                        style={{
                            minHeight : "30px",
                            display : "flex",
                            flexDirection : "row-reverse",
                            padding : "10px"
                        }}
                    >
                        <Button onClick={
                            (event : React.MouseEvent) => {
                                props.onClose(event);
                                setTrySubmit(false);
                            }
                        }
                            sx={{
                                height : "45px"
                            }}

                            variant="outlined"
                        >
                            <BiX  style={{
                                width : "100%",
                                height : "100%"
                            }}/>
                        </Button>
                    </div>

                    <Stack
                        sx={{
                            padding : "10px"
                        }}
                        spacing={"20px"}
                    >
                        <TextField 
                            fullWidth 
                            placeholder="Name (Optional)"
                            value={name}
                            onChange={ 
                                (e) => { setName(e.target.value)}
                            }
                        >
                        </TextField>

                        <TextField 
                            fullWidth 
                            multiline 
                            placeholder="Description ( Required )"
                            value={description}

                            error={description === "" && trySubmit}
                            helperText={description === "" ? 'Empty field!' : ' '}

                            /* styles the input component */
                            inputProps={{
                                style: {
                                    height : "200px",
                                    overflow : "scroll"
                                },
                            }}

                            onChange={ 
                                (e) => { setDescription(e.target.value)}
                            }
                        >
                        </TextField>
                    </Stack>
                    <div
                        style={{
                            minHeight : "30px",
                            display : "flex",
                            flexDirection : "row-reverse",
                            padding : "10px"
                        }}
                    >
                        <Button 
                            onClick={
                                async (e) => {

                                    if (description != ""){
                                        const result = await SubmitFeedback(name, description);
                                        console.log("SUBMIT RESULT : ", await result.json());
                                        setDescription("");
                                        setName("");

                                        props.onClose(e);
                                        setTrySubmit(false);
                                    }
                                    else{
                                        setTrySubmit(true);
                                    }
                                }
                            }


                            sx={{
                                height : "45px"
                            }}

                            variant="contained"
                        >
                            SUBMIT
                        </Button>
                    </div>
                </Paper>
            </Container>
        </div>
    )
}