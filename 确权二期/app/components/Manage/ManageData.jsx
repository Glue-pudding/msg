import React, { Component } from 'react';
import { render } from 'react-dom';
import API from '@api';
import {post,get} from '@axios';
import { Table, Icon, Divider ,message,Row,Col,Card,Input 
  ,Button,Form,Modal,Select ,Badge,DatePicker,Radio } from 'antd';
import styles from './manage.module.less';
import commStyle from '../../app.less';
import PersonDetails from './PersonDetails';
import { Route, Link } from 'react-router';
import Page from '@common/PageTable';
import moment from 'moment';
import EditData from './editData';

const Search = Input.Search;
const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;
class ManageHome extends Component {
  constructor(props){
    super(props);
    this.state={
      loading:false,visible:false,userType:'Supplier',
      list:[],Supplier:[],Customer:[],
      editType:'',
      count:'',    startValue: null,dataSetName:'',
      endValue: null,
      endOpen: false,value:1,DataSetList:'',
      startTime:'',endTime:'',
      //筛选框相关属性
      dropdownVisible:false,curType:'all' 
    };
  }
  componentDidMount() {
    let t = this;
    t.loadData();
    t.getUserType();

  }

  //拉取用户列表
  loadData(value){
    let t = this,params='';
    if(value){
      params = { url: API.BUSINESS_QUERY ,params:{BusinessName:value}};
    }else{
      params = { url: API.BUSINESS_QUERY};
    }
    t.setState({ loading: true,curType:'all' });
    get(params).then(function (res) {
      if (res && res.code === 10000) {
        t.setState({ list: res.data.BusinessList,  loading: false, editType: '',supplier:res.data.BusinessList.Supplier});
      } else {
        t.setState({ loading: false, editType: '' });
        message.warn(res.message || '系统出错，请联系管理员!');
      }
    }).catch = (err) => {
      t.setState({ loading: false, editType: '' });
      console.log('==error==', err);
    };
  }

  //获取供方名称
  getUserType(){
    let t = this,params='';
    t.setState({ loading: true });
    params = { url: API.GET_USERS_CONDITIONS};
    get(params).then(function (res) {
      if (res && res.code === 10000) {
        t.setState({ Supplier: res.data.Supplier,  loading: false, editType: '',Customer: res.data.Customer });
      } else {
        t.setState({ loading: false, editType: '' });
        message.warn(res.message || '系统出错，请联系管理员!');
      }
    }).catch = (err) => {
      t.setState({ loading: false, editType: '' });
      console.log('==error==', err);
    };
  }

