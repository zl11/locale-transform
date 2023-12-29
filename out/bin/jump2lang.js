"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyDefinitionProvider = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const vscode = require("vscode");
const api_1 = require("./api");
const config_1 = require("./config");
const file_1 = require("./file");
const utils_1 = require("./utils");
class MyDefinitionProvider {
    async provideDefinition(document, position, token) {
        // 实现提供跳转到定义文件所需的位置信息的代码
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
        // getLocalLang(langPath);
        // let langWordPath = `${langPath}/${localLang.value}.${projectLang.value}`;
        // if (!existsSync(langWordPath)) {
        //     return;
        // }
        let range = document.getWordRangeAtPosition(position);
        let clickedString = document.getText(range);
        const localeDirAbsolutePath = (0, path_1.resolve)(srcPath, config_1.localeDirPath);
        const langDirPath = (0, path_1.resolve)(localeDirAbsolutePath, config_1.localeLangPath);
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
        return Promise.all(localeLangList.filter(name => langMap[name] && langMap[name][clickedString]).map(async (name) => {
            const targetPath = `${langPath}/${name}.${config_1.projectLang.value}`;
            const translateText = langMap[name][clickedString];
            const documentText = await vscode.workspace.openTextDocument(targetPath);
            const offset = documentText.getText().indexOf(clickedString) - 1;
            const startPosition = documentText.positionAt(offset);
            // 直接采用当前行最后一列
            const endPosition = documentText.lineAt(startPosition.line).range.end;
            // const endPosition = documentText.positionAt(endOffset)
            const range = new vscode.Range(startPosition, endPosition);
            (0, api_1.getSpotRecord)({
                id: "locale_transform__jump2lang",
                value: translateText,
                project: srcPath
            });
            return new vscode.Location(vscode.Uri.file(targetPath), range);
        }));
    }
}
exports.MyDefinitionProvider = MyDefinitionProvider;
//# sourceMappingURL=jump2lang.js.map