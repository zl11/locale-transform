import { existsSync } from "fs";
import { normalize, resolve } from "path";
import * as vscode from "vscode";
import { getSpotRecord } from "./api";
import { localeDirPath, localeLangPath, localLang, projectLang } from "./config";
import { findTargetDirPath, getAllFileNameByParentDir } from "./file";
import { getLangMapByPath, getLocalLang, getProjectLang } from "./utils";

export class MyDefinitionProvider implements vscode.DefinitionProvider {
    public async provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.Location[] | undefined> {
        // 实现提供跳转到定义文件所需的位置信息的代码

        const pathStr = normalize(document.uri.path.slice(1));

        const srcPath = findTargetDirPath(pathStr, "src");

        if (!srcPath) {
            return;
        }

        getProjectLang(pathStr);

        const langPath = resolve(srcPath, localeDirPath, localeLangPath);

        const langFileIsExist = existsSync(langPath);

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
        
        const localeDirAbsolutePath = resolve(srcPath, localeDirPath);
        const langDirPath = resolve(localeDirAbsolutePath, localeLangPath);

        const localeLangList = getAllFileNameByParentDir(langDirPath);

        const langMap = localeLangList.reduce(
            (map, langName) => {
                const langFilePath = `${langDirPath}/${langName}.${projectLang.value}`; 

                if(!existsSync(langFilePath)) {
                    return map;
                }

                const langMap = getLangMapByPath(langFilePath);
                map[langName] = langMap
                return map
            }, 
            {} as any
        )
        
        return Promise.all(localeLangList.filter(name => langMap[name] && langMap[name][clickedString]).map(async name => {
            const targetPath = `${langPath}/${name}.${projectLang.value}`
            const translateText = langMap[name][clickedString]
            const documentText = await vscode.workspace.openTextDocument(targetPath)
            const offset = documentText.getText().indexOf(clickedString) - 1
            const startPosition = documentText.positionAt(offset)
            // 直接采用当前行最后一列
            const endPosition = documentText.lineAt(startPosition.line).range.end;
            // const endPosition = documentText.positionAt(endOffset)
            const range = new vscode.Range(startPosition, endPosition);
    
            getSpotRecord({
                id: "locale_transform__jump2lang",
                value: translateText,
                project: srcPath
            })

            return new vscode.Location(vscode.Uri.file(targetPath), range);
        }))
    }
}
