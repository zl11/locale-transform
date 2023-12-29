import { statSync } from "fs";
import { normalize } from "path";
import * as vscode from "vscode";
import collect from "./collect";
import { chineseReg } from "./config";
import { findTargetDirPath, readFileContent, traverseDir } from "./file";
import locale from "./locale";
import { getProjectLang, getProjectVueVersion } from "./utils";

const dealFilePathFunc = function (path: string) {
  const res = readFileContent(path);
  // 去除注释
  const replaceContent = res.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");

  const matchList = replaceContent.match(chineseReg);

  if (matchList) {
    collect.add(matchList, path);
  }
};

const translate = async function (path: string) {
  try {
    const stats = statSync(path);
    if (stats.isDirectory()) {
      traverseDir(path, dealFilePathFunc);
    } else {
      dealFilePathFunc(path);
    }

    collect.createSetMap(path);
    collect.transform();
    await collect.getEnWord();
  } catch (err) {
    vscode.window.showErrorMessage(`${err}`);
  }
};

export function localeTransform(context: any) {
  let uri = context;
  if (!context) {
    uri = vscode.window.activeTextEditor?.document.uri;
  }
  keyLocaleTransform(uri);
}

export async function keyLocaleTransform(pathUri: vscode.Uri) {
  const pathStr = normalize(pathUri.path.slice(1));

  const srcPath = findTargetDirPath(pathStr, "src");

  if (!srcPath) {
    vscode.window.showErrorMessage("未找到src目录!!!");
    return;
  }

  const vueVersion = getProjectVueVersion(pathStr);
  if (!vueVersion) {
    vscode.window.showErrorMessage("暂不支持非vue项目");
    return;
  }

  getProjectLang(pathStr);

  vscode.window.showInformationMessage(`开始翻译`);
  try {
    collect.reset();
    await translate(pathStr);
    await locale.detection(pathStr);
    await locale.replace(pathStr);
    locale.transform(pathStr);
  } catch (err) {
    vscode.window.showErrorMessage(`${err}`);
  }
  vscode.window.showInformationMessage(`翻译完成`);
}