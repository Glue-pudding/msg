import { productType } from "../constants/ActionTypes";
const defaultState = {
  top:{
    picId:12,
    title:'服务案例'
  },
  infor: {
    title: "经典案例",
    productItem1:{
        title:'案例一',
        constants:'You can relay on our amazing features list and also our custome',
        productPicId:15
        
    },
    productItem2:{
        title:'案例二',
        constants:'You can relay on our amazing features list and also our custome',
        productPicId:8
    }
  },
  productTitle:'产品一览',
  productList:[],
  count:'',
};
const productReducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case productType["CHANGE_INFOR_TOPTITLE"]:
      var iObj = Object.assign({},state.top,{title: action.title});

      return Object.assign({},state,{top:iObj});
    case productType["CHANGE_INFOR_TOPIMG"]:
      var iObj = Object.assign({},state.top,{picId: action.id});

      return Object.assign({},state,{top:iObj});
    case productType["CHANGE_INFOR_TITLE"]:
      var iObj = Object.assign({},state.infor,{title: action.title})

      return Object.assign({},state,{infor:iObj});
    case productType["CHANGE_PRODUCT_LIST_TITLE"]:
      var iObj = Object.assign({},state,{productTitle: action.title});
      console.log(iObj);
      return Object.assign({},state,iObj);
    case productType["PRODUCT_LIST"]:
      let iArrD = action.list;

      return Object.assign({},state,{productList:iArrD,count:action.count});
    case productType["CHANGE_PRODUCT_INFOR"]:
      let  curInfor = action.infor;
      
      var iObj = {...state,infor:{
        ...state.infor,[curInfor.part]:{
            ...state.infor[curInfor.part],
            [curInfor.tag]:curInfor.data
        }
      }};
      return Object.assign({},state,iObj);
    case productType["NEW_LIST_PRODUCT"]:
      let iobj=action.list;
      return Object.assign({},state,{productList:iobj});
    case productType["CHANGE_ICON_PIC"]:
      let  icon = action.iconID,name=action.iconName;
        
      var iObj = {...state,infor:{
        ...state.infor,[name]:{
            ...state.infor[name],
            'productPicId':icon
        }
      }};
      return Object.assign({},state,iObj);
    default:
      return state;
  }
};
export default productReducer;
