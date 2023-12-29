import { existsSync } from "fs";
import { resolve } from "path";
import * as vscode from "vscode";
import { getTranslateData } from "./api";
import { localeDirPath, localeLangPath, localLang, projectLang } from "./config";
import { findTargetDirPath } from "./file";
import { getLangMapByPath, getLocalLang } from "./utils";
import { getSingleKey } from "./uuid";

class Collect {
  allWord = new Set();
  wordMap = new Map();
  existMap = new Map();
  fileWordMap = new Map();
  wordMapTextList: string[] = [];
  enWordMapTextList: string[] = [];
  add(data: any, path?: string) {
    if (Array.isArray(data)) {
      data.forEach((item) => this.allWord.add(item));
      this.fileWordMap.set(path, data);
      return;
    }

    this.allWord.add(data);
    this.fileWordMap.set(path, [data]);
  }
  reset() {
    this.allWord = new Set()
    this.fileWordMap = new Map()
  }
  values() {
    return this.allWord.values();
  }
  createSetMap(path: string) {
    if (this.wordMap) {
      this.wordMap.clear()
      this.existMap.clear()
    }

    const srcPath = findTargetDirPath(path, "src");
    const langPath = resolve(srcPath, localeDirPath, localeLangPath);
    getLocalLang(langPath);

    const langFilePath = `${langPath}/${localLang.value}.${projectLang.value}`;
    let reverseLangMap: Map<string, string>
    if (existsSync(langFilePath)) {
      const langMap = getLangMapByPath(langFilePath);
      reverseLangMap = Object.entries(langMap).reduce(
        (map, [key, value]) => {
          map.set(value, key);
          return map;
        },
        new Map()
      )
    }

    this.allWord.forEach((val) => {
      const targetKey = reverseLangMap?.get(val as string)

      if(targetKey) {
        this.existMap.set(val, targetKey)
      } else {
        this.wordMap.set(val, getSingleKey());
      }
    });
  }
  transform() {
    this.wordMapTextList = [];
    this.wordMap.forEach((val, key) => {
      this.wordMapTextList.push(`${val}: ${key},`);
    });
  }
  async getEnWord() {
    let wordList: string[] = [];
    let keyList: string[] = [];
    this.wordMap.forEach((val, key) => {
      wordList.push(key);
      keyList.push(val);
    });
    if(wordList.length) {
      try {
        const res = await getTranslateData(wordList);
        this.enWordMapTextList = res.data.map(
          (word: string, i: number) => `${keyList[i]}: ${word},`
        );
      } catch (err) {
        console.error(err);
        vscode.window.showErrorMessage(`接口翻译失败`);
        this.enWordMapTextList = this.wordMapTextList;
      }
    } else {
      this.enWordMapTextList = [];
    }
  }
}

export default new Collect();
