"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyLocaleTransform = exports.localeTransform = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const vscode = require("vscode");
const collect_1 = require("./collect");
const config_1 = require("./config");
const file_1 = require("./file");
const locale_1 = require("./locale");
const utils_1 = require("./utils");
const dealFilePathFunc = function (path) {
    const res = (0, file_1.readFileContent)(path);
    // 去除注释
    const replaceContent = res.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
    const matchList = replaceContent.match(config_1.chineseReg);
    if (matchList) {
        collect_1.default.add(matchList, path);
    }
};
const translate = async function (path) {
    try {
        const stats = (0, fs_1.statSync)(path);
        if (stats.isDirectory()) {
            (0, file_1.traverseDir)(path, dealFilePathFunc);
        }
        else {
            dealFilePathFunc(path);
        }
        collect_1.default.createSetMap(path);
        collect_1.default.transform();
        await collect_1.default.getEnWord();
    }
    catch (err) {
        vscode.window.showErrorMessage(`${err}`);
    }
};
function localeTransform(context) {
    let uri = context;
    if (!context) {
        uri = vscode.window.activeTextEditor?.document.uri;
    }
    keyLocaleTransform(uri);
}
exports.localeTransform = localeTransform;
async function keyLocaleTransform(pathUri) {
    const pathStr = (0, path_1.normalize)(pathUri.path.slice(1));
    const srcPath = (0, file_1.findTargetDirPath)(pathStr, "src");
    if (!srcPath) {
        vscode.window.showErrorMessage("未找到src目录!!!");
        return;
    }
    const vueVersion = (0, utils_1.getProjectVueVersion)(pathStr);
    if (!vueVersion) {
        vscode.window.showErrorMessage("暂不支持非vue项目");
        return;
    }
    (0, utils_1.getProjectLang)(pathStr);
    vscode.window.showInformationMessage(`开始翻译`);
    try {
        collect_1.default.reset();
        await translate(pathStr);
        await locale_1.default.detection(pathStr);
        await locale_1.default.replace(pathStr);
        locale_1.default.transform(pathStr);
    }
    catch (err) {
        vscode.window.showErrorMessage(`${err}`);
    }
    vscode.window.showInformationMessage(`翻译完成`);
}
exports.keyLocaleTransform = keyLocaleTransform;
//# sourceMappingURL=index.js.map