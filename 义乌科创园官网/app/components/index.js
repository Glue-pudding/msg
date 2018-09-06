import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory,IndexRoute,hashHistory } from 'react-router';
import App from './app';
import Home from './Home/Home.jsx';
import News from './News/News.jsx';
import Company from './Company/company.jsx';
import Park from './Park/park.jsx';
import Person from './Person/person.jsx';
import InfoDetail from '../components/modules/InfoDetail.jsx';
import NotFoundPage from '../components/modules/NotFound.jsx';

// import 'antd/dist/antd.css';

import IconFont from '../../static/iconFont/iconfont.css';
// import mockServer from '../common/mock';
import '../../static/css/slick.min.css';
import '../../static/css/slick.theme.min.css';
render((
  <Router history={hashHistory}>    
    <Route path="/" breadcrumbName="首页" component={App}>
      <Route path="home"  component={Home} />   
      
      <Route path="news" breadcrumbName="新闻公告" component={News} />   
      <Route path="news" breadcrumbName="新闻公告">
        <Route path='newsList' breadcrumbName="新闻资讯" component={News}/>
        <Route path='msgList' breadcrumbName="信息公示" component={News}/>
        <Route path='careList' breadcrumbName="领导关怀" component={News}/>
        <Route path='cultureList' breadcrumbName="园区文化" component={News}/>
        <Route path="newsDetail" breadcrumbName="新闻正文" component={InfoDetail} />  
      </Route>
      
      <Route path="park" breadcrumbName="园区服务"  component={Park} />
      <Route path="park" breadcrumbName="园区服务">
        <Route path="parkDetail" breadcrumbName="服务详情" component={InfoDetail} />
      </Route>
      <Route path="company" breadcrumbName="入驻企业" component={Company}/>
      <Route path="company" breadcrumbName="入驻企业" >
        <Route path="companyDetail" breadcrumbName="企业详情" component={InfoDetail} />
      </Route>
      <Route path="person" breadcrumbName="人才展示" component={Person} />
      <Route path="person" breadcrumbName="人才展示" >
        <Route path="personDetail" breadcrumbName="人才详情" component={InfoDetail} />
      </Route>
    </Route>
    <Route path="*" component={NotFoundPage} />
  </Router>
), document.getElementById('root'));
