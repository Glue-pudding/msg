import React, { Component } from 'react';
import axios from '@axios';
import { Table, Avatar, Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import comStyle from '../app.less';
import style from './style.less';

import ParkIntro from './ParkIntro.jsx';
import Industrial from './Industrial.jsx';
import PolicyService from './PolicyService.jsx';
import SupportFacilities from './supportFacilities.jsx';



class Park extends Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.state = {
      list: [],
      key: 'news',
      newsList:[
        {name:'news1',desc:'the first news list'},
        {name:'news2',desc:'the second news list'},
      ]
    };
  }
  tabChange(key){
    this.setState({key});
  }
  componentDidMount(){
    let iStr = location.hash.match(/([^\\?]+)$/)[0],iType='';
    iStr.replace(/(?=(type=)).*$/,function(i,k,m){
      iType = i.substring(k.length);
    });
    setTimeout(function(){
      switch(iType){
      case 'top':
        // window.scrollBy(0,400);
        document.getElementById('industry').scrollIntoView();
        break;
      case 'middle':
        // window.scrollBy(0,1400);
        document.getElementById('policy').scrollIntoView();
        break;
      case 'bottom':
        // window.scrollBy(0,2200);
        document.getElementById('support').scrollIntoView();
        break;
      }
    },500);
    
  }
  render(){
    return (
      <div className={style.all}>
        <div className={comStyle.panelTop}><h2>园区服务</h2></div>
        <div className={comStyle.normalCont}>
          <div className={style.parkIntro}><ParkIntro /></div>
          <div className={style.Industrial} id="industry"><Industrial /></div>
          <div className={style.PolicyService} id='policy'><PolicyService /></div>
          <div className={style.Industrial} id='support'><SupportFacilities /></div>
        </div>
      </div>
    );
  }
}
export default Park;