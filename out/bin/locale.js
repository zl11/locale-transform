"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = require("path");
const api_1 = require("./api");
const collect_1 = require("./collect");
const config_1 = require("./config");
const file_1 = require("./file");
const utils_1 = require("./utils");
const langFileDefaultContent = `export default $
`;
const localeFileDefaultJsContent = `import Vue from "vue";
import VueI18n from "vue-i18n";
import en from "./lang/en.js";
import cn from "./lang/cn.js";

Vue.use(VueI18n);

// cookie 读取配置

const getCookie = function (n) {
  var a,
    r = new RegExp("(^| )" + n + "=([^;]*)(;|$)");
  try {
    if ((a = document.cookie.match(r))) {
      return decodeURIComponent(a[2]);
    } else {
      return "";
    }
  } catch (e) {
    return "";
  }
};

// url 读取配置
const getUrlParams = function (id) {
  let params = window.location.search.slice(1);
  params = params.spilt("&");
  let urlParams = {};
  params.forEach((item) => {
    item = item.split("=");
    urlParams[item[0]] = item[1];
  });
  if (!id) return urlParams;
  return urlParams[id];
};

// 多语言配置的读取顺序
// url -> cookie -> zh
let lang = getUrlParams("lang");
if (!lang) {
  lang = getCookie("ifindlang");
}
if (!lang) lang = "cn";
window.lang = lang;
document.body.classList.add(lang);

const i18n = new VueI18n({
  locale: lang,
  messages: {
    cn: { ...cn },
    en: { ...en },
  },
});

// 扩展多语言配置格式化
i18n.$e = (key, values) => {
  let result = i18n.t(key);
  if (Array.isArray(values) && values.length) {
    values.forEach((v) => {
      result = result.replace(/%s/, v);
    });
  }
  return result;
};

window.$t = function (key) {
  return i18n.t(key);
};

window.$extend = function (key, values) {
  return i18n.$e(key, values);
};
Vue.prototype.$extend = function (key, values) {
  const i18n = this.$i18n;
  return i18n.$e(key, values);
};
window.$if = function (s1, s2) {
  if (window.lang === "en") {
    return s2;
  } else {
    return s1;
  }
};

export default i18n;
`;
const localeFileDefaultTsContent = `import Vue from "vue";
import VueI18n from "vue-i18n";
import en from "./lang/en";
import cn from "./lang/cn";

Vue.use(VueI18n);

// cookie 读取配置

const getCookie = function (n: string) {
  var a,
    r = new RegExp("(^| )" + n + "=([^;]*)(;|$)");
  try {
    if ((a = document.cookie.match(r))) {
      return decodeURIComponent(a[2]);
    } else {
      return "";
    }
  } catch (e) {
    return "";
  }
};

// url 读取配置
const getUrlParams = function (id: string) {
  let params = window.location.search.slice(1);
  params = params.spilt("&");
  let urlParams = {};
  params.forEach((item: any) => {
    item = item.split("=");
    urlParams[item[0]] = item[1];
  });
  if (!id) return urlParams;
  return urlParams[id];
};

// 多语言配置的读取顺序
// url -> cookie -> zh
let lang = getUrlParams("lang");
if (!lang) {
  lang = getCookie("ifindlang");
}
if (!lang) lang = "cn";
window.lang = lang;
document.body.classList.add(lang);

const i18n = new VueI18n({
  locale: lang,
  messages: {
    cn: { ...cn },
    en: { ...en },
  },
});

// 扩展多语言配置格式化
i18n.$e = (key: string, values: any) => {
  let result = i18n.t(key);
  if (Array.isArray(values) && values.length) {
    values.forEach((v) => {
      result = result.replace(/%s/, v);
    });
  }
  return result;
};

window.$t = function (key: string) {
  return i18n.t(key);
};

window.$extend = function (key: string, values: any) {
  return i18n.$e(key, values);
};
Vue.prototype.$extend = function (key: string, values: any) {
  const i18n = this.$i18n;
  return i18n.$e(key, values);
};
window.$if = function (s1: any, s2: any) {
  if (window.lang === "en") {
    return s2;
  } else {
    return s1;
  }
};

export default i18n;
`;
const localeFileVue3JsContent = `import { createI18n } from 'vue-i18n'
import en from "./lang/en.js";
import cn from "./lang/cn.js";

// cookie 读取配置
const getCookie = function (n) {
    var a,
        r = new RegExp("(^| )" + n + "=([^;]*)(;|$)");
    try {
        if ((a = document.cookie.match(r))) {
            return decodeURIComponent(a[2]);
        } else {
            return "";
        }
    } catch (e) {
        return "";
    }
};

// url 读取配置
const getUrlParams = function (id) {
    let params = window.location.search.slice(1);
    params = params.spilt("&");
    const urlParams = {};
    params.forEach((item) => {
        item = item.split("=");
        urlParams[item[0]] = item[1];
    });
    if (!id) return urlParams;
    return urlParams[id];
};

// 多语言配置的读取顺序
// url -> cookie -> zh
let lang = getUrlParams("lang");
if (!lang) {
    lang = getCookie("ifindlang");
}
if (!lang) lang = "cn";
window.lang = lang;
document.body.classList.add(lang);


const i18n = craeteI18n({
    locale: lang, // 同 vue2的lang，可通过工具把对应取值复制过来，代表的是当前语言环境的字符串常量：'en' 'cn'等
    globalInjection: true, // vue3 template 可使用$t
    legacy: false, // 解决编译问题
    messages: {
        en, // 英文翻译文件
        cn // 中文翻译文件
    }
})

export default i18n;
`;
const localeFileVue3TsContent = `import { createI18n } from 'vue-i18n'
import en from "./lang/en";
import cn from "./lang/cn";

// cookie 读取配置
const getCookie = function (n: string) {
    var a,
        r = new RegExp("(^| )" + n + "=([^;]*)(;|$)");
    try {
        if ((a = document.cookie.match(r))) {
            return decodeURIComponent(a[2]);
        } else {
            return "";
        }
    } catch (e) {
        return "";
    }
};

// url 读取配置
const getUrlParams = function (id: string) {
    let params = window.location.search.slice(1);
    params = params.spilt("&");
    const urlParams: any = {};
    params.forEach((item: any) => {
        item = item.split("=");
        urlParams[item[0]] = item[1];
    });
    if (!id) return urlParams;
    return urlParams[id];
};

// 多语言配置的读取顺序
// url -> cookie -> zh
let lang = getUrlParams("lang");
if (!lang) {
    lang = getCookie("ifindlang");
}
if (!lang) lang = "cn";
window.lang = lang;
document.body.classList.add(lang);


const i18n = craeteI18n({
    locale: lang, // 同 vue2的lang，可通过工具把对应取值复制过来，代表的是当前语言环境的字符串常量：'en' 'cn'等
    globalInjection: true, // vue3 template 可使用$t
    legacy: false, // 解决编译问题
    messages: {
        en, // 英文翻译文件
        cn // 中文翻译文件
    }
})

export default i18n;
`;
class Locale {
    constructor() {
        this.vueVersion = "";
        this.localeDirPath = "";
        this.localeDirIsExist = false;
        this.langDirPath = "";
        this.langDirIsExist = false;
        this.localeWordMap = {
            en: "enWordMapTextList",
        };
    }
    /**
     * 检测 vuei18n 需要的对应的文件
     * @param curPath String
     */
    detection(curPath) {
        this.vueVersion = (0, utils_1.getProjectVueVersion)(curPath);
        const srcPath = (0, file_1.findTargetDirPath)(curPath, "src");
        this.localeDirPath = path.resolve(srcPath, config_1.localeDirPath);
        this.localeDirIsExist = (0, fs_1.existsSync)(this.localeDirPath);
        this.langDirPath = path.resolve(this.localeDirPath, config_1.localeLangPath);
        this.langDirIsExist = (0, fs_1.existsSync)(this.langDirPath);
    }
    /**
     * 没有对应文件，根据 js/ts vue 版本 创建文件
     * @param curPath String
     * @returns
     */
    async createFileIfNotExist(curPath) {
        if (!this.localeDirIsExist) {
            await (0, file_1.mkdirIfNotExist)(this.localeDirPath);
        }
        const localeIndexFilePath = `${this.localeDirPath}/index.${config_1.projectLang.value}`;
        if ((0, fs_1.existsSync)(localeIndexFilePath)) {
            return;
        }
        const vueVersion = (0, utils_1.getProjectVueVersion)(curPath);
        const vueVersionNum = vueVersion.split(".")[0].slice(-1);
        let localeFileContent = "";
        if (vueVersionNum === "2") {
            localeFileContent = localeFileDefaultJsContent;
            if (config_1.projectLang.value === "ts") {
                localeFileContent = localeFileDefaultTsContent;
            }
        }
        else if (vueVersionNum === "3") {
            localeFileContent = localeFileVue3JsContent;
            if (config_1.projectLang.value === "ts") {
                localeFileContent = localeFileVue3TsContent;
            }
        }
        (0, file_1.writeFileContent)(localeIndexFilePath, localeFileContent);
    }
    async translateLangFile() {
        if (!this.langDirIsExist) {
            await (0, file_1.mkdirIfNotExist)(this.langDirPath);
        }
        delete this.localeWordMap[config_1.localLang.value];
        (0, utils_1.getLocalLang)(this.langDirPath);
        this.localeWordMap[config_1.localLang.value] = "wordMapTextList";
        config_1.needTranslateLangList.forEach(async (lang) => {
            const langFilePath = `${this.langDirPath}/${lang}.${config_1.projectLang.value}`;
            const fileIsExist = (0, fs_1.existsSync)(langFilePath);
            const localeWordMap = this.localeWordMap;
            const wordMapKey = localeWordMap[lang];
            if (!wordMapKey) {
                console.warn("暂不支持lang: ", lang);
                return;
            }
            const langFileWordTextList = collect_1.default[wordMapKey];
            if (!langFileWordTextList) {
                console.warn("暂不支持翻译成lang: ", lang);
                return;
            }
            // 没有内容需要替换
            if (!langFileWordTextList.length) {
                return;
            }
            const langWordTextMap = langFileWordTextList.reduce((map, item) => {
                const [key, val] = item.split(": ");
                map[key] = val.slice(0, -1);
                return map;
            }, {});
            let replacedText = "";
            if (fileIsExist) {
                const langMap = (0, utils_1.getLangMapByPath)(langFilePath);
                const newLangMap = { ...langMap, ...langWordTextMap };
                replacedText = JSON.stringify(newLangMap, null, 2);
            }
            else {
                replacedText = JSON.stringify(langWordTextMap, null, 2);
            }
            (0, file_1.writeFileContent)(langFilePath, langFileDefaultContent.replace("$", `${replacedText}`));
        });
    }
    async replace(curPath) {
        await this.createFileIfNotExist(curPath);
        await this.translateLangFile();
    }
    transformFile(path) {
        const res = (0, file_1.readFileContent)(path);
        let transformText = res;
        const wordList = collect_1.default.fileWordMap.get(path);
        if (wordList) {
            wordList.forEach((word) => {
                (0, api_1.getSpotRecord)({
                    id: "locale_transform__translate",
                    value: word,
                    project: path
                });
                let index = 0;
                const commentList = [];
                const filterText = transformText.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, (match) => {
                    commentList.push(match);
                    return `__localeTransform__$${index++}`;
                });
                transformText = filterText.replace(new RegExp(word, 'g'), `$t('${collect_1.default.existMap.get(word) || collect_1.default.wordMap.get(word)}')`);
                commentList.forEach((item, i) => {
                    transformText = transformText.replace(`__localeTransform__$${i}`, item);
                });
            });
            (0, file_1.writeFileContent)(path, transformText);
        }
    }
    transform(curPath) {
        const stats = (0, fs_1.statSync)(curPath);
        if (stats.isDirectory()) {
            (0, file_1.traverseDir)(curPath, this.transformFile);
        }
        else {
            this.transformFile(curPath);
        }
    }
}
exports.default = new Locale();
//# sourceMappingURL=locale.js.map