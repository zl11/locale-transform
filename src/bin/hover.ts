import * as vscode from "vscode";
import { existsSync } from "fs";
import { join, normalize, resolve } from "path";
import { findTargetDirPath, getAllFileNameByParentDir } from "./file";
import { getLangMapByPath, getProjectLang } from "./utils";
import {
  localeDirPath,
  localeLangPath,
  projectLang,
} from "./config";
import { getSpotRecord } from "./api";

export function hoverProvider(
  document: vscode.TextDocument,
  position: vscode.Position,
  token: vscode.CancellationToken
) {
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

  const localeLangList = getAllFileNameByParentDir(langPath);
  
  const word = document.getText(document.getWordRangeAtPosition(position));

  let localeOrigText = ``;
  try {
    localeLangList.forEach((text) => {
      let langWordPath = `${langPath}/${text}.${projectLang.value}`;

      const langWordIsExist = existsSync(langWordPath);
      if (!langWordIsExist) {
        return;
      }

      const langMap = getLangMapByPath(langWordPath);

      if (langMap && langMap[word]) {
        localeOrigText += `${text}: ${langMap[word]} `;
      }
    });
  } catch (err) {
    console.log(err);
  }

  if (localeOrigText) {
    // 增加埋点
    getSpotRecord({
      id: "locale_transform__hover",
      value: localeOrigText,
      project: srcPath
    })

    const md = new vscode.MarkdownString();
    md.appendMarkdown("- 翻译内容\n");
    md.appendText(localeOrigText);
    return new vscode.Hover(md);
  }
}
