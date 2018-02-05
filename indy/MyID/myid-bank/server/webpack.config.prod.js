const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, '../client'),
  output: {
    path: path.resolve(__dirname, '../server/public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        WEBPACK: true
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('bundle.css')
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: path.resolve(__dirname, '../client')
      }, {
        test: /\.scss/,
        loader: ExtractTextPlugin.extract('style', 'css!sass!postcss'),
        include: path.resolve(__dirname, '../client')
      }
    ]
  },
  postcss: [autoprefixer]
}
