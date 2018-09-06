import {newsTypes} from '../constants/ActionTypes'
import newsDetail from './newsDetail';
const defaultState = {
    news:[
        {id:1,title:'从CES看中国消费电子产品企业差距',time:'2018-05-09',subject:'2018年美国CES消费电子展刚刚在拉斯维加斯落下帷幕，主办方美国CTA（美国消费技术协会）就已经开始马不停蹄地进…'},
        {id:2,title:'从CES看中国消费电子产品企业差距',time:'2018-05-09',subject:'2018年美国CES消费电子展刚刚在拉斯维加斯落下帷幕，主办方美国CTA（美国消费技术协会）就已经开始马不停蹄地进…'},
        {id:3,title:'从CES看中国消费电子产品企业差距',time:'2018-05-09',subject:'2018年美国CES消费电子展刚刚在拉斯维加斯落下帷幕，主办方美国CTA（美国消费技术协会）就已经开始马不停蹄地进…'},
        {id:4,title:'从CES看中国消费电子产品企业差距',time:'2018-05-09',subject:'2018年美国CES消费电子展刚刚在拉斯维加斯落下帷幕，主办方美国CTA（美国消费技术协会）就已经开始马不停蹄地进…'},
        {id:5,title:'从CES看中国消费电子产品企业差距',time:'2018-05-09',subject:'2018年美国CES消费电子展刚刚在拉斯维加斯落下帷幕，主办方美国CTA（美国消费技术协会）就已经开始马不停蹄地进…'},
    ],
    newsListTitle:'新闻列表',
    count:null,
    NewsDetail:{},
    top:{
        title:'新闻资讯',
        picId:12,
      },
};
const newsReducer = (state = defaultState, action = {}) => {
    const count = state.count;
    switch (action.type) {
        case newsTypes['NEWS_LIST']:
            let iArr = action.list.sort((a,b)=>a.sort-b.sort);
            return Object.assign({}, state, {
                news: iArr,
                count:action.count
            });
        case newsTypes['NEWS_DETAIL']:
            let iArrD = action.list;
            console.log(iArrD);
            return Object.assign({}, state, {
                NewsDetail: iArrD
            });
        case newsTypes["CHANGE_INFOR_TOPTITLE"]:
            var iObj = Object.assign({},state.top,{title: action.title});
      
            return Object.assign({},state,{top:iObj});
        case newsTypes["CHANGE_INFOR_TOPIMG"]:
            var iObj = Object.assign({},state.top,{picId: action.id});
      
            return Object.assign({},state,{top:iObj});
        case newsTypes["CHANGE_NEWS_LIST_TITLE"]:
            var iObj = Object.assign({},state,{newsListTitle: action.title});
            return Object.assign({},state,iObj);
        default:
            return state;
    }
};
export default newsReducer;