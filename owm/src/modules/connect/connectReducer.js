import { connectType } from "../constants/ActionTypes";
const defaultState = {
  topObj:{
    picId:12,
    title:'联系我们'
  },
  infor: {
    title: "联系方式",
    address: {name: "联系地址",value: "杭州市西湖区文三路 553 号",icon:8},
    tel: { name: "联系电话", value: "400-063-9966", icon:11 },
    mail: { name: "联系邮箱", value: "xiaop@bdp.cn", icon: 15 }
  },
  map: {
    latitude: 30.270616,
    longitude: 120.174534,
    company: "浙江中小型企业大厦",
    address: "杭州市西湖区文三路 553 号"
    // https://www.amap.com/search?query=%E6%B5%99%E6%B1%9F%E6%97%A5%E6%8A%A5%E5%A4%A7%E6%A5%BC&geoobj=120.168752%7C30.267285%7C120.184201%7C30.274781&zoom=17
  }
};
const connectReducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case 'COMMON_GET_CONNECT_SITDATA':
      console.log(action.infor,'==site data connect==');
      return state;
    case connectType["CHANGE_INFOR_TOPTITLE"]:
      var iObj = Object.assign({},state.topObj,{title: action.title});

      return Object.assign({},state,{topObj:iObj});
    case connectType["CHANGE_INFOR_TOPIMG"]:
      var iObj = Object.assign({},state.topObj,{picId: action.id});

      return Object.assign({},state,{topObj:iObj});
    case connectType["CHANGE_INFOR_TITLE"]:
      var iObj = Object.assign({},state.infor,{title: action.title})

      return Object.assign({},state,{infor:iObj});
    case connectType["CHANGE_ICON_PIC"]:
      let  icon = action.iconID,name=action.iconName;
        
      var iObj = {...state,infor:{
        ...state.infor,[name]:{
            ...state.infor[name],
            'icon':icon
        }
      }};
      return Object.assign({},state,iObj);
    case connectType["CHANGE_CONNECT_INFOR"]:
      let  curInfor = action.infor;
      
      var iObj = {...state,infor:{
        ...state.infor,[curInfor.part]:{
            ...state.infor[curInfor.part],
            [curInfor.tag]:curInfor.data
        }
      }};
      return Object.assign({},state,iObj);
    default:
      return state;
  }
};
export default connectReducer;
