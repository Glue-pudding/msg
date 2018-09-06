import {productType} from '../constants/ActionTypes';
import {post} from '@/tools/axios';
import API from '@/tools/api';
const iActions = {
    increaseAction:function(time){
        return {type: "INCREASE",time};
    },
    changeMap:function(state){
        return {type:productType.CHANGE_MAP,infor:state}
    },
    changeInforTitle:(data)=>{
        return {type:productType.CHANGE_INFOR_TITLE,title:data}
    },
    changeProductInfor:(part,tag,data)=>{
        let iObj ={part,tag,data};
        return {type:productType.CHANGE_PRODUCT_INFOR,infor:iObj}
    },
    setBGTitle:(title)=>{
        return {type:productType.CHANGE_INFOR_TOPTITLE,title:title}
    },
    setBGImg:(id)=>{
        return {type:productType.CHANGE_INFOR_TOPIMG,id:id}
    },
    loadProductList:()=>dispatch=>{
        post({url:API.PRODUCT_LIST}).then((res)=>{
            let datas = res&&res.data;
            console.log(datas);
            dispatch({type:productType.PRODUCT_LIST,list:datas.list||[],
            count:datas.count})
        })
    },
    //删除产品
    deleteProductList:(id)=>dispatch=>{
        let t=this;
        post({url:API.DELETE_PRODUCT_LIST,data:{productId:id}}).then((res)=>{
            let datas=res&&res.data;
            console.log(res);
            dispatch(t.a.loadProductList())
        })
    },
    //新增/编辑新闻
    addAndEdit:(data)=>dispatch=>{
        post({url:API.PRODUCT_ADD_AND_EDIT,data:data}).then((res)=>{
            let datas=res&&res.data;
            console.log(res);
            dispatch(this.a.loadProductList())
        })
    },
    newList:(list)=>dispatch=>{
        dispatch({
            type:productType.NEW_LIST_PRODUCT,
            list:list
        })
    },
    productSort:(list)=>dispatch=>{
        post({url:API.PRODUCT_SORT,data:list}).then((res)=>{
            dispatch(this.a.loadProductList())
        })
    },
    changePic:(id,name)=>{
        return {type:productType.CHANGE_ICON_PIC,iconID:id,iconName:name}
    },
    changeProductListTitle:(data)=>{
        return {type:productType.CHANGE_PRODUCT_LIST_TITLE,title:data}
    },


}
export default iActions;