import {commonTypes} from '../constants/ActionTypes';
import {post,get} from '@/tools/axios';
import {message} from "antd";
import API from '@/tools/api';
const iActions = {
    getData:()=>dispatch=>{
        get({url:API.GET_SITE_DATA}).then((res)=>{
            let datas = res&&res.data;
            // dispatch({type:})
            dispatch({
                type:'COMMON_GET_CONNECT_SITDATA',
                infor:datas['connect']
            })
        })
    },
    saveData:()=>(dispatch,getState)=>{
        const {commonState,connectState,productState,aboutState,newsState}=getState();
        let iObj = {
            common:commonState,
            connect:connectState,
            product:productState,
            about:aboutState,
            news:newsState
        }
        post({url:API.SAVE_SITE_DATA,data:{content:iObj}}).then((res)=>{
            let msg = res.message;
            message.success(msg||"保存成功！");
            dispatch(iActions.getData());
        })
    },
    changeMenu:(key)=>{
        return {
            type:commonTypes.CHANGE_MENU_KEY,
            key:key
        }
    },
    submitManage:(iObj)=>{      //模块显隐
        return {type:commonTypes.TOGGLE_INFOR_MODAL,modal:iObj}
    },
    loadMenuList:()=>(dispatch,getState)=>{
        post({url:API.LOAD_MENU_LIST}).then((res)=>{
            let datas = res&&res.data;
            dispatch({type:commonTypes.LOAD_MENU_LIST,list:datas.list||[]})
        })
    },
    loadImgList:()=>dispatch=>{
        post({url:API.LOAD_IMG_LIST}).then((res)=>{
            let datas = res&&res.data;
            dispatch({type:commonTypes.LOAD_IMG_LIST,list:datas.list||[]})
        })
    },
    addNewImg:()=>dispatch=>{
        
    },
    delImg:(id)=>dispatch=>{
        post({url:API.DELETE_IMG,data:{imageId:id}}).then((res)=>{
            message.success("操作成功！");
            dispatch(iActions.loadImgList());
        })
    },
    submitMenu:(menu)=>{
        return {
            type:commonTypes.SUBMIT_SORT_MENU,
            menus:menu
        }
    },
    changeLogo:(type,imgId,text)=>{
        let iObj = {
            type:type, 
            imgID:imgId,
            word:text
        };
        return {
            type:commonTypes.CHANGE_LOGO_INFO,
            infor:iObj
        }
    }
}
export default iActions;