
import React, { Component } from 'react';
import { Route, Link } from 'react-router';
import API from '@api';
import {post,get} from '@axios';
import img from '@static/images/icon.png';
import img2 from '@static/images/icon2.png';
import styles from './manage.module.less';
import { Steps, Popover, Button, Modal, Icon,DatePicker, message,Input,Badge,Card,Row,Col,Form ,Select,Divider} from 'antd';
const FormItem = Form.Item;
import moment from 'moment';
import Page from '@common/PageTable';

const Option = Select.Option;
// const monthFormat = 'YYYY-MM';
const { TextArea } = Input;
class DetailInfor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,startValue:'',endValue:'',
      BusinessID: null,type:'',endTime:'',
      dataList: [],userType:'',startTime:'',
    };
  }
  componentDidMount(){
    let iStr = window.location.hash;
    let name = null,strs='';
    strs=iStr.split('/').pop();
    if(strs){
      this.setState({BusinessID: strs});
      this.getMainTainDetail(strs);
    }
	
  }
  //获取详情
  getMainTainDetail(id) {
    let t=this,
      state=this.state,
      params = {url:API.GET_BUSINESS_DETAIL,params:{BusinessID: id}};
    t.setState({loading:true});
    get(params).then(function(res){
      if(res&&res.code===10000){
        t.setState({dataList:res.data||[],loading:false,startValue:res.data.StartTime,endValue:res.data.EndTime,BusinessID:res.data.BusinessID});
      }else{
        message.warn((res&&res.message)||'系统出错，请联系管理员!');
        t.setState({loading:false});
      }
    }).catch=(err)=>{
      t.setState({loading:false});
    };
  }
  //正文上半部分
  renderCurrrentState() {
    const { dataList } = this.state;
    const time = moment(dataList.CreateTime).format('YYYY-MM-DD');
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
      <div className={dataList.Status===3?styles.errorBorder:styles.bussnormal}>
        <div style={{padding:'16px 16px 16px 28px',float:'left'}}>
          <span style={{marginRight: '20px'}} className={styles.fontStyleH}> 业务状态: &nbsp;&nbsp;<span className={styles.fontStyle}>{iCont}{
            dataList.Status===0?'未生效':(dataList.Status===1?'已生效':(dataList.Status===2?'已过期':'冻结'))
          }</span></span>
        </div>
        <div>
          {dataList.Status===2?'':<a onClick={this.stateChange.bind(this,dataList.BusinessID,dataList.Status)} className={styles.listStatu}>{dataList.Status===3?'恢复':'冻结'}</a>}
        </div>
      </div>
    );
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
        t.getMainTainDetail(BusinessID);
      } else {
        t.setState({ loading: false, editType: '' });
        message.warn(res.message || '系统出错，请联系管理员!');
      }
    }).catch = (err) => {
      t.setState({ loading: false, editType: '' });
      console.log('==error==', err);
    };
  }
  //编辑详情
  EditDetails(){
    let t=this;
    t.setState({ visible: true});
  }

  detailsTitle(){
    const { dataList } = this.state;
    let disable=dataList.EditFlag===0?true:false;
    return (
      <div style={{marginTop:'10px'}}>
        <div className={styles.title_L}>
          <span className={styles.title_l} /><span style={{fontSize:'20px'}}>{dataList.BusinessName}</span>
        </div>
        <div className={styles.title_R}>
          <Button type="primary" onClick={this.EditDetails.bind(this)} disabled={disable} className={styles.allBtn}>编辑</Button>
        </div>
      </div>
    );
  }
  passChange(type){
    if(type==='password'){
      this.setState({type:'text'});
    }else{
      this.setState({type:'password'});
    }
  }
  renderRepairDetail() {
    const { dataList } = this.state;
    const detailsTitle =this.detailsTitle();
    let BusType = '';
    if(dataList.BusinessType==='query'){BusType='查询业务';}else{BusType='分析业务';}
    let time=moment(dataList.StartTime).format('YYYY-MM-DD');
    let EndTime=moment(dataList.EndTime).format('YYYY-MM-DD');
    return (<Card title={detailsTitle}>
      <Row gutter={16}>
        <Col span={8} style={{paddingLeft:'0'}}>
          <div className={styles.CardBox}>
            <div className={styles.fontStyleH}>起止时间</div>
            <div className={styles.fontStyle}>{time}~{EndTime}</div>
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.CardBox}>
            <div className={styles.fontStyleH}>业务类型</div>
            <div className={styles.fontStyle}>{BusType}</div>
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.CardBox}>
            <div className={styles.fontStyleH}>数据名称</div>
            <div className={styles.fontStyle}>{dataList.DataSetName}</div>
          </div>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}  style={{paddingLeft:'0'}}>
          <div className={styles.CardBox}>
            <div className={styles.fontStyleH}>数据描述</div>
            <div className={styles.fontStyle}>{dataList.BusinessDescription}</div>
          </div>
        </Col>
      </Row>
    </Card>);
  }
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }
  onStartChange = (date, dateString) => {
    this.onChange('startValue', date);
    this.setState({startTime:dateString});
  }

  onEndChange = (date,dateString) => {
    this.onChange('endValue', date);
    this.setState({endTime:dateString});
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }
  //新增用户提交
  handleOk(e) {
    e.preventDefault();
    let t = this;
    const {StartTime,EndTime,BusinessID,DataSetID}= t.state.dataList;
    this.props.form.validateFields((err, values)=>{
      if (err) {
        console.log('请确认表单信息: ', values);
        return false;
      } else {
        let Begintime = new Date(t.state.startTime).getTime() || StartTime;
        let Endtime = new Date(t.state.endTime).getTime() || EndTime;
        let  data={
          BusinessID:BusinessID,
          BusinessName:values.BusinessName,
          Supplier:values.Supplier,
          Customer:values.Customer,
          StartTime:Begintime,
          EndTime:Endtime,
          BusinessDescription:values.BusinessDescription,
          BusinessType:values.BusinessType==='查询业务'?'query':'analyse',
          DataSetID:DataSetID,
        };
        let params = { url: API.EDIT_BUSINESS ,data:data};
        post(params).then(function (res) {
          if (res && res.code === 10000) {
            t.setState({loading: false, editType: '' ,visible:false});
            message.success('操作成功');
            t.getMainTainDetail(BusinessID);
          } else {
            t.setState({ loading: false, editType: '' });
            message.warn(res.message || '系统出错，请联系管理员!');
          }
        }).catch = (err) => {
          t.setState({ loading: false, editType: '' });
          console.log('==error==', err);
        };
      }
    });
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
  SchemaList(){
    let columns = [], t = this;
    columns = [{
      title: '属性名称',
      dataIndex: 'SchemaName',
      key: 'SchemaName',
    }, {
      title: '属性类型',
      dataIndex: 'SchemaType',
      key: 'SchemaType',
    },{
      title: '描述',
      dataIndex: 'SchemaDescription',
      key: 'SchemaDescription',
    }, {
      title: '数据是否加密',
      dataIndex: 'Sensitive',
      key: 'Sensitive',
      render: (text, record) => {
        return <span className={styles.iconStyle}>
          {record.Sensitive===0?<Icon type="close" style={{color:'red'}} />:<Icon type="check" style={{color:'#7EC856'}}/>}
        </span>;
      }
    }, {
      title: '需方是否选用',
      dataIndex: 'Select',
      key: 'Select',
      render: (text, record) => {
        return <span className={styles.iconStyle}>
          {record.Select===0?<Icon type="close" style={{color:'red'}} />:<Icon type="check" style={{color:'#7EC856'}}/>}
        </span>;
      }
    }];
    return columns;
  }
  checkText=(rule,value,callback)=>{
    let reg = /^[a-zA-Z_\u4e00-\u9fa5]*$/;
    if(!reg.test(value)){
      callback('不能包含特殊字符或数字');
    }else{
      callback();
    }
  }

  render() {
    const { dataList } = this.state;
    const schemaList = dataList.SchemaList;
    let columns = this.SchemaList();
    const { getFieldDecorator } = this.props.form;
    const { startValue, endValue, endOpen } = this.state;
    let BusType = '';
    if(dataList.BusinessType==='query'){BusType='查询业务';}else{BusType='分析业务';}
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
          <Link to={'manage/business'}>
            <Button className={styles.returnBtn}><i className="iconfont icon-Menu-Back-copy" />返回</Button>
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
        <Row gutter={16}>
          <Col span={12}>
            <div  className={styles.supplierStyle}>
              <div className={styles.Lcon}>
                <h3>{dataList.Supplier}</h3>
                <span>{iCont}{dataList.SupplierStatus===0?'未上报Schema':'已上报Schema'}</span>
              </div>
              <div className={styles.Rcon}>
                <img src={img}/>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div  className={styles.supplierStyle}>
              <div className={styles.Lcon}>
                <h3>{dataList.Customer}</h3>
                <span>{iCont}{dataList.CustomerStatus===0?'未上报配置文件':'已上报配置文件'}</span>
              </div>
              <div className={styles.Rcon}>
                <img src={img2} />
              </div>
            </div>
          </Col>
        </Row>
        <div className={styles.schema}>
          <Card bordered={false} title={<div><span className={styles.title_l} /><span style={{fontSize:'20px'}}>Schema 列表</span></div>}>
            <Page loading={this.state.loading} columns={columns} list={schemaList||[]} rowKey="SchemaID"/>
          </Card> 
        </div>
        {this.state.visible?<Modal
          title="新增业务" width='688px'
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          okText="提交"
          cancelText="取消"
          maskClosable={false}
        >
          <Form>
            <FormItem {...formItemLayout} label="供方名称" >
              {getFieldDecorator('Supplier', {
                rules: [{ required: true, message: '请选择供方名称'},{
                  validator: this.validateNum,
                }],initialValue:dataList.Supplier
              })(
                <Select style={{ width: '100%'}} disabled>
                  <Option value={dataList.Supplier}>{dataList.Supplier}</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="需方名称" >
              {getFieldDecorator('Customer', {
                rules: [{ required: true, message: '请选择需方名称'},{
                  validator: this.validateNum,
                }],initialValue:dataList.Customer
              })(
                <Select style={{ width: '100%'}} disabled>
                  <Option value={dataList.Customer}>{dataList.Customer}</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              label={<span><span style={{color:'#f5222d',marginRight: '4px',fontSize:'14px'}}>*</span>起止时间</span>}
              {...formItemLayout}
              className={styles.datePick}
            >
              <Col span={11}>
                <FormItem>
                  {getFieldDecorator('time', {
                    rules: [{ required: true, message: '请选择时间'}],
                    initialValue:moment(startValue)
                  })(
                    <DatePicker
                      disabledDate={this.disabledStartDate}
                      showToday={false}
                      format="YYYY-MM-DD"
                      // defaultValue={moment(startValue)}
                      placeholder="开始时间"
                      onChange={this.onStartChange}
                      onOpenChange={this.handleStartOpenChange}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={2}>
                <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                  -
                </span>
              </Col>
              <Col span={11}>
                <FormItem>
                  {getFieldDecorator('time1', {
                    rules: [{ required: true, message: '请选择时间'}],
                    initialValue:moment(endValue)
                  })(
                    <DatePicker
                      disabledDate={this.disabledEndDate}
                      showToday={false}
                      format="YYYY-MM-DD"
                      // defaultValue={moment(endValue)}
                      placeholder="结束时间"
                      onChange={this.onEndChange}
                      open={endOpen}
                      onOpenChange={this.handleEndOpenChange}
                    />
                  )}
                </FormItem>
              </Col>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="业务名称"
            >
              {getFieldDecorator('BusinessName', {
                rules: [{type:'string', required: true, message: '请输入业务名称!' },{
                  validator:this.checkText,
                }],
                initialValue:dataList.BusinessName
              })(
                <Input placeholder="请输入业务名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="业务类型"
            >
              {getFieldDecorator('BusinessType', {
                rules: [{ required: true, message: '请选择业务类型!' },{
                  validator:this.checkText,
                }],
                initialValue:BusType
              })(
                <Input disabled/>
              )}
            </FormItem>
            <Divider dashed />
            <FormItem
              {...formItemLayout}
              label="数据名称"
            >
              {getFieldDecorator('dataSetName', {
                rules: [{ message: '请输入数据名称!' },{
                  validator:this.checkText,
                }],
                initialValue:dataList.DataSetName
              })(
                <Input disabled/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="数据描述"
            >
              {getFieldDecorator('BusinessDescription', {
                rules: [{ message: '请输入数据描述!' },{
                  validator: this.validateNum,
                }],
                initialValue:dataList.BusinessDescription
              })(
                <TextArea autosize={{ minRows: 5, maxRows: 5 }} placeholder="请输入数据描述" />
              )}
            </FormItem>
          </Form>
        </Modal>:null}
      </div>
    );
  }
}

export default Form.create()(DetailInfor);