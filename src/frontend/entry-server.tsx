import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { App } from './App.js'
import React from "react"

export async function render(url : string, context : any) {

  return ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <App/>
    </StaticRouter>,
  )
}