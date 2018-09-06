import React, { Component } from 'react';
import { Route, Link } from 'react-router';
import API from '@api';
import {post,get} from '@axios';
import {Card,Row,Col,Button,Form,DatePicker,message } from 'antd';
import styles from './comstom.module.less';
import moment from 'moment';

const FormItem = Form.Item;

class DataConfuse extends Component {
  constructor(props){
    super(props);
    this.state={
      startValue: null,startTime:'',
      endValue: null,endTime:'',
      endOpen: false,display:'none',
      list:'',editType:'',downlist:'',
    };
  }

  componentDidMount(){
    let t = this;
    let params = {url:API.DATA_RECOVER,data:{RecoverBeginTime:0,RecoverLength:0}};
    post(params).then(function(res){
      if(res&&res.code===10000){
        t.setState({loading:false,list:res.data,editType:'edit'});
      }else{
        message.warn((res&&res.message)||'系统出错，请联系管理员!');
      }
    }).catch=(err)=>{
      t.setState({loading:false});
    };
  }
  confuseChange(e) {
    e.preventDefault();
    let t = this;
    const {startTime,endTime} = t.state;
    if(startTime=='' || endTime==''){
      t.setState({display:'block'});
    }else{
      let Begintime = new Date(t.state.startTime).getTime();
      let Endtime = new Date(t.state.endTime).getTime();
      let RecoverLength= Endtime-Begintime;
      let params = {url:API.DATA_RECOVER,data:{RecoverBeginTime: Begintime,RecoverLength:RecoverLength}};
      t.setState({loading:true});
      post(params).then(function(res){
        if(res&&res.code===10000){
          t.setState({loading:false,list:res.data,editType:'edit'});
        }else{
          message.warn((res&&res.message)||'系统出错，请联系管理员!');
        }
      }).catch=(err)=>{
        t.setState({loading:false});
      };
    }
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

  onStartChange = (value,dateString) => {
    this.onChange('startValue', value);
    this.setState({startTime:dateString,display:'none'});
  }

  onEndChange = (value,dateString) => {
    this.onChange('endValue', value);
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


  downLoad(){
    const {list} = this.state;
    let sessionId = sessionStorage.getItem('localSession');
    let params = {url:API.DOWNLOAD_CERT,params:{filePath: list.CertificationPath,fileName:list.CertificationFile}};
    get(params).then(function(res){
      if(res.code!==30000){
        location.href = API.DOWNLOAD_CERT+'?SessionId='+sessionId+'&fileName='+list.CertificationFile+'&filePath='+list.CertificationPath; 
      }else{
        message.warn((res&&res.message)||'系统出错，请联系管理员!');
      }
    }).catch=(err)=>{
      this.setState({loading:false});
    };
  }
  confuseDetail(){
    const {startTime,endTime,list} = this.state;
    let EndTime = list.RecoverLength+list.RecoverBeginTime;
    let time=moment(list.RecoverBeginTime).format('YYYY-MM-DD');
    let Endtime=moment(EndTime).format('YYYY-MM-DD');
    return(
      <div style={{marginTop:'20px'}}>
        {list?<Card>
          <Row gutter={16}>
            <Col span={21}>
              <div className={styles.fontStyleH}>解析混淆有效期: <span className={styles.fontStyle}>{time}~{Endtime}</span></div>
            </Col>
            <Col span={3} style={{textAlign:'right'}}>
              <a href='javascript:;' onClick={this.downLoad.bind(this)}>证书下载</a>
            </Col>
          </Row>
        </Card>:''}
        {list?<Card style={{marginTop:'20px'}}>
          <Row gutter={16} style={{marginLeft:'-4px',marginRight:'-4px'}}>
            <Col span={12} style={{height:'80px'}}>
              <div className={styles.confuseBox}>
                <div className={styles.fontStyleH}>混淆数据导入地址</div>
                <div className={styles.fontStyle}>{list.DistortionResultTopic}</div>
              </div>
            </Col>
            <Col span={12} style={{height:'80px'}}>
              <div className={styles.confuseBox}>
                <div className={styles.fontStyleH}>解混淆结果取用地址</div>
                <div className={styles.fontStyle}>{list.RealResultTopic}</div>
              </div>
            </Col>
          </Row>
        </Card>:''}
      </div>
    );
  }


  render() {
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
    return (
      <div>
        <div className={styles.header}>数据解混淆管理</div>
        <Card><Form  style={{marginTop:'9px'}}>
          <FormItem
            {...formItemLayout}
            label="解析混淆有效期"
          >
            {getFieldDecorator('time', {
              rules: [{  required: true},{
                validator: this.validateNum,
              }],
            })(
              <div>
                <DatePicker
                  disabledDate={this.disabledStartDate}
                  showToday={false}
                  format="YYYY-MM-DD"
                  value={startValue}
                  placeholder="开始时间"
                  onChange={this.onStartChange}
                  onOpenChange={this.handleStartOpenChange}
                />&nbsp;~&nbsp;
                <DatePicker
                  disabledDate={this.disabledEndDate}
                  showToday={false}
                  format="YYYY-MM-DD"
                  value={endValue}
                  placeholder="结束时间"
                  onChange={this.onEndChange}
                  open={endOpen}
                  onOpenChange={this.handleEndOpenChange}
                /><br />
                <span style={{color:'red',display:this.state.display}}>请选择时间</span>
              </div>
            )}
          </FormItem>
          <div className={styles.lable}>
            <FormItem
              {...formItemLayout}
              label={<div style={{display:'none'}}>解混淆有效期</div>}
            >
              <Button type="primary" onClick={this.confuseChange.bind(this)} className={styles.allBtn}>申请解混淆</Button>
            </FormItem>
          </div>
        </Form></Card>
        {this.confuseDetail()}
      </div>
    );
  }
}
export default Form.create() (DataConfuse);