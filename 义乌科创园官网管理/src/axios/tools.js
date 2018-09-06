/**
 * Created by author on 2017/7/30.
 * http通用工具函数
 */
import axios from 'axios';
import { message,Modal } from 'antd';

/**
 * 公用get请求
 * @param url       接口地址
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
export const get = ({url, msg = '接口异常', headers}) =>
    axios.get(url, headers).then(res => res.data).catch(err => {
       console.log(err);
       message.warn(msg);
    });

/**
 * 公用post请求
 * @param url       接口地址
 * @param data      接口参数
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
export const post = ({url, data, msg = '接口异常', headers}) =>
    axios.post(url, data, headers).then((res) => {
        let datas = res.data;
        if(datas.code===30001){
            message.warn("登录信息失效，即将跳转到登录页面.");
            setTimeout(function(){
                window.location.href = 'http://183.131.202.121:23500/logout';
            },3000)
        }
        return res.data;
    }).catch(err => {
        let desc = err.response.data,title = err.response.statusText;
        message.error(title);
    });
