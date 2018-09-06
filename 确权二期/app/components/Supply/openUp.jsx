import React, { Component } from 'react';
import { render } from 'react-dom';
import API from '@api';
import {post,get} from '@axios';
import { Table, Icon, Divider ,message,Row,Col,Card,Input 
  ,Button,Form,Modal,Select ,Badge,DatePicker,Radio,Tooltip } from 'antd';
import styles from './ConStyle.less';
import commStyle from '../../app.less';
import OpenDetails from './openDetails';
import { Route, Link } from 'react-router';
import Page from '@common/PageTable';

const Search = Input.Search;
const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;
class ManageHome extends Component {
  constructor(props){
    super(props);
    this.state={
      loading:false,visible:false,
      list:[],Customer:'',
      editType:'',
      count:'',    startValue: null,dataSetName:'',
      endValue: null,
      endOpen: false,value:1,DataSetList:'',
      startTime:'',endTime:'',
      dropdownVisible:false,
      curType:'all',
      typeDataList:[]

    };
  }
  componentDidMount() {
    let t = this;
    t.loadData();
  }
  //拉取用户列表
  loadData(value){
    let t = this,params='';
    t.setState({ loading: true });
    if(value){
      params = { url: API.DATA_OPEN_BUSINESS_MANAGER ,params:{BusinessName:value}};
    }else{
      params = { url: API.DATA_OPEN_BUSINESS_MANAGER};
    }
    get(params).then(function (res) {
      console.log(res);
      if (res && res.code === 10000) {
        t.setState({ list: res.data.DataSets,  loading: false, editType: '',typeDataList:res.data.DataSets});
      } else {
        t.setState({ loading: false, editType: '' });
        message.warn(res.message || '系统出错，请联系管理员!');
      }
    }).catch = (err) => {
      t.setState({ loading: false, editType: '' });
      // console.log('==error==', err);
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
  //类型查找
  changeType=(type)=>{
    console.log(type);
    
    this.setState({curType:type,dropdownVisible:false});
  }
  //表格头部
  loadColumn(){
    let columns = [], t = this;
    const {curType,dropdownVisible} = this.state;
    let typeList = [
      { text: '全部', value:'all'},
      { text: '分析', value: 'analyse' },
      { text: '查询', value: 'query' }
    ];
    const Prompt = <span>当前业务未完成授权操作</span>;
    columns = [{
      title: '业务名称',
      dataIndex: 'BusinessName',
      key: 'BusinessName',
      width:'18%'
    }, {
      title: '业务类型',
      dataIndex: 'BusinessType',
      key: 'BusinessType',
      width:'18%',
      render: (text, record) => {
        return <span>
          {
            record.BusinessType==='analyse'?'分析':'查询'
          }
        </span>;
      },
      // filters: [
      //   { text: '政务数据', value: 'GovernmentDataSets' },
      //   { text: '金融数据', value: 'FinanceDataSets' },
      //   { text: '医疗卫生', value: 'MedicalDataSets' },
      //   { text: '人工智能', value: 'AIDataSets' },
      //   { text: '电商营销', value: 'ElectronicBusinessDataSets' },
      //   { text: '交通数据', value: 'TrafficDataSets' },
      //   { text: '应用开发', value: 'ServiceDataSets' },
      // ],
      // filterMultiple: false,
      // onFilter: (value, record) => record.BusinessType.indexOf(value)===0,
      // filterIcon: <Icon type="caret-down" />,
      filterIcon: <Icon type="caret-down" />,
      filterDropdownVisible:dropdownVisible,
      onFilterDropdownVisibleChange:(visible)=>{
        t.setState({dropdownVisible:visible});
      },
      filterDropdown: (
        <div className={commStyle.dropdownBox}>
          <ul>
            {typeList.map((item,index)=>{
              return <li onClick={t.changeType.bind(t,item.value)} key={item.value} className={curType===item.value?commStyle.active:''}>
                <a href="javascript:void(0);">{item.text}</a>
              </li>;
            })}  
          </ul>
        </div>
      ),
    },{
      title: '数据规模',
      dataIndex: 'DataSize',
      key: 'DataSize',
      width:'14%',
      render:(text,record)=>{
        return (
          record.DataSize?record.DataSize:'--'
        );
      }
    }, {
      title: '起止时间',
      dataIndex: 'StartTime',
      key: 'StartTime',
      width:'20%',
      render: (text, record) => {
        let timeStart = new Date(record.StartTime),
          yearS = timeStart.getFullYear(),monthS=timeStart.getMonth()+1,dayS=timeStart.getDate();
        let timeEnd = new Date(record.EndTime),yearE = timeEnd.getFullYear(),monthE=timeEnd.getMonth()+1,dayE=timeEnd.getDate();
        return <span>
          <span>起：{yearS+'-'+(monthS>9?monthS:'0'+monthS)+'-'+(dayS>9?dayS:'0'+dayS)}</span><br />
          <span>止：{yearE+'-'+(monthE>9?monthE:'0'+monthE)+'-'+(dayE>9?dayE:'0'+dayE)}</span>
        </span>;
      }
    }, {
      title: '业务状态',
      dataIndex: 'Status',
      key: 'Status',
      width:'15%',
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
      width:'15%',
      render: (text, record) => {
        return <span>{
          record.AuthFlag===0?
            <Tooltip placement="top" title={Prompt}>
              <Icon style={{color:'#FFCE00',width:20}} type="exclamation-circle "/>
            </Tooltip>:null}
        <Link to={'/supply/business/openDetails/'+record.BusinessID}>详情</Link>
        </span>;
      }
    }];
    return columns;
  }

  render() {
    var t = this, state = t.state;
    let columns = t.loadColumn();
    const { getFieldDecorator } = this.props.form;
    const { startValue, endValue, endOpen, curType } = this.state;
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
    let listHeader =<div>
      <Search placeholder="业务名称检索" onSearch={this.searchName.bind(this)} style={{ width: 200 ,float:'right', marginBottom:8,marginTop:8}} />
    </div>;
    let curList = curType==='all'? this.state.list:this.state.list.filter((item,index)=>{
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
                <Page loading={this.state.loading} columns={columns} list={curList||[]} rowKey="id"/>
              </Card> : <OpenDetails />}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(ManageHome);