"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFileNameByParentDir = exports.findTargetDirPath = exports.mkdirIfNotExist = exports.writeFileContent = exports.readFileContent = exports.traverseDir = void 0;
const fs_1 = require("fs");
const mkdirp_1 = require("mkdirp");
const path = require("path");
const vscode = require("vscode");
const config_1 = require("./config");
function traverseDir(dirpath, dealFilePathFunc) {
    const files = (0, fs_1.readdirSync)(dirpath);
    files.forEach((filename) => {
        const filePath = path.join(dirpath, filename);
        if (config_1.unLoopDirPath.includes(filename)) {
            return;
        }
        const stats = (0, fs_1.statSync)(filePath);
        if (stats.isDirectory()) {
            traverseDir(filePath, dealFilePathFunc);
        }
        else {
            const parsed = path.parse(filePath);
            if (config_1.loopExtList.includes(parsed.ext)) {
                dealFilePathFunc(filePath, filename);
            }
        }
    });
}
exports.traverseDir = traverseDir;
function readFileContent(filepath) {
    try {
        return (0, fs_1.readFileSync)(filepath, "utf-8");
    }
    catch (err) {
        vscode.window.showErrorMessage(`${err}`);
        return "";
    }
}
exports.readFileContent = readFileContent;
function writeFileContent(filepath, content) {
    try {
        (0, fs_1.writeFileSync)(filepath, content);
    }
    catch (err) {
        vscode.window.showInformationMessage(`${filepath} 转换失败`);
        vscode.window.showErrorMessage(`${err}`);
        return "";
    }
}
exports.writeFileContent = writeFileContent;
function mkdirIfNotExist(filepath) {
    const parsed = path.parse(filepath);
    if (!parsed.ext) {
        return (0, mkdirp_1.mkdirp)(filepath);
    }
    else {
        return (0, mkdirp_1.mkdirp)(parsed.dir);
    }
}
exports.mkdirIfNotExist = mkdirIfNotExist;
function findTargetDirPath(pathStr, dirName) {
    const dirNameList = pathStr.split("\\");
    const targetIndex = dirNameList.findIndex((name) => name === dirName);
    if (targetIndex === undefined) {
        return "";
    }
    return dirNameList.slice(0, targetIndex + 1).join("\\");
}
exports.findTargetDirPath = findTargetDirPath;
function getAllFileNameByParentDir(dirpath) {
    const files = (0, fs_1.readdirSync)(dirpath);
    const fileList = [];
    files.forEach((filename) => {
        const filePath = path.join(dirpath, filename);
        const stats = (0, fs_1.statSync)(filePath);
        if (stats.isDirectory()) {
            return;
        }
        else {
            fileList.push(filename.slice(0, filename.lastIndexOf('.')));
        }
    });
    return fileList;
}
exports.getAllFileNameByParentDir = getAllFileNameByParentDir;
//# sourceMappingURL=file.js.map