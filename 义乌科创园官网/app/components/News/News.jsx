import React, { Component } from 'react';
import axios from '@axios';
import {Link} from 'react-router';
import { browserHistory ,hashHistory} from 'react-router';
import API from '../../common/api';
import { Table, Avatar, Tabs,Button,message,Row,Col,List,Icon,Pagination } from 'antd';
const TabPane = Tabs.TabPane;
import NewsDetail from '../modules/InfoDetail.jsx';

import styles from './style.less';
import comStyle from '../app.less';
class News extends Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.state = {
      key: '1',page:1,pageSize:7,
      newsList:[],countNum:0,
      curPage:'list'
    };
  }
  changeType(key){
    this.setState({key,page:1});
    this.loadNews(this.state.page,key);
  }
  componentDidMount(){
    this.loadNews();
  }
  componentWillUnmount(){
    this.setState({page:1,newsList:[]});
  }
  loadNews(page,key){
    let t=this,state =t.state,iPage=page||state.page;
    let url = API.NEWS_LIST,params={typeId:key||state.key,page:iPage,size:iPage==1?state.pageSize:6};
    axios({
      method: 'post',
      url:url,
      data:params
    }).then(data => {
      let datas = data.data.data,code = data.data.code;
      if(code===10000){
        t.setState({ newsList: datas.list,countNum:datas.count});
      }else{
        message.warn(data.data.message||'系统出错，请联系管理员');
      }
    }).catch(error => {
      message.error(error);// 异常处理
    });
  }
  pageChange(page){
    this.setState({page});
    this.loadNews(page);
  }
  loadDetail(id){
    hashHistory.push('/news/newsDetail/?type=news&key='+this.state.key+'&id='+id);
  }
  render(){    
    let t=this,actKey = t.state.key,newsList = t.state.newsList,page=t.state.page;
    const IconText = ({text }) => <span>{text}</span>;
    let itemRender = function(current, type, originalElement) {
      if (type === 'prev') {
        return <a><Icon type="left" />上一页</a>;
      } else if (type === 'next') {
        return <a>下一页<Icon type="right" /></a>;
      }
      return originalElement;
    };
    return (<div>
      <div className={comStyle.panelTop}><h2>新闻公告</h2></div>
      <div className={comStyle.normalCont}>
        <div className={styles.newsCont}>
          <Button className={`${styles.btn} ${actKey==='1'?`${styles.active}`:''}`} onClick={t.changeType.bind(this,'1')}>
            <Link to="/news/msgList">信息公示</Link>
          </Button>
          <Button className={`${styles.btn} ${actKey==='2'?`${styles.active}`:''}`}  onClick={t.changeType.bind(this,'2')}>
            <Link to="/news/newsList">新闻资讯</Link>
          </Button>
          <Button className={`${styles.btn} ${actKey==='3'?`${styles.active}`:''}`}  onClick={t.changeType.bind(this,'3')}>
            <Link to="/news/cultureList">园区文化</Link>
          </Button>
          <Button className={`${styles.btn} ${actKey==='4'?`${styles.active}`:''}`} onClick={t.changeType.bind(this,'4')}>
            <Link to="/news/careList">领导关怀</Link>
          </Button>
        </div>
        {newsList&&newsList.length?<List
          itemLayout="vertical"
          size="large" className={styles.newsBox}
          pagination={false}
          dataSource={t.state.newsList}
          footer={<Pagination total={t.state.countNum||1} pageSize={page===1?7:6} current={t.state.page} itemRender={itemRender} onChange={t.pageChange.bind(t)} className={comStyle.pagePanel} />}
          renderItem={(item,index) => {
            let time = new Date(item.modifyTime),author = item.modifier||'',
              year = time.getFullYear(),month = time.getMonth()+1,day = time.getDate();
            let timeStr = year+'-'+(month>9?month:'0'+month)+'-'+(day>9?day:'0'+day),listCont=null;
            if(!index&&t.state.page===1){
              listCont = <Col span={24}><List.Item
                key={item.title} onClick={t.loadDetail.bind(t,item.id)}
                actions={[<IconText text={author}/>, <IconText text={timeStr}/>]}
                extra={item.url?<img  alt="logo" src={item.url} />:null}
              >
                <List.Item.Meta
                  title={<label >{item.title||''}</label>}
                />
                {item.subject||''}
              </List.Item></Col>;
            }else{
              listCont = <Col span={12} style={{marginRight:t.state.page>1?index%2==0?'30px':0:index%2==0?0:'30px'}}>
                <List.Item  
                  key={item.title} className={styles.newsBoxCard} onClick={t.loadDetail.bind(t,item.id)}
                  actions={[<IconText text={author}/>, <IconText text={timeStr}/>]}
                  extra={item.url?<img alt="logo" src={item.url} />:null}
                >
                  <List.Item.Meta
                    title={<label >{item.title||''}</label>}
                  />
                  {item.subject||''}
                </List.Item>
              </Col>;
            }
            return listCont;
          }}
        />:null}
        
      </div>
    </div>);
  }
}
export default News;

