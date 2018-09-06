import React, { Component } from 'react';
import { render } from 'react-dom';
import API from '@api';
import {post,get} from '@axios';
import { Table, Icon ,message,Row,Col,Card,Input 
  ,Button,Form,Select ,Badge,Tooltip ,Alert} from 'antd';
import styles from './comstom.module.less';
import { Route, Link } from 'react-router';
import Page from '@common/PageTable';
import moment from 'moment';
import commStyle from '../../app.less';

const Search = Input.Search;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
class ManageHome extends Component {
  constructor(props){
    super(props);
    this.state={
      loading:false,visible:false,
      list:[],
      editType:'',BusinessID:'',
      count:'',
      dropdownVisible:false,curType:'all',dropdownStatus:false

    };
  }
  componentDidMount() {
    let t = this;
    t.loadData();
  }
  //拉取用户列表
  loadData(value){
    let t = this,params='';
    t.setState({ loading: true ,curType:'all'});
    if(value){
      params = { url: API.BUSINESS_LIST ,params:{BusinessName:value}};
    }else{
      params = { url: API.BUSINESS_LIST};
    }
    get(params).then(function (res) {
      if (res && res.code === 10000) {
        t.setState({ 
          list: res.data.BusinessList,  
          loading: false, 
          editType: '',
          supplier:res.data.BusinessList.Supplier,
          BusinessID:res.data.BusinessList.BusinessID,
          ChooseList:res.data.BusinessList,  
        });
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
  changeStatus=(type)=>{
    this.setState({curType:type,dropdownStatus:false});
  }
  //表格头部
  loadColumn(){
    let columns = [], t = this;
    const {curType,dropdownVisible,dropdownStatus} = this.state;
    let typeList = [
      { value: '全部', key: 'all' },
      { value: '查询业务', key: 'query' },
      { value: '分析业务', key: 'analyse' },
    ];
    let Status = [
      { value: '全部', key: 'all' },
      { value: '未生效', key: 0 },
      { value: '已生效', key: 1 },
      { value: '已过期', key: 2 },
      { value: '冻结', key: 3 },
    ];
    columns = [{
      title: '业务名称',
      dataIndex: 'BusinessName',
      key: 'BusinessName',
    }, {
      title: '业务类型',
      dataIndex: 'BusinessType',
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
        return <span>
          {record.BusinessType==='query' ?'查询业务':'分析业务'}
        </span>;
      }
    }, {
      title: '起止时间',
      dataIndex: 'StartTime',
      key: 'StartTime',
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
      filterIcon: <Icon type="caret-down" />,
      filterDropdownVisible:dropdownStatus,
      onFilterDropdownVisibleChange:(visible)=>{
        t.setState({dropdownStatus:visible});
      },
      filterDropdown: (
        <div className={commStyle.dropdownBox}>
          <ul>
            {Status.map((item,index)=>{
              return <li onClick={t.changeStatus.bind(t,item.key)} key={item.key} className={curType===item.key?commStyle.active:''}>
                <a href="javascript:void(0);">{item.value}</a>
              </li>;
            })}  
          </ul>
        </div>
      ),
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
        return <span className={styles.ConfigFlag}>
          {record.ConfigFlag===0?<Tooltip title="当前业务未完成配置操作"><span><Alert type="warning" showIcon /></span></Tooltip>:null}
          <Link to={'/custom/business/businessDetail/'+record.BusinessID}>详情</Link>
        </span>;
      }
    }];
    return columns;
  }

  render() {
    var t = this, state = t.state;
    let columns = t.loadColumn();
    const {list,curType} =state;
    const { getFieldDecorator } = this.props.form;
    const { startValue, endValue, endOpen } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    let listHeader =<div style={{marginTop:'2.7%',marginBottom:'2.3%'}}>
      <Search placeholder="业务名称检索" onSearch={this.searchName.bind(this)} style={{ width: 200 ,float:'right'}} />
    </div>;
    let curList = curType==='all'?list:list.filter((item,index)=>{
      if(item.BusinessType===curType || item.Status===curType){
        return item;
      }
    });
    return (
      <div>
        <div className={styles.header}>数据开放业务管理</div>
        <Row type="flex" justify="center" className={styles.listBody}>
          <Col md={24}>
            <div className="gutter-box">
              <Card bordered={false} title={listHeader}>
                <Page loading={this.state.loading} columns={columns} list={curList||[]} rowKey='BusinessID'/>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(ManageHome);