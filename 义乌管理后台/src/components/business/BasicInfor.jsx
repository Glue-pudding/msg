/**
 * Created by author on 2017/4/25.
 */
import React, { Component } from 'react';
import { Row, Col, Card, Tabs, Icon, Form, Button ,Input,message,DatePicker} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import moment from 'moment';
import styles from './business.module.less';
import {post} from '../../axios/tools';
import API from '@/mock';
const TextArea = Input.TextArea;
const FormItem = Form.Item;
class BasicInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            basicObj:null,editObj:{}
        };
    }
    componentDidMount(){
        this.loadInfor();
    }
    loadInfor(){
        let t=this;
        post({url:API.API_COMPANY_INFO_GET}).then(function(res){
            if(res&&res.code===10000){
                t.setState({basicObj:res.data});
            }else{
                message.warn((res&&res.message)||'系统出错，请联系管理员!');
            }
        }).catch=(err)=>{
            console.log("==error==",err)
        }
    }
    onEdit=(type)=>{
        let iObj = {...this.state.editObj};
        iObj[type] = true;
        this.setState({editObj:iObj})
    }
    cancelEdit=(type)=>{
        let iObj = {...this.state.editObj};
        iObj[type] = false;
        this.setState({editObj:iObj});
        this.loadInfor();
    }
    textChange=(name,e)=>{
        let iObj = {...this.state.basicObj};
        iObj[name] = e.target.value||"";
        this.setState({basicObj:iObj});
    }
    timeChange=(name,data,str)=>{
        let iObj = {...this.state.basicObj};
        iObj[name] = str||"";
        this.setState({basicObj:iObj});
    }
    teleChange=(id,name,e)=>{
        let iObj = {...this.state.basicObj},
            iArr = iObj.contacts&&iObj.contacts.length?iObj.contacts:[{name:'',telephone:''},{name:'',telephone:''}];
        iArr.filter((item,index)=>{
            if(item.id===id||index===id){
                item[name] = e.target.value;
            }
            return item;
        })
        this.setState({basicObj:{...this.state.basicObj,contacts:iArr}});
    }
    saveInfo=(type)=>{
        let t=this;
        post({url:API.API_COMPANY_INFO_UPDATE,data:t.state.basicObj}).then(function(res){
            if(res&&res.code===10000){
                message.success("保存成功！");
                t.cancelEdit(type);
            }else{
                message.warn((res&&res.message)||'系统出错，请联系管理员!');
            }
        }).catch=(err)=>{
            console.log("==error==",err)
        }
    }
    disabledTime=(time)=>{
        let now = new Date();
        return time.valueOf() >= now.valueOf();
    }
    checkPhone(rule, value, callback) {
		//正则用//包起来
        var regex = /^((\+)?86|((\+)?86)?)0?1[3458]\d{9}$/; 
		if(!value||(value&&value.match(regex))){
            callback();
        }else{
            callback("请输入正确的手机号码！");
        }
	}
    render() {
        const {basicObj,editObj} = this.state;
        const {getFieldDecorator} = this.props.form;
        let t=this,editBasic = editObj&&editObj['basic'],editIntel = editObj&&editObj['intel'],editSubject = editObj&&editObj['subject'],
            editMsg = editObj&&editObj['msg'],editCont = editObj&&editObj['contact'];
        const dateFormat = 'YYYY-MM-DD';
        const rendInput = function(name,type,teldesc,index){
            if(type==='textarea'){
                return <Input type="textarea" value={basicObj&&basicObj[name]} onChange={t.textChange.bind(this,name)} />;
            }
            if(type==='textArea'){
                return <TextArea value={basicObj&&basicObj[name]} onChange={t.textChange.bind(this,name)} />
            }
            if(type==='list'){
                return <Input type="textarea" onChange={t.teleChange.bind(this,name.id||index,teldesc)} />;
            }
            if(type==='date'){
                let now = new Date();
                return <div>
                    <DatePicker disabledDate={t.disabledTime} defaultValue={moment((basicObj&&basicObj[name])||now, dateFormat)} onChange={t.timeChange.bind(this,name)} />
                </div>
            }
        };
        let iContact = basicObj&&basicObj.contacts&&basicObj.contacts.length?basicObj.contacts:[{name:'',telephone:''},{name:'',telephone:''}];
        return (
            <div className="gutter-example button-demo">
              <div className={styles.header}>
                <BreadcrumbCustom first="企业信息" second="基本信息" />
                <div className={styles.headerB}>基本信息</div>
              </div>  
                <Row gutter={16}>
                    <Col className="gutter-row" md={24}>
                     <div className={styles.content}>
                        <div style={{marginBottom:"20px"}}>
                            <Card title={<h2>{(basicObj&&basicObj.enterpriseNameCn)||"企业中文名"}</h2>} bordered={false}
                                    extra={editBasic?null:<Button className={`${styles.btn}`} onClick={this.onEdit.bind(this,"basic")}>编辑</Button>}>                            
                                <Row type="flex" gutter={16}>
                                    <Col span={12} className={styles.cardBox}>
                                        <div className={styles.boxDiv}>
                                            <label htmlFor="">英文名称:</label>
                                            {editBasic?rendInput("enterpriseNameEn",'textarea'):<div>{basicObj&&basicObj.enterpriseNameEn}</div>}
                                        </div>
                                    </Col>
                                    <Col span={6} className={styles.cardBox}>                                         
                                        <div className={styles.boxDiv}>
                                            <label htmlFor="">法人代表:</label>
                                            {editBasic?rendInput("legalRepresentative",'textarea'):<div>{basicObj&&basicObj.legalRepresentative}</div>}
                                        </div>
                                    </Col>
                                    <Col span={6} className={styles.cardBox}>                                        
                                        <div className={styles.boxDiv}>
                                        <label htmlFor="">成立日期:</label>
                                        {editBasic?rendInput("registTime",'date'):<div>{basicObj&&basicObj.registTime}</div>}   
                                        </div>                                     
                                    </Col>
                                    <Col span={6} className={styles.cardBox}>                                        
                                        <div className={styles.boxDiv}>
                                        <label htmlFor="">注册资金:</label>
                                        {editBasic?rendInput("registeredCapitalRmb",'textarea'):<div>{basicObj&&basicObj.registeredCapitalRmb}</div>}
                                        </div>
                                    </Col>
                                    <Col span={6} className={styles.cardBox}>                                        
                                        <div className={styles.boxDiv}>
                                        <label htmlFor="">企业性质:</label>
                                        {editBasic?rendInput("companyType",'textarea'):<div>{basicObj&&basicObj.companyType}</div>}
                                        </div>
                                    </Col>
                                    <Col span={12} className={styles.cardBox}>                                       
                                        <div className={styles.boxDiv}>
                                        <label htmlFor="">注册地址:</label>
                                        {editBasic?rendInput("businessAddress",'textarea'):<div>{basicObj&&basicObj.businessAddress}</div>}
                                        </div>
                                    </Col>
                                    <Col span={6} className={styles.cardBox}>                                       
                                        <div className={styles.boxDiv}>
                                        <label htmlFor="">营业执照:</label>
                                        {editBasic?rendInput("businessLicenseNo",'textarea'):<div>{basicObj&&basicObj.businessLicenseNo}</div>}
                                        </div>
                                    </Col>
                                    <Col span={6} className={styles.cardBox}>                                       
                                        <div className={styles.boxDiv}>
                                        <label htmlFor="">税务登记:</label>
                                        {editBasic?rendInput("taxNo",'textarea'):<div>{basicObj&&basicObj.taxNo}</div>}
                                        </div>
                                    </Col>
                                    <Col span={6} className={styles.cardBox}>                                       
                                        <div className={styles.boxDiv}>
                                        <label htmlFor="">组织机构代码:</label>
                                        {editBasic?rendInput("orgCode",'textarea'):<div>{basicObj&&basicObj.orgCode}</div>}
                                        </div>
                                    </Col>
                                </Row>
                                {editBasic?<Row className={styles.footerBox}>
                                    <Button onClick={this.cancelEdit.bind(this,"basic")}>取消</Button> 
                                        <Button type="primary" onClick={this.saveInfo.bind(this,'basic')}>保存</Button>
                                </Row>:null}
                            </Card>
                        </div>          
                        <Row gutter={16} >
                            <Col span={12}>
                                <Card>
                                    <Row className={styles.topTitle}>
                                        <h2 className={styles.h2}>知识产权</h2>
                                        {editIntel?null:<Button className={styles.btn} onClick={this.onEdit.bind(this,"intel")}>编辑</Button>}
                                    </Row>
                                    <Row>
                                        <Col span={24} className={`${styles.cardBox} ${styles.areaBox}`}>                                       
                                            <div className={styles.boxDiv}>
                                            {editIntel?rendInput("intellectualProperty",'textArea'):<div>{basicObj&&basicObj.intellectualProperty}</div>}
                                            </div>
                                        </Col>
                                    </Row>
                                    {editIntel?<div className={styles.footerBox}>
                                        <Button onClick={this.cancelEdit.bind(this,"intel")}>取消</Button> 
                                            <Button type="primary" onClick={this.saveInfo.bind(this,'intel')}>保存</Button>
                                    </div>:null}
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card>
                                    <Row className={styles.topTitle}>
                                        <h2 className={styles.h2}>科技主体</h2>
                                        {editSubject?null:<Button className={styles.btn} onClick={this.onEdit.bind(this,"subject")}>编辑</Button>}
                                    </Row>
                                    <Row>
                                        <Col span={24} className={`${styles.cardBox} ${styles.areaBox}`}>                                       
                                            <div className={styles.boxDiv}>
                                            {editSubject?rendInput("scienceSubject",'textArea'):<div>{basicObj&&basicObj.scienceSubject}</div>}
                                            </div>
                                        </Col>
                                    </Row>
                                    {editSubject?<div className={styles.footerBox}>
                                        <Button onClick={this.cancelEdit.bind(this,"subject")}>取消</Button> 
                                            <Button type="primary" onClick={this.saveInfo.bind(this,'subject')}>保存</Button>
                                    </div>:null}
                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={16} >
                            <Col span={12}>
                                <Card >
                                    <Row className={styles.topTitle}>
                                        <h2 className={styles.h2}>经营信息</h2>
                                        {editMsg?null:<Button className={styles.btn} onClick={this.onEdit.bind(this,"msg")}>编辑</Button>}
                                    </Row>
                                    <Row type="flex" gutter={16} >
                                        <Col span={12} className={styles.cardBox}>                                       
                                            <div className={styles.boxDiv}>
                                            <label htmlFor="">所属产业:</label>
                                            {editMsg?rendInput("industryCategory",'textarea'):<div>{basicObj&&basicObj.industryCategory}</div>}
                                            </div>
                                        </Col>
                                        {/* <Col span={11} className={styles.cardBox}>
                                            <label htmlFor="">经营类目:</label>
                                            {editMsg?<Input type="textarea" defaultValue="- -" />:<div>- -</div>}
                                        </Col> */}
                                        <Col span={12} className={styles.cardBox}>                                       
                                            <div className={styles.boxDiv}>
                                            <label htmlFor="">网址:</label>
                                            {editMsg?rendInput("enterpriseWebsite",'textarea'):<div>{basicObj&&basicObj.enterpriseWebsite}</div>}
                                            </div>
                                        </Col>
                                        <Col span={24} className={styles.cardBox}>                                       
                                            <div className={styles.boxDiv}>
                                            <label htmlFor="">企业简介:</label>
                                            {editMsg?rendInput("companyProfile",'textarea'):<div>{basicObj&&basicObj.companyProfile}</div>}
                                            </div>
                                        </Col>
                                    </Row>
                                    {editMsg?<Row className={styles.footerBox}>
                                        <Button onClick={this.cancelEdit.bind(this,"msg")}>取消</Button>
                                        <Button type="primary" onClick={this.saveInfo.bind(this,'msg')}>保存</Button>
                                    </Row>:null}
                                </Card>
                            </Col>
                            <Col span={12} >
                                  <Card>
                                    <Row className={styles.topTitle}>
                                        <h2 className={styles.h2}>联系方式</h2>
                                        {editCont?null:<Button className={styles.btn} onClick={this.onEdit.bind(this,"contact")}>编辑</Button>}
                                    </Row>
                                    <Row gutter={16} type="flex" >
                                        <Col span={12} className={styles.cardBox}>                                       
                                            <div className={styles.boxDiv}>
                                                <label htmlFor="">单位电话:</label> 
                                                {editCont?rendInput("enterpriseTel",'textarea'):<div>{basicObj&&basicObj.enterpriseTel}</div>}
                                            </div>
                                        </Col>
                                        <Col span={12} className={styles.cardBox}>                                       
                                            <div className={styles.boxDiv}>
                                            <label htmlFor="">单位传真:</label>
                                            {editCont?rendInput("enterpriseFax",'textarea'):<div>{basicObj&&basicObj.enterpriseFax}</div>}
                                            </div>
                                        </Col>
                                        <Col span={24} className={styles.cardBox} style={{padding:0}}> 
                                            <Form>
                                            {basicObj?iContact.map((item,index)=>{
                                                return <Row key={index} gutter={16} style={{margin:0}}>
                                                    <Col span={12} className={styles.cardBox}>                                       
                                                        <div className={styles.boxDiv}>
                                                        <FormItem
                                                        label='联系人'
                                                        >
                                                        {editCont?getFieldDecorator('name'+index, {
                                                            initialValue:item.name
                                                        })(
                                                            rendInput(item,'list','name',index)
                                                        ):<div>{item.name||""}</div>}
                                                        </FormItem>
                                                        {/* <label htmlFor="">联系人{index+1}:</label>
                                                            {editCont?rendInput(item,'list','name',index):<div>{item.name||""}</div>} */}
                                                        </div>
                                                    </Col>
                                                    <Col span={12} className={styles.cardBox}>                                       
                                                        <div className={styles.boxDiv}>
                                                        <FormItem
                                                        label='联系电话'
                                                        >
                                                        {editCont?getFieldDecorator('phone'+index, {
                                                            rules: [{validator:t.checkPhone}],
                                                            initialValue:item.telephone
                                                        })(
                                                            rendInput(item,'list','telephone',index)
                                                        ):<div>{item.telephone||""}</div>}
                                                        </FormItem>
                                                        {/* <label htmlFor="">联系电话:</label>
                                                        {editCont?rendInput(item,'list','telephone',index):<div>{item.telephone||""}</div>} */}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            }):null}
                                            </Form>
                                        </Col>
                                    </Row>
                                    {editCont?<Row className={styles.footerBox}>
                                        <Button onClick={this.cancelEdit.bind(this,"contact")}>取消</Button> 
                                        <Button type="primary" onClick={this.saveInfo.bind(this,'contact')}>保存</Button>
                                    </Row>:null}
                                </Card>
                            </Col>
                        </Row>        
                    </div>
                 </Col>
            </Row>
        </div>
        )
    }
}

export default Form.create()(BasicInfor);