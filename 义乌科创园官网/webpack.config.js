const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
module.exports = {
  devtool: 'eval-source-map',
  entry:  ["babel-polyfill",__dirname + "/app/components/index.js"],//已多次提及的唯一入口文件
  output: {
    path: __dirname + "/build",//打包后的文件存放的地方
    filename: "bundle.js"//打包后输出文件的文件名
  },
  resolve:{
    alias:{
      '@img':__dirname+'/static/images/',
      '@axios':__dirname+'/app/common/axios'
    }
  },
  devServer: {
    contentBase: "./public",//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转
    // inline: true,//实时刷新
    port:8081,
    host:'0.0.0.0',
    proxy:{
      '/api':{
        target: 'http://183.131.202.186:23502',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "babel-loader",
        },
        exclude: /node_modules/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        enforce: "pre",
        include: [path.resolve(__dirname, 'app')], // 指定检查的目录
        exclude: /node_modules/,
        options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
          formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
        }
      },
      {
        test: /\.(png|jpg|gif|ico|svg|woff|eot|ttf)$/,
        loader: 'url-loader',
        options: { 
          limit:1024,
          outputPath:'images/'
        }
      },
      {
        test: /\.css$/,
        exclude: [/node_modules/,/static/],
        use: [
          {
            loader: "style-loader"
          }, {
            loader: "css-loader",
            options: {
              modules: true
            }
          }, {
            loader: "postcss-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        exclude:/app/,
        use: [
          {
            loader: "style-loader"
          }, {
            loader: "css-loader"
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader"
          }, {
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
    new webpack.BannerPlugin('版权所有，翻版必究'),
    new HtmlWebpackPlugin({
      template: __dirname + "/app/common/index.tmpl.html",//new 一个这个插件的实例，并传入相关的参数
      title: "义乌市科技创业园",
      favicon: __dirname+"/static/images/favicon.ico",
    }),
    new webpack.HotModuleReplacementPlugin()//热加载插件
  ]
};