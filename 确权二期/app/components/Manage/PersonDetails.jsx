
import React, { Component } from 'react';
import { Route, Link } from 'react-router';
import API from '@api';
import {post,get} from '@axios';
import styles from './manage.module.less';
import { Steps, Popover, Button, Modal, Icon, message,Input,Badge,Card,Row,Col,Form ,Select,Divider} from 'antd';
const FormItem = Form.Item;
import moment from 'moment';

const Option = Select.Option;
// const monthFormat = 'YYYY-MM';
const { TextArea } = Input;
class DetailInfor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      UserName: null,type:'password',
      dataList: [],userType:'',
    };
  }
  componentDidMount(){
    let iStr = window.location.hash;
    let name = null,strs='';
    strs=iStr.split('/').pop();
    if(strs){
      this.setState({UserName: strs});
      this.getMainTainDetail(strs);
    }
	
  }
  //获取详情
  getMainTainDetail(name) {
    let t=this,
      state=this.state,
      params = {url:API.GET_USER_DETAIL,params:{UserName: name}};
    t.setState({loading:true});
    get(params).then(function(res){
      if(res&&res.code===10000){
        t.setState({dataList:res.data||[],loading:false,userType:res.data.UserType});
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
    case 0:
      iCont = <Badge status="error" />;
      break;
    case 1:
      iCont = <Badge status="processing" />;
      break;
    }
    return (
      <div className={dataList.Status===0?styles.errorBorder:styles.bussnormal}>
        <div style={{padding:'16px 16px 16px 28px',float:'left'}}>
          <span style={{marginRight: '20px'}} className={styles.fontStyleH}>账号状态: &nbsp;&nbsp;<span className={styles.fontStyle}>{iCont}{
            dataList.Status === 0?'冻结':'正常'
          }</span></span>
          <span className={styles.fontStyleH}>创建时间: <span className={styles.fontStyle}>{time}</span></span>
        </div>
        <div>
          <a onClick={this.stateChange.bind(this,dataList.Status,dataList.UserName)} className={dataList.Status===0?styles.listStatus:styles.listStatu}>{dataList.Status === 0?'恢复':'冻结'}</a>
        </div>
      </div>
    );
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
        t.getMainTainDetail(userName);
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
    t.setState({ visible: true,});
  }

  detailsTitle(){
    const { dataList } = this.state;
    let disable=dataList.EditFlag===0?true:false;
    return (
      <div style={{marginTop:'12px'}}>
        <div className={styles.title_L}>
          <span className={styles.title_l} /><span style={{fontSize:'20px'}}>{dataList.UserName}</span>
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
    return (<Card title={detailsTitle}>
      <Row gutter={16}>
        <Col span={12} style={{paddingLeft:'0px'}}>
          <div className={styles.CardBoxD}>
            <div className={styles.fontStyleH}>账号类型</div>
            <div className={styles.fontStyle}>{dataList.UserType}</div>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.CardBoxD}>
            <div className={styles.fontStyleH}>登录密码</div>
            <div className={styles.fontStyle}>
              <Input 
                value={dataList.Password}
                prefix={this.state.type==='password'?
                  <i className='iconfont icon-PasswordOff' onClick={this.passChange.bind(this,this.state.type)} style={{width:'20px',height:'20px'}}/>
                  :<i className='iconfont icon-PasswordOn' onClick={this.passChange.bind(this,this.state.type)} style={{width:'20px',height:'20px'}}/>} 
                type={this.state.type}
                disabled
              />
            </div>
          </div>
        </Col>
      </Row>
      <Divider dashed />
      <Row gutter={16}>
        <Col span={12} style={{paddingLeft:'0px'}}>
          <div className={styles.CardBoxD}>
            <div className={styles.fontStyleH}>企业名称</div>
            <div className={styles.fontStyle}>{dataList.CompanyName}</div>
          </div>
        </Col>
        <Col span={6} >
          <div className={styles.CardBoxD}>
            <div className={styles.fontStyleH}>联系人</div>
            <div className={styles.fontStyle}>{dataList.Contacts}</div>
          </div>
        </Col>
        <Col span={6}>
          <div className={styles.CardBoxD}>
            <div className={styles.fontStyleH}>联系电话</div>
            <div className={styles.fontStyle}>{dataList.ContactInformation}</div>
          </div> 
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12} style={{marginBottom:'4px',paddingLeft:'0px'}}>
          <div className={styles.CardBoxD}>
            <div className={styles.fontStyleH}>联系地址</div>
            <div className={styles.fontStyle}>{dataList.Address}</div>
          </div> 
        </Col>
      </Row>
    </Card>);
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
        let params = { url: API.EDIT_USER ,data:data};
        post(params).then(function (res) {
          if (res && res.code === 10000) {
            t.setState({loading: false, editType: '' ,visible:false});
            message.success('编辑成功');
            t.getMainTainDetail(values.userName);
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
  checkText=(rule,value,callback)=>{
    let reg = /^[a-zA-Z_\u4e00-\u9fa5]*$/;
    if(!reg.test(value)){
      callback('不能包含特殊字符或数字');
    }else{
      callback();
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

  render() {
    const { dataList } = this.state;
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
    return (
      <div>
        <div >
          <span className={styles.header}>账号详情</span>
          <Link to={'manage/account'}>
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
        {this.state.visible?<Modal
          title="编辑账号" width='688px'
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
                  validator:this.checkText,
                }],
                initialValue:dataList.UserName
              })(
                <Input disabled/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="账号类型"
            >
              {getFieldDecorator('userType', {
              })(
                <div>
                  <Select defaultValue={dataList.UserType} style={{ width: '100%'}} disabled>
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
                initialValue:dataList.Password
              })(
                <Input 
                  prefix={this.state.type==='password'?
                    <i className='iconfont icon-PasswordOff' onClick={this.passChange.bind(this,this.state.type)} style={{width:'20px',height:'20px'}}/>
                    :<i className='iconfont icon-PasswordOn' onClick={this.passChange.bind(this,this.state.type)} style={{width:'20px',height:'20px'}}/>} 
                  type={this.state.type}
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
                  validator:this.checkText,
                }],
                initialValue:dataList.CompanyName
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
                  validator:this.checkText,
                }],
                initialValue:dataList.Contacts
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
                initialValue:dataList.ContactInformation
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
                  validator:this.checkAdress,
                }],
                initialValue:dataList.Address
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

export default Form.create()(DetailInfor);