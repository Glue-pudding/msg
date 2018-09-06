import {connectType} from '../constants/ActionTypes';
const iActions = {
    increaseAction:function(time){
        return {type: "INCREASE",time};
    },
    changeMap:function(state){
        return {type:connectType.CHANGE_MAP,infor:state}
    },
    changeInforTitle:(data)=>{
        return {type:connectType.CHANGE_INFOR_TITLE,title:data}
    },
    changeConnectInfor:(part,tag,data)=>{
        let iObj ={part,tag,data};
        return {type:connectType.CHANGE_CONNECT_INFOR,infor:iObj}
    },
    setBGTitle:(title)=>{
        return {type:connectType.CHANGE_INFOR_TOPTITLE,title:title}
    },
    setBGImg:(id)=>{
        return {type:connectType.CHANGE_INFOR_TOPIMG,id:id}
    },
    changePic:(id,name)=>{
        return {type:connectType.CHANGE_ICON_PIC,iconID:id,iconName:name}
    }
}
export default iActions;