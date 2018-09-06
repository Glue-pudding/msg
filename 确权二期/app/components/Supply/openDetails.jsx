
import React, { Component } from 'react';
import { Route, Link } from 'react-router';
import API from '@api';
import {post,get} from '@axios';
import styles from './ConStyle.less';
import { Steps, Popover, Button, Modal, Icon,DatePicker, message,Input,Badge,Card,Row,Col,Form ,Select,Divider,Switch,Tooltip } from 'antd';
const FormItem = Form.Item;
import moment from 'moment';
import Page from '@common/PageTable';

const Search = Input.Search;

const Option = Select.Option;
// const monthFormat = 'YYYY-MM';
const { TextArea } = Input;
class DetailInfor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked:false,
      visible: false,
      loading: false,startValue:'',endValue:'',
      BusinessID: null,type:'',
      dataList: [],userType:'',
      cSchema:false,
      EditDetailsSch:[],
      schemaCheck:false,
      Supplier:'',
      maskClosablestate:false
    };
  }
  componentDidMount(){
    let iStr = window.location.hash;
    let name = null,strs='';
    strs=iStr.split('/').pop();
    if(strs){
      console.log(strs);
      this.setState({BusinessID: strs});
      this.getMainTainDetail(strs);
    }
	
  }
  //获取详情
  getMainTainDetail(id) {
    let t=this,
      state=this.state,
      params = {url:API.DATA_OPEN_BUSINESS_DETAIL,params:{BusinessID: id}};
    t.setState({loading:true});
    get(params).then(function(res){
      if(res&&res.code===10000){
        t.setState({dataList:res.data||[],loading:false,startValue:res.data.StartTime,
          Supplier:res.data.Supplier,
          endValue:res.data.EndTime});
      }else{
        message.warn((res&&res.message)||'系统出错，请联系管理员!');
      }
    }).catch=(err)=>{
      t.setState({loading:false});
    };
  }
  //正文上半部分
  renderCurrrentState() {
    const { dataList } = this.state;
    const time = moment(dataList.CreateTIme).format('YYYY-MM-DD');
    let iCont = null;
    switch(dataList.Status){
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
    return (
      <div className={styles.bussnormal}>
        <div style={{padding:'16px'}}>
          <span style={{marginRight: '28px',fontSize:14,color:'#9A9A9A'}}>需方：&nbsp;<span style={{fontSize:14,color:'#363636',display:'inline-block'}}>{dataList.Customer}</span></span>
          <span style={{marginRight: '20px',fontSize:14,color:'#363636'}}><span style={{fontSize:14,color:'#9A9A9A',display:'inline-block'}}>业务状态: &nbsp;</span>{iCont}{
            dataList.Status===0?'未生效':(dataList.Status===1?'已生效':(dataList.Status===2?'已过期':'冻结'))
          }</span>
        </div>
      </div>
    );
  }
  //正文上半部分
  renderScheam() {
    const { dataList } = this.state;
    return (<div>
      <div className={styles.prompt}><Icon style={{color:'#FFCE00',width:20,marginRight:5}} type="exclamation-circle "/>当前业务未授权 Schema，请在业务生效前单击模块右上角「授权 Schema」按钮进行授权</div></div>
      
    );
  }
  //添加schema
  EditDetails(){
    let t=this,
      state=this.state,
      params = {url:API.OPEN_GET_SCHEMA,params:{BusinessID: state.BusinessID}};
    // console.log(params);
    get(params).then(function(res){
      if(res&&res.code===10000){
        t.setState({EditDetailsSch:res.data.SchemaList||[]});
      }else{
        message.warn((res&&res.message)||'系统出错，请联系管理员!');
      }
    }).catch=(err)=>{
      t.setState({loading:false});
    };
    t.setState({ visible: true});
  }

  detailsTitle(){
    const { dataList } = this.state;
    let disable=dataList.EditFlag?false:true;
    return (
      <div style={{marginTop:'10px',overflow:'hidden',borderLeft:'2px solid #328DFF'}}>
        <div className={styles.title_LY}>
          <span className={styles.title_lY} /><span>业务名称：{dataList.BusinessName}</span>
        </div>
      </div>
    );
  }
  //schema搜索

  renderRepairDetail() {
    const { dataList } = this.state;
    const detailsTitle =this.detailsTitle();
    let timeStart = new Date(dataList.StartTime),
      yearS = timeStart.getFullYear(),monthS=timeStart.getMonth()+1,dayS=timeStart.getDate();
    let timeEnd = new Date(dataList.EndTime),yearE = timeEnd.getFullYear(),monthE=timeEnd.getMonth()+1,dayE=timeEnd.getDate();
    return (<Card title={detailsTitle}>
      <Row gutter={16}>
        <Col span={8} className={styles.cardBox}>
          <div className={styles.boxDiv}>
            {/* <div>起止时间：</div> */}
            <label htmlFor="">起止时间:</label>
            <div>{yearS+'-'+(monthS>9?monthS:'0'+monthS)+'-'+(dayS>9?dayS:'0'+dayS)}~{yearE+'-'+(monthE>9?monthE:'0'+monthE)+'-'+(dayE>9?dayE:'0'+dayE)}</div>
          </div>
        </Col>
        <Col span={8} className={styles.cardBox}>
          <div className={styles.boxDiv}>
            {/* <div>业务类型：</div> */}
            <label htmlFor="">业务类型：</label>
            <div>{
              dataList.BusinessType===0?'金融数据':(dataList.BusinessType===1?'交通数据':
                (dataList.BusinessType===2?'政务数据':
                  (dataList.BusinessType===3?'医疗卫生':
                    (dataList.BusinessType===4?'人工智能':
                      (dataList.BusinessType===5?'电商营销':'应用开发'
                    
                      )
                    )
            
                  )
                )
              )
            }</div>
          </div>
        </Col>
        <Col span={8} className={styles.cardBox}>
          <div className={styles.boxDiv}>
            {/* <div>数据名称：</div> */}
            <label htmlFor="">数据名称：</label>
            <div>{dataList.BusinessName}</div>
          </div>
        </Col>
      
        <Col span={24} className={styles.cardBox}>
          <div className={styles.boxDiv}>
            {/* <div>数据描述：</div> */}
            <label htmlFor="">数据描述：</label>
            <div>{dataList.Description}</div>
          </div>
        </Col>
      </Row>
    </Card>);
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }
  //授权schema提交
  handleOk(e) {
    let t=this,
      state=this.state,
      params = {url:API.OPEN_AUTH_SCHEMA,data:{BusinessID: state.BusinessID , Supplier:state.Supplier,SchemaList:state.EditDetailsSch}};
    post(params).then(function(res){
      if(res&&res.code===10000){
        t.setState({visible:false});
        t.getMainTainDetail(state.BusinessID);
        
        

      }else{
        message.warn((res&&res.message)||'系统出错，请联系管理员!');
      }
    }).catch=(err)=>{
      t.setState({loading:false});
    };
  }
  //取消编辑人才
  handleCancel(e){
    this.setState({visible:false});
  }
  //检测手机号格式
  checkAccount(rule, value, callback) {
    var regex = /^((\+)?86|((\+)?86)?)0?1[3458]\d{9}$/; 
    if(!value||(value&&value.match(regex))){
      callback();
    }else{
      callback('请输入正确的手机号码！');
    }
  }
  grantonChange(id,value){
    let list =this.state.EditDetailsSch;
    list.map((item,index)=>{
      if(item.SchemaID===id){
        item.Selected = value?1:0; 
      }
      return item;
    });
    this.setState({schemaCheck:false,EditDetailsSch:list});
  }
  //全部选中Schema
  setAgeSort(){
    let list =this.state.EditDetailsSch;
    
    list.map((item,index)=>{
      item.Selected = 1; 
      return item;
    });
    this.setState({EditDetailsSch:list,schemaCheck:true});
  }

  SchemaList(){
    let columns = [], t = this;
    columns = [{
      title: '属性名称',
      dataIndex: 'SchemaName',
      width:'25%',
      key: 'SchemaName',
    }, {
      title: '属性类型',
      dataIndex: 'SchemaType',
      width:'25%',
      key: 'SchemaType',
    },{
      title: '描述',
      dataIndex: 'SchemaDescription',
      width:'25%',
      key: 'SchemaDescription',
    }, {
      title: '数据是否加密',
      dataIndex: 'Sensitive',
      width:'25%',
      key: 'Sensitive',
      render: (text, record) => {
        return <span>
          {record.Sensitive===0?<Icon type="close" style={{color:'red'}} />:<Icon type="check" style={{color:'#7EC856'}}/>}
        </span>;
      }
    }];
    return columns;
  }
  // 授权Schema列表
  grantSchemaList(){
    let columns = [], t = this;
    columns = [{
      title: '属性名称',
      dataIndex: 'SchemaName',
      width:'25%',
      key: 'SchemaName',
    }, {
      title: '属性类型',
      dataIndex: 'SchemaType',
      width:'25%',
      key: 'SchemaType',
    },{
      title: '描述',
      dataIndex: 'SchemaDescription',
      width:'25%',
      key: 'SchemaDescription',
    }, {
      title: '是否选用',
      dataIndex: 'Selected',
      width:'25%',
      key: 'Selected',
      render: (text, record) => {
        
        return <Switch 
          checkedChildren="是" 
          unCheckedChildren="否" 
          onChange={this.grantonChange.bind(this,record.SchemaID)}
          defaultChecked={record.Selected===1?true:false}
          checked={this.state.schemaCheck?this.state.schemaCheck:(record.Selected===1)}
        />;
      }
    }];
    return columns;
  }

  render() {
    const { dataList ,EditDetailsSch} = this.state;
    const schemaList = dataList.SchemaList;
    let columns = this.SchemaList();
    let grantcolumus=this.grantSchemaList();
    const { getFieldDecorator } = this.props.form;
    const { startValue, endValue, endOpen } = this.state;
    const Prompt = <span>当前状态不可进行授权操作</span>;
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
    let iCont = null,CCont=null;
    switch(dataList.SupplierStatus){
    case 0:
      iCont = <Badge status="error" />;
      break;
    case 1:
      iCont = <Badge status="processing" />;
      break;
    }
    switch(dataList.SupplierStatus){
    case 0:
      CCont = <Badge status="error" />;
      break;
    case 1:
      CCont = <Badge status="processing" />;
      break;
    }
    return (
      <div>
        <div >
          <span className={styles.header}>数据开放业务详情</span>
          <Link to={'/supply/business/'}>
            <Button icon="enter" className={styles.returnBtn}>返回</Button>
          </Link>
        </div>

        {
          this.renderCurrrentState()
        }
        <div>
          <div className={styles.content}>
            {this.renderRepairDetail()}
          </div>
        </div>
        
        <div className={styles.schema1}>
          <Card bordered={false} title={<div style={{overflow:'hidden',borderLeft:'2px solid #328DFF ',marginTop:'12px'}}><span className={styles.title_lY} /><span style={{fontSize:'20px'}}>Schema 列表</span>
            {
              dataList.EditFlag==1?
                <Button type="primary" onClick={this.EditDetails.bind(this)} style={{float:'right',marginRight:24}}>授权Schema</Button>: <Tooltip placement="top" title={Prompt}>
                  <Button disabled style={{float:'right',marginRight:24}}>授权Schema</Button></Tooltip>
            }
          </div>}>
            {/* {
              this.renderScheam()
            } */}
            {dataList.AuthFlag==0?this.renderScheam():null}
            <Page loading={this.state.loading} columns={columns} list={schemaList||[]} rowKey="id"/>
          </Card> 
        </div>
        {this.state.visible?<Modal
          title="授权Scheam" width='928px'
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          okText="提交"
          cancelText="取消"
          maskClosable={this.state.maskClosablestate}
        >
          <div className="table-operations" style={{marginBottom:23}}>
            <Button type="primary" style={{marginRight:10}} onClick={this.setAgeSort.bind(this)}>全部选用</Button>
            
          </div>
          <Page loading={this.state.loading} columns={grantcolumus} list={EditDetailsSch||[]} rowKey="id"/>
        </Modal>:null}
      </div>
    );
  }
}

export default Form.create()(DetailInfor);