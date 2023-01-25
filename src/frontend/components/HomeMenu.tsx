import { Grid } from '@mui/material';
import type { ReactElement } from 'react'
import React from 'react';

interface ItemMenuProps {
    children? : React.ReactNode
}

export default function HomeMenu( props : ItemMenuProps ) {

    return (
      <Grid 
        sx={{ flexGrow: 1 }} 
        container 
        spacing={4} 
        marginTop={1}
        justifyContent="center"
      >
        { props.children }
      </Grid>
    );
}