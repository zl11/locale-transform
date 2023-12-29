"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provideCompletionItems = void 0;
const vscode = require("vscode");
const path_1 = require("path");
const utils_1 = require("./utils");
const file_1 = require("./file");
const config_1 = require("./config");
const fs_1 = require("fs");
const api_1 = require("./api");
const provideCompletionItems = function (document, position, token, context) {
    // 判断是否有中文
    let linePrefix = document.lineAt(position).text.substr(0, position.character);
    const matchList = linePrefix.match(config_1.chineseEndReg);
    if (!matchList) {
        return undefined;
    }
    const pathStr = (0, path_1.normalize)(document.uri.path.slice(1));
    (0, utils_1.getProjectLang)(pathStr);
    const srcPath = (0, file_1.findTargetDirPath)(pathStr, "src");
    if (!srcPath) {
        // 未找到src目录
        return;
    }
    const localeDirAbsolutePath = (0, path_1.resolve)(srcPath, config_1.localeDirPath);
    const langDirPath = (0, path_1.resolve)(localeDirAbsolutePath, config_1.localeLangPath);
    (0, utils_1.getLocalLang)(langDirPath);
    const localeLangList = (0, file_1.getAllFileNameByParentDir)(langDirPath);
    const langMap = localeLangList.reduce((map, langName) => {
        const langFilePath = `${langDirPath}/${langName}.${config_1.projectLang.value}`;
        if (!(0, fs_1.existsSync)(langFilePath)) {
            return map;
        }
        const langMap = (0, utils_1.getLangMapByPath)(langFilePath);
        map[langName] = langMap;
        return map;
    }, {});
    const localLangMap = langMap[config_1.localLang.value];
    // 没有 本地默认 翻译文件
    if (!localLangMap) {
        return undefined;
    }
    const localWordKeyMap = Object.entries(localLangMap).reduce((map, [key, word]) => {
        map[word] = key;
        return map;
    }, {});
    const localLangSet = new Set(Object.values(localLangMap));
    const filterList = [...localLangSet].filter((item) => {
        return item.indexOf(matchList[0]) > -1;
    });
    let completionItems = [];
    filterList.forEach((label) => {
        const onlyId = localWordKeyMap[label];
        const completionItem = new vscode.CompletionItem(label);
        completionItem.kind = vscode.CompletionItemKind.Keyword;
        const md = new vscode.MarkdownString();
        md.appendMarkdown("- 翻译内容\n");
        let localeOrigText = "";
        localeLangList.forEach((langName) => {
            if (langMap[langName] && langMap[langName][onlyId]) {
                localeOrigText += `${langName}: ${langMap[langName][onlyId]} `;
            }
        });
        (0, api_1.getSpotRecord)({
            id: "locale_transform__completion",
            value: localeOrigText,
            project: srcPath
        });
        md.appendText(localeOrigText);
        completionItem.documentation = md;
        completionItem.insertText = `$t('${onlyId}')`;
        completionItems.push(completionItem);
    });
    return new vscode.CompletionList(completionItems, true);
};
exports.provideCompletionItems = provideCompletionItems;
//# sourceMappingURL=provideCompletionItems.js.map