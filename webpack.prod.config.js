const webpack = require('webpack');
const baseConfig = require('./webpack.config.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const Merge = require('webpack-merge');

module.exports = Merge(baseConfig, {
  mode: "production",
  
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false
          },
          compress: {
            drop_console: true
          }
        }
      })
    ]
  },

  devtool: 'cheap-module-source-map'
});
