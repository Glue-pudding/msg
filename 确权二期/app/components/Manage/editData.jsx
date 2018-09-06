import React, { Component } from 'react';
import { render } from 'react-dom';
import {Divider ,message,Input ,Form,Select,DatePicker,Radio,Modal,Col } from 'antd';
import styles from './manage.module.less';
import moment from 'moment';
import API from '@api';
import {post,get} from '@axios';

const Search = Input.Search;
const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class EditData extends Component{
  constructor(props){
    super(props);
    this.state={
      loading:false,visible:this.props.visible,userType:'Supplier',
      Supplier:this.props.Supplier,Customer:this.props.Customer,
      startValue: null,
      endValue: null,
      endOpen: false,value:1,DataSetList:[],
      startTime:'',endTime:'',
    };
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
  
    radioChange = (e) => {
      this.setState({
        value: e.target.value,
      });
    }
    DataSetListChange(value){
      this.setState({dataSetName:value});
    }
    dataSetChange(e){
      this.setState({dataSetName:e.target.value});
    }
    checkText=(rule,value,callback)=>{
      let reg = /^[a-zA-Z_\u4e00-\u9fa5]*$/;
      if(!reg.test(value)){
        callback('不能包含特殊字符或数字');
      }else{
        callback();
      }
    }
    //用户类型更改
    userChange(value){
      this.setState({userType:value});
      this.dataSetList(value);
    }
    CustomerChange(value){
      this.setState({userType:value});
    }
    //获取数据源
    dataSetList(value){
      let t = this,params='';
      t.setState({ loading: true });
      params = { url: API.GET_DATA_SETS_CONDITIONS,params:{Supplier:value}};
      get(params).then(function (res) {
        if (res && res.code === 10000) {
          t.setState({ DataSetList: res.data.DataSetList,  loading: false, editType: '' });
        } else {
          t.setState({ loading: false, editType: '' });
          message.warn(res.message || '系统出错，请联系管理员!');
        }
      }).catch = (err) => {
        t.setState({ loading: false, editType: '' });
        console.log('==error==', err);
      };
    }
    
  //新增用户提交
    handleOk(e) {
      e.preventDefault();
      let t = this;
      const {loadData,handleVisible} = this.props;
      this.props.form.validateFields((err, values)=>{
        if (err) {
          console.log('请确认表单信息: ', values);
          return false;
        } else {
          let data = '';
          if(t.state.startTime=='' || t.state.endTime==''){
            message.warn('请选择起止时间！');
          }else{
            let Begintime = new Date(t.state.startTime).getTime();
            let Endtime = new Date(t.state.endTime).getTime();
            if(values.dataSetName==='2'){
              data={
                BusinessName:values.BusinessName,
                Supplier:values.Supplier,
                Customer:values.Customer,
                StartTime:Begintime,
                EndTime:Endtime,
                BusinessDescription:values.BusinessDescription,
                BusinessType:values.BusinessType,
                DataSetID:t.state.dataSetName,
                
              };
            }else{
              data={
                BusinessName:values.BusinessName,
                Supplier:values.Supplier,
                Customer:values.Customer,
                StartTime:Begintime,
                EndTime:Endtime,
                BusinessDescription:values.BusinessDescription,
                BusinessType:values.BusinessType,
                DataSetName:values.dataSetName,
              };
            }
            let params = { url: API.ADD_BUSINESS ,data:data};
            post(params).then(function (res) {
              if (res && res.code === 10000) {
                t.setState({loading: false, editType: '' ,visible:false});
                handleVisible(false);
                message.success('添加成功');
                loadData();
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
    //取消新增人才
    handleCancel(e){
      this.props.handleVisible(false);
      this.setState({visible:false});
    }

    render(){
      var t = this, state = t.state;
      let Supplier = [],Customer=[];
      Supplier=state.Supplier?state.Supplier.split(','):[];
      Customer=state.Customer?state.Customer.split(','):[];
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
      return(
        <Modal
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
                }],
              })(
                <Select 
                  style={{ width: '100%'}} 
                  onChange={this.userChange.bind(this)}
                  showSearch
                  placeholder="请选择供方名称"
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {Supplier.map((item,index)=><Option value={item} key={index}>{item}</Option>)}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="需方名称" >
              {getFieldDecorator('Customer', {
                rules: [{ required: true, message: '请选择需方名称'},{
                  validator: this.validateNum,
                }],
              })(
                <Select 
                  style={{ width: '100%'}} 
                  onChange={this.CustomerChange.bind(this)}
                  showSearch
                  placeholder="请选择需方名称"
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {Customer.map((item,index)=><Option value={item} key={index}>{item}</Option>)}
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
                  })(
                    <DatePicker
                      disabledDate={this.disabledStartDate}
                      showToday={false}
                      format="YYYY-MM-DD"
                      setFieldsValue={startValue}
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
                  })(
                    <DatePicker
                      disabledDate={this.disabledEndDate}
                      showToday={false}
                      format="YYYY-MM-DD"
                      setFieldsValue={endValue}
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
                  validator: this.checkText,
                }],
                initialValue:''
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
                  validator: this.validateNum,
                }],
              })(
                <Select style={{ width: '100%'}} placeholder='请选择业务类型!'>
                  <Option value="analyse">分析业务</Option>
                  <Option value="query">查询业务</Option>
                </Select>
              )}
            </FormItem>
            <Divider dashed />
            <FormItem
              {...formItemLayout}
              label="数据名称"
            >
              {getFieldDecorator('dataSetName', {
                rules: [{ message: '请输入数据名称!' },{
                  validator: this.checkText,
                }],
                initialValue:''
              })(
                <div>
                  <RadioGroup onChange={this.radioChange} value={this.state.value}>
                    <Radio value={1}>新建数据</Radio>
                    <Radio value={2}>已有数据</Radio>
                  </RadioGroup>
                  {this.state.value===1?<Input placeholder="请输入数据名称" onChange={this.dataSetChange.bind(this)}/>
                    :<Select 
                      style={{ width: '100%'}} 
                      onChange={this.DataSetListChange.bind(this)}
                      showSearch
                      placeholder="请选择数据名称"
                      optionFilterProp="children"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {state.DataSetList.map((item,index)=><Option value={item.DataSetID} key={index}>{item.DataSetName}</Option>)}
                    </Select>}
                </div>
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
                initialValue:''
              })(
                <TextArea autosize={{ minRows: 5, maxRows: 5 }} placeholder="请输入数据描述" />
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
}
export default Form.create()(EditData);