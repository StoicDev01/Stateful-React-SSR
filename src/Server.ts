import fs from 'fs'
import Path from 'path'
import { fileURLToPath } from 'url'
import express, { Request, Response} from 'express'
import { url, port } from './config.js'
import cors from "cors"
import {ViteDevServer, createServer} from "vite"
import { ServerData } from './ServerData.js'
import apiRouter from './ApiRouter.js'
import BodyParser from 'body-parser'
import Compression from 'compression'
import ServeStatic from 'serve-static'
import dotenv from "dotenv"

dotenv.config();

const __dirname = Path.dirname(fileURLToPath(import.meta.url))
const isTest = process.env.VITEST
const isProd  = process.env.NODE_ENV === 'production';
const doLog = true;

function log(text : string){
  if (doLog){
    console.log(text);
  }
}

async function createViteServer(){
  return await createServer({
    root: "./src/frontend",
    logLevel: isTest ? 'error' : 'info',
    server: {
      middlewareMode: true,
      watch: {
        // During tests we edit the files too fast and sometimes chokidar
        // misses change events, so enforce polling for consistency
        usePolling: true,
        interval: 100,
      },
      hmr: {
      },
    },
    appType: 'custom',
  })
}

async function renderPage(req :Request, res : Response, viteServer? : ViteDevServer, index? : string) {
    //try {
      const url = req.originalUrl
      log(`${req.ip} Request page ${url}`);

      let template : string, render

      if (!isProd && viteServer) {
        // always read fresh template in dev
        template = fs.readFileSync(Path.resolve('./src/frontend/index.html'), 'utf-8')
        template = await viteServer.transformIndexHtml(url, template)
        render = (await viteServer.ssrLoadModule('./entry-server.tsx')).render
      } else if (index) {
        template = index
        // @ts-ignore
        const entryServer = "./frontend/server/entry-server.js";
        const renderImport = import(entryServer);
        render = (await renderImport).render;
      }

      const context : any = {}
      const appHtml = await Promise.resolve(render(url, context));

      if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        return res.redirect(301, context.url)
      }

      const html = template.replace(`<!--app-html-->`, appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    /*
    } catch (e) {
      if (vite){
        !isProd && vite.ssrFixStacktrace(e as Error)
        console.log((e as Error).stack)
        res.status(500).end((e as Error).stack)
      }
    }
    */
}

async function main(
  hmrPort? : number,
  root = "./src"
) {
  const resolve = (p : string) => Path.resolve(__dirname, p)

  const indexProd = isProd
    ? fs.readFileSync(resolve('frontend/client/index.html'), 'utf-8')
    : ''

  const server = express()
  const apiPath = Path.join(__dirname, "/backend/api");

  let viteServer :ViteDevServer;

  if (!isProd) {
    // use vite's connect instance as middleware
    viteServer = await createViteServer();
    server.use(viteServer.middlewares)
  } else {
    server.use(Compression());
    server.use(ServeStatic(resolve("frontend/client")))
  }

  if (!isProd){
    server.use(cors());
  }

  // parse application/x-www-form-urlencoded
  server.use(BodyParser.urlencoded({ extended: false }))

  // parse application/json
  server.use(BodyParser.json())

  server.use("/api", await apiRouter(apiPath));

  // Render page
  server.use('*', async (req, res) => renderPage(req, res, viteServer, indexProd))

  server.listen(port, () => {
    console.log("Started Server on : ", url);
  })

  ServerData.load();
}

main();