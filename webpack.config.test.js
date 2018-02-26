const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackAddAnnotationPlugin = require('./index.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    app: './test/index.js',
  },
  module:{
    rules: [ {
        test: /\.(css)?$/,
        use: ["style-loader",'css-loader']
    }, {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: "file-loader"
    }]
  },
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.HashedModuleIdsPlugin(),
    /*这里用到了我们的插件*/
    new WebpackAddAnnotationPlugin({
      startText: "/*这里是注释*/",/*要添加的注释*/
      startNewLine: true, /*注释和文本是否换行*/
      test:/^.*\.js$/gi, /*正则匹配 默认全部匹配 这里给所有js结尾的加注释*/
    })
  ],
};