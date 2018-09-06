/**
 * authored on 2017/4/15.
 */
import React, { Component } from 'react';
import { Route, Link,hashHistory } from 'react-router';
import Schema from '../Schema/Schema.jsx';
import styles from './ConStyle.less';
import {
  Row,
  Col,Upload,
  DatePicker,
  TimePicker,
  Select,
  message,
  InputNumber,
  Table,
  Form,
  Modal,
  Icon,
  Input,
  Button,
  Checkbox,
  Cascader
} from 'antd';
import PropTypes from 'prop-types';
import TabComp from '@common/PageTable';
import API from '@api';
import {post,get} from '@axios';


import residences2, { columns, dataList ,residences} from './const';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const { TextArea } = Input;


class EditPerson extends Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.state = {
      loading: false,style:{color:'#f00',display:'none'},
      avatar:[{
        uid: -1,
        name: 'logo',
        status: 'done',
        url: this.props.avator,
      }],
      avatar1:[{
        uid: -1,
        name: 'logo',
        status: 'done',
        url: this.props.avator,
      }],
      previewVisible: false,
      previewImage: '',
      fileList: [
      ],
      url:null,
      urlIdentify:null,
      addNewSchema:[],
      schema:[],
      defaultFileList:[] ,
      defaultFileList1:[],

      schemaTabList: dataList || [],
      judgefile:[],
    };
  }
  // checkText(rule,value,callback){
  //   let regEn = /[`~!@#$%^&*()_+<>?:"{},./;'[\]]/im,
  //     regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

  //   if(regEn.test(value) || regCn.test(value)) {
  //     callback('不能包含特殊字符.');
  //   }else{
  //     callback();
  //   }
  // }
  normFile  (e)  {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
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
    let PolicyUrl=t.state.defaultFileList;
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
      let judgefilebefore=[];
      judgefilebefore.push(info.file.name);
      PolicyUrl.push(urll);
      console.log(PolicyUrl);
      this.setState({defaultFileList:PolicyUrl,loading:false});
    }
  }
  //Identify 文件


  handleChange1  (info)  {
    let status = info.file.status,t=this;
    let SaveList=[];
    let PolicyUrl=t.state.defaultFileList1;
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
      console.log(info);
      PolicyUrl.push(urll);
      console.log(PolicyUrl);
      this.setState({defaultFileList1:PolicyUrl,loading:false,});
    }
  }
  beforeUpload1(file){
    console.log(file);
    const name=file.name;
    let subname=name.substr(name.length-5,5);
    const istext = file.type === 'text/xml';
    const isLt1M = file.size / 1024/1024 < 10;
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
  nameSwatch(val){
    this.loadData(val);
  }


  submit(e){
    e.preventDefault();
    let t=this,datasize='';
    
    let {addNewSchema,defaultFileList,defaultFileList1}=t.state;
    console.log(addNewSchema);
    this.props.form.validateFields((err, values) => {
      datasize=values.DataSize+values.prefix;
      console.log(datasize);
      if (err) {
        console.log('请确认表单信息: ', values);
        return false;
      }else{
        t.setState({loading:true});
        let StoreConfigFilename=[],UserIndentifyFile=[];
        defaultFileList.map((item,index)=>{
          StoreConfigFilename.push(item.name);
        });
        defaultFileList1.map((item,index)=>{
          UserIndentifyFile.push(item.name);
        });
        console.log(addNewSchema=='');
        if(addNewSchema==''){
          message.error('请添加schema数据!');
          t.setState({
            loading: false
          });
          return false;
        }
        let iObj = {
          DataSetID:t.state.DataSetID,
          DataSetName:values.DataSetName,
          DataType:values.DataType[0],
          DataSubType:values.DataType[1],
          DataSize:datasize,
          Description:values.Description,
          StoreType:values.StoreType,
          StoreConfigFilename:StoreConfigFilename.join(),
          UserIndentifyFile:UserIndentifyFile.join(),
          SchemaList:addNewSchema
        } ; 
        console.log(iObj) ;     
        let params = { url: API.ADD_DATA_SOURCE ,data:iObj};
        post(params).then(function (res) {
          if (res && res.code === 10000) {
            message.warn('数据添加成功!');
            t.setState({dataList:res.data||[],
              schema:res.data.SchemaList||[],
    
              loading:false,userType:res.data.UserType});
            hashHistory.push('/supply/resource');
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
  cancel(){
    this.props.cancel();
  }

  getData(rowData) {
    const t=this;
    let {addNewSchema}=this.state;
    // console.log(addNewSchema);
    // addNewSchema.map((item,index)=>{
    //   console.log(item.SchemaName);
    //   if(item.SchemaName === rowData.SchemaName){
    //     Modal.warning({title:'提示',content:'属性名称不可以重复'});
    //     return false;
    //   }
    // });
    var r = [];
    console.log('ajax', rowData);
    function unique5(array){ 
       
      for(var i = 0, l = array.length; i < l; i++) { 
        for(var j = i + 1; j < l; j++) 
          if (array[i].key === array[j].key) j = ++i; 
        r.push(array[i]); 
      } 
      return r; 
    }
    t.state.addNewSchema.push(rowData);
    unique5(t.state.addNewSchema);
    console.log(r);
    t.setState({
      addNewSchema:r
    });

  }
  //批量上传
  chuanSchema(info){
    const t=this;
    console.log(info);
    t.setState({addNewSchema:info});
  }
  //删除schema 
  delSchema(rowData) {
    const t=this;
    console.log('ajax', rowData);
    t.setState({
      addNewSchema:rowData
    });
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

  renderBaseInfoMation() {
    const { getFieldDecorator } = this.props.form;
    let DataSetName='',
      DataType='',
      DataSize='',
      StoreType='',
      Description='',
      url='',
      urlIdentify='';
    
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: 'KB',
    })(
      <Select style={{ width: 70 }}>
        <Option value="KB">KB</Option>
        <Option value="MB">MB</Option>
        <Option value="GB">GB</Option>
        <Option value="TB">TB</Option>
      </Select>
    );

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

    let sessionId = sessionStorage.getItem('localSession');

    return ( 
      <div>
        <div style={{background:'#fff',paddingBottom:28,marginBottom:24,borderBottomLeftRadius:10,borderBottomRightRadius:10,paddingLeft:80}}>
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
            })(<Cascader options={residences} placeholder	='请选择分类'/>)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="数据规模"
          >
            {getFieldDecorator('DataSize', {
              rules: [{ required: true, message: '请输入数据规模!' },{validator:this.datasizenum}],
              initialValue:DataSize
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
                <Upload 
                  action={API.FILE_UPLOAD+'?'+'SessionId='+sessionId}
                  name="file" 
                  onChange={this.handleChange.bind(this)}
                  beforeUpload={this.beforeUpload}
                  defaultFileList={this.state.defaultFileList || null}>
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
              rules: [
                {validator:this.checkText}
              ],
              initialValue:Description
            })(<TextArea placeholder="请输入政策摘要（内容50字以内）" maxLength="50" autosize={{ minRows: 3, maxRows: 3}} />)}
          </FormItem>
        </div>
      </div>
    );
  }

  isEditing(record) {
    return record.key === this.state.editingKey || 'a';
  }

  addNewSchData() {

    const { schemaTabList } = this.state;
    schemaTabList.push(
      {
        DataSetName: 1,
        DataType: 2,
        DataSize: 'abcd',
        isKey: 3,
        key: `${Math.random().toString()}`
      }
    );
    this.setState({
      schemaTabList
    });
  }
  renderbefore(){
    return (
      <div style={{marginBottom:28}}>
        <span className={styles.header}>新增数据资源</span>
        <Link to={'/supply/resource/'}>
          <Button icon="rollback" className={styles.returnBtn}>返回</Button>
        </Link>
      </div>
    );
  }

  renderSchemaList() {
    const t = this;
    return (
      <div style={{background:'#fff',padding:'28px 24px 0px 24px',borderTopLeftRadius:10,borderTopRightRadius:10}} className={styles.selectClass}>
        <div style={{overflow:'hidden',marginLeft: '-24px'}}>
          <p className={styles.Schema}>
             Schema列表
          </p>
        </div>
        <Schema
          getData={(rowData) => this.getData(rowData)} 
          schData={this.state.addNewSchema} 
          // DataSetName={this.state.DataSetName}
          // swatch={(val)=>this.swatch(val)}
          // DataSetID={this.state.DataSetID}
          delSchema={(rowData)=>this.delSchema(rowData)} 
          chuanSchema={(info)=>this.chuanSchema(info)}
        /> 
        {/* <div style={{paddingBottom:'24px'}}>
          <Button
            type="primary" 
            style={{marginRight:8}}
          >批量导入</Button>
          <Button
            onClick={() => this.addNewSchData()}
          >新增</Button>
          <Search
            placeholder="数据名称检索"
            onSearch={this.nameSwatch.bind(this)}
            style={{ width: 200 ,float:'right'}}
          />
        </div>
        <TabComp
          // loading={this.state.loading} 
          columns={columns(t)} 
          // list={dataList}
          list={this.state.schemaTabList || []}
          loadList={this.loadData}
          rowKey={(record) => record.key}
        /> */}
      </div>
    );
  }

  renderSubmit() {
    return (
      // <div style={{background:'#fff',textAlign:'right',paddingTop:24}}>
      //   <FormItem style={{background:'#fff',textAlign:'right',marginRight:24}} >
      //     <Button type="primary" onClick={this.submit.bind(this)} loading={this.state.loading}>提交</Button>
      //   </FormItem>
      // </div>
      <div style={{background:'#fff',textAlign:'right',paddingTop:10,position:'fixed',left:0,bottom:0,width:'100%',zIndex:100}}>
        <FormItem style={{background:'#fff',textAlign:'right',margin:'0 auto',paddingBottom:10,width:1200,paddingRight:16}} >
          <Button type="primary" onClick={this.submit.bind(this)} loading={this.state.loading}>提交</Button>
        </FormItem>
      </div>
    );
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    
    return (
      <div>
        {this.renderbefore()}
        <div style={{background:'#fff'}} className={styles.editPanel}>
        
          
          <div className={styles.dataHead}>数据基本信息</div>
          <Form style={{background:'#f0f2f5'}}>
            {
              this.renderBaseInfoMation()
            }
            {
              this.renderSchemaList()
            }
            {/* {
              this.renderSubmit()
            } */}
          </Form>
        
          {
            this.renderSubmit()
          }
        </div>
      </div>
    );
  }
}
export default Form.create()(EditPerson);
