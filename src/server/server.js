import fs from 'fs'
import path from 'path'
import express from 'express'
import webpack from 'webpack'
import createDevServer from '../../build/setup-dev-server'
import { createBundleRenderer } from 'vue-server-renderer'


const createServer = async () => {
  const app = express()
  const resolve = (file) => path.resolve(__dirname, file)
  const template = fs.readFileSync("./public/index.html", "utf-8")
  const serve = path => express.static(resolve(path))

  const createRenderer = (bundle, options) => createBundleRenderer(bundle, {
    ...options,
    template,
    //basedir: process.env.NODE_ENV !== 'production' ? path.resolve(__dirname, '../../dist') : null,
    runInNewContext: true
  })

  const render = (req, res, context) => {
    const s = Date.now()
    console.log(`Rendering: ${req.url}`)

    res.setHeader('Content-Type', 'text/html')

    const errorHandler = (err) => {
      // TODO: Render Error Page
      console.error(`Fatal error when rendering : ${req.url}`)
      console.error(err)

      res.status(500)
      res.end(`500 | Fatal error: ${err}`)

      console.log(`Whole request: ${Date.now() - s}ms`)
    }

    renderer.renderToString(context, (err, html) => {
      if (err) return errorHandler(err)
      return res.status(200).end(html)
      console.log(`Whole request: ${Date.now() - s}ms`)
    })
  }

  let renderer, isReady
  if (process.env.NODE_ENV === 'production') {
    const bundle = require('../../dist/vue-ssr-bundle.json')
    const clientManifest = require('../../dist/vue-ssr-client-manifest.json')
    renderer = createRenderer(bundle, { clientManifest })
    isReady = Promise.resolve()
  }
  else {
    isReady = createDevServer(app, (bundle, options) => {
      renderer = createRenderer(bundle, options)
    })

  }

  app.use('/dist', serve('../../dist'))

  app.get('*', (req, res) => process.env.NODE_ENV === 'production' ?
    render(req, res, { url: req.url}) :
    isReady.then(() => render(req, res, { url: req.url}))
  )

  return Promise.resolve(app)
}

export default createServer
