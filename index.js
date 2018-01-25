

class WebpackAddAnnotationPlugin {
    constructor(options = {}) {
        const {
            startText,
            endText,
            startNewLine=false,
            endNewLine=false,
        } = options;

        this.options = {
            startText: this.getText(startText) + (!!startNewLine&&`\n`),
            endText: (!!endNewLine && `\n`) + this.getText(endText)
        };
    }

    getText(text){
        text = (text || "").toString();
        if (!text) {
            return "";
        }
        return /^\/\*.*\*\/$/.test(text) ? text : `/*${text}*/`;
    }

    apply(compiler) {
        let { startText, endText } = this.options;
        compiler.plugin('emit', (compilation, callback) => {
            compilation.chunks.forEach(function (chunk) {
                chunk.files.forEach(function (filename,index) {
                    let oldFile = compilation.assets[filename];
                    compilation.assets[filename] = {
                        source: () => {
                            return `${startText}${oldFile.source()}${endText}`;
                        },
                        size: () => {
                            return Buffer.byteLength(`${startText}${endText}`, 'utf8') + oldFile.size();
                        }
                    };
                });
            });
            callback();
        });
    }
}

module.exports = WebpackAddAnnotationPlugin;