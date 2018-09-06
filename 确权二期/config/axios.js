import axios from 'axios';
import { message } from 'antd';
import Promise from 'promise/lib/es6-extensions.js';
let axiosIns = axios.create({});
let sessionId = null;
// 添加请求拦截器
axiosIns.interceptors.request.use(
  function(config) {
    if(!config.url.match('login')){
      sessionId = sessionStorage.getItem('localSession')||null;
    }
    // 在发送请求之前做些什么
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axiosIns.interceptors.response.use(
  function(response) {
    let status = response.status,code = response.data?response.data.code||'':'',
      header = response.headers;
    if (status === 404) {
      window.location.href = '#/404';
    }
    if(code&&code===30000){
      window.location.href = '#/login';
    }
    // 对响应数据做点什么
    return response;
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
/**
 * 公用get请求
 * @param url       接口地址
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
export const get = ({url,params, msg = '接口异常', headers}) =>{
  sessionId = sessionStorage.getItem('localSession')||null;
  if(!url.match('login')&&sessionId){
    params = {...params};
    params['SessionId'] = sessionId;
  }
  return axiosIns.get(url,{params}, headers).then(res => res.data).catch(err => {
    message.warn(msg);
  });
};


/**
 * 公用post请求
 * @param url       接口地址
 * @param data      接口参数
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
export const post = ({url, data, msg = '接口异常', headers}) =>{
  sessionId = sessionStorage.getItem('localSession')||null;
  let params = {};
  if((!url.match('login')&&sessionId)||url.match('logout')){
    params['SessionId'] = sessionId;
  }
  return axiosIns.post(url,data,{params:params},headers).then(res => res.data).catch(err => {
    message.warn(msg);
  });
};

