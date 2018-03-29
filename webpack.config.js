const path    = require("path");
const webpack = require("webpack");
const ModernizrWebpackPlugin = require("modernizr-webpack-plugin");

let config = {
  mode: "development",
  
  entry: {
    app: [
      'popper.js', 
      'bootstrap/js/src/tooltip',
      'bootstrap/js/src/popover',
      'jquery-validation',
      path.resolve(__dirname, 'src/scripts/app')
    ],
    vendor: ['picturefill', path.resolve(__dirname, 'src/scripts/vendor')]
  },

  output: {
    path: path.resolve(__dirname, 'build/assets'),
    filename: '[name].js'
  },

  resolve: {
    extensions: [".js", ".json"],
    modules: ['node_modules']
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jquery': 'jquery',
      Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
      Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
    }),
    new ModernizrWebpackPlugin({
      "options": [
        "setClasses"
      ],
      "feature-detects": [
        "svg",
        "svg/smil",
        "css/flexbox",
        "css/flexboxlegacy",
        "css/flexboxtweener",
        "css/flexwrap",
        "css/transforms",
        "css/transitions",
        "css/backgroundcliptext"
      ]
    })
  ],

  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ],
            plugins: [
              '@babel/plugin-proposal-object-rest-spread'
            ]
          }
        }
      },
      {
        test: /\.woff$/,
        use: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.woff2$/,
        use: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.ttf$/,
        use: "file-loader"
      },
      {
        test: /\.eot$/,
        use: "file-loader"
      },
      {
        test: /\.svg$/,
        use: "file-loader"
      }
    ]
  },

  devtool: 'cheap-module-eval-source-map'
}

module.exports = config;
