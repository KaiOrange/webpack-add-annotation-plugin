# webpack-add-annotation-plugin
#### 一个在webpack打包后的文件中添加注释的插件。


## 使用 🐛
1.下载包.
```sh
npm i webpack-add-annotation-plugin
```
2.在webpack.config.js里面添加插件配置如下.
```JavaScript
var WebpackAddAnnotationPlugin = require("webpack-add-annotation-plugin");

/*修改plugins部分代码*/
plugins: [
    /*这里用到了我们的插件*/
    new WebpackAddAnnotationPlugin({
      startText: "/*这里是注释*/",/*要添加的注释*/
      startNewLine: true, /*注释和文本是否换行*/
      test:/^.*\.js$/gi, /*正则匹配 默认全部匹配 这里给所有js结尾的加注释*/
    })
  ],
```

## 例子

1. 克隆项目：
`git clone git@github.com:KaiOrange/webpack-add-annotation-plugin.git`
2. 下载包：
`npm install`
3. 运行测试例子：
`npm run test`
4. 运行完成后查看dist目录下的文件，如下注释已经加载上了。

![运行结果](./testresult.png)

## 参数

1. `startText:<string|function>` 开始位置插入的文本，当是函数的时候会有一个fileName的参数，返回值就是希望添加的注释文本：
2. `endText:<string|function>` 结束位置插入的文本，当是函数的时候会有一个fileName的参数，返回值就是希望添加的注释文本：
3. `startNewLine:<boolean>` 开始处注释和正文是否换行，默认不换行`(false)`：
4. `endNewLine:<boolean>` 结束处注释和正文是否换行，默认不换行`(false)`：
5. `test:<object>` 正则表达式，匹配需要添加注释的**打包后的文件名**：
