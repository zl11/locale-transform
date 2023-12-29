"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpotRecord = exports.getTranslateData = void 0;
const axios_1 = require("axios");
const config_1 = require("./config");
function getTranslateData(origData) {
    return axios_1.default.post(config_1.translateApi, origData);
}
exports.getTranslateData = getTranslateData;
function getSpotRecord(params) {
    console.log(params);
    // 发到本地服务
    return axios_1.default.get('http://172.19.80.62:81/standardgwapi/api/company_library/devlop_custom/addRecord', { params }).catch(() => console.log('record spot faild'));
}
exports.getSpotRecord = getSpotRecord;
//# sourceMappingURL=api.js.map