import React, { Component } from 'react';
import {Layout,Breadcrumb,Menu,Carousel,Row,Col,BackTop,Icon,Popover,message,Card} from 'antd';
import {Link} from 'react-router';
const {Header,Content,Footer} = Layout;
import styles from './app.less';//导入
import Home from './Home/Home.jsx';
import img from '../../static/images/Logo_2.png';
import botLogo from '@img/Logo_3.png';
import qrImg from '@img/QR_code.png';
import CarouselBox from './modules/Carousel.jsx';
import API from '../common/api';
import axios from '@axios';
let loadUserInfo = function(){
  let url = API.CONTACT_GET,t=this;
  axios({
    method: 'post',
    url:url
  }).then(data => {
    let datas = data.data.data,code = data.data.code;
    if(code===10000&&datas.length){
      sessionStorage.setItem('contactInfo',JSON.stringify(datas));
    }else{
      message.warn(data.data.message||'系统出错，请联系管理员');
    }
  }).catch(error => {
    message.error(error);// 异常处理
  });
};
const App = ({ routes, params, children }) => {
  let path = routes&&routes.length&&routes[routes.length-1]['path'];
  // console.log(process.env.NODE_ENV);
  path = path==='/'?'home':
    path.match(/news|msg|care|culture/)?'news':
      path.match('company')?'company':
        path.match('person')?'person':
          path.match('park')?'park':path;
  window.scrollTo(0,0);
  let sInfo = sessionStorage.getItem('contactInfo');
  if(sInfo){
    let iObj = JSON.parse(sInfo),phoneObj =  document.getElementById('phoneText');
    if(phoneObj){
      iObj.filter((item,index)=>{
        if(item.title==='招商电话'){
          phoneObj.innerHTML = item.content||'';
        }
      });
    }
  }else{
    loadUserInfo();
  }
  return <Layout className="layout">
    <Header className={styles.menuTop} id='topMenu'>
      <div className={styles.menuBox}>
        <div className={styles.logo} id='logo'><Link to="/home"><img src={img} height='45'/></Link></div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[path==='/'?'home':path]}
          className={styles.menuItem}
        >
          <Menu.Item key="home"><Link to="/home">首页</Link></Menu.Item>
          <Menu.Item key='news'><Link to="/news/msgList">新闻公告</Link></Menu.Item>
          <Menu.Item key="park"><Link to="/park">园区服务</Link></Menu.Item>
          <Menu.Item key="company"><Link to="/company">入驻企业</Link></Menu.Item>
          <Menu.Item key="person"><Link to="/person">人才展示</Link></Menu.Item>
        </Menu>
      </div>
    </Header>
    {path==='home'?<CarouselBox />:null}  
    <Content style={path==='home'?null:{marginTop:'82px'}}>
      {path==='home'?null:<div style={{textAlign:'center'}}><Breadcrumb routes={routes} params={params} /></div>}
      <div className={styles.box} >{children||<Home />} </div>
      
      <div id='botoomBox' className={styles.backTop}  >
        <div className={styles.backIconBox} id="numBox">
          {/* <Popover placement="left" onMouseEnter={backEnter} title='招商电话' content='15657162000' > */}
          <i className="iconfont icon-Backtop-Phone"></i>
          {/* </Popover> */}
        </div>
        <BackTop>
          <div className={styles.backIconBox} id='backTarget'>
            <i className="iconfont icon-Backtop-Top" title='返回顶部'></i>      
          </div>
        </BackTop>
        {/* <Card title='义乌科技创业园公众号' id='qrCont' className={styles.botBox}><img src={qrImg}/></Card> */}
        <Card title='招商电话' id='numCont' className={styles.botBox}><label id='phoneText'>暂无</label></Card>
      </div>
    </Content>
    <Footer className={styles.bottom} style={path==='home'?null:{height:'137px'}}>
      <Row className={styles.botText} style={path==='home'?null:{marginTop:'1%'}}>
        <Col span={12} className={styles.botLeft}><div style={{width:'214px',height:'34px'}} className={styles.leftImg}><img src={botLogo} /></div></Col>
        <Col span={10} offset={2} className={styles.botRight}>
          <p>本站归<span> 义乌市科技创业园 </span>版权所有</p>
          <p>&copy;2015 yiwukcy.com | 浙ICP备13016135号</p>
        </Col>
      </Row>
    </Footer>
  </Layout>;
};

export default App;