  //查询搜索
  searchName(value){
    this.loadData(value);
  }
  //点击查看详情
  edit(){
    this.setState({editType:'edit'});
  }
  changeType=(type)=>{
    this.setState({curType:type,dropdownVisible:false});
  }
  //表格头部
  loadColumn(){
    let columns = [], t = this;
    const {curType,dropdownVisible} = this.state;
    let typeList = [
      { value: '全部', key: 'all' },
      { value: '查询业务', key: 'query' },
      { value: '分析业务', key: 'analyse' },
    ];
    columns = [{
      title: '业务名称',
      dataIndex: 'BusinessName',
      key: 'BusinessName',
      width:'19%',
    }, {
      title: '业务类型',
      dataIndex: 'BusinessType',
      width:'110px',
      key: 'BusinessType',
      filterIcon: <Icon type="caret-down" />,
      filterDropdownVisible:dropdownVisible,
      onFilterDropdownVisibleChange:(visible)=>{
        t.setState({dropdownVisible:visible});
      },
      filterDropdown: (
        <div className={commStyle.dropdownBox}>
          <ul>
            {typeList.map((item,index)=>{
              return <li onClick={t.changeType.bind(t,item.key)} key={item.key} className={curType===item.key?commStyle.active:''}>
                <a href="javascript:void(0);">{item.value}</a>
              </li>;
            })}  
          </ul>
        </div>
      ),
      render: (text, record) => {
        let BusType = '';
        if(record.BusinessType==='query'){BusType='查询业务';}else{BusType='分析业务';}
        return <span>
          {BusType}
        </span>;
      }
    },{
      title: '供方/需方',
      dataIndex: 'Supplier',
      key: 'Supplier',
      width:'20%',
      render: (text, record) => {
        return <span>
          <span>供方：{record.Supplier}</span><br />
          <span>需方：{record.Customer}</span>
        </span>;
      }
    }, {
      title: '起止时间',
      dataIndex: 'StartTime',
      key: 'StartTime',
      width:'20%',
      render: (text, record) => {
        let StartTime=moment(record.StartTime).format('YYYY-MM-DD');
        let EndTime=moment(record.EndTime).format('YYYY-MM-DD');
        return <span>
          <span>起：{StartTime}</span><br />
          <span>止：{EndTime}</span>
        </span>;
      }
    }, {
      title: '业务状态',
      dataIndex: 'Status',
      key: 'Status',
      width:'13%',
      render: (text, record) => {
        let iCont = null;
        switch(record.Status){
        case 3:
          iCont = <Badge status="error" />;
          break;
        case 1:
          iCont = <Badge status="processing" />;
          break;
        case 0:
          iCont = <Badge status="warning" />;
          break;
        case 2:
          iCont = <Badge status="default" />;
          break;
        default:
          iCont = <Badge status="default" />;
        }
        return <span>
          {iCont}{record.Status===0?'未生效':(record.Status===1?'已生效':(record.Status===2?'已过期':'冻结'))}
        </span>;
      }
    },{
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return <span>
          <Link to={'/manage/business/datasDetails/'+record.BusinessID}>详情</Link>
          {record.Status===2?'':<span><Divider type="vertical" /><a onClick={this.stateChange.bind(this,record.BusinessID,record.Status)} className={record.Status===3 ? styles.red : ''}>{record.Status===3?'恢复':'冻结'}</a></span>}
        </span>;
      }
    }];
    return columns;
  }
  //改变用户状态
  stateChange(BusinessID,status){
    let t=this,params='',data={BusinessID:BusinessID};
    this.setState({loading:true});
    if(status===3){
      params = { url: API.RECOVER_BUSINESS ,data:data};
    }else{
      params = { url: API.BLOCK_BUSINESS ,data:data};
    }
    post(params).then(function (res) {
      if (res && res.code === 10000) {
        t.setState({loading: false, editType: '' ,visible:false});
        message.success('操作成功');
        t.loadData();
      } else {
        t.setState({ loading: false, editType: '' });
        message.warn(res.message || '系统出错，请联系管理员!');
      }
    }).catch = (err) => {
      t.setState({ loading: false, editType: '' });
      console.log('==error==', err);
    };
  }
  //新增用户
  showModal() {
    let t=this;
    t.setState({ visible: true,});
  }
  changeVisible(visible){
    this.setState({visible});
  }
  render() {
    var t = this, state = t.state;
    const {list,curType} =state;
    let columns = t.loadColumn();
    let listHeader =<div style={{marginTop:'12px',marginBottom:'8px'}}>
      <Button type="primary" onClick={t.showModal.bind(this)} className={styles.allBtn}>新增业务</Button>
      <Search placeholder="业务名称检索" onSearch={this.searchName.bind(this)} style={{ width: 200 ,float:'right'}} />
    </div>;
    
    let curList = curType==='all'?list:list.filter((item,index)=>{
      if(item.BusinessType===curType){
        return item;
      }
    });
    return (
      <div>
        <div className={styles.header}>数据开放业务管理</div>
        <Row type="flex" justify="center" className={styles.listBody}>
          <Col md={24}>
            <div className="gutter-box">
              {!this.state.editType ? <Card bordered={false} title={listHeader}>
                <Page loading={this.state.loading} columns={columns} list={curList||[]} rowKey="BusinessID"/>
              </Card> : <PersonDetails />}
            </div>
          </Col>
        </Row>
        {this.state.visible?
          <EditData visible={this.state.visible} handleVisible={this.changeVisible.bind(this)} Supplier={this.state.Supplier} Customer={this.state.Customer} DataSetList={this.state.DataSetList} loadData={this.loadData.bind(this)}/>
          :null}
      </div>
    );
  }
}

export default Form.create()(ManageHome);