"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loopExtList = exports.unLoopDirPath = exports.chineseEndReg = exports.chineseReg = exports.translateApi = exports.localLang = exports.needTranslateLangList = exports.projectLang = exports.localeLangPath = exports.localeDirPath = void 0;
const vscode = require("vscode");
exports.localeDirPath = "locale";
exports.localeLangPath = "lang";
const config = vscode.workspace.getConfiguration("localeTransform");
exports.projectLang = {
    value: "js",
};
exports.needTranslateLangList = config.get("transform.langList");
exports.localLang = {
    value: config.get("transform.localLang")
};
exports.translateApi = config.get("transform.translateApi");
exports.chineseReg = /[\u4e00-\u9fa5]+/g;
exports.chineseEndReg = /[\u4e00-\u9fa5]+$/g;
exports.unLoopDirPath = config.get("transform.ignorePaths");
exports.loopExtList = config.get("transform.extensions");
//# sourceMappingURL=config.js.map