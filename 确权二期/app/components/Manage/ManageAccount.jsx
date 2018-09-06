import React, { Component } from 'react';
import { render } from 'react-dom';
import API from '@api';
import axios from 'axios';
import {post,get} from '@axios';
import { Table, Icon, Divider ,message,Row,Col,Card,Input ,Button,Form,Modal,Select } from 'antd';
import styles from './manage.module.less';
import commStyle from '../../app.less';
import PersonDetails from './PersonDetails';
import { Route, Link } from 'react-router';
import Page from '@common/PageTable';
import moment from 'moment';

const Search = Input.Search;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
class ManageHome extends Component {
  constructor(props){
    super(props);
    this.state={
      loading:false,visible:false,userType:'Supplier',
      list:[],
      editType:'',
      count:'',type:'password',
      //筛选框相关属性
      dropdownVisible:false,curType:'all'
    };
  }
  componentDidMount() {
    let t = this;
    t.loadData();
  }
  //拉取用户列表
  loadData(value){
    let t = this,params='';
    t.setState({ loading: true,curType:'all' });
    if(value){
      params = { url: API.USER_LIST_QUERY ,params:{UserName:value}};
    }else{
      params = { url: API.USER_LIST_QUERY};
    }
    get(params).then(function (res) {
      if (res && res.code === 10000) {
        t.setState({ list: res.data.UserList,  loading: false, editType: '' });
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
      { value: '供方', key: 'Supplier' },
      { value: '需方', key: 'Customer' },
    ];
    columns = [{
      title: '账号名称',
      dataIndex: 'UserName',
      key: 'UserName',
    }, {
      title: '账号类型',
      dataIndex: 'UserType',
      key: 'UserType',
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
          {record.UserType==='Customer' ?'需方':'供方'}
        </span>;
      }
    }, {
      title: '创建时间',
      dataIndex: 'CreateTime',
      key: 'CreateTIme',
      render: (text, record) => {
        let time=moment(record.CreateTime).format('YYYY-MM-DD');
        return <span>
          {time}
        </span>;
      }
    }, {
      title: '账号状态',
      dataIndex: 'Status',
      key: 'Status',
      render: (text, record) => {
        return <span>
          <span className={record.Status===0 ? styles.red : styles.blue} style={{margin:'5px'}}>●</span>
          {record.Status===0?'冻结':'正常'}
        </span>;
      }
    },{
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return <span>
          <Link to={'/manage/account/personDetails/'+record.UserName}>详情</Link><Divider type="vertical" />
          <a onClick={this.stateChange.bind(this,record.Status,record.UserName)} className={record.Status===0? styles.red : ''}>{record.Status===0?'恢复':'冻结'}</a>
        </span>;
      }
    }];
    return columns;
  }
  passChange(type){
    if(type==='password'){
      this.setState({type:'text'});
    }else{
      this.setState({type:'password'});
    }
  }
  //改变用户状态
  stateChange(status,userName){
    let t=this,params='',data={UserName:userName};
    this.setState({loading:true});
    if(status===0){
      params = { url: API.RECOVER_USER ,data:data};

    }else{
      params = { url: API.BLOCK_USER ,data:data};
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
  //用户类型更改
  userChange(value){
    this.setState({userType:value});
  }
  //新增用户提交
  handleOk(e) {
    e.preventDefault();
    let t = this;
    this.props.form.validateFields((err, values)=>{
      if (err) {
        console.log('请确认表单信息: ', values);
        return false;
      } else {
        let data={
          UserName:values.userName,
          UserType:this.state.userType,
          Password:values.passWord,
          ContactInformation:values.ContactInformation,
          Contacts:values.Contacts,
          CompanyName:values.CompanyName,
          Address:values.address,
        };
        let params = { url: API.ADD_USER ,data:data};
        post(params).then(function (res) {
          if (res && res.code === 10000) {
            t.setState({loading: false, editType: '' ,visible:false});
            message.success('添加成功');
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
    });
  }
  //取消新增人才
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
  checkAdress = (rule, value, callback) => {
    let regEn = /[`~!@#$%^&*()_+<>?"{}/'[\]]/im,
      regCn = /[·#￥（——）“”‘|《》？【】[\]]/im;

    if (regEn.test(value) || regCn.test(value)) {
      callback('不能包含特殊字符.');
    } else {
      callback();
    }
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
    var t = this, state = t.state;
    const {list,curType} =state;
    let columns = t.loadColumn();
    const { getFieldDecorator } = this.props.form;
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
    let listHeader =<div style={{marginTop:'12px',marginBottom:'8px'}}>
      <Button type="primary" onClick={t.showModal.bind(this)} className={styles.allBtn}>新增账号</Button>
      <Search placeholder="账号名称检索" onSearch={this.searchName.bind(this)} style={{ width: 200 ,float:'right'}} />
    </div>;
    let curList = curType==='all'?list:list.filter((item,index)=>{
      if(item.UserType===curType){
        return item;
      }
    });
    return (
      <div>
        <div className={styles.header}>账号管理</div>
        <Row type="flex" justify="center" className={styles.listBody}>
          <Col md={24}>
            <div className="gutter-box">
              {!this.state.editType ? <Card bordered={false} title={listHeader}>
                <Page loading={this.state.loading} columns={columns} list={curList||[]} rowKey="UserName"/>
              </Card> : <PersonDetails />}
            </div>
          </Col>
        </Row>
        {this.state.visible?<Modal
          title="新增账号" width='688px'
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          okText="提交"
          cancelText="取消"
          maskClosable={false}
        >
          <Form>
            <FormItem {...formItemLayout} label="账号名称" >
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: '请输入账号名称（2-20个中英文字符）'},{
                  validator: this.checkText,
                }],
                initialValue:''
              })(
                <Input placeholder="请输入账号名称（2-20个中英文字符）" maxLength="20"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="账号类型"
            >
              {getFieldDecorator('userType', {
              })(
                <div>
                  <Select defaultValue="Supplier" style={{ width: '100%'}} onChange={this.userChange.bind(this)}>
                    <Option value="Supplier">供方</Option>
                    <Option value="Customer">需方</Option>
                  </Select>
                </div>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="登录密码"
              className={styles.password}
            >
              {getFieldDecorator('passWord', {
                rules: [{type:'string', required: true, message: '请输入登录密码!' },{
                  validator: this.validateNum,
                }],
                initialValue:''
              })(
                <Input 
                  prefix={this.state.type==='password'?
                    <i className='iconfont icon-PasswordOff' onClick={this.passChange.bind(this,this.state.type)} style={{width:'20px',height:'20px'}}/>
                    :<i className='iconfont icon-PasswordOn' onClick={this.passChange.bind(this,this.state.type)} style={{width:'20px',height:'20px'}}/>} 
                  type={this.state.type}
                  placeholder='请输入登录密码'
                />
              )}
            </FormItem>
            <Divider dashed />
            <FormItem
              {...formItemLayout}
              label="企业名称"
            >
              {getFieldDecorator('CompanyName', {
                rules: [{type:'string', required: true, message: '请输入企业名称!' },{
                  validator: this.checkText,
                }],
                initialValue:''
              })(
                <Input placeholder="请输入企业名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="联系人"
            >
              {getFieldDecorator('Contacts', {
                rules: [{type:'string', required: true, message: '请输入联系人!' },{
                  validator: this.checkText,
                }],
                initialValue:''
              })(
                <Input placeholder="请输入联系人" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="联系电话"
            >
              {getFieldDecorator('ContactInformation', {
                rules: [{type:'string', required: true, message: '请输入联系电话!' },{
                  validator: this.checkAccount,
                }],
                initialValue:''
              })(
                <Input placeholder="请输入联系电话" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="联系地址"
            >
              {getFieldDecorator('address', {
                rules: [{type:'string', required: true, message: '请输入联系地址!' },{
                  validator: this.checkAdress,
                }],
                initialValue:''
              })(
                <TextArea autosize={{ minRows: 4, maxRows: 4 }} placeholder="请输入联系地址" />
              )}
            </FormItem>
          </Form>
        </Modal>:null}
      </div>
    );
  }
}

export default Form.create()(ManageHome);