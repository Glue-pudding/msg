import {aboutType} from '../constants/ActionTypes';
const iActions = {
    setBGTitle:(title)=>{
        return {type:aboutType.CHANGE_INFOR_TOPTITLE,title:title}
    },
    setBGImg:(id)=>{
        return {type:aboutType.CHANGE_INFOR_TOPIMG,id:id}
    },
    changePic:(id,name)=>{
        return {type:aboutType.CHANGE_ICON_PIC,iconID:id,iconName:name}
    },
    changePicService:(id,name)=>{
        return {type:aboutType.CHANGE_ICON_PIC_SERVICE,iconID:id,iconName:name}
    },
    changePicTeam:(id,name)=>{
        return {type:aboutType.CHANGE_ICON_PIC_TEAM,iconID:id,iconName:name}
    },
    changeAboutInfor:(part,tag,data)=>{
        let iObj ={part,tag,data};
        return {type:aboutType.CHANGE_ABOUT_INFOR,infor:iObj}
    },
    changeAboutService:(part,tag,data)=>{
        let iObj ={part,tag,data};
        return {type:aboutType.CHANGE_ABOUT_SERVICE,infor:iObj}
    },
    changeAboutTeam:(part,tag,data)=>{
        let iObj ={part,tag,data};
        return {type:aboutType.CHANGE_ABOUT_TEAM,infor:iObj}
    },
    changeTeamTitle:(data)=>{
        return {type:aboutType.CHANGE_TEAM_TITLE,title:data}
    },
    changeTeamContent:(data)=>{
        return {type:aboutType.CHANGE_TEAM_CONTENT,title:data}
    },
    changeServiceTitle:(data)=>{
        return {type:aboutType.CHANGE_SERVICE_TITLE,title:data}
    },
    changeServiceContent:(data)=>{
        return {type:aboutType.CHANGE_SERVICE_CONTENT,title:data}
    },
    
}
export default iActions;