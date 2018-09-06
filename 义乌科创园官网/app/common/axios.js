import axios from 'axios';
import { message } from 'antd';
import Promise from 'promise/lib/es6-extensions.js';
let axiosIns = axios.create({});
// 添加请求拦截器
axiosIns.interceptors.request.use(
  function(config) {
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
    let status = response.status,
      header = response.headers;
    if (status === 404) {
      window.location.href = '#/404';
    }
    // 对响应数据做点什么
    return response;
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
export default axiosIns;
