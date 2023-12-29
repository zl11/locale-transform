import * as vscode from "vscode";
export const localeDirPath = "locale";
export const localeLangPath = "lang";

const config = vscode.workspace.getConfiguration("localeTransform");

export const projectLang = {
  value: "js",
};

export const needTranslateLangList = config.get("transform.langList") as string[];
export const localLang = {
  value: config.get("transform.localLang") as string
};
export const translateApi = config.get("transform.translateApi") as string;

export const chineseReg = /[\u4e00-\u9fa5]+/g;
export const chineseEndReg = /[\u4e00-\u9fa5]+$/g;

export const unLoopDirPath = config.get("transform.ignorePaths") as string[];

export const loopExtList = config.get("transform.extensions") as string[];
