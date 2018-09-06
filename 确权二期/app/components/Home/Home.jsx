import React, { Component } from 'react';
import axios from '@axios';
import { Row,Col,Tabs } from 'antd';
import AccountComp from '../Manage/ManageAccount';
import SupplyDataComp from '../Supply/DatasourceMange';
import CustomBusinessComp from '../Comstom/BusinessManage';
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.state={
      role:sessionStorage.getItem('localRole')||null
    };
  }
  render() {
    const {role} = this.state;
    let homeCont =null;
    switch(role){
    case 'Admin':
    case 'admin':
      homeCont = <AccountComp />;
      break;
    case 'Supplier':
    case 'supplier':
      homeCont = <SupplyDataComp />;
      break;
    case 'Customer':
    case 'customer':
      homeCont = <CustomBusinessComp />;
      break;
    }
    return (
      <div>
        {homeCont||'home'}
      </div>
    );
  }
}

export default Home;