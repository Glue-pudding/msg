import React from 'react';
import {Menu,message} from 'antd';
import {Link} from 'react-router';
import API from '@api';
import {post,get} from '@axios';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import {hashHistory} from 'react-router';
import styles from './style.less';
class CommonMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKey:['1'],
      roleType:this.props.auth||null,
      hasKey:null
    };
  }
  componentDidMount(){
    let hash = location.hash;
    if((!hash.match('custom')&&hash.match('business'))||hash.match('remix')){
      this.setState({selectedKey:['2']});
    }
  }
  changeSelect=(item)=>{
    this.setState({selectedKey:item.selectedKeys});
  }
  openChange=(key)=>{
    this.setState({hasKey:key});
  }
  render() {
    const {roleType,selectedKey,hasKey} =this.state;
    let iCont =null;
    switch(roleType){
    case 'Admin':
    case 'admin':
      iCont = <SubMenu key="sub1" title={<span>确权平台管理</span>}>
        <Menu.Item key="1"><Link to='/manage/account' title='账号管理'>账号管理</Link></Menu.Item>
        <Menu.Item key="2"><Link to='/manage/business' title='数据开放业务管理'>数据开放业务管理</Link></Menu.Item>
      </SubMenu>;
      break;
    case 'Supplier':
    case 'supplier':
      iCont = <SubMenu key="sub1" title={<span>数据供方管理</span>}>
        <Menu.Item key="1"><Link to='/supply/resource' title='数据资源管理'>数据资源管理</Link></Menu.Item>
        <Menu.Item key="2"><Link to='/supply/business' title='数据开放业务管理'>数据开放业务管理</Link></Menu.Item>
      </SubMenu>;
      break;
    case 'Customer':
    case 'customer':
      iCont = <SubMenu key="sub1" title={<span>数据需方管理</span>}>
        <Menu.Item key="1"><Link to='/custom/business' title='数据开放业务管理'>数据开放业务管理</Link></Menu.Item>
        <Menu.Item key="2"><Link to='/custom/remix' title='数据混淆管理'>数据混淆管理</Link></Menu.Item>
      </SubMenu>;
      break;
    }
    return (<Menu
      mode="inline" defaultOpenKeys={['sub1']} selectedKeys={selectedKey} defaultSelectedKeys={['1']}
      style={{ width: '100%' }}  onSelect={this.changeSelect} onOpenChange={this.openChange} className={hasKey&&hasKey.length?'':!hasKey?'':styles.collapStyle}
    >
      {iCont}
    </Menu>
    );
  }
}

export default CommonMenu;