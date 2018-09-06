import {homeTypes} from '../constants/ActionTypes';
import {post,get} from '@/tools/axios';
import {message} from "antd";

import API from '@/tools/api';
const iActions = {
    //获取banner信息
    loadBanner:()=>dispatch=>{
        post({url:API.GET_BANNER_LIST,data:{size:4}}).then((res)=>{
            let datas = res&&res.data;
            dispatch({type:homeTypes.LOAD_BANNER_LIST,list:datas.list||[]})
        })
    },
    //获取新闻列表
    loadNews:()=>dispatch=>{
        dispatch({type:homeTypes.HOME_NEWS_LOADING,loading:true})
        post({url:API.NEWS_LIST}).then((res)=>{
            let datas = res&&res.data;
            dispatch({type:homeTypes.LOAD_HOME_NEWS_LIST,list:datas.list||[]});
            dispatch({type:homeTypes.HOME_NEWS_LOADING,loading:false})
        })
    },
    getNewsDetail:(id)=>dispatch=>{
        post({url:API.NEWS_DETAIL,data:{newsId:id}}).then((res)=>{
            let datas = res&&res.data;
            dispatch({type:homeTypes.LOAD_HOME_NEWS_DETAIL,detail:datas});
        })
    },
    submitNews:(nObj)=>dispatch=>{
        post({url:API.ADD_AND_EDIT,data:{...nObj}}).then((res)=>{
            message.success("操作成功！");
            dispatch(iActions.loadNews());
        })
    },
    delNewsAction:(id)=>dispatch=>{
        post({url:API.DELETE_NEWS_LIST,data:{newsId:id}}).then((res)=>{
            message.success("删除成功！");
            dispatch(iActions.loadNews());
        })
    },
    changeInforAction:(name,value)=>{
        return {
            type:homeTypes.CHANGE_INFOR_MESSAGE,
            name:name,value:value
        }
    },
    changeAdvanceAction:(name,value)=>{
        return {
            type:homeTypes.CHANGE_ADVANCE_INFOR,
            name:name,value:value
        }
    },
    changeProductAction:(name,value)=>{
        return {
            type:homeTypes.CHANGE_HOME_PRODUCT_INFOR,
            name:name,value:value
        }
    },
    saveSlider:(iObj,fn)=>dispatch=>{
        let curObj = {
            url:iObj.url,href:iObj.href
        };
        if(iObj.id){
            curObj['bannerId'] = iObj.id;
        }
        dispatch({type:homeTypes.ADD_SAVEBANNER_LOAD});
        post({url:API.SAVE_BANNER_LIST,data:curObj}).then((res)=>{
            dispatch(iActions.loadBanner());
            dispatch({type:homeTypes.MOVE_SAVEBANNER_LOAD});
            fn&&fn(true);
        }).catch((err)=>{
            fn&&fn(false);
            dispatch({type:homeTypes.MOVE_SAVEBANNER_LOAD});
        })
    },
    sortSaveSlider:(iList,fn)=>dispatch=>{
        let curList =[];
        iList.map((item,index)=>{
            curList.push({id:item.id,sort:index+1})
        })
        post({url:API.SORT_BANNER_LIST,data:{bannerList:curList}}).then((res)=>{
            dispatch(iActions.loadBanner());
            fn&&fn(true);
        }).catch((err)=>{
            fn&&fn(false);
        })
    },
    deleteSlider:(id)=>dispatch=>{
        post({url:API.DEL_BANNER_LIST,data:{bannerId:id}}).then((res)=>{
            message.success("删除成功！");
            dispatch(iActions.loadBanner());
        })
    }
}
export default iActions;