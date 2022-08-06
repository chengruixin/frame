const path = require("path");
const HTMLWebpackPlugin = require('html-webpack-plugin');
// const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
//   output: {
//     path: path.resolve(__dirname, "dist"),
//     filename: "main.js",
//     publicPath: '/', // 从 entry 定义打包的文件，到打包成 path + filename后的output，这个output被访问的前缀即为publicPath
//   },
  devServer: {
    static: [  // 静态资源文件根目录
      {
        directory: path.resolve(__dirname, 'static'),
        publicPath: '/', // 访问 __dirname + static 的路径的前缀
      }
    ],
    compress: true, // 是否启动压缩
    port: 3000,
    open: true, // 自动打开浏览器
    devMiddleware: {
      writeToDisk: false,
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    // new ESLintPlugin({
    //   extensions: ['js', 'ts', 'jsx', 'tsx'],
    //   // fix: true,
    //   failOnError: true,
    //   failOnWarning: false,
    //   files: './src'
    // }),
    new HTMLWebpackPlugin({
      template: './src/index.html'
    })
  ]
};