

class WebpackAddAnnotationPlugin {
    constructor(options = {}) {
        const {
            startText,
            endText,
            startNewLine=false,
            endNewLine=false,
            test=null/*正则表达式*/
        } = options;

        this.options = {
            startText,
            startTextisFunction :this.isFunction(startText),
            endText,
            endTextisFunction :this.isFunction(endText),
            test,
            startNewLine,
            endNewLine
        };
    }

    isFunction (fun){
        return typeof fun === "function";
    }

    decorateStartText(startText){
        return this.getText(startText) + (!!this.options.startNewLine ? `\n` : "");
    }
    
    decorateEndText(endText){
        return (!!this.options.endNewLine ? `\n` : "") + this.getText(endText);;
    }

    getText(text){
        text = (text || "").toString();
        if (!text) {
            return "";
        }
        return /^\/\*.*\*\/$/.test(text) ? text : `/*${text}*/`;
    }

    apply(compiler) {
        let that = this;
        let { startText, endText, test, startTextisFunction, endTextisFunction } = this.options;
        let tempStartText = "";
        let tempEndText = "";
        if (!startTextisFunction) {
            tempStartText = this.decorateStartText(startText);
        }
        if (!endTextisFunction) {
            tempEndText = this.decorateEndText(endText);
        }

        compiler.plugin('emit', (compilation, callback) => {
            compilation.chunks.forEach(function (chunk) {
                chunk.files.forEach(function (filename,index) {
                    if (!!test) {
                        if (typeof test === "object" && !!test.test) {
                            if (!test.test(filename)) {
                                return;
                            }
                        } else {
                            let text = "WebpackAddAnnotationPlugin传入的test字段必须是正则表达式";
                            console.error(text);
                            throw new Error(text);
                        }
                    }
                    let oldFile = compilation.assets[filename];
                    if (startTextisFunction) {//如果开头是一个方法
                        tempStartText = that.decorateStartText(startText(filename));
                    }
                    if (endTextisFunction) {//如果结束是一个方法
                        tempEndText = that.decorateEndText(endText(filename));
                    }
                    compilation.assets[filename] = {
                        source: () => {
                            return `${tempStartText}${oldFile.source()}${tempEndText}`;
                        },
                        size: () => {
                            return Buffer.byteLength(`${tempStartText}${tempEndText}`, 'utf8') + oldFile.size();
                        }
                    };
                });
            });
            callback();
        });
    }
}

module.exports = WebpackAddAnnotationPlugin;