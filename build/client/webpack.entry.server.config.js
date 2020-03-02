const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const nodeExternals = require('webpack-node-externals')
const VueSSRPlugin = require('vue-ssr-webpack-plugin')
const { dependencies } = require('../../package.json')

module.exports = merge(base, {
  mode: 'development',
  target: 'node',
  entry: {
    app: './src/client/entry-server.js'
  },
  devtool: "#source-map",
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: 'server.bundle.js',
    libraryTarget: 'commonjs2',
  },
  externals: [
    ...Object.keys(dependencies)
  ],
  plugins: [
    new webpack.DefinePlugin({
      "process.env.VUE_ENV": "'server'"
    }),
    new VueSSRPlugin()
  ]
})


if (process.env.NODE_ENV === 'production') {
  module.exports.mode = 'production'
  module.exports.devtool = '#source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
