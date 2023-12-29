import * as vscode from "vscode";
import { resolve } from "path";
import { localLang, projectLang } from "./config";
import { findTargetDirPath, readFileContent } from "./file";
import { existsSync } from "fs";

/**
 * 获取当前工作区的package
 * @param pathStr 路径
 * @returns
 */
function getProjectPackage(pathStr: string) {
  const srcPath = findTargetDirPath(pathStr, "src");
  const packageFilePath = resolve(srcPath, "../package.json");
  const packageText = readFileContent(packageFilePath);
  return JSON.parse(packageText);
}

/**
 * 获取当前项目的语言
 * @param pathStr 路径
 */
export function getProjectLang(pathStr: string) {
  const packageJson = getProjectPackage(pathStr);
  const isTs = packageJson?.devDependencies?.typescript || packageJson?.dependencies?.typescript;

  projectLang.value = isTs ? "ts" : "js";
}

export function getLocalLang (pathStr:string) {
  const langFilePath = `${pathStr}/${localLang.value}.${projectLang.value}`;
  
  if (!existsSync(langFilePath)) {
    let cnLangText;
    if(localLang.value === 'cn') {
      cnLangText = 'zh'
    } else if( localLang.value === 'zh') {
      cnLangText = 'cn'
    } 

    if(cnLangText) {
      if(existsSync(`${pathStr}/${cnLangText}.${projectLang.value}`)) {
        localLang.value = cnLangText;
      }
    }
  }
}

/**
 * 获取lang 语言文件，并转为对象
 * @param pathStr lang 路径
 * @returns
 */
export function getLangMapByPath(pathStr: string) {
  try {
    const content = readFileContent(pathStr);
    const leftIndex = content.indexOf("{");

    const langFunc = new Function(`return ${content.slice(leftIndex)}`);
    return langFunc();
  } catch (err) {
    vscode.window.showErrorMessage(`${err}`);
    return {};
  }
}

export function getProjectVueVersion(pathStr: string) {
  const packageJson = getProjectPackage(pathStr);
  return packageJson?.dependencies?.vue || packageJson?.devDependencies?.typescript;
}
