"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hoverProvider = void 0;
const vscode = require("vscode");
const fs_1 = require("fs");
const path_1 = require("path");
const file_1 = require("./file");
const utils_1 = require("./utils");
const config_1 = require("./config");
const api_1 = require("./api");
function hoverProvider(document, position, token) {
    const pathStr = (0, path_1.normalize)(document.uri.path.slice(1));
    const srcPath = (0, file_1.findTargetDirPath)(pathStr, "src");
    if (!srcPath) {
        return;
    }
    (0, utils_1.getProjectLang)(pathStr);
    const langPath = (0, path_1.resolve)(srcPath, config_1.localeDirPath, config_1.localeLangPath);
    const langFileIsExist = (0, fs_1.existsSync)(langPath);
    if (!langFileIsExist) {
        return;
    }
    const localeLangList = (0, file_1.getAllFileNameByParentDir)(langPath);
    const word = document.getText(document.getWordRangeAtPosition(position));
    let localeOrigText = ``;
    try {
        localeLangList.forEach((text) => {
            let langWordPath = `${langPath}/${text}.${config_1.projectLang.value}`;
            const langWordIsExist = (0, fs_1.existsSync)(langWordPath);
            if (!langWordIsExist) {
                return;
            }
            const langMap = (0, utils_1.getLangMapByPath)(langWordPath);
            if (langMap && langMap[word]) {
                localeOrigText += `${text}: ${langMap[word]} `;
            }
        });
    }
    catch (err) {
        console.log(err);
    }
    if (localeOrigText) {
        // 增加埋点
        (0, api_1.getSpotRecord)({
            id: "locale_transform__hover",
            value: localeOrigText,
            project: srcPath
        });
        const md = new vscode.MarkdownString();
        md.appendMarkdown("- 翻译内容\n");
        md.appendText(localeOrigText);
        return new vscode.Hover(md);
    }
}
exports.hoverProvider = hoverProvider;
//# sourceMappingURL=hover.js.map