const path = require('path')
const webpack = require('webpack')
const MFS = require("memory-fs")
const clientConfig = require("./client/webpack.entry.client.config")
const serverConfig = require("./client/webpack.entry.server.config")
const webpackDevMiddleware = require("webpack-dev-middleware")
const webpackHotMiddleware = require("webpack-hot-middleware")

let bundle, clientManifest

const setupServer = () => {
  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  serverCompiler.mode = 'development'
  serverCompiler.outputFileSystem = mfs
  return serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    stats.errors.forEach((err) => console.error(err))
    stats.warnings.forEach((err) => console.warn(err))
    const readFile = (file) => mfs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')
    bundle = JSON.parse(readFile('vue-ssr-bundle.json'))
  })
}

const setupClient = async app => new Promise(resolve => {
  clientConfig.mode = 'development'
  clientConfig.entry.app = ["webpack-hot-middleware/client", clientConfig.entry.app]
  clientConfig.output.filename = "[name].js"
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )

  const clientCompiler = webpack(clientConfig)
  const devMiddleware = webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true
  })
  app.use(devMiddleware)

  clientCompiler.plugin('done', () => {
    console.log('done')
    const fs = devMiddleware.fileSystem
    const readFile = (file) => fs.readFileSync(path.join(clientConfig.output.path, file), "utf-8")
    clientManifest = JSON.parse(readFile('vue-ssr-client-manifest.json'))
    resolve()
  })

  // hot middleware
  app.use(webpackHotMiddleware(clientCompiler))
})

const setupDevServer = async (app, cb) => new Promise(async resolve => {
  setupServer()
  await setupClient(app)
  cb(bundle, { clientManifest })
  return resolve()
})

export default setupDevServer
