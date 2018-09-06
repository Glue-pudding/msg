import {commonTypes} from '../constants/ActionTypes'
const defaultState = {
    selectedMenuKey:'home',
    logo:{
        type:'text', //img-图片，text-文字
        imgID:null,
        word:'方不方'
    },
    menu:[
        {id:1,name:'首页',isEditView:0,sort:1,isView:1,route:'home'},
        {id:12,name:'关于我们',isEditView:1,sort:12,isView:1,route:'about'},
        {id:13,name:'服务案例',isEditView:1,sort:13,isView:1,route:'product'},
        {id:14,name:'新闻资讯',isEditView:1,sort:14,isView:1,route:'news'},
        {id:15,name:'联系我们',isEditView:1,sort:15,isView:1,route:'connect'},
    ],
    imgList:[],
    //模块名前缀和路由名一致
    homeBox:{
        slider:{name:'轮播图',visible:true},
        infor:{name:'信息简介',visible:true},
        advance:{name:'优势介绍',visible:true},
        product:{name:'案例展示',visible:true},
        counter:{name:'数据信息',visible:true},
        news:{name:'新闻资讯',visible:true}
    },
    aboutBox:{
        banner:{name:'Banner图',visible:true},
        infor:{name:'公司简介',visible:true},
        service:{name:'服务领域',visible:true},
        team:{name:'团队信息',visible:true}
    },
    productBox:{
        banner:{name:'Banner图',visible:true},
        classic:{name:'经典案例',visible:true},
        list:{name:'产品一览',visible:true},
    },
    newsBox:{
        banner:{name:'Banner图',visible:true},
        list:{name:'新闻列表',visible:true}
    },
    connectBox:{
        banner:{name:'Banner图',visible:true},
        infor:{name:'联系方式',visible:true},
        map:{name:'地图',visible:true},
    },
    copyInfor:'owm site'
};
const connectReducer = (state = defaultState, action = {}) => {
    let curKey = state.selectedMenuKey;
    switch (action.type) {
        case commonTypes['LOAD_MENU_LIST']:
            let iArr = action.list.sort((a,b)=>a.sort-b.sort);
            return Object.assign({}, state, {
                menu: iArr
            });
        case commonTypes['CHANGE_LOGO_INFO']:
            return Object.assign({},state,{logo:action.infor})
        case commonTypes['SUBMIT_SORT_MENU']:
            return Object.assign({}, state, {menu: action.menus});
        case commonTypes['LOAD_IMG_LIST']:
            return Object.assign({}, state, {imgList: action.list});
        case commonTypes['CHANGE_MENU_KEY']:
            action.key.replace(/\w+/,(res,index)=>{curKey=res;})
            return Object.assign({}, state, {selectedMenuKey:curKey});
        case commonTypes['TOGGLE_INFOR_MODAL']:
            return Object.assign({}, state, {[curKey+'Box']:action.modal});
        default:
            return state;
    }
};
export default connectReducer;