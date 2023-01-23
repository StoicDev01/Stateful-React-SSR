import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { ViteDevServer } from 'vite'
import { frontendURL, frontendPort } from '../config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isTest = process.env.VITEST

process.env.MY_CUSTOM_SECRET = 'API_KEY_qwertyuiop'

export async function createServer(
  hmrPort? : number,
  root = process.cwd(),
  isProd  = process.env.NODE_ENV === 'production',
) {
  const resolve = (p : string) => path.resolve(__dirname, p)

  const indexProd = isProd
    ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
    : ''

  const app = express()

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite : undefined|ViteDevServer = undefined;
  if (!isProd) {
    vite = await (
      await import('vite')
    ).createServer({
      root,
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
          port: hmrPort,
        },
      },
      appType: 'custom',
    })
    // use vite's connect instance as middleware
    app.use(vite.middlewares)
  } else {
    app.use((await import('compression')).default())
    app.use(
      (await import('serve-static')).default(resolve('dist/client'), {
        index: false,
      }),
      )
  }

  app.use('*', async (req, res) => {
    //try {
      const url = req.originalUrl

      let template, render

      if (!isProd && vite) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('./entry-server.tsx')).render
      } else {
        template = indexProd
        // @ts-ignore
        const renderImport = import("./dist/server/entry-server.js")
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

  })

  return { app, vite }
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(frontendPort, () => {
      console.log("Started frontend Server on : ", frontendURL);
    }),
  )
}