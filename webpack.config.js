const webpack = require('webpack')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function(options) {
  if (!options) options = {};

  return {
    entry: {
      main: path.resolve('src/index.ts')
    },

    output: {
      path: path.resolve("dist"),
      filename: 'bundle.js'
    },

    devtool: (options.production) ? '' : 'cheap-source-map',

    module: {
      rules: [
        { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
        { test: /\.styl/, use: ['style-loader', 'css-loader', 'stylus-loader'] },
        { test: /\.(woff|woff2|eot|ttf)$/, loader: 'file-loader?limit=1024&name=[name].[ext]' },
        { test: /\.svg$/i, loaders: [ 'preload-image-loader', 'file-loader' ] },
      ]
    },

    plugins: [
      // new webpack.optimize.UglifyJsPlugin(),
      new ExtractTextPlugin("styles.css"),
      new HtmlWebpackPlugin({
        template: path.resolve("src", "index.html")
      }),
    ],

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
    }

  }
};
