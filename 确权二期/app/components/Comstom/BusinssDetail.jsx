
import React, { Component } from 'react';
import { Route, Link } from 'react-router';
import API from '@api';
import {post,get} from '@axios';
import styles from './comstom.module.less';
import {  Button, Modal, Icon,Alert, message,Input,Badge,Card,Row,Col,Form,Select,Upload,Switch,Table} from 'antd';
const FormItem = Form.Item;
import moment from 'moment';
import Page from '@common/PageTable';

// const monthFormat = 'YYYY-MM';
const Option = Select.Option;
const { TextArea } = Input;
class BusinessDetailInfor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      BusinessID: '',cSchema:false,
      dataList: [],userType:'',defaultFileList:[],schemaCheck:false,
      SchemaList:[],DataSetID:'',configList:'',
      red:{color:'red',display:'none'}, 
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
      params = {url:API.BUSINESS_DETAIL_QUERY,params:{BusinessID: id}};
    get(params).then(function(res){
      if(res&&res.code===10000){
        let configList = [],StoreFileName=[];
        StoreFileName=res.data.StoreConfigFilename?res.data.StoreConfigFilename.split(','):[];
        StoreFileName.map((item,index)=>{
          configList.push({
            uid: index,
            name: item,
            status: 'done',
          },);
        });
        t.setState({
          dataList:res.data||[],
          loading:false,
          DataSetID:res.data.DataSetID,
          BusinessID:res.data.BusinessID,
          defaultFileList:configList,
          configList:configList,
        });
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
        <div style={{padding:'16px',float:'left'}}>
          <span style={{marginRight: '20px'}} className={styles.fontStyleH}>供方: &nbsp;&nbsp;<span className={styles.fontStyle}>{dataList.Supplier}</span></span>
          <span style={{marginRight: '20px'}} className={styles.fontStyleH}>业务状态: &nbsp;&nbsp;<span className={styles.fontStyle}>{iCont}{
            dataList.Status===0?'未生效':(dataList.Status===1?'已生效':(dataList.Status===2?'已过期':'冻结'))
          }</span></span>
        </div>
      </div>
    );
  }
  //配置文件
  EditDetails(){
    let t=this;
    t.setState({ visible: true});
  }
  //新增配置
  handleOk(e) {
    e.preventDefault();
    let t = this;
    const {BusinessID,dataList,defaultFileList} = t.state;
    this.props.form.validateFields((err, values)=>{
      if (err) {
        console.log('请确认表单信息: ', values);
        return false;
      } else {
        if(values.avator.fileList == ''){
          this.setState({red:{color:'red',display:'inline'}});
        }else{
          let data = '',StoreConfigFilename=[];
          defaultFileList.map((item,index)=>{
            StoreConfigFilename.push(item.name);
          });
          // if(StoreConfigFilename[0].name==='kafka.conf' && name==='server.properties'){
             
          // }
          data = {
            BusinessID:BusinessID,
            BusinessName:dataList.BusinessName,
            StoreConfigFilename:StoreConfigFilename.join(),
            StoreType:values.userType,
          };
          let params = { url: API.CONFIRM_CONFIG ,data:data};
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
      }
    });
  }
  //取消配置
  handleCancel(e){
    const {configList} = this.state;
    this.setState({visible:false,cSchema:false,defaultFileList:configList,loading:false});
  }

  //获得可选用的Schema
  ChooseSchema(){
    let t =this;
    const {BusinessID,DataSetID} = t.state;
    let params = { url: API.SELECT_SCHEMA ,params:{BusinessID:BusinessID,DataSetID:DataSetID}};
    get(params).then(function (res) {
      if (res && res.code === 10000) {
        t.setState({loading: false, editType: '',SchemaList:res.data.SchemaList,BusinessID:res.data.BusinessID,DataSetID:res.data.DataSetID,cSchema:true,});
      } else {
        t.setState({ loading: false, editType: '' });
        message.warn(res.message || '系统出错，请联系管理员!');
      }
    }).catch = (err) => {
      t.setState({ loading: false, editType: '' });
      console.log('==error==', err);
    };
  }

  //全部选中Schema
  AllSchema(){
    let list =[...this.state.SchemaList];
    list.map((item,index)=>{
      item.Select = 1; 
      return item;
    });
    this.setState({schemaCheck:true,SchemaList:list});
  }

  //提取是否选用Schema;
  handleSchema(e) {
    let t = this;
    const {BusinessID,DataSetID,SchemaList} =t.state;
    if(SchemaList){
      let params = { url: API.CONFIRM_SCHEMA ,data:{BusinessID:BusinessID,DataSetID:DataSetID,SchemaList:SchemaList}};
      post(params).then(function (res) {
        if (res && res.code === 10000) {
          t.setState({loading: false, editType: '' ,visible:false,cSchema:false});
          message.success('操作成功');
          t.getMainTainDetail(BusinessID);
        } else {
          t.setState({ loading: false, editType: '' });
          message.warn('暂无数据可提交' || '系统出错，请联系管理员!');
        }
      }).catch = (err) => {
        t.setState({ loading: false, editType: '' });
        console.log('==error==', err);
      };
    }else{
      message.warn('暂无数据可提交');
    }
    

  }

  detailsTitle(){
    const { dataList } = this.state;
    let disable=dataList.EditFlag===0?true:false;
    return (
      <div style={{marginTop:'10px'}}>
        <div className={styles.title_L}>
          <span className={styles.title_l} /><span style={{fontSize:'20px'}}>业务名称：{dataList.BusinessName}</span>
        </div>
        <div className={styles.title_R}>
          <Button type="primary" onClick={this.EditDetails.bind(this)} disabled={disable} className={styles.allBtn}>配置文件管理</Button>
        </div>
      </div>
    );
  }
  SchemaTitle(){
    const { dataList } = this.state;
    let disable=dataList.EditFlag===0?true:false;
    return (
      <div>
        <div style={{marginTop:'10px'}}>
          <div className={styles.title_L}>
            <span className={styles.title_l} /><span style={{fontSize:'20px'}}>Schema 列表</span>
          </div>
          <div className={styles.title_R}>
            <Button type="primary" onClick={this.ChooseSchema.bind(this)} disabled={disable} className={styles.allBtn}>选用Schema</Button>
          </div>
        </div>
      </div>
    );
  }
  AllSchemaTitle(){
    const { SchemaList } = this.state;
    let disable=SchemaList==undefined?true:false;
    return (
      <div>
        <div style={{marginTop:'10px'}}>
          <div className={styles.title_L}>
            <Button type="primary" onClick={this.AllSchema.bind(this)} className={styles.allBtn} disabled={disable}>全部选用</Button>
          </div>
        </div>
      </div>
    );
  }
  renderRepairDetail() {
    const { dataList } = this.state;
    const detailsTitle =this.detailsTitle();
    let time=moment(dataList.StartTime).format('YYYY-MM-DD');
    let EndTime=moment(dataList.EndTime).format('YYYY-MM-DD');
    return (<Card title={detailsTitle}>
      {dataList.CustomerStatus===0?
        <Row gutter={16}>
          <Col span={23} className={styles.ConfigBox}>
            <span className={styles.ConfigF}><Alert type="warning" showIcon /></span>
            <div style={{marginLeft:'40px',display: 'inline-block',marginTop: '18px'}}>当前业务未上传配置文件，请在业务生效前点击模块右上角【配置文件管理】进行上传</div>
          </Col>
        </Row>:null}
      <Row gutter={16} style={{marginRight:'-4px'}}>
        <Col span={8} className={styles.CardBox}>
          <div className={styles.fontStyleH}>起止时间</div>
          <div className={styles.fontStyle}>{time}~{EndTime}</div>
        </Col>
        <Col span={7} className={styles.CardBox}>
          <div className={styles.fontStyleH}>业务类型</div>
          <div className={styles.fontStyle}>{dataList.BusinessType==='query'?'查询业务':'分析业务'}</div>
        </Col>
        <Col span={7} className={styles.CardBox}>
          <div className={styles.fontStyleH}>数据存储方式</div>
          <div className={styles.fontStyle}>{dataList.StoreType || ''}</div>
        </Col>
      </Row>
      <Row gutter={16} style={{marginRight:'-4px',marginLeft:'0'}}>
        <Col span={24}>
          <div  className={styles.CardBoxc}>
            <div className={styles.fontStyleH}>数据描述</div>
            <div className={styles.fontStyle}>{dataList.BusinessDescription}</div>
          </div>
        </Col>
      </Row>
    </Card>);
  }
  //用户类型更改
  userChange(value){
    this.setState({userType:value});
  }
  SchemaChange(id,value){
    let list =[...this.state.SchemaList];
    list.map((item,index)=>{
      if(item.SchemaID===id){
        item.Select = value?1:0; 
      }
      return item;
    });
    this.setState({schemaCheck:false,SchemaList:list});
  }
  SchemaListD(){
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
      title: '需方是否选用',
      dataIndex: 'Select',
      key: 'Select', 
      render: (text, record) => {
        return <span className={styles.iconStyle}>
          {this.state.cSchema?<Switch checkedChildren="是" unCheckedChildren="否" defaultChecked={record.Select===1?true:false} onChange={this.SchemaChange.bind(this,record.SchemaID)} checked={this.state.schemaCheck?this.state.schemaCheck:(record.Select===1)} />
            :(record.Select===0?<Icon type="close" />:<Icon type="check" style={{color:'#7EC856'}}/>)}
        </span>;
      }
    }];
    return columns;
  }

  ConfigChange = (info) => {
    this.setState({red:{color:'red',display:'none'}});
    let status = info.file.status,t=this;
    let PolicyUrl=[...this.state.defaultFileList];
    if (status === 'removed'||status==='error') {
      let curId = info.file.uid,curIndex=null;
      PolicyUrl.map((item,index)=>{
        if(item.uid === curId){
          curIndex = index;
        }
      });
      if(curIndex!==null){
        PolicyUrl.splice(curIndex,1);
      }
      t.setState({defaultFileList:PolicyUrl});
    }
    if (status === 'done' ||status === 'uploading') {
      this.setState({defaultFileList:info.fileList,loading:false});
      
    }
  }
  beforeUpload(file){
    let PolicyUrl=[...this.state.defaultFileList];
    const name=file.name;
    const isLt1M = file.size / 1024/1024 < 1;
    if(PolicyUrl.length>1){
      message.error('此类型文件仅支持上传2个文件');
      return false;
    }
    if (name!=='kafka.conf' && name!=='server.properties') {
      message.error('请上传对应名称文件');
      return false;
    }
    if (!isLt1M) {
      message.error('文件大小不能超过1MB!');
      this.setState({avatar:''});
      return false;
    }
  }
  queryUpload(file){
    const name=file.name;
    let PolicyUrl=[...this.state.defaultFileList];
    const isLt1M = file.size / 1024/1024 < 10;
    if(PolicyUrl.length>0){
      message.error('此类型文件仅支持上传1个文件');
      return false;
    }
    if (name!=='jdbc.conf') {
      message.error('请上传对应名称文件');
      return false;
    }
    if (!isLt1M) {
      message.error('文件大小不能超过1MB!');
      this.setState({avatar:''});
      return false;
    }
  }
  render() {
    const { dataList } = this.state;
    let sessionId = sessionStorage.getItem('localSession');
    const schemaList = dataList.SchemaList;
    let columns = this.SchemaListD();
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
          <Link to={'custom/business'}>
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
        <div className={styles.schema}>
          <Card bordered={false} title={this.SchemaTitle()}>
            <Page loading={this.state.loading} columns={columns} list={schemaList||[]} rowKey="SchemaID"/>
          </Card> 
        </div>
        {this.state.visible?<Modal
          title="配置文件管理" width='688px'
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          okText="提交"
          cancelText="取消"
          maskClosable={false}
          loading={this.state.loading}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="数据存储方式"
            >
              {getFieldDecorator('userType', {
                rules: [{type:'string', required: true, message: '请选择存储方式!' }],
                initialValue:dataList.StoreType ||'',
              })(
                <Select style={{ width: '100%'}} onChange={this.userChange.bind(this)} >
                  {dataList.BusinessType==='query'?<Option value="jdbc">jdbc</Option>:<Option value="kafka">kafka</Option>}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="配置文件信息"
              extra={dataList.BusinessType==='query'?<div>jdbc方式要求上传配置信息: jdbc.conf</div>:<div>kafka方式要求上传配置信息:kafka.conf,server.properties</div>}
            >
              <div className={styles.dropbox}>
                {getFieldDecorator('avator', {
                  rules: [{required: true ,message: '请上传配置文件!'}],
                })(
                  <Upload 
                    action={API.FILE_UP_LOAD+'?'+'SessionId='+sessionId+'&'+'BusinessName='+dataList.BusinessName}
                    beforeUpload={dataList.BusinessType==='query'?this.queryUpload.bind(this):this.beforeUpload.bind(this)}
                    name="file" 
                    onChange={this.ConfigChange.bind(this)}
                    fileList={this.state.defaultFileList || null}>
                    <Button>
                      <Icon type="file-add" /> 上传附件
                    </Button><br />
                    <span style={this.state.red}>请上传配置文件</span>
                  </Upload>
                  
                )}
              </div>
            </FormItem>
          </Form>
        </Modal>:null}
        {this.state.cSchema?<Modal
          title="选用Schema" width='928px'
          visible={this.state.cSchema}
          onOk={this.handleSchema.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          okText="提交"
          cancelText="取消"
          maskClosable={false}
        >
          <div className={styles.Chooseschema}>
            <Card bordered={false} title={this.AllSchemaTitle()}>
              <Table loading={this.state.loading} columns={columns} dataSource={this.state.SchemaList||[]} rowKey="SchemaID"/>
            </Card> 
          </div>
        </Modal>:null}
      </div>
    );
  }
}

export default Form.create()(BusinessDetailInfor);