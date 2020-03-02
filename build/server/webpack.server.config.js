const path = require('path')
const nodeExternals = require('webpack-node-externals')
const { dependencies } = require('../../package.json')

const externals = [ , ...Object.keys(dependencies) ]

module.exports = {
  mode: 'development',
  entry: {
    server: './src/server/bin/www.js',
  },
  output: {
    path: path.join(__dirname, '../../dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  target: 'node',
  externals: [
    nodeExternals()
  ],
  devtool: 'source-map',
  module: {
    rules: [
      {
        // Transpiles ES6-8 into ES5
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
}
