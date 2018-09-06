/**
 * Created by author on 2017/4/26.
 */
import React, { Component } from 'react';
import { Row, Col,Card, Button ,Icon,Modal,message,Input,Table,Tooltip,Popconfirm,Form} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import {post} from '../../axios/tools';
import styles from './report.module.less';
import moment from 'moment';
import { DatePicker } from 'antd';
import API from '@/mock';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const monthFormat = 'YYYY-MM';
class DataReport extends Component {
    state = {
        page:1,pageSize:10,startTime:null,endTime:null,
        dataList:[],loading:false,dateValue:[],visible:false,
        modalType:'add',
        modalObj:{dataReportId:'',saleIncome:0,devIncome:0,totalTax:0,time:null}
    };
    componentDidMount(){
        this.loadList();
    }
    loadList(sTime,eTime,page,pageSize){
        let t=this,state=this.state,
            params = {url:API.API_COMPANY_DATA_LIST,data:{page:page||state.page,size:pageSize||state.pageSize}};
        if(sTime&&eTime){
            params.data['startTime'] =sTime;
            params.data['endTime'] =eTime;
        }
        t.setState({loading:true});
        post(params).then(function(res){
            if(res&&res.code===10000){
                t.setState({dataList:res.data.list||[],loading:false});
            }else{
                message.warn((res&&res.message)||'系统出错，请联系管理员!');
            }
        }).catch=(err)=>{
            t.setState({loading:false})
            console.log("==error==",err)
        }
    }
    getColumns=()=>{
        let columns = [],t=this;
        columns = [
            {title: '直报月份',width:130,dataIndex: 'time', key: 'time',render:(r,k)=>{
                // let time = new Date(r),year = time.getFullYear(),month = time.getMonth();
                return r; //<label>{year}-{month>9?month:'0'+month}</label>
            }},
            {title: '销售收入 (万元)',width:'20%',dataIndex: 'saleIncome', key: 'saleIncome',render:(text)=>'￥'+(text||0)},
            {title: '研发投入 (万元)',width:'15%',dataIndex: 'devIncome', key: 'devIncome',render:(text)=>'￥'+(text||0)},
            {title: '固定资产 (万元)',width:'15%',dataIndex: 'fixedInvestments', key: 'fixedInvestments',render:(text)=>'￥'+(text||0)},
            {title: '每月税务总计 (万元)',width:'15%',dataIndex: 'totalTax', key: 'totalTax',render:(text)=>'￥'+(text||0)},
            {title: <Tooltip title="研发投入比例=研发投入/销售投入">
                    <span>研发投入比例 (%) <Icon type="info-circle" style={{color:'#D8DFE5',fontSize:'16px'}}/></span>
                </Tooltip>,width:'15%',dataIndex: 'devSaleRatio',key:'devSaleRatio',render:(text)=>(text||0)+'%'},
            {title: '操作',dataIndex: 'operate', key: 'operate',render:(r,k)=>{
                return <label>
                    <a style={{marginRight:'8px'}} onClick={t.toggleReport.bind(t,k)}>编辑</a>
                    <Popconfirm title="确认删除?" onConfirm={t.deleReport.bind(t,k.dataReportId)}>
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                </label>
            }},
        ]
        return columns;
    }
    changeDate=(data,rangeStr)=>{
        this.setState({dateValue:data});
        this.loadList();
    }
    handlePanelChange = (value, mode) => {
        this.setState({dateValue:value});
        let sTime ='',eTime='';
        if(value&&value.length){
            let sMonth = value[0].month()+1,eMonth = value[1].month()+1;
            sTime = value[0].year()+'-'+(sMonth>9?sMonth:'0'+sMonth);
            eTime = value[1].year()+'-'+(eMonth>9?eMonth:'0'+eMonth);
        }
        this.loadList(sTime,eTime);
    }
    toggleReport=(iObj)=>{
        let t=this;
        if(iObj&&iObj.dataReportId){
            let id=iObj.dataReportId,sale = iObj.saleIncome||0,dev = iObj.devIncome||0,fixed=iObj.fixedInvestments||0,
                total = iObj.totalTax||0,time = iObj.time;
            this.props.form.setFieldsValue({"saleInput":sale,"fixedProper":fixed,"devInput":dev,"totalTax":total,"month":moment(time, monthFormat)});
            this.setState({
                visible:true,modalType:'edit',
                modalObj:{...t.state.modalObj,dataReportId:id,saleIncome:sale,devIncome:dev,totalTax:total,time:time}
            });
        }else{
            this.setState({visible:true,modalType:'add'});
        }
    }
    validateNum=(rule,value,callback)=>{
        if(!value){
            callback();
            return false;
        }
        // let isMatch = value.toString().match(/^[0-9]+[.]+[0-9]{2}$/);
        let isMatch = value.toString().match(/^[0-9]*[.]*[0-9]{1,2}$/);
        if(isMatch){
            callback();
        }else{
            callback('请输入正确数字格式：23.00或13')
        }
    }
    handleSubmit=(e)=>{
        e.preventDefault();
        let t=this;
    
        this.props.form.validateFields((err, values) => {
        if (err) {
            console.log('请确认表单信息: ', values);
            return false;
        }else{
            let time = values.month._d,year = time&&time.getFullYear(),month=time?(time.getMonth()+1)>9?(time.getMonth()+1):'0'+(time.getMonth()+1):'';
            let iObj = {
                saleIncome:values.saleInput,devIncome:values.devInput,fixedInvestments:values.fixedProper,
                totalTax:values.totalTax,time:year+'-'+month
            }
            if(t.state.modalType==="edit"){
                iObj["dataReportId"] = t.state.modalObj['dataReportId']
            }
            this.submitInfo(iObj);
        }
        });
    }
    deleReport=(id)=>{
        let t=this,state=this.state,
            params = {url:API.API_COMPANY_DATA_DELETE,data:{dataReportId:id}};
        post(params).then(function(res){
            if(res&&res.code===10000){
                message.success('删除成功！');
                t.loadList();
            }else{
                message.warn(res.message||'系统出错，请联系管理员!');
            }
        }).catch=(err)=>{
            t.setState({loading:false})
            console.log("==error==",err)
        }
    }
    submitInfo=(param)=>{
        let t=this,state=this.state,
            params = {url:API.API_COMPANY_DATA_SAVE_OR_UPDATE,data:param};
        post(params).then(function(res){
            if(res&&res.code===10000){
                message.success('操作成功！');
                t.setState({dateValue:[]})
                t.cancelModal();
                t.loadList();
            }else{
                t.setState({loading:false})
                message.warn(res.message||'系统出错，请联系管理员!');
            }
        }).catch=(err)=>{
            t.setState({loading:false})
            console.log("==error==",err)
        }
    }
    cancelModal=()=>{
        this.props.form.setFieldsValue({"saleInput":null,"devInput":null,"totalTax":null,"month":null,"fixedProper":null});
        this.setState({visible:false,modalObj:{...this.state.modalObj,dataReportId:null,saleIncome:0,devIncome:0,totalTax:0,time:null}})
    }
    disabledTime=(monthTime)=>{
        let now = new Date();
        return monthTime.valueOf() >= now.valueOf();
    }
    pageChange=(page,pageSize)=>{
        this.setState({page,pageSize})
        this.loadList(this.state.startTime,this.state.endTime,page,pageSize);
    }
    sizeChange=(current,size)=>{
        this.setState({page:current,pageSize:size});
        this.loadList(this.state.startTime,this.state.endTime,current,size);
    }
    render() {
        const { dataList,dateValue,page,pageSize,visible,modalType,modalObj} = this.state;
        const {saleIncome,devIncome,totalTax,time,fixedInvest} = modalObj;
        const { getFieldDecorator } = this.props.form;
        let t=this,tabTop=<div className={styles.reportTop}>
            <Button type="primary" onClick={t.toggleReport} >新增直报</Button>
            <RangePicker format="YYYY-MM" onChange={this.changeDate} value={dateValue} onPanelChange={this.handlePanelChange}
                        mode={['month', 'month']}  /></div>;        
        let pageProps ={
            page:page,pageSize:pageSize,
            showSizeChanger:true,showQuickJumper:true,
            onShowSizeChange:this.sizeChange,onChange:this.pageChange,
            showTotal:(total)=>`共 ${total} 条`
        }
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
          };
        return (
            <div >
                <BreadcrumbCustom first="数据直报"  />
                <Row gutter={16} type="flex">
                    <Col className={styles.reportPanel} md={23} style={{marginLeft:"20px"}} >
                        <Card title={tabTop} bordered={false}>
                            <Table columns={t.getColumns()} pagination={pageProps} dataSource={dataList} rowKey="dataReportId" />
                        </Card>
                    </Col>
                </Row>
                <Modal title={modalType==='add'?"新增直报":'编辑直报'} className={styles.modalBox} visible={visible} width='680px' onCancel={t.cancelModal} onOk={t.handleSubmit}
                        okText="提交" cancelText="取消">
                    <Form >
                        <FormItem
                        {...formItemLayout}
                        label="直报月份"
                        >
                        {getFieldDecorator('month',{initialValue:time?moment(time, monthFormat):null})(
                            <MonthPicker style={{width:'240px'}} disabledDate={t.disabledTime} />
                        )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="销售收入" extra="建议保留到小数点后两位"
                            >
                            {getFieldDecorator('saleInput', {
                                rules: [{
                                required: true, message: '请输入销售收入',
                                }, {
                                validator: this.validateNum,
                                }],
                                initialValue:saleIncome||null
                            })(
                                <Input addonBefore="￥" style={{width:'240px'}} />
                            )}
                            <span className="ant-form-text"> 万元</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="研发收入" extra="建议保留到小数点后两位"
                            >
                            {getFieldDecorator('devInput', {
                                rules: [{
                                required: true, message: '请输入研发收入',
                                }, {
                                validator: this.validateNum,
                                }],
                                initialValue:devIncome||''
                            })(
                                <Input addonBefore="￥" style={{width:'240px'}} />
                            )}
                            <span className="ant-form-text"> 万元</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="固定资产" extra="建议保留到小数点后两位"
                            >
                            {getFieldDecorator('fixedProper', {
                                rules: [{
                                required: true, message: '请输入固定资产',
                                }, {
                                validator: this.validateNum,
                                }],
                                initialValue:fixedInvest||''
                            })(
                                <Input addonBefore="￥" style={{width:'240px'}} />
                            )}
                            <span className="ant-form-text"> 万元</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="每月税务总计" extra="建议保留到小数点后两位"
                            >
                            {getFieldDecorator('totalTax', {
                                rules: [{
                                required: true, message: '请输入每月税务总计',
                                }, {
                                validator: this.validateNum,
                                }],
                                initialValue:totalTax?totalTax:null
                            })(
                                <Input addonBefore="￥" style={{width:'240px'}} />
                            )}
                            <span className="ant-form-text"> 万元</span>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(DataReport);