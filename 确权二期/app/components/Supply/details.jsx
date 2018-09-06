/**
 * Created by author on 2017/4/25.
 */
import React, { Component } from 'react';
import { Row, Col, Card, Tabs, Icon, Form, Button ,Input,message,DatePicker, Modal, Select,Cascader, Upload, Tooltip} from 'antd';
import moment from 'moment';
import styles from './ConStyle.less';
import TabComp from '../../common/modules/PageTable';
import Schema from '../Schema/Schema.jsx';
import {post,get} from '@axios';
import API from '@api';
import { Route, Link } from 'react-router';

import { residences, resData } from './const';

const TextArea = Input.TextArea;
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;



class BasicInfor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      visibleSchema:false,
      loading: false,
      UserName: null,
      DataSetName:null,
      DataType:null,
      DataSize:null,
      StoreType:null,
      Description:'',
      type:'',
      dataList: resData,
      schema:[],
      userType:'',
      DataSetID:'',
      addNewSchema:[],
      UserIndentifyFile:'',
      StoreConfigFilename:'' ,
      defaultFileList:[] ,
      defaultFileList1:[],
      maskClosablestate:false,
      WhetherEdit:null,
    };
  }
  componentDidMount(){
    let iStr = window.location.hash;
    let name = null,strs='';
    strs=iStr.split('/').pop();
    if(strs){
      
      this.setState({DataSetID:strs});
      this.loadInfor(strs);
    }
    
  }

  
  //获取详情
  loadInfor(strs){
    let DataTypeArray=[];
    let t=this,
      state=this.state,
      params = {url:API.GET_DATA_SOURCE_DETAIL,params:{DataSetID: strs}};
    t.setState({loading:true});
    get(params).then(function(res){
      console.log(res);
      let configList = [],configList1=[];
      if(res&&res.code===10000){
        if(res.data.StoreConfigFilename){
          let splitconfig=res.data.StoreConfigFilename.split(',');
          
          splitconfig.map((item,index)=>{
            configList.push({
              uid: index,
              name: item,
              status: 'done',
            },);
          });
        }
        if(res.data.UserIndentifyFile){
          let splitconfig1=res.data.UserIndentifyFile.split(',');
          splitconfig1.map((item,index)=>{
            configList1.push({
              uid: index,
              name: item,
              status: 'done',
            },);
          });
        }
        DataTypeArray.push(res.data.DataType);
        DataTypeArray.push(res.data.DataSubType);
        console.log(DataTypeArray);
        // console.log(res.data.SchemaList, 'RES');
        // SchemaID
        t.setState({dataList:res.data||[],
          schema:res.data.SchemaList||[],
          addNewSchema:res.data.SchemaList||[],
          DataSetName:res.data.DataSetName,
          defaultFileList:configList,
          defaultFileList1:configList1,
          DataType:DataTypeArray,

          loading:false,userType:res.data.UserType});
      }else{
        message.warn((res&&res.message)||'系统出错，请联系管理员!');
      }
    }).catch=(err)=>{
      t.setState({loading:false});
    };
  }
  //配置文件
  beforeUpload(file){
    const istext = file.type === 'text/xml';
    const isname = file.name === 'core-site.xml'||file.name==='hdfs-site.xml'|| file.name==='hdfs.conf';
    const isLt1M = file.size / 1024/1024 < 1;
    if (!isname) {
      message.error('请上传core-site.xml/hdfs-site.xml/hdfs.conf');
      return false;
    }
    if (!isLt1M) {
      message.error('文件大小不能超过1MB!');
      return false;
    }
  }
  handleChange  (info)  {
    let status = info.file.status,t=this;
    let SaveList=[];
    let PolicyUrl=[...t.state.defaultFileList];
    if (status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
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
    if (status === 'done') {
      let url = info.file.response;
      let urll={uid:info.file.uid,name:info.file.name};
      PolicyUrl.push(urll);
      // console.log(PolicyUrl);
      this.setState({defaultFileList:PolicyUrl,loading:false});
    }
  }
 

  ////Identify 文件
  handleChange1  (info)  {
    console.log(info.file);
    let status = info.file.status,t=this;
    let PolicyUrl=[...this.state.defaultFileList1];
    if (status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
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
      t.setState({defaultFileList1:PolicyUrl});
    }
    if (status === 'done') {
      let url = info.file.response;
      let urll={uid:info.file.uid,name:info.file.name};
      PolicyUrl.push(urll);
      console.log(PolicyUrl);
      this.setState({defaultFileList1:PolicyUrl,loading:false});
    }
  }

  beforeUpload1(file){
    const name=file.name;
    let subname=name.substr(name.length-5,5);
    // const istext = file.type === 'text/xml';
    const isLt1M = file.size / 1024/1024 < 1;
    if (name!=='identify.file') {
      message.error('请上传identify.file文件');
      return false;
    }
    if (!isLt1M) {
      message.error('文件大小不能超过1MB!');
      this.setState({defaultFileList1:''});
      return false;
    }
  }


  //批量上传
  chuanSchema(info){
    const t=this;
    console.log(info);
    t.setState({addNewSchema:info});
  }
  //批量上传前
  beforeUpload2(){
    // console.log(222);
  }
  //删除schema 
  delSchema(rowData) {
    const t=this;
    console.log('ajax', rowData);
    t.setState({
      addNewSchema:rowData
    });
  }

  //保存/编辑数据schema
  getData(rowData,WhetherEdit) {
    console.log(WhetherEdit);
    const t=this;
    let editYu=t.state.schema;
    editYu.push(rowData);
    var r = [];
    // console.log('ajax', rowData);
    function unique5(array){ 
       
      for(var i = 0, l = array.length; i < l; i++) { 
        for(var j = i + 1; j < l; j++) 
          if (array[i].key === array[j].key) j = ++i; 
        r.push(array[i]); 
      } 
      return r; 
    }
    // t.state.addNewSchema.push(rowData);
    unique5(editYu);
    // console.log(r);
    t.setState({
      addNewSchema:r
    });

  }

  loadColumn() {
    let columns = [], t = this;
    columns = [{
      title: '属性名称',
      dataIndex: 'SchemaName',
      width:'25%',
      key: 'SchemaName',
    }, {
      title: '类型',
      dataIndex: 'SchemaType',
      width:'25%',
      key: 'SchemaType',
    },  {
      title: '描述',
      dataIndex: 'SchemaDescription',
      width:'25%',
      key: 'SchemaDescription',
    },{
      title: '数据是否加密',
      dataIndex: 'Sensitive',
      width:'25%',
      align:'left',
      key: 'Sensitive',
      render: (text, record) => {
        return <span style={{display:'inline-block'}}>
          {record.Sensitive===0?<Icon type="close" style={{color:'red',fontWeight:'bold'}} />:<Icon type="check" style={{color:'#7EC856',fontWeight:'bold'}}/>}
        </span>;
      }
      // render: (text, record) => {
      //   return <span>
      //     <Link to={'/supply/details/'+record.UserName}>详情</Link>
      //   </span>;
      // }
    }];
    return columns;
  }
  addData(){

  }
  swatch(val){
    
  }

  checkText=(rule,value,callback)=>{
    let reg = /^[a-zA-Z_\u4e00-\u9fa5]*$/;
    if(!reg.test(value)){
      callback('不能包含特殊字符或数字');
    }else{
      callback();
    }
  }
  datasizenum=(rule,value,callback)=>{
    let reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if(!reg.test(value)){
      callback('请输入数字');
    }else{
      callback();
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  EditDetails = () => {
    this.setState({
      visibleSchema: true,
    });
  }
  //编辑Schema
  handleOkSchema=(e)=>{
    e.preventDefault();
    let t=this,datasize='';
    let iObj = {};
    let {addNewSchema,schema}=t.state;
    iObj = {
      DataSetID:t.state.DataSetID,
      SchemaList:addNewSchema
    };
    // if(addNewSchema.length===0 && schema.length===0){
    //   iObj = {
    //     DataSetID:t.state.DataSetID,
    //     SchemaList:addNewSchema
    //   };
    // }else if(addNewSchema.length!==0){
    //   iObj = {
    //     DataSetID:t.state.DataSetID,
    //     SchemaList:addNewSchema
    //   };
    // }else{
    //   iObj = {
    //     DataSetID:t.state.DataSetID,
    //     SchemaList:addNewSchema
    //   };
    // }
    console.log(iObj);
    // let iObj = {
    //   DataSetID:t.state.DataSetID,
    //   SchemaList:addNewSchema
    // } ; 
    // console.log(iObj) ;     
    let params = { url: API.EDIT_SOURCE_SCHEMA ,data:iObj};
    post(params).then(function (res) {
      if (res && res.code === 10000) {
        t.setState({dataList:res.data||[],
          schema:res.data.SchemaList||[],
          visibleSchema: false,
      
          loading:false,userType:res.data.UserType});
        t.loadInfor(t.state.DataSetID);
      } else {
        t.setState({ loading: false, editType: '' });
        message.warn(res.message || '系统出错，请联系管理员!');
      }
    }).catch = (err) => {
      t.setState({ loading: false, editType: '' });
      // console.log('==error==', err);
    };
    
  }
  handleCancelSchema = (e) => {
    this.setState({
      visibleSchema: false,
    });
  }

  //编辑基本信息
  handleOk = (e) => {
    e.preventDefault();
    let t = this,datasize='';
    const {defaultFileList,defaultFileList1} = t.state;
    this.props.form.validateFields((err, values)=>{
      t.setState({DataSetName:values.DataSetName});
      console.log(values.DataType);
      datasize=values.DataSize+values.prefix;
      console.log(datasize);
      // console.log(datasize);
      if (err) {
        // console.log('请确认表单信息: ', values);
        return false;
      } else {
        if(values.avatar.fileList==''){
          this.setState({red:{color:'red',display:'inline'}});
        }else if(values.avatar1.fileList==''){
          this.setState({red:{color:'red',display:'inline'}});
        }
        else{
          let StoreConfigFilename=[],UserIndentifyFile=[];
          defaultFileList.map((item,index)=>{
            StoreConfigFilename.push(item.name);
          });
          defaultFileList1.map((item,index)=>{
            UserIndentifyFile.push(item.name);
          });
          let data={
            DataSetID:t.state.DataSetID,
            DataSetName:values.DataSetName,
            DataType:values.DataType[0],
            DataSubType:values.DataType[1],
            DataSize:datasize,
            Description:values.Description,
            StoreType:values.StoreType,
            StoreConfigFilename:StoreConfigFilename.join(),
            UserIndentifyFile:UserIndentifyFile.join()
          };
          console.log(data);
          let params = { url: API.EDIT_DATA_SOURCE_INFO ,data:data};
          post(params).then(function (res) {
            if (res && res.code === 10000) {
              t.setState({dataList:res.data||[],
                schema:res.data.SchemaList||[],
                visible: false,
      
                loading:false,userType:res.data.UserType});
            } else {
              t.setState({ loading: false, editType: '' });
              message.warn(res.message || '系统出错，请联系管理员!');
            }
          }).catch = (err) => {
            t.setState({ loading: false, editType: '' });
            // console.log('==error==', err);
          };
        }
      }
    });
  }
  handleCancel = (e) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  }


  renderSearchData() {
    const { dataList} = this.state;
    const Prompt = <span>关联业务已生效，当前不可进行编辑操作</span>;
    return (
      <div style={{marginBottom:'20px'}}>
        <Card 
          title={
            <h2 
              className={styles.titleData}>
              <span className={styles.dataname}>数据名称：{dataList.DataSetName}</span>
              {dataList.EditFlag!==0?<Button className={styles.editdata} type="primary" onClick={this.showModal}>编辑</Button>:<Tooltip placement="top" title={Prompt}>
                <Button disabled className={styles.editdata}>编辑</Button></Tooltip>}
            </h2>
          } 
          bordered={false}
        >                            
          <Row type="flex" gutter={16}>
            <Col span={8} className={styles.cardBox}>
              <div className={styles.boxDiv}>
                <label htmlFor="">数据分类:</label>
                <div>
                  {
                    dataList.DataType==='FinanceDataSets'?'金融数据':(dataList.DataType==='TrafficDataSets'?'交通数据':
                      (dataList.DataType==='GovernmentDataSets'?'政务数据':
                        (dataList.DataType==='MedicalDataSets'?'医疗卫生':
                          (dataList.DataType==='AIDataSets'?'人工智能':
                            (dataList.DataType==='ElectronicBusinessDataSets'?'电商营销':'应用开发'
                              
                            )
                          )
                      
                        )
                      )
                    )
                  }
                </div>
              </div>
            </Col>
            <Col span={8} className={styles.cardBox}>                                         
              <div className={styles.boxDiv}>
                <label htmlFor="">数据规模:</label>
                <div>{dataList.DataSize}</div>
              </div>
            </Col>
            <Col span={8} className={styles.cardBox}>                                        
              <div className={styles.boxDiv}>
                <label htmlFor="">数据储存方式:</label>
                <div>{dataList.StoreType}</div>  
              </div>                                     
            </Col>
            <Col span={24} className={styles.cardBox}>                                        
              <div className={styles.boxDiv}>
                <label htmlFor="">数据简述:</label>
                <div>{dataList.Description}</div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>        
    );
  }


  renderSchemaList() {
    const t = this;
    const { dataList} = this.state;
    let columns = t.loadColumn();
    const Prompt = <span>关联业务已生效，当前不可进行编辑操作</span>;
    
    return (
      <div>
        <div style={{background:'#fff',padding:'24px 24px 0px 0px',overflow:'hidden',borderTopLeftRadius:'10px',borderTopRightRadius:10}}>
          <p className={styles.Schema}>
            Schema列表
          </p>
          {dataList.EditFlag!==0?<Button onClick={this.EditDetails.bind(this)} type="primary" className={styles.editScheam} >编辑</Button>:<Tooltip placement="top" title={Prompt}>
            <Button disabled className={styles.editScheam}>编辑</Button></Tooltip>}
                
        </div>
        <div style={{background:'#fff',padding:'0px 24px',borderBottomLeftRadius:10,borderBottomRightRadius:10,paddingBottom:10}}>
          <TabComp loading={this.state.loading} columns={columns} list={this.state.schema || []} rowKey="id" loadList={this.loadData} />
        </div>
      </div>
    );
  }

  renderBaseInfoModal() {
    const {dataList} = this.state;
    if(typeof(dataList.DataSize) == 'number'){
      dataList.DataSize=dataList.DataSize+'';
    }else if(typeof(dataList.DataSize) == 'undefined'){
      dataList.DataSize='';
    }
    let sizenum='',sizeCompany='';
    if(dataList.DataSize.substr(dataList.DataSize.length-2,dataList.DataSize.length-1)!=='KB'&& dataList.DataSize.substr(dataList.DataSize.length-2,dataList.DataSize.length-1)!=='MB'&&dataList.DataSize.substr(dataList.DataSize.length-2,dataList.DataSize.length-1)!=='GB'&& dataList.DataSize.substr(dataList.DataSize.length-2,dataList.DataSize.length-1)!=='TB'){
      sizenum=dataList.DataSize;
      sizeCompany='KB';
    }else{
      sizenum=dataList.DataSize.substr(0,dataList.DataSize.length-2);sizeCompany=dataList.DataSize.substr(dataList.DataSize.length-2,dataList.DataSize.length-1);
    }
    console.log(dataList.DataSize);
    const { getFieldDecorator } = this.props.form;
    let DataSetName=dataList.DataSetName||'',
      DataType=this.state.DataType||'',
      DataSize=dataList.DataSize||'',
      StoreType=dataList.StoreType||'',
      Description=dataList.Description||'',
      url=this.props.avator||'',
      urlIdentify='';

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: sizeCompany,
    })(
      <Select style={{ width: 70 }}>
        <Option value="KB">KB</Option>
        <Option value="MB">MB</Option>
        <Option value="GB">GB</Option>
        <Option value="TB">TB</Option>
      </Select>
    );
    let sessionId = sessionStorage.getItem('localSession');

    return (
      <div>
        <Modal
          title="编辑数据基本信息"
          width='688px'
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          className={styles.modaldata}
          maskClosable={this.state.maskClosablestate}
        >
          <Form>
            <FormItem {...formItemLayout}  label="数据名称">
              {getFieldDecorator('DataSetName', {
                rules: [
                  {required: true,message: '请输入数据名称'},
                  {validator:this.checkText}
                ],
                initialValue:DataSetName
              })(<Input placeholder="请输入数据名称,2-20个中英文字符" />)}
            </FormItem>
            <FormItem {...formItemLayout}  label="数据分类">
              {getFieldDecorator('DataType', {
                rules: [
                  { required: true,message: '请选择数据分类' }
                ],
                initialValue:DataType
              })(<Cascader options={residences} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="数据规模"
            >
              {getFieldDecorator('DataSize', {
                rules: [{ required: true, message: '请输入数据规模!' },{validator:this.datasizenum}],
                initialValue:sizenum
              })(
                <Input addonAfter={prefixSelector} style={{ width: '100%' }} />
              )}
            </FormItem>

            <FormItem
              label="数据储存方式"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              {getFieldDecorator('StoreType', {
                rules: [{ required: true, message: '请选择路径!' }],
                initialValue:StoreType
              })(
                <Select
                  placeholder="请选择路径"
                  onChange={this.handleSelectChange}
                >
                  <Option value="hdfs">hdfs</Option>
                </Select>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="配置信息文件"
              extra={<div>hdfs方式要求上传配置信息：<br/>core-site.xml/hdfs-site.xml/hdfs.conf</div>}
            >
              <div className={styles.dropbox}>
                {getFieldDecorator('avatar', {
                  rules: [{ required: true, message: '请上传配置信息文件!' }],
                  // valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,
                  initialValue:this.state.defaultFileList || null
                })(
                  <Upload name="file" 
                    onChange={this.handleChange.bind(this)}
                    defaultFileList={this.state.defaultFileList || null}
                    beforeUpload={this.beforeUpload}
                    action={API.FILE_UPLOAD+'?'+'SessionId='+sessionId}
                  >
                    <Button>
                      <Icon type="file-add" /> 上传附件
                    </Button>
                  </Upload>
                )}
              </div>
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Identify 文件："
              extra={<div>要求上传文件：identify.file</div>}
            >
              <div className={styles.dropbox}>
                {getFieldDecorator('avatar1', {
                  rules: [{ required: true, message: '请上传Identify文件!' }],
                  // valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,
                  initialValue:this.state.defaultFileList1 || null
                })(
                  <Upload 
                    action={API.FILE_UPLOAD+'?'+'SessionId='+sessionId}
                    name="file" 
                    onChange={this.handleChange1.bind(this)}
                    beforeUpload={this.beforeUpload1}
                    defaultFileList={this.state.defaultFileList1 || null}>
                    <Button>
                      <Icon type="file-add" /> 上传附件
                    </Button>
                  </Upload>
                )}
              </div>
            </FormItem>


            <FormItem {...formItemLayout}  label="政策摘要">
              {getFieldDecorator('Description', {
                
                initialValue:Description
              })(<TextArea placeholder="请输入政策摘要（内容50字以内）" maxLength="50" autosize={{ minRows: 3, maxRows: 3}} />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }


  renderSchemaModal() {
    const t = this;
    let columns = t.loadColumn();
    return (
      <div>
        <Modal
          title="授权Scheam" width='928px'
          visible={this.state.visibleSchema}
          onOk={this.handleOkSchema.bind(this)}
          onCancel={this.handleCancelSchema.bind(this)}
          cancelText="取消"
          maskClosable={this.state.maskClosablestate}
        >
          
          <Schema
            getData={(rowData,WhetherEdit) => this.getData(rowData,WhetherEdit)} 
            schData={this.state.schema} 
            DataSetName={this.state.DataSetName}
            swatch={(val)=>this.swatch(val)}
            DataSetID={this.state.DataSetID}
            delSchema={(rowData)=>this.delSchema(rowData)} 
            chuanSchema={(info)=>this.chuanSchema(info)}
          />
        </Modal>
      </div>
    );
  }


    
  render() {
    const {basicObj,editObj,previewVisible, previewImage, fileList, dataList} = this.state;
    let t=this;
    let columns = t.loadColumn();
    const dateFormat = 'YYYY-MM-DD';
    let iContact = basicObj&&basicObj.contacts&&basicObj.contacts.length?basicObj.contacts:[{name:'',telephone:''},{name:'',telephone:''}];

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    
    return (
      <div className="gutter-example button-demo">  
        <div style={{marginBottom:28}}>
          <span className={styles.header}>数据资源详情</span>
          <Link to={'/supply/resource/'}>
            <Button icon="enter" className={styles.returnBtn}>返回</Button>
          </Link>
        </div>
        <Row gutter={16}>
          <Col className="gutter-row" md={24}>
            <div className={styles.content}>
              {
                this.renderSearchData()
              }
              <Row gutter={16} >
                <Col span={24} >
                  {
                    this.renderSchemaList()
                  }
                </Col>
              </Row>        
            </div>
          </Col>
        </Row>
        {
          this.renderBaseInfoModal()
        }
        {
          this.renderSchemaModal()
        }
      </div>
    );
  }
}

export default Form.create()(BasicInfor);