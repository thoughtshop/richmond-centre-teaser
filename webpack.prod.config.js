const webpack = require('webpack');
const baseConfig = require('./webpack.config.js');
const Merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin')

module.exports = Merge(baseConfig, {
  mode: "production",
  
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },

  devtool: 'cheap-module-source-map'
});
