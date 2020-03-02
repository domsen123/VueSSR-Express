const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const WebpackBar = require('webpackbar')

module.exports = merge(base, {
  mode: 'development',
  plugins: [
    new HtmlWebPackPlugin({
      template: "public/index.html"
    }),
    new VueSSRClientPlugin(),
    new WebpackBar({ name: 'Client', color: 'green' })
  ],
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  devtool: '#eval-source-map'
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
