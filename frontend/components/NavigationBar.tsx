import { AppBar, Container, Toolbar, Typography, Box, Button, Stack } from "@mui/material"
import { BiMenu } from "react-icons/bi"
import Link from "./Link"
import { name } from "../../config"

interface NavigationBarProps{
    pages : { 
        name : string,
        href : string
    }[]
}

export default function NavigationBar(props : NavigationBarProps ){

    return (
        <AppBar position="static">
            <Container>
                <Toolbar>

                    {/* Medium window sizes */}
                    <Link to="/">
                        <Typography
                            variant="h1"
                            noWrap
                            sx={{
                                mr: 2,
                                display : { xs : 'none', md : 'flex'},
                                fontFamily : 'monospace',
                                fontWeight : 700,
                                letterSpacing : ".1rem",
                                color: "inherit",
                                textDecoration : "none"
                            }}
                        >
                            {name}
                        </Typography>
                    </Link>

                    <Box 
                        sx={{ 
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' } 
                        }}
                    >
                        {props.pages.map((page ) => (
                            <Link to={`${page.href}`} key={page.name}>
                                <Button
                                    sx={{
                                        my: 2, 
                                        color: 'white', 
                                        display: 'block' 
                                    }}
                                    
                                >
                                    <Typography
                                        variant="h4"

                                    >
                                        {page.name}
                                    </Typography>
                                </Button>
                            </Link>
                        ))}
                    </Box>

                    { /* Small Window Sizes */}
                    <Link to="/">
                        <Typography
                                variant="h1"
                                noWrap
                                sx={{
                                    mr: 2,
                                    display : { xs : 'flex', md : 'none'},
                                    fontFamily : 'monospace',
                                    fontWeight : 700,
                                    letterSpacing : ".1rem",
                                    color: "inherit",
                                    textDecoration : "none"
                                }}
                            >
                                {name}
                        </Typography>
                    </Link>
                        
                    <Stack
                        sx={{
                            display : {xs : "flex", md : "none"},
                            marginLeft : "auto",
                            marginRight : "0"
                        }}
                        direction={"row-reverse"}
                    >
                        <Button
                            variant="outlined"
                            sx={{
                                color : "white"
                            }}
                        >
                            <BiMenu
                                style={{
                                    width : "auto",
                                    height : "35px",
                                }}
                            >
                            </BiMenu>
                        </Button>
                    </Stack>

            
                </Toolbar>
            </Container>
      </AppBar>
    );
}