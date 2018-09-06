import React from "react";
import {Link ,withRouter} from 'react-router-dom';
import RouteIndex from '../router/router'
import { Layout, Menu, Breadcrumb, Icon,Affix,Row,Col,Button} from "antd";
import styles from "./index.less";
import HeadCont from '@/modules/common/header';
import FootCont from '@/modules/common/footer';

import {get} from '@/tools/axios';
import API from '@/tools/api';
import {connect } from "react-redux";
import { bindActionCreators } from 'redux'
import IndexAction from './indexAction';

import ModalMangeCont from '@/modules/common/modal/modalManage';
import ImgManageCont  from '@/modules/common/image/imgMonitor';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
class horizonApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultKey: ["1"],
      modalVisible:false,
      imgVisible:false
    };
  }
  componentDidMount(){
    console.log(this.props.history,"==props history==");
    window.scrollTo(0,0)
  }
  modalEdit=()=>{
    this.setState({modalVisible:true})
  }
  cancelModalEdit=()=>{
    this.setState({modalVisible:false})
  }
  imgEdit=()=>{
    this.setState({imgVisible:true})
  }
  cancelImgEdit=()=>{
    this.setState({imgVisible:false})
  }
  render() {
    const {IndexState}=this.props;
    return (
      <div >
        <HeadCont history={this.props.history} />
        <main role="main">
          <Affix offsetTop={160} className={styles.fixedBox} >
            <div className={styles.fixedBtn}>
              <Button onClick={this.modalEdit}><Icon type="appstore" /><span>模块管理</span></Button>
            </div>
            <div className={styles.fixedBtn}>
              <Button onClick={this.imgEdit}><Icon type="picture" /><span>图片管理</span></Button>
            </div>          
          </Affix>
          <RouteIndex />
        </main>
        <FootCont />
        {this.state.modalVisible?<ModalMangeCont visible={this.state.modalVisible} cancelManage={this.cancelModalEdit}/>:null}
        {this.state.imgVisible?<ImgManageCont visible={this.state.imgVisible} cancelImg={this.cancelImgEdit} isEdit={true} />:null}
      </div>
    );
  }
}
const mapStateToProps=function(state) {
  return {
    IndexState: state.indexState
  }
}

const mapDispatchToProps=(dispatch)=> {
  return {
    actions:bindActionCreators(IndexAction, dispatch)
  }
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(horizonApp)
);
