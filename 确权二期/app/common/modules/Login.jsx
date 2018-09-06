import React from 'react';
import img from '@static/images/bg1920.png';
import { Layout,Row,Col,Form,Input,Icon,Checkbox,Button,message,Tooltip } from 'antd';
import comStyle from '../../app.less';//导入
import styles from './style.less';
import {hashHistory} from 'react-router';
import API from '@api';
import {post,get} from '@axios';
const { Header,Content} = Layout;
const FormItem = Form.Item;
class Login extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log('Received values of form: ', values);
      }else{
        let url = API.USER_LOGIN,params={url:url,data:{'UserName':values.userName,'Password':values.passWord,'IdentifyCode':values.qrCode}};
        post(params).then(function(res){
          if(res&&res.code===10000&&res.data){
            sessionStorage.setItem('localRole',res.data.Role);
            sessionStorage.setItem('localSession',res.data.SessionId);
            console.log(res.data.Role,'===json===');
            hashHistory.push('');
          }else{
            message.warn((res&&res.message)||'系统出错，请联系管理员!');
          }
        }).catch=(err)=>{
          message.warn(err.message||'请求出错');
        };
      }
    });
  }
  componentDidMount(){
    if(sessionStorage.getItem('localRole')){
      sessionStorage.removeItem('localRole');
    }
    if(sessionStorage.getItem('localSession')){
      sessionStorage.removeItem('localSession');
    }
  }
  checkName=(rule,value,callback)=>{
    let reg = /^[a-zA-Z_\u4e00-\u9fa5]*$/;
    if(!reg.test(value)){
      callback('不能包含特殊字符或数字');
    }else{
      callback();
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (<div style={{height:'100%'}}>
      <Layout  className={styles.loginBG} style={{backgroundRepeat:'no-repeat'}}>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%',background:'rgba(55,57,76,0.90)' }}>
          <div className={`${comStyle.boxstyle} ${comStyle.boxPadding} ${styles.matchStyle}`} >
            <div className={comStyle.logo} />
          </div>
        </Header>
        <div className={`${comStyle.boxstyle} ${styles.loginBox}`} >
          <Row type='flex'>
            <Col span={12} className={styles.loginLeft}>
              <h2>浙江大数据交易中心 确权平台</h2>
              <p>数据交易的首选，简洁、易懂、高效</p>
              <p>深入业务场景，源头保障数据隐私</p>
              <p>告别隐患时代，拥抱数据交易安全</p>
            </Col>
            <Col span={10} offset={2} className={styles.loginRight}>
              <h3 style={{marginBottom:'0'}}>用户登录</h3>
              <Form onSubmit={this.handleSubmit} className="login-form clearfix" style={{marginTop:'32px'}}>
                <FormItem>
                  {getFieldDecorator('userName', {
                    rules: [{ required: true, message: '请输入用户名!'},{validator:this.checkName}],
                  })(
                    <Input prefix={<i className="iconfont icon-User" />} placeholder="请输入用户名称" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('passWord', {
                    rules: [{ required: true, message: '请输入密码!' }],
                  })(
                    <Input prefix={<i className="iconfont icon-Password" />} type="password" placeholder="请输入登录密码" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('qrCode', {
                    rules: [{ required: true, message: '请输入验证码' }],
                  })(
                    <Input prefix={<i className="iconfont icon-Code" />} placeholder="请输入验证码" style={{width:'62%'}} />
                  )}
                  <img src={img} style={{width:'30%',height:'48px',float:'right',minWidth:'120px'}}/>
                </FormItem>
                <FormItem style={{marginTop:'36px',marginBottom:'0'}}>
                  <Button type="primary" htmlType="submit" className={styles.loginBtn}>
                        登 录
                  </Button>
                  <a href="javascript:void(0);" className={styles.forgetLink} ><Tooltip title='点击后将具体情况写入邮件，我们将尽快回复'>忘记密码?</Tooltip></a>
                </FormItem>
              </Form>
            </Col>
          </Row>
        </div>
      </Layout>
    </div>
    );
  }
}

export default Form.create()(Login);