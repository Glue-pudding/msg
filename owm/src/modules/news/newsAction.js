import {newsTypes} from '../constants/ActionTypes';

import {post} from '@/tools/axios';
import API from '@/tools/api';
const iActions = {
    //获取新闻列表
    loadNewsList:()=>dispatch=>{
        post({url:API.NEWS_LIST}).then((res)=>{
            let datas = res&&res.data;
            console.log(datas);
            dispatch({type:newsTypes.NEWS_LIST,list:datas.list||[],
            count:datas.count})
        })
    },
    //删除新闻
    deleteNewsList:(id)=>dispatch=>{
        let t=this;
        post({url:API.DELETE_NEWS_LIST,data:{newsId:id}}).then((res)=>{
            let datas=res&&res.data;
            console.log(res);
            dispatch(t.a.loadNewsList())
        })
    },
    //获取新闻详情
    getNewsDetail:(id)=>dispatch=>{
        post({url:API.NEWS_DETAIL,data:{newsId:id}}).then((res)=>{
            let datas=res&&res.data;
            console.log(datas);
            dispatch({type:newsTypes.NEWS_DETAIL,list:datas})
        })
    },
    //新增/编辑新闻
    addAndEdit:(data)=>dispatch=>{
        post({url:API.ADD_AND_EDIT,data:data}).then((res)=>{
            let datas=res&&res.data;
            console.log(res);
            dispatch(this.a.loadNewsList())
        })
    },
    setBGTitle:(title)=>{
        return {type:newsTypes.CHANGE_INFOR_TOPTITLE,title:title}
    },
    setBGImg:(id)=>{
        return {type:newsTypes.CHANGE_INFOR_TOPIMG,id:id}
    },
    newsListTitle:(data)=>{
        return {type:newsTypes.CHANGE_NEWS_LIST_TITLE,title:data}
    },

}
export default iActions;