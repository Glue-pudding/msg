import {homeTypes} from '../constants/ActionTypes'
const defaultState = {
    sliderList:[],
    saveBannerLoading:false,
    infor:{
        title:'领先的智能电子设备品质一如既往',
        content:'我们生产各种创新产品——包括数据转换器、放大器和线性产品、射频(RF) IC、电源管理产品、基于微机电系统(MEMS)技术的传感器、其他类型传感器以及信号处理产品，包括DSP和其他处理器——全部是为满足广大客户的需求而设计。 公司，集销售、技术、服务于一体，公司坚持“品质服务，合作互赢”的宗旨，高品味低价位、诚信经营、互惠互利的经营理念，围绕“精益求精、精简高效”的经营方针，自成立以来以良好的产品质量和优质的售后服务赢得了社会各企业的支持。 产品包括110KV220KV大型超高压变压器和35KV以下各种干式变压器、油浸式变压器、非晶合金变压器、预装式变电站、光伏/风力变压器、有载调容变压器、地理变压器。',
        picId:14
    },
    advance:{
        title:'我们的优势',
        desc:'关注MD，便能通过无与伦比的物理和数字检测测量连接技术的智能集成，获得优异的产品、先进的参考资料以及大量的专家协助，解读我们周围的世界。',
        list:[
            {name:'优势一',content:'简介内容1',icon:16},
            {name:'优势二',content:'简介内容2',icon:18},
            {name:'优势三',content:'简介内容3',icon:19},
            {name:'优势四',content:'简介内容4',icon:15},
        ]
    },
    product:{
        title:'经典案例展示',
        list:[
            {name:'案例名',picId:9},
            {name:'案例名2',picId:19},
            {name:'案例名3',picId:18},
        ],
        messageInfor:{
            'patent':{name:'拥有专利',number:5000},
            'customer':{name:'服务用户',number:2300},
            'employer':{name:'在职员工',number:200},
            'year':{name:'余载',number:20}
        }
    },
    news:{
        title:'新闻资讯，尽在掌握',
        detail:{},
        list:[],
        tableLoading:false
    }
}
const homeReducer = (state = defaultState, action = {}) => {
    let iObj = null;
    switch (action.type) {
        case homeTypes['HOME_NEWS_LOADING']:
            iObj = Object.assign({},state.news,{tableLoading: action.loading});
    
            return Object.assign({},state,{news:iObj});
        case homeTypes['LOAD_BANNER_LIST']:
            return Object.assign({},state,{sliderList:action.list});
        case homeTypes['ADD_SAVEBANNER_LOAD']:
            return Object.assign({},state,{saveBannerLoading:true});
        case homeTypes['MOVE_SAVEBANNER_LOAD']:
            return Object.assign({},state,{saveBannerLoading:false});
        case homeTypes['LOAD_HOME_NEWS_LIST']:
            iObj = Object.assign({},state.news,{list: action.list});
    
            return Object.assign({},state,{news:iObj});
        case homeTypes['LOAD_HOME_NEWS_DETAIL']:
            iObj = Object.assign({},state.news,{detail: action.detail});

            return Object.assign({},state,{news:iObj});
        case homeTypes['CHANGE_HOME_PRODUCT_INFOR']:
            iObj = Object.assign({},state.product,{[action.name]: action.value});
            return Object.assign({},state,{product:iObj});
        case homeTypes['CHANGE_ADVANCE_INFOR']:
            iObj = Object.assign({},state.advance,{[action.name]: action.value});
            return Object.assign({},state,{advance:iObj});
        case homeTypes['CHANGE_INFOR_MESSAGE']:
            iObj = Object.assign({},state.infor,{[action.name]: action.value});
            return Object.assign({},state,{infor:iObj});
        default:
            return state;
    }
};
export default homeReducer;