import { readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import { mkdirp } from "mkdirp";
import path = require("path");
import * as vscode from "vscode";
import { loopExtList, unLoopDirPath } from "./config";

export function traverseDir(dirpath: string, dealFilePathFunc: Function) {
  const files = readdirSync(dirpath);

  files.forEach((filename: any) => {
    const filePath = path.join(dirpath, filename);
    if (unLoopDirPath.includes(filename)) {
      return;
    }
    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      traverseDir(filePath, dealFilePathFunc);
    } else {
      const parsed = path.parse(filePath);

      if (loopExtList.includes(parsed.ext)) {
        dealFilePathFunc(filePath, filename);
      }
    }
  });
}

export function readFileContent(filepath: string) {
  try {
    return readFileSync(filepath, "utf-8");
  } catch (err) {
    vscode.window.showErrorMessage(`${err}`);
    return "";
  }
}

export function writeFileContent(filepath: string, content: string) {
  try {
    writeFileSync(filepath, content);
  } catch (err) {
    vscode.window.showInformationMessage(`${filepath} 转换失败`);
    vscode.window.showErrorMessage(`${err}`);
    return "";
  }
}

export function mkdirIfNotExist(filepath: string) {
  const parsed = path.parse(filepath);
  if (!parsed.ext) {
    return mkdirp(filepath);
  } else {
    return mkdirp(parsed.dir);
  }
}

export function findTargetDirPath(pathStr: string, dirName: string) {
  const dirNameList = pathStr.split("\\");

  const targetIndex = dirNameList.findIndex((name) => name === dirName);
  if (targetIndex === undefined) {
    return "";
  }
  return dirNameList.slice(0, targetIndex + 1).join("\\");
}

export function getAllFileNameByParentDir (dirpath: string) {
  const files = readdirSync(dirpath);
  const fileList: string[] = [];
  files.forEach((filename: any) => {
    const filePath = path.join(dirpath, filename);
    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      return;
    } else {
      fileList.push(filename.slice(0, filename.lastIndexOf('.')));
    }
  });
  return fileList;
}
