import React from 'react';
import { render } from 'react-dom';
import { message} from 'antd';
import { Router, Route, browserHistory,IndexRoute,hashHistory } from 'react-router';
import App from '../app';
import Home from '../components/Home/Home.jsx';
import AccountComp from '../components/Manage/ManageAccount';
import DatamanageComp from '../components/Manage/ManageData';
import PersonDetails from '../components/Manage/PersonDetails';
import DatasDetails from '../components/Manage/DatasDetails';

import SupplyDataComp from '../components/Supply/DatasourceMange';
import AddData from '../components/Supply/AddData';
import Details from '../components/Supply/details';
import OpenUp from '../components/Supply/openUp';
import OpenDetails from '../components/Supply/openDetails';
import CustomBusinessComp from '../components/Comstom/BusinessManage';
import CustomDataremix from '../components/Comstom/DataConfuse';
import BussinessDetail from '../components/Comstom/BusinssDetail';
import NotFoundPage from '@common/NotFound';
import LoginPage from '@common/Login';

let enterPage=function(nextState,replaceState){
  const curRole = sessionStorage.getItem('localRole')||null;
  const curSession = sessionStorage.getItem('localSession')||null;
  if(!curRole&&!curSession){
    message.warn('登录信息无效，即将跳转登录页面！');
    setTimeout(()=>{
      hashHistory.push('/login');
    },2000);
    return false;
  }
};
export default class RouterComp extends React.Component {
  render() {
    return <Router history={hashHistory}>    
      <Route path="/" breadcrumbName="首页" component={App} onEnter={enterPage} >
        <Route path="home"  component={Home} />    
        <Route path="manage" breadcrumbName="确权平台管理">
          <Route path='account' breadcrumbName="账号管理" component={AccountComp} />
          <Route path="account/personDetails/:name" breadcrumbName="账号管理" component={PersonDetails} />
          <Route path='business' breadcrumbName="数据开放业务管理" component={DatamanageComp} />
          <Route path="business/datasDetails/:id" component={DatasDetails} />
        </Route>
        <Route path="supply" breadcrumbName="数据供方管理">
          <Route path='resource' breadcrumbName="数据资源管理" component={SupplyDataComp}/>
          <Route path='resource/addData' breadcrumbName="添加数据" component={AddData}/>
          <Route path='resource/details/:name' breadcrumbName="数据详情" component={Details}/>
          <Route path='business' breadcrumbName="数据开放业务管理" component={OpenUp} />
          <Route path='business/openDetails/:id' breadcrumbName="数据开发业务详情" component={OpenDetails}/>
        </Route>
        <Route path="custom" breadcrumbName="确权平台管理">
          <Route path='remix' breadcrumbName="数据混淆管理" component={CustomDataremix}/>
          <Route path='business' breadcrumbName="数据开放业务管理" component={CustomBusinessComp} />
          <Route path='business/businessDetail/:id' component={BussinessDetail} />
        </Route>
      </Route>
      <Route path="/login" component={LoginPage} />
      <Route path="*" component={NotFoundPage} />
    </Router>;
  }
}