import React, { Component } from 'react';
import axios from '@axios';
import { browserHistory ,hashHistory} from 'react-router';
import { Table, Avatar,message,Carousel,Icon,Tabs,Button,Row, Col,Pagination } from 'antd';
import API from '../../common/api';
import styles from './style.less';
import comStyle from '../app.less';
const TabPane = Tabs.TabPane;


class PolicyService extends Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.state = {
      page:1,
      pageSize:6,
      list:[],countNum:0,
      cont:1,
      key:1,

    };
    this.loadNews = this.loadNews.bind(this);
  }
  componentDidMount() {
    this.loadNews(1);
  }
  loadNews(key,page){
    let params = {page:page||this.state.page,size:this.state.pageSize,typeId:key},t=this;
    axios({
      method: 'post',
      url:API.POLICY_LIST,
      data:params,
    }).then(data => {
      let datas = data.data,code = data.data.code;
      if(code===10000){
        t.setState({ list: data.data.data.list,countNum:datas.data.count});
      }else{
        message.warn(datas.message||'系统出错，请联系管理员');
      }
    }).catch(error => {
      message.error(error);// 异常处理
    });
  }

  callback(key, me) {
    this.setState({key:key,page:1});
    me.loadNews(key,1);
  }
  loadDetail(id,typeId,e){
    e.preventDefault();
    let key='';
    if(typeId==1){
      key='扶持政策';
    }else if(typeId==2){
      key='特色服务';
    }else if(typeId==3){
      key='基础服务';
    }
    hashHistory.push('/park/parkDetail/?type=policy&key='+(key)+'&id='+id);
  }
  
  pageChange(page){
    this.setState({page});
    this.loadNews(this.state.key,page);
  }
  render(){
    const {countNum,page} =this.state;
    let itemRender = function(current, type, originalElement) {
      if (type === 'prev') {
        return <a><Icon type="left" />上一页</a>;
      } else if (type === 'next') {
        return <a>下一页<Icon type="right" /></a>;
      }
      return originalElement;
    };
    const pageCont =countNum>6?<Pagination total={countNum||1} pageSize={6}  current={page} itemRender={itemRender} onChange={this.pageChange.bind(this)} className={comStyle.pagePanel} />:null;
    return(
      <div className={styles.ParkIntroContent}>
        <h2>政策服务</h2>
        <Row>
          <Tabs defaultActiveKey="1" onChange={(key) => this.callback(key, this)} size='large' style={{padding:'0px',margin:'0px 0px 80px 0px'}} type="card" className={styles.tabBox}> 
            <TabPane tab="扶持政策" key="1" className={styles.tabItem}>
              <div className={styles.Yborder}>
                {
                  this.state.list.map((item,index)=>{
                    return (
                      <Row key={index} className={styles.Policy}>
                        <Col span={24}>
                          <h3>
                            <a href="javascript:;" onClick={this.loadDetail.bind(this,item.id,item.typeId)}>{index+1}、{item.title}</a></h3>
                          <p>{item.subject}</p>
                          <Button className={styles.addpolicy} onClick={this.loadDetail.bind(this,item.id,item.typeId)}>了解更多</Button>
                        </Col>
                      </Row>
                    );
                  })
                }
                {pageCont}
              </div>
            </TabPane>
         
            <TabPane tab="基础服务" key="3" className={styles.tabItem}>
              <div className={styles.Yborder}>
                {
                  this.state.list.map((item,index)=>{
                    return (
                      <Row key={index} className={styles.Policy}>
                        <Col span={24}>
                          <h3 style={{color:'#328DFF'}}><a href="javascript:;" onClick={this.loadDetail.bind(this,item.id,item.typeId)}>{index+1}、{item.title}</a></h3>
                          <p>{item.subject}</p>
                          <Button className={styles.addpolicy} onClick={this.loadDetail.bind(this,item.id,item.typeId)}>了解更多</Button>
                        </Col>
                      </Row>
                    );
                  })
                }
                
                {pageCont}
              </div>
            </TabPane>
            <TabPane tab="特色服务" key="2" className={styles.tabItem}> 
              <div className={styles.Yborder}>
                {
                  this.state.list.map((item,index)=>{
                    return (
                      <Row key={index} className={styles.Policy}>
                        <Col span={24}>
                          <h3 style={{color:'#328DFF'}}>
                            <a href="javascript:;" onClick={this.loadDetail.bind(this,item.id,item.typeId)}>{index+1}、{item.title}</a></h3>
                          <p>{item.subject}</p>
                          <Button className={styles.addpolicy} onClick={this.loadDetail.bind(this,item.id,item.typeId)}>了解更多</Button>
                        </Col>
                      </Row>
                    );
                  })
                }
                {pageCont}
              </div>
            </TabPane>
          </Tabs>
        </Row>
      </div>
    );
  }
}

export default PolicyService;
