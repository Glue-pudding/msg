import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb,Icon,Avatar,Tabs,Row,Col,message,Modal} from 'antd';
import {hashHistory} from 'react-router';
import {Link} from 'react-router';
import styles from './app.less';//导入
import Home from './components/Home/Home';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

// moment.locale('en');
import MenuComp from '@common/MenuComp';
import API from '@api';
import {post} from '@axios';
import avatar from '@static/images/Avatar.png';
const { Header, Content, Footer} = Layout;
const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;
const MenuItemGroup = Menu.ItemGroup;
let authRole = null;
let logOut = function(){
  let url = API.USER_LOGOUT,sessionID=sessionStorage.getItem('localSession')||null;
  // url = url+'?sessionId='+sessionID;
  let params={url:url};
  post(params).then(function (res) {
    if (res && res.code === 10000) {
      message.success('操作成功');
      sessionStorage.removeItem('localSession');
      if(authRole){
        sessionStorage.removeItem('localRole');
      }
      hashHistory.push('/login');
    } else {
      message.warn(res.message || '系统出错，请联系管理员!');
    }
  }).catch = (err) => {
    console.log('==error==', err);
  };
};
let showModal = function(){
  Modal.confirm({
    title: '登出提示',
    content: '确认退出登录？',
    okText:'是的',
    cancelText:'取消',
    onOk:logOut
  });
};
const App = ({ routes, params, children }) => {
  authRole = sessionStorage.getItem('localRole')||null;
  return <LocaleProvider locale={zh_CN}><Layout>
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <div className={`${styles.boxstyle} ${styles.boxPadding} clearfix`}>
        <div className={styles.logo} />
        <Menu
          theme="dark"
          mode="horizontal"
          className={styles.authBox}
        >
          <SubMenu key="sub1" title={<span >
            <img src={avatar} /><span style={{marginLeft:'8px'}}>{authRole||''}</span>
            <i className="iconfont icon-Nav-More" style={{marginLeft:'8px'}}></i>
          </span>}>
            <MenuItemGroup>
              {/* <Link to='/login' onClick={logOut}> */}
              <Menu.Item key="1" onClick={showModal}>退出登录</Menu.Item>
            </MenuItemGroup>
          </SubMenu>
          {/* <Menu.Item key="1">nav 1</Menu.Item> */}
        </Menu>
      </div>
    </Header>
    <Content className={`${styles.boxstyle} ${styles.boxPadding} clearfix`} >
      {/* <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb> */}
      <div className={styles.boxCont}>
        <Row type='flex' gutter={24}>
          <Col span={5}>
            <MenuComp auth={authRole}/>
          </Col>
          <Col span={19}>
            {children||<Home />}
          </Col>
        </Row>
      </div>
    </Content>
  </Layout></LocaleProvider>;
};

export default App;
