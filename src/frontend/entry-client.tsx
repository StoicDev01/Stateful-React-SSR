import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import React from "react"

async function main() {

  ReactDOM.hydrateRoot(
    document.getElementById('app') as HTMLElement,
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  )
  console.log('hydrated')
}

main();