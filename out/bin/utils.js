"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectVueVersion = exports.getLangMapByPath = exports.getLocalLang = exports.getProjectLang = void 0;
const vscode = require("vscode");
const path_1 = require("path");
const config_1 = require("./config");
const file_1 = require("./file");
const fs_1 = require("fs");
/**
 * 获取当前工作区的package
 * @param pathStr 路径
 * @returns
 */
function getProjectPackage(pathStr) {
    const srcPath = (0, file_1.findTargetDirPath)(pathStr, "src");
    const packageFilePath = (0, path_1.resolve)(srcPath, "../package.json");
    const packageText = (0, file_1.readFileContent)(packageFilePath);
    return JSON.parse(packageText);
}
/**
 * 获取当前项目的语言
 * @param pathStr 路径
 */
function getProjectLang(pathStr) {
    const packageJson = getProjectPackage(pathStr);
    const isTs = packageJson?.devDependencies?.typescript || packageJson?.dependencies?.typescript;
    config_1.projectLang.value = isTs ? "ts" : "js";
}
exports.getProjectLang = getProjectLang;
function getLocalLang(pathStr) {
    const langFilePath = `${pathStr}/${config_1.localLang.value}.${config_1.projectLang.value}`;
    if (!(0, fs_1.existsSync)(langFilePath)) {
        let cnLangText;
        if (config_1.localLang.value === 'cn') {
            cnLangText = 'zh';
        }
        else if (config_1.localLang.value === 'zh') {
            cnLangText = 'cn';
        }
        if (cnLangText) {
            if ((0, fs_1.existsSync)(`${pathStr}/${cnLangText}.${config_1.projectLang.value}`)) {
                config_1.localLang.value = cnLangText;
            }
        }
    }
}
exports.getLocalLang = getLocalLang;
/**
 * 获取lang 语言文件，并转为对象
 * @param pathStr lang 路径
 * @returns
 */
function getLangMapByPath(pathStr) {
    try {
        const content = (0, file_1.readFileContent)(pathStr);
        const leftIndex = content.indexOf("{");
        const langFunc = new Function(`return ${content.slice(leftIndex)}`);
        return langFunc();
    }
    catch (err) {
        vscode.window.showErrorMessage(`${err}`);
        return {};
    }
}
exports.getLangMapByPath = getLangMapByPath;
function getProjectVueVersion(pathStr) {
    const packageJson = getProjectPackage(pathStr);
    return packageJson?.dependencies?.vue || packageJson?.devDependencies?.typescript;
}
exports.getProjectVueVersion = getProjectVueVersion;
//# sourceMappingURL=utils.js.map