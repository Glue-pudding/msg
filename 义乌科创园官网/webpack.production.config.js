const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  entry: ["babel-polyfill",__dirname + "/app/components/index.js"], //已多次提及的唯一入口文件
  output: {
    path: __dirname + "/build",
    filename: "bundle-[hash].js"
  },
  resolve:{
    alias:{
      '@img':__dirname+'/static/images/',
      '@axios':__dirname+'/app/common/axios'
    }
  },
  devtool: "null", //注意修改了这里，这能大大压缩我们的打包代码
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "babel-loader"
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                modules: true
              }
            },
            {
              loader: "postcss-loader"
            }
          ]
        }),
        exclude: [/node_modules/, /static/]
      },
      {
        test: /\.(png|jpg|gif|ico|svg|woff|eot|ttf)$/,
        loader: "url-loader",
        options: {
          limit: 1024,
          outputPath: "images/"
        }
      },
      {
        test: /\.css$/,
        exclude: /app/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          },
          {
            loader: "less-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin("版权所有，翻版必究"),
    new HtmlWebpackPlugin({
      template: __dirname + "/app/common/index.tmpl.html", //new 一个这个插件的实例，并传入相关的参数
      title: "义乌科创园",
      favicon: __dirname + "/static/images/favicon.ico"
    }),
    new webpack.HotModuleReplacementPlugin(), //热加载插件
    new webpack.optimize.OccurrenceOrderPlugin(), //OccurenceOrderPlugin :为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
    new webpack.optimize.UglifyJsPlugin(), //压缩js文件
    new ExtractTextPlugin("style.css"), //分离CSS和JS文件
    new CleanWebpackPlugin("build/*.*", {
      root: __dirname,
      verbose: true,
      dry: false
    })
  ]
};
