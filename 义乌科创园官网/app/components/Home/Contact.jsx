import React from 'react';
import {Row, Col, Card,Tabs,Avatar,Button,Icon,message} from 'antd';
import API from '../../common/api';
import axios from '@axios';
import styles from './style.less';
const TabPane = Tabs.TabPane;
const { Meta } = Card;
export default class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inforList:[]
    };
  }
  componentDidMount(){
    let url = API.CONTACT_GET,t=this;
    axios({
      method: 'post',
      url:url
    }).then(data => {
      let datas = data.data.data,code = data.data.code;
      if(code===10000){
        t.setState({ inforList: datas});
      }else{
        message.warn(data.data.message||'系统出错，请联系管理员');
      }
    }).catch(error => {
      message.error(error);// 异常处理
    });
  }
  render() {
    let mail='',phone='',address='',bus='';
    let iObj = document.getElementById('phoneText');
    this.state.inforList.map((item,index)=>{
      switch(item.title){
      case '电子邮件':
        mail = item.content;
        break;
      case '招商电话':
        // console.log(document.getElementById('phoneText'),'====iObj====');
        if(iObj) {iObj.innerHTML = item.content||'';}
        phone = item.content;
        break;
      case '园区地址':
        address = item.content;
        break;
      case '公交线路':
        bus = item.content;
        break;
      }
    });
    return (
      <Row gutter={16} type="flex">
        <Col span={ 1 }></Col>
        <Col span={22} className={styles.inforLsit}>
          <h2 className={styles.contactWe1}>联系我们</h2>
          <p><Icon type="mail" />{mail}</p>
          <p><Icon type="mobile" />{phone}</p>
          <p><Icon type="environment" />{address}</p>
          <div><i className="iconfont icon-Contact-Bus"></i>{bus}</div>
        </Col>
        <Col span={1}></Col>
        {/* <Col span={8} offset={4} className={styles.inforCode}>
          <p>微信公众号</p>
          <img className={styles.qrCode} />
        </Col> */}
      </Row>
    );
  }
}