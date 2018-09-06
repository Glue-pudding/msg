import React, { Component } from 'react';
import axios from '@axios';
import { Table, Avatar, Tabs,message,List,Card,Pagination,Icon, Button} from 'antd';
const TabPane = Tabs.TabPane;
import { hashHistory} from 'react-router';
const { Meta } = Card;
import comStyle from '../app.less';
import API from '../../common/api';
import styles from './style.less';

class Person extends Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.state = {
      list: [],page:1,
      size:6,
      talentList:[],
      typeList:[],
      listNum:0,
      activeKey:'all'
    };
    this.column = [];
  }
  componentDidMount(){
    this.loadPersonList();
    this.loadTypeList();    
  }
  componentWillUnmount(){
    this.setState({page:1,newsList:[]});
  }
  loadPersonList(page,typeId){
    let t=this,state=t.state,params={page:page||t.state.page,size:t.state.size};
    params.talentsTypeId = (typeId==='all'||typeId===undefined)?'':(typeId||this.state.activeKey);
    axios({
      method: 'post',
      url:API.TALENTS_LIST,
      data:params
    }).then(data => {
      let datas = data.data.data,code = data.data.code;
      if(code===10000){
        t.setState({talentList: datas.list,listNum:datas.count});
      }else{
        message.warn(data.message||'系统出错，请联系管理员');
      }
    }).catch(error => {
      message.error(error);// 异常处理
    });
  }

  loadTypeList(){
    let t=this;
    axios({
      method: 'post',
      url:API.TALENTS_TYPE_LIST,
    }).then(data => {
      let datas = data.data.data,code = data.data.code;
      this.column = datas.list;
      if(code===10000){
        if(datas.list && datas.list.length>7){
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
    this.loadPersonList(1,id);
    this.setState({page:1,activeKey:id});
  }

  pageChange(page,size){
    this.setState({page,size});
    this.loadPersonList(page);
  }
  loadDetail(id,typeId,name){
    console.log(typeId);
    let iName = null;
    this.state.typeList.filter((item,index)=>{
      if(item.id===typeId){
        iName = item.name;
      }
    });
    // if(iKey){
    hashHistory.push('/person/personDetail/?type=talents&key='+typeId+'&name='+name+'&id='+id);
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
    // console.log(this.state.talentList,'===talent===');
    const {page,listNum,talentList,activeKey,typeList} =this.state;
    let list = this.state.talentList,t=this;
    let typeCont = typeList.length?typeList.map((item,index)=>{
      let activeCls = item.id===activeKey?styles.activeBtn:'';
      if(item.id){
        return <Button key={item.id} className={`${styles.btn} ${activeCls}`} onClick={this.changeType.bind(t,item.id)} title={item.name}>{item.name}</Button>;
      }      
    }):null;
    let clist = list.filter(function(item,index){
      if(index<6){
        return item;
      }
    });
    let allStyle = activeKey==='all'?styles.activeBtn:'',curNum = activeKey==='all'?listNum:talentList.length;
    var itemRender = function(current, type, originalElement) {
      if (type === 'prev') {
        return <a><Icon type="left" />上一页</a>;
      } else if (type === 'next') {
        return <a>下一页<Icon type="right" /></a>;
      }
      return originalElement;
    };

    return (<div>
      <div className={comStyle.panelTop}><h2>人才展示</h2></div>
      <div className={comStyle.normalCont} >
        {typeList.length?<div className={styles.maxHeight}>
          <Button className={`${styles.btnQ} ${allStyle}`} onClick={this.changeType.bind(t,'all')}>全部 {listNum} 名人才</Button>
          {typeCont}
          {
            this.column.length>7?this.renderIsOpen():''
          }
        </div>:null}
        {list.length&&list?<List grid={{ gutter: 32,column: 3 }}
          className={styles.talenCla}
          dataSource={clist}
          renderItem={(item,index) => {
            let itemCont =<List.Item className={styles.talentItem} >
              <Card className={styles.talentCard} bordered={false} onClick={t.loadDetail.bind(t,item.id,item.talentsTypeList[0].id,item.name)}
                cover={<img alt={item.name} src={item.url} />}
              >
                <Meta
                  title={
                    <div><h3>{item.name}</h3><h4>{item.companyName}</h4></div>
                  }
                  description={item.title}
                />
              </Card>
            </List.Item>;
            return itemCont;
          }}
        />:null}
      </div>
      {listNum>6?<Pagination total={listNum||1} current={page} pageSize={6}  itemRender={itemRender} onChange={t.pageChange.bind(t)} className={comStyle.pagePanel} />:null}
    </div>);
  }
}
export default Person;