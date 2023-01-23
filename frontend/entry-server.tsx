import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { App } from './App'
import { backendURL } from '../config';
import Load from './components/Load';
import getServerStatus from './ServerStatus';
import React from "react"

export async function render(url : string, context : any) {
  const serverStatus = await getServerStatus();
  const loaded = serverStatus === "loaded";

  return ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <App loaded={loaded}/>
    </StaticRouter>,
  )
}