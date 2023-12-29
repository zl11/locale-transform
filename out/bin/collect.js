"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const vscode = require("vscode");
const api_1 = require("./api");
const config_1 = require("./config");
const file_1 = require("./file");
const utils_1 = require("./utils");
const uuid_1 = require("./uuid");
class Collect {
    constructor() {
        this.allWord = new Set();
        this.wordMap = new Map();
        this.existMap = new Map();
        this.fileWordMap = new Map();
        this.wordMapTextList = [];
        this.enWordMapTextList = [];
    }
    add(data, path) {
        if (Array.isArray(data)) {
            data.forEach((item) => this.allWord.add(item));
            this.fileWordMap.set(path, data);
            return;
        }
        this.allWord.add(data);
        this.fileWordMap.set(path, [data]);
    }
    reset() {
        this.allWord = new Set();
        this.fileWordMap = new Map();
    }
    values() {
        return this.allWord.values();
    }
    createSetMap(path) {
        if (this.wordMap) {
            this.wordMap.clear();
            this.existMap.clear();
        }
        const srcPath = (0, file_1.findTargetDirPath)(path, "src");
        const langPath = (0, path_1.resolve)(srcPath, config_1.localeDirPath, config_1.localeLangPath);
        (0, utils_1.getLocalLang)(langPath);
        const langFilePath = `${langPath}/${config_1.localLang.value}.${config_1.projectLang.value}`;
        let reverseLangMap;
        if ((0, fs_1.existsSync)(langFilePath)) {
            const langMap = (0, utils_1.getLangMapByPath)(langFilePath);
            reverseLangMap = Object.entries(langMap).reduce((map, [key, value]) => {
                map.set(value, key);
                return map;
            }, new Map());
        }
        this.allWord.forEach((val) => {
            const targetKey = reverseLangMap?.get(val);
            if (targetKey) {
                this.existMap.set(val, targetKey);
            }
            else {
                this.wordMap.set(val, (0, uuid_1.getSingleKey)());
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
        let wordList = [];
        let keyList = [];
        this.wordMap.forEach((val, key) => {
            wordList.push(key);
            keyList.push(val);
        });
        if (wordList.length) {
            try {
                const res = await (0, api_1.getTranslateData)(wordList);
                this.enWordMapTextList = res.data.map((word, i) => `${keyList[i]}: ${word},`);
            }
            catch (err) {
                console.error(err);
                vscode.window.showErrorMessage(`接口翻译失败`);
                this.enWordMapTextList = this.wordMapTextList;
            }
        }
        else {
            this.enWordMapTextList = [];
        }
    }
}
exports.default = new Collect();
//# sourceMappingURL=collect.js.map