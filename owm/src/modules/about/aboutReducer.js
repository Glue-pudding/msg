import { aboutType } from "../constants/ActionTypes";
const defaultState = {
  topObj:{
    picId:12,
    title:'关于我们'
  },
  infor: {
    Explain:{
        introduce: "公司简介",
        proContent: "我们生产各种创新产品——包括数据转换器、放大器和线性产品、射频(RF) IC、电源管理产品、基于微机电系统(MEMS)技术的传感器、其他类型传感器以及信号处理产品，包括DSP和其他处理器——全部是为满足广大客户的需求而设计。 公司，集销售、技术、服务于一体，公司坚持“品质服务，合作互赢”的宗旨，高品味低价位、诚信经营、互惠互利的经营理念，围绕“精益求精、精简高效”的经营方针，自成立以来以良好的产品质量和优质的售后服务赢得了社会各企业的支持。 产品包括110KV220KV大型超高压变压器和35KV以下各种干式变压器、油浸式变压器、非晶合金变压器、预装式变电站、光伏/风力变压器、有载调容变压器、地理变压器。",
        proContentImgID:16
    }
  },
  service: {
      serviceTitle: "我们的服务领域",
      serviceContent: "关注MD，便能通过无与伦比的物理和数字检测测量连接技术的智能集成，获得优异的产品、先进的参考资料以及大量的专家协助，解读我们周围的世界",
      fieldOne: {
          fieldPicId:16,
          fieldTitle:"工程电子",
          fieldValut:"叉车、铲土运输机械 压实机械、混凝土机械等"
      },
      fieldTwo: {
        fieldPicId:16,
        fieldTitle:"基础电子",
        fieldValut:"轴承、液压件、密封件 工业链条、齿轮、模具等"
      },
      fieldThree: {
        fieldPicId:16,
        fieldTitle:"专业电子",
        fieldValut:"机床、变压器、电动机 塑料加工机械等"
      }
  },
  professionTeam:{
      teamTitle:"专业服务团队",
      teamContent:"我们有专业的设计师我们不断的从变革、创新 使我们的商品好用，方便，安全因为您的选择让我们更有动力",
      staffOne:{
          staffPicId:16,
          staffName:"铁城",
          staffPosition:"首席技术官"
      },
      staffTwo:{
        staffPicId:16,
        staffName:"郑亦殷",
        staffPosition:"产品专家"
      },
      staffThree:{
        staffPicId:16,
        staffName:"高秋燕",
        staffPosition:"资深维修师"
      },
      staffFore:{
        staffPicId:16,
        staffName:"徐广林",
        staffPosition:"资深维修师"
      },
  }
}
const aboutReducer = (state = defaultState, action = {}) => {
    switch (action.type) {
        case aboutType["CHANGE_INFOR_TOPTITLE"]:
            var iObj = Object.assign({},state.topObj,{title: action.title});
      
            return Object.assign({},state,{topObj:iObj});
        case aboutType["CHANGE_INFOR_TOPIMG"]:
            var iObj = Object.assign({},state.topObj,{picId: action.id});
      
            return Object.assign({},state,{topObj:iObj});
        case aboutType["CHANGE_ICON_PIC"]:
            let  icon = action.iconID,name=action.iconName;
            var iObj = {...state,infor:{
                ...state.infor,[name]:{
                    ...state.infor[name],
                    'proContentImgID':icon
                }
              }};
            return Object.assign({},state,iObj);
        case aboutType["CHANGE_ICON_PIC_SERVICE"]:
            let  fieldPicId = action.iconID,fieldname=action.iconName;
            var iObj = {...state,service:{
                ...state.service,[fieldname]:{
                    ...state.service[fieldname],
                    'fieldPicId':fieldPicId
                }
              }};
            return Object.assign({},state,iObj);
        case aboutType["CHANGE_ICON_PIC_TEAM"]:
            let  staffPicId = action.iconID,staffname=action.iconName;
            var iObj = {...state,professionTeam:{
                ...state.professionTeam,[staffname]:{
                    ...state.professionTeam[staffname],
                    'staffPicId':staffPicId
                }
              }};
            return Object.assign({},state,iObj);
        case aboutType["CHANGE_ABOUT_INFOR"]:
            let  curInfor = action.infor;
            
            var iObj = {...state,infor:{
              ...state.infor,[curInfor.part]:{
                  ...state.infor[curInfor.part],
                  [curInfor.tag]:curInfor.data
              }
            }};
            return Object.assign({},state,iObj);
        case aboutType["CHANGE_ABOUT_SERVICE"]:
            let  curService = action.infor;
            
            var iObj = {...state,service:{
              ...state.service,[curService.part]:{
                  ...state.service[curService.part],
                  [curService.tag]:curService.data
              }
            }};
            return Object.assign({},state,iObj);
        case aboutType["CHANGE_ABOUT_TEAM"]:
            let  curTeam = action.infor;
            
            var iObj = {...state,professionTeam:{
              ...state.professionTeam,[curTeam.part]:{
                  ...state.professionTeam[curTeam.part],
                  [curTeam.tag]:curTeam.data
              }
            }};
            return Object.assign({},state,iObj);
        case aboutType["CHANGE_TEAM_TITLE"]:
            var iObj = Object.assign({},state.professionTeam,{teamTitle: action.title})
      
            return Object.assign({},state,{professionTeam:iObj});
        case aboutType["CHANGE_TEAM_CONTENT"]:
            var iObj = Object.assign({},state.professionTeam,{teamContent: action.title})
      
            return Object.assign({},state,{professionTeam:iObj});
        case aboutType["CHANGE_SERVICE_TITLE"]:
            var iObj = Object.assign({},state.service,{serviceTitle: action.title})
      
            return Object.assign({},state,{service:iObj});
        case aboutType["CHANGE_SERVICE_CONTENT"]:
            var iObj = Object.assign({},state.service,{serviceContent: action.title})
      
            return Object.assign({},state,{service:iObj});
        default:
            return state;
    }
}

export default aboutReducer;