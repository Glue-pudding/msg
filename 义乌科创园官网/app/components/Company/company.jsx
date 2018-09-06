import React, { Component } from 'react';
import axios from '@axios';
import { Button,message,Card,Row,Col,Pagination,Icon} from 'antd';
import { hashHistory} from 'react-router';
import comStyle from '../app.less';
import styles from './style.less';
import API from '../../common/api';

class Company extends Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.state = {
      typeList: [],compList:[],
      listNum:0,activeKey:'all',
      page:1,size:12,
      eigthList: []
    };
    this.column = [];
  }
  tabChange(key){
    this.setState({key});
  }
  componentDidMount(){
    this.loadTypeList();
    this.loadCompList();
  }
  loadCompList(page,typeId){
    let t=this,state=t.state,params={size:t.state.size,page:page||t.state.page,source:1};
    params.typeId = (typeId==='all'||typeId===undefined)?'':(typeId||this.state.activeKey);
    axios({
      method: 'post',
      url:API.COMPANY_LIST,
      data:params
    }).then(data => {
      let datas = data.data.data,code = data.data.code;
      if(code===10000){
        t.setState({ compList: datas.list,listNum:state.listNum||datas.count });
      }else{
        message.warn(data.data.message||'系统出错，请联系管理员');
      }
    }).catch(error => {
      message.error(error);// 异常处理
    });
  }
  loadTypeList(){
    let { typeList, eigthList } = this.state;
    let t=this;
    axios({
      method: 'post',
      url:API.COMPANY_TYPE_LIST,
    }).then(data => {
      let datas = data.data.data,code = data.data.code;
      this.column = datas.list;
      if(code===10000){
        if(datas.list && datas.list.length>7) {
          // this.state.eigthList = datas.list.slice(0,8);
          t.setState({ typeList: datas.list.slice(0,7)});
          
        }else{
          t.setState({typeList:datas.list});
        }
      }else{
        message.warn(data.message||'系统出错，请联系管理员');
      }
    }).catch(error => {
      message.error(error);// 异常处理
    });
  }
  changeType(id){
    console.log(id);
    this.loadCompList(1,id);
    this.setState({page:1,activeKey:id});
  }
  pageChange(page,size){
    this.loadCompList(page);
    this.setState({page,size});
  }
  loadDetail(id,typeId){
    let iName = null;
    this.state.typeList.filter((item,index)=>{
      if(item.id===typeId){
        iName = item.name;
      }
    });
    // if(iKey){
    hashHistory.push('/company/companyDetail/?type=company&key='+typeId+'&name='+iName+'&id='+id);
    // }
  }
  oepnAll() {
    this.setState({
      typeList: this.column
    });
  }
  closeAll() {
    const newArr = this.column.slice();
    this.setState({
      typeList: newArr.slice(0,7)
    });
  }
  renderIsOpen() {
    const { typeList } = this.state;
    return (
      <span>
        {
          typeList.length > 7 ?
            <span className={styles.openAll} onClick={() => {this.closeAll();}}>收起 -</span>
            :
            <span className={styles.openAll} onClick={() => {this.oepnAll();}}>展开 +</span>
        }
      </span>
    );
  }
  render(){
    const { typeList, listNum, activeKey, compList, page, eigthList } = this.state;
    let t=this; 
    let typeCont = typeList.length?typeList.map((item,index)=>{
      let activeCls = item.id===activeKey?styles.activeBtn:'';
      if(item.id){
        return (
          <Button
            key={item.id} 
            className={`${styles.btn} ${activeCls}`}
            onClick={this.changeType.bind(t,item.id)}
            title={item.name}
          >
            {item.name}
          </Button>
        );
      }
    }):null;
    let compListCont = compList.length?compList.map((item,index)=>{
      if(index<12&&(item.typeId===activeKey||activeKey==='all')){
        return <Col span={6} key={item.id}>
          <div onClick={t.loadDetail.bind(t,item.id,item.typeId)} className={styles.cardImg}>
            <img src={item.url} />
          </div>
        </Col>;
      }
    }):null;
    let allStyle = activeKey==='all'?styles.activeBtn:'',curNum = activeKey==='all'?listNum:compList.length;
    let itemRender = function(current, type, originalElement) {
      if (type === 'prev') {
        return <a><Icon type="left" />上一页</a>;
      } else if (type === 'next') {
        return <a>下一页<Icon type="right" /></a>;
      }
      return originalElement;
    };
    return (<div>
      <div className={comStyle.panelTop}><h2>入驻企业</h2></div>
      <div className={comStyle.normalCont}>
        {typeList.length?<div >
          <Button className={`${styles.btnQ} ${styles.btn} ${allStyle}`} onClick={this.changeType.bind(t,'all')}>全部 {listNum} 家企业</Button>
          {typeCont}
          {
            this.column.length > 7 ? 
              this.renderIsOpen() : ''
          }
        </div>:null}
        {compList.length?<Row type="flex" gutter={32} className={styles.cardList}>
          {compListCont}
        </Row>:null}
      </div>
      {curNum>12?<Pagination total={curNum} current={page} pageSize={12}  itemRender={itemRender} onChange={t.pageChange.bind(t)} className={comStyle.pagePanel} />:null}
    </div>);
  }
}
export default Company;