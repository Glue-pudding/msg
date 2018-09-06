const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const autoprefixer = require("autoprefixer");
const antdTheme = require("./config/theme/index.json");
// 打包后的资源根目录（本地物理文件路径）
const ASSETS_BUILD_PATH = path.resolve("./build");
module.exports = {
  devtool: "eval-source-map",
  entry: ["babel-polyfill", __dirname + "/app/components/index.js"], //入口文件
  output: {
    path: ASSETS_BUILD_PATH, //打包后的文件存放的地方
    filename: "bundle.js" //打包后输出文件的文件名
  },
  resolve: {
    alias: {
      "@static": __dirname + "/static",
      "@axios": __dirname + "/config/axios",
      "@api": __dirname + "/config/mock/api",
      "@config": __dirname + "/config",
      "@common":__dirname+"/app/common/modules"
    },
    extensions: [".js", ".jsx"] // 同时支持 js 和 jsx
  },
  devServer: {
    contentBase: "./public", //本地服务器所加载的页面所在的目录
    historyApiFallback: true, //不跳转
    // inline: true,//实时刷新
    port: 8088,
    host: "127.0.0.1",
    proxy: {
      "/api": {
        target: "https://183.131.202.165:8090/ownership_webtransfer",
        changeOrigin: true,
        secure:false,
        pathRewrite: {
          "^/api": "/api"
        }
      }
    }
  },
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
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        enforce: "pre",
        include: [path.resolve(__dirname, "app")], // 指定检查的目录
        exclude: /node_modules/,
        options: {
          // 这里的配置项参数将会被传递到 eslint 的 CLIEngine
          formatter: require("eslint-friendly-formatter") // 指定错误报告的格式规范
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true
            }
          },
          {
            loader: "postcss-loader"
          }
        ],
        exclude: [/node_modules/, /static/]
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
        test: /\.(png|jpg|gif|ico|svg|woff|eot|ttf)$/,
        loader: "url-loader",
        options: {
          limit: 1024,
          outputPath: "images/"
        }
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true
            }
          },
          {
            loader: "postcss-loader"
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
      title: "大数据交易中心",
      favicon: __dirname + "/static/images/favicon1.ico"
    }),
    new webpack.HotModuleReplacementPlugin() //热加载插件
  ]
};
