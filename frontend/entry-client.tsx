import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import getServerStatus from './ServerStatus'

async function main() {
  const serverStatus = await getServerStatus();
  const loaded = serverStatus === "loaded";

  ReactDOM.hydrateRoot(
    document.getElementById('app') as HTMLElement,
    <BrowserRouter>
      <App loaded={loaded}/>
    </BrowserRouter>,
  )
  console.log('hydrated')
}

main();