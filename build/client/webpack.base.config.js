const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
  entry: {
    app: './src/client/entry-client.js'
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    publicPath: '/dist/',
    filename: 'js/[name].[chunkhash:16].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
    //new BundleAnalyzerPlugin()
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '../../src/client')
    },
    extensions: ['*', '.js', '.vue', '.json']
  }
}
