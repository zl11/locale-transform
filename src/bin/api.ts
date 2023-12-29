import axios, { AxiosProxyConfig, AxiosRequestConfig } from "axios";
import { translateApi } from "./config";

export function getTranslateData(origData: any) {
  return axios.post(translateApi, origData);
}


export function getSpotRecord(params: any) {
  console.log(params);
  // 发到本地服务
  return axios.get(
    'http://172.19.80.62:81/standardgwapi/api/company_library/devlop_custom/addRecord', 
    { params }
  ).catch(() => console.log('record spot faild'))
}