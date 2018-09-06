import React from 'react';
import { Row, Col, Avatar, Button, Icon,message } from 'antd';
import PropTypes from 'prop-types';
import styles from './style.less';
import axios from '@axios';
import { browserHistory ,hashHistory} from 'react-router';
import API from '../../common/api';
import comStyle from '../app.less';
import { Z_STREAM_ERROR } from 'zlib';
const formatDate = (iTime) => {
  if (!iTime) return;
  let time = new Date(iTime),
    year = time.getFullYear(),month = time.getMonth()+1,day = time.getDate();
  month = month >9?month:'0'+month;
  day  = day>9?day:'0'+day;
  return year +'-'+month+'-'+day;
};
const matchMsg = {
  'company':'相关企业',
  'policy':'相关基础服务',
  'talents':'相关人才',
  '扶持政策':1,
  '特色服务':2,
  '基础服务':3
};
const matchApi ={
  'news':{
    INFO:API.NEWS_GET,
    LIST:API.NEWS_LIST
  },
  'company':{
    INFO:API.COMPANY_GET,
    LIST:API.COMPANY_LIST
  },
  'policy':{
    INFO:API.POLICY_GET,
    LIST:API.POLICY_LIST
  },
  'talents':{
    INFO:API.TALENTS_GET,
    LIST:API.TALENTS_LIST
  }
};
const createMarkup = function(cont) { return {__html: cont}; };
export default class InforDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      infor: {},
      list: [],
      page:1,key:'1',type:'',id:null,name:''
    };
  }
  componentDidMount(){
    this.loadPage();
  }
  loadPage(){
    /**
     * iType :信息类别
     * iKey : 信息类型
     * id :信息id
     */
    let iStr = location.hash.match(/([^\\?]+)$/)[0],iType ='',iKey = '',id = '',name='';
    iStr.replace(/(?=(type=)).*?(?=&)/,function(i,k,m){
      iType = i.substring(k.length);
    });
    iStr.replace(/(?=(key=)).*?(?=&)/,function(i,k,m){
      iKey = decodeURI(i.substring(k.length));
    });
    iStr.replace(/(?=(name=)).*?(?=&)/,function(i,k,m){
      name = decodeURI(i.substring(k.length));
    });
    iStr.replace(/(?=(id=)).*$/,function(i,k,m){
      id = i.substring(k.length);
    });
    let inforUrl = matchApi[iType].INFO,listUrl = matchApi[iType].LIST,
      inforParams={},listParams={};
    id = id?parseInt(id):null;
    switch(iType){
    case 'news':
      inforParams = {newsId:id};
      listParams = {typeId:iKey,page:1,size:5};
      break;
    case 'company':
      inforParams = {companyId:id};
      listParams = {source:1,page:1,size:5,typeId:iKey};
      break;
    case 'policy':
      inforParams = {policyId:id};
      listParams = {typeId:matchMsg[iKey],page:1,size:5};
      break;
    case 'talents':
      inforParams = {talentsId:id};
      listParams = {page:1,size:5,talentsTyleId:iKey};
      break;
    }
    if(id&&iType){
      this.loadInfor(inforUrl,inforParams);
      this.loadList(listUrl,listParams);
      this.setState({key:iKey,type:iType,id,name});
    }else{
      message.warning('地址信息出错');
    }
  }
  componentWillReceiveProps(props){
    if(props.location.search!==this.props.location.search){
      this.loadPage();
    }
  }
  loadInfor(url,params){
    let t=this;
    if(url&&params){
      axios({
        method: 'post',
        url:url,
        data:params
      }).then(data => {
        let datas = data.data.data,code = data.data.code;
        if(code===10000){
          t.setState({ infor: datas});
        }else{
          message.warn(datas.message||'系统出错，请联系管理员');
        }
      }).catch(error => {
        message.error(error);// 异常处理
      });
    }
    
  }
  loadList(url,params){
    let t=this,state =t.state;
    axios({
      method: 'post',
      url:url,
      data:params
    }).then(data => {
      let datas = data.data.data,code = data.data.code;
      if(code===10000){
        t.setState({ list: datas.list,countNum:datas.count});
      }else{
        message.warn(datas.message||'系统出错，请联系管理员');
      }
    }).catch(error => {
      message.error(error);// 异常处理
    });
  }
  loadNews(id){
    // hashHistory.push('http://127.0.0.1:8081/#/news/newsDetail/?type=news&key='+this.state.key+'&id='+id);
    const {name} = this.state;
    let locStr = location.href.match(/(?!=(#)).*?(?=(\?))/)[0];
    location.href = name?(locStr+'?type='+this.state.type+'&key='+this.state.key+'&name='+name+'&id='+id):(locStr+'?type='+this.state.type+'&key='+this.state.key+'&id='+id);
  }
  render() {
    const { infor, list,type,id,key,name } = this.state;
    let typeN= infor.typeName || '';
    let title = infor.title || infor.companyName||'',t=this,
      time = infor.modifyTime&&new Date(infor.modifyTime),
      author = infor.modifier || '',url=infor.url||'',
      tag = infor.subject || '',
      cont = infor.content || '';
    let newsTitle = '';
    if(type==='news'){
      switch(key){
      case '1':
        newsTitle='信息公示'; break;
      case '2':
        newsTitle='新闻资讯'; break;
      case '3':
        newsTitle='园区文化'; break;
      case '4':
        newsTitle='领导关怀'; break;
      }
    }
    let timeStr = formatDate(time),
      titleMsg = type==='news'?'最新'+newsTitle:matchMsg[type],
      titleStr = type,titleCont=null;
      
    if(type==='news'){
      titleMsg='最新'+newsTitle;
    }else{
      titleMsg=matchMsg[type];
    }
    if(type==='news'){
      titleStr='新闻公告';
    }else if(type==='company'){
      titleStr='入驻企业';
    }else if(type=='talents'){
      titleStr='人才展示';
    }else{
      titleStr='园区服务';
    }
    switch(type){
    case 'news':
      titleCont= <div>
        <h2>{title}</h2>
        <label>{author} • {timeStr} • {newsTitle}<br/> {tag}</label>
      </div>;
      break;
    case 'company':
      titleCont= <Row gutter={24}>
        <Col span={2} style={{width:'80px',height:'80px'}}><img src={url} width='100%' height='100%' alt='企业logo' /></Col>
        <Col span={20}><h2>{title}</h2><label>{key&&key!=='null'?(typeN||key):'企业类别'}</label></Col>
      </Row>;
      break;
    case 'policy':
      titleCont= <div>
        <h2>{title}</h2>
        <label>{key&&key!=='null'?key:'服务类别'}</label>
      </div>;
      break;
    case 'talents':
      titleCont= <Row gutter={24}>
        <Col span={2} style={{width:'80px',height:'80px'}}><img src={url} width='100%' height='100%' alt='个人相片' /></Col>
        <Col span={20}><h2>{key&&key!=='null'?(name||key):'个人姓名'}</h2><label>{title}</label></Col>
      </Row>;
      break;
    }
    return (
      <div>
        <div className={comStyle.panelTop}>
          <h2>{titleStr}</h2>
        </div>
        <div className={comStyle.normalCont}>
          <Row gutter={16}>
            <Col span={18}>
              <div className={styles.inforTitle}>
                {titleCont}
                <hr align='left' />
              </div>
              <article className={styles.newsCont} dangerouslySetInnerHTML={createMarkup(cont)} />
              {type==='policy'&&infor.filePath?<div className={styles.fileBox}>
                <h3>附件下载</h3>
                <ul>
                  {
                    infor.filePath.map((item,index)=>{
                      return <li><i className="iconfont icon-Form-Download"></i><a href={item.url} target="new">{item.name||'模板文件'}</a></li>;
                    })
                  }
                </ul>
              </div>:null}
            </Col>
            <Col span={5} offset={1} className={styles.inforList}>
              <h3>{titleMsg}</h3>
              <ul>
                {list.map((item, index) => {
                  if(index<15){
                    return (
                      <li key={item.id}>
                        <a href='javascript:void(0);' onClick={t.loadNews.bind(this,item.id)} title={item.title || item.name||''} className={styles.contTitle}>{item.title || item.name||''}</a>
                        <p className={styles.contTime}>{item.modifyTime&&type==='news'?formatDate(item.modifyTime):null}</p>
                      </li>
                    );
                  }
                })}
              </ul>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
