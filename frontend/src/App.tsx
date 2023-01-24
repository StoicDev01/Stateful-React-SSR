import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { Link, Route, Routes } from 'react-router-dom'
import Load from './components/Load';
import NavigationBar from './components/NavigationBar';
import Theme from './components/Theme';
import { useEffect, useState } from 'react';
import { backendURL } from '../config.js';
import React from "react"

// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const pages = import.meta.glob('./pages/**/*.tsx', { eager: true })

interface Route {
  name : string,
  path : string,
  component : (props?: any) => JSX.Element;
}

const routes : Route[] = Object.keys(pages).map((path) => {
  const name = (path.match(/\.\/pages\/(.*)\.tsx$/) as string[])[0];

  let urlPath = name.replace("./pages/", "");
  urlPath = urlPath.replace(".tsx", "");

  return {
    name : urlPath,
    path: urlPath === 'Home' ? '/' : `/${urlPath.toLowerCase()}`,
    component: (pages[path] as any).default,
  }  
})

const navPages = [
  {
    name : "About",
    href : "/about"
  }
]


interface Props {
  loaded  : boolean,
}

export function App(props : Props) {  
  return (
    <>
      <ThemeProvider theme={Theme}>
        <CssBaseline/>
        <NavigationBar pages={navPages}/>

          {props.loaded && (
            <Routes>
              {routes.map(({ path, component: RouteComp }) => {
                return <Route key={path} path={path} element={<RouteComp />}></Route>
              })}
            </Routes>
          )}

          {!props.loaded && (
            <Load/>
          )}
      </ThemeProvider>
    </>
  )
}
