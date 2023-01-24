// Pre-render the app into static HTML.
// run `yarn generate` and then `dist/static` can be served as a static site.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const toAbsolute = (p ) => path.resolve(__dirname, p)

const template = fs.readFileSync(toAbsolute('dist/static/index.html'), 'utf-8')
const isDev = process.env.NODE_ENV !== "production";

const importPath = isDev ? "../dist/server/entry-server.mjs" : "../server/entry-server.mjs" 

const stat = fs.statSync(importPath);

if (!stat.isFile()){
  console.error(`Error, ImportPath ${importPath} is not a file`);
  process.exit();
}

const { render } = await import(importPath)

// determine routes to pre-render from pages
const routesToPrerender = fs
  .readdirSync(toAbsolute('pages'))
  .map((file) => {
    const name = file.replace(/\.tsx$/, '').toLowerCase()
    return name === 'home' ? `/` : `/${name}`
  })

;(async () => {
  // pre-render each route...
  for (const url of routesToPrerender) {
    const context = {}
    const appHtml = await render(url, context)

    const html = template.replace(`<!--app-html-->`, appHtml)

    const filePath = `dist/static${url === '/' ? '/index' : url}.html`
    fs.writeFileSync(toAbsolute(filePath), html)
    console.log('pre-rendered:', filePath)
  }
})()
