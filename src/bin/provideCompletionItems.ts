import * as vscode from "vscode";
import { normalize, resolve } from "path";
import { getLangMapByPath, getProjectLang, getLocalLang } from "./utils";
import { findTargetDirPath, getAllFileNameByParentDir } from "./file";
import {
  chineseEndReg,
  localeDirPath,
  localeLangPath,
  localLang,
  projectLang,
} from "./config";
import { existsSync } from "fs";
import { getSpotRecord } from "./api";

export const provideCompletionItems = function (
  document: vscode.TextDocument,
  position: vscode.Position,
  token: vscode.CancellationToken,
  context: vscode.CompletionContext
) {
  // 判断是否有中文
  let linePrefix = document.lineAt(position).text.substr(0, position.character);
  const matchList = linePrefix.match(chineseEndReg);
  if (!matchList) {
    return undefined;
  }

  const pathStr = normalize(document.uri.path.slice(1));
  getProjectLang(pathStr);

  const srcPath = findTargetDirPath(pathStr, "src");

  if (!srcPath) {
    // 未找到src目录
    return;
  }

  const localeDirAbsolutePath = resolve(srcPath, localeDirPath);
  const langDirPath = resolve(localeDirAbsolutePath, localeLangPath);

  getLocalLang(langDirPath);
  const localeLangList = getAllFileNameByParentDir(langDirPath);
  
  const langMap = localeLangList.reduce((map, langName) => {
    const langFilePath = `${langDirPath}/${langName}.${projectLang.value}`;

    if (!existsSync(langFilePath)) {
      return map;
    }

    const langMap = getLangMapByPath(langFilePath);
    map[langName] = langMap;
    return map;
  }, {} as any);

  const localLangMap = langMap[localLang.value];

  // 没有 本地默认 翻译文件
  if (!localLangMap) {
    return undefined;
  }

  const localWordKeyMap = Object.entries(localLangMap).reduce((map, [key, word]) => {
    map[word as string] = key;
    return map;
  }, {} as any);

  const localLangSet = new Set<string>(Object.values(localLangMap));

  const filterList = [...localLangSet].filter((item: string) => {
    return item.indexOf(matchList[0]) > -1;
  });

  let completionItems: Array<vscode.CompletionItem> = [];

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

    getSpotRecord({
      id: "locale_transform__completion",
      value: localeOrigText,
      project: srcPath
    })

    md.appendText(localeOrigText);
    completionItem.documentation = md;
    completionItem.insertText = `$t('${onlyId}')`;
    completionItems.push(completionItem);
  });

  return new vscode.CompletionList(completionItems, true);
};
