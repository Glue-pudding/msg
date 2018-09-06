/**
 * Created by author on 2017/4/25.
 */
import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { Row, Col, Card, Tabs, Icon, Radio, Button ,Input, Table, message, Modal, Form,Divider,Badge,Rate} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import styles from './maintain.module.less'
import API from '@/mock';
import {post} from '../../axios/tools';
import moment from 'moment';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const monthFormat = 'YYYY-MM-dd';
const { TextArea } = Input;


class BasicInfor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,listCount:0,reatvisible:false,ratevalue:this.props.ratevalue || null,
			maintainList:null,page:1,pageSize:10,retaValue:''|| null,id:''|| null,
			modalObj:null,phone:""
		};
	};
	componentDidMount(){
		this.loadMaintainList();
		this.loadPhoneInfo();
	}
	loadPhoneInfo(){
		let t=this,state=this.state,
		params = {url:API.API_COMPANY_REPAIR_GET_PHONE};
        post(params).then(function(res){
            if(res&&res.code===10000){
                t.setState({phone:res.data});
            }else{
                message.warn((res&&res.message)||'系统出错，请联系管理员!');
            }
        }).catch=(err)=>{
            t.setState({loading:false});
        }
	}
    loadMaintainList(page,size){
        let t=this,state=this.state,
		params = {url:API.API_REPAIR_LIST,data:{page:page||state.page,size:size||state.pageSize}};
        t.setState({loading:true});
        post(params).then(function(res){
            if(res&&res.code===10000){
                t.setState({maintainList:res.data.list,loading:false,listCount:res.data.count});
            }else{
                t.setState({loading:false});
                message.warn((res&&res.message)||'系统出错，请联系管理员!');
            }
        }).catch=(err)=>{
            t.setState({loading:false});
        }
    }
	showModal = () => {
			this.setState({
					visible: true,
			});
	};


	handleOk = (e) => {
        e.preventDefault();
        let t=this,state = t.state;
        this.props.form.validateFields((err, values) => {
			if (err) {
				console.log('请确认表单信息: ', values);
				return false;
			}else{
				let iObj = {
					title:values.reason,remark:values.content,
					contactName:values.member,contactPhone:values.phone,
					address:values.address
				}
				if(state.modalObj){
					iObj["repairId"] = state.modalObj.repairId;
				}
				t.submitInfo(iObj);
			}
        });
	};

	submitInfo=(param)=>{
        let t=this, state=this.state,
            params = {url:API.API_COMPANY_REPAIR_ADD,data:param};
        post(params).then(function(res){
            if(res&&res.code===10000){
				message.success('操作成功！');
                t.handleCancel();
                t.loadMaintainList();
            }else{
                message.warn(res.message||'系统出错，请联系管理员!');
            }
        }).catch=(err)=>{
            t.setState({loading:false})
            console.log("==error==",err)
        }
    }
	handleCancel = (e) => {
		this.setState({visible:false,modalObj:null})
	};
	callback = (key) => {
			console.log(key);
	};
	handleModeChange = (e) => {
			const mode = e.target.value;
			this.setState({ mode });
	};
	onChange = (activeKey) => {
			this.setState({ activeKey });
	};
	add = () => {
			const panes = this.state.panes;
			const activeKey = `newTab${this.newTabIndex++}`;
			panes.push({ title: 'New Tab', content: 'New Tab Pane', key: activeKey });
			this.setState({ panes, activeKey });
	};
	remove = (targetKey) => {
			let activeKey = this.state.activeKey;
			let lastIndex;
			this.state.panes.forEach((pane, i) => {
				if (pane.key === targetKey) {
					lastIndex = i - 1;
				}
			});
			const panes = this.state.panes.filter(pane => pane.key !== targetKey);
			if (lastIndex >= 0 && activeKey === targetKey) {
					activeKey = panes[lastIndex].key;
			}
			this.setState({ panes, activeKey });
	};

    rateChange = (value) => {
	    this.setState({ ratevalue:value });
	  }
    rateOk = () => {
		let param='';
		if(!this.state.retaValue){param={score:this.state.ratevalue,repairId:this.state.id}}else{param={score:this.state.ratevalue,scoreRemark:this.state.retaValue,repairId:this.state.id}}
		const t=this, params = {url:API.API_COMPANY_REPAIR_COMMENT,data:param};
		post(params).then(function(res){
            if(res&&res.code===10000){
                message.success('操作成功！');
				t.setState({reatvisible: false});
            }else{
                message.warn(res.message||'系统出错，请联系管理员!');
            }
        }).catch=(err)=>{
            t.setState({loading:false})
            console.log("==error==",err)
        }

	  }
    rateCancel = () => {
        this.setState({
			reatvisible: false,
		});
	  }
    rateModal=(id)=>{
		this.setState({
			reatvisible: true,id:id
		});
	  }

	getColumns(){
		let columns=[],t=this;
		columns=[{
			title: '报修事由',
			dataIndex: 'title',
			key: 'title',
			render: text => <a href= "javascript:;">{text||""}</a>,
		}, {
			title: '状态',
			dataIndex: 'statusTitle',
			key: 'statusTitle',
			render:(r,k)=>{
				let iCont = null;
				switch(k.status){
					case 'WSL':
						iCont = <Badge status="error" />;
						break;
					case 'YXF':
						iCont = <Badge status="success" />;
						break;
					case 'YSL':
						iCont = <Badge status="warning" />;
						break;
					case 'DH':
						iCont = <Badge status="default" />;
						break;
					default:
						iCont = <Badge status="default" />;
				}
                return <label>{iCont} {r}</label>;
			}
		}, {
			title: '更新时间',
			dataIndex: 'modifyTime',
			key: 'modifyTime',
            render: text => <span>{text?moment(text).format("YYYY-MM-DD, HH:mm:ss"):""}</span>,
		}, {
			title: '操作',
			key: 'action',
			render: (text, record) => {				
				let iStatus = record.status;
				return <span>
					<Link to={"/app/maintain/"+record.id}>详情</Link>
					{iStatus==='WSL'?<span><Divider type="vertical" /><a onClick={t.onEdit.bind(t,record.id)}>编辑</a></span>:null}
				</span>
			},
		}];
		return columns;
	}
	onEdit=(id)=>{
		let t=this,params = {url:API.API_COMPANY_REPAIR_GET,data:{repairId:id}};
		post(params).then(function(res){
            if(res&&res.code===10000){
                t.setState({modalObj:res.data,visible:true});
            }else{
                message.warn((res&&res.message)||'系统出错，请联系管理员!');
            }
        }).catch=(err)=>{
            console.log("==error==",err)
        }
	}
	checkAccount(rule, value, callback) {
		//正则用//包起来
		var regex = /^((\+)?86|((\+)?86)?)0?1[3458]\d{9}$/; 
		if (value) {
			//react使用正则表达式变量的test方法进行校验，直接使用value.match(regex)显示match未定义
			if (regex.test(value)) { 
				callback();
			} else { 
				callback('请输入正确的手机号码！');
			}
		} else {
			//这里的callback函数会报错
		}
	}
	
    pageChange=(page,pageSize)=>{
        this.setState({page,pageSize})
        this.loadMaintainList(page,pageSize);
    }
    sizeChange=(current,size)=>{
        this.setState({page:current,pageSize:size});
        this.loadMaintainList(current,size);
    }
	render() {
		const { page,pageSize,maintainList, modalObj,phone } = this.state;
		const columns = this.getColumns();
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
		  
		let pageProps ={
            page:page,pageSize:pageSize,
            showSizeChanger:true,showQuickJumper:true,
            onShowSizeChange:this.sizeChange,onChange:this.pageChange,
            showTotal:(total)=>`共 ${total} 条`
        }
		return (
				<div className={styles.gutterexample}>
						<div className={styles.header}>
							<BreadcrumbCustom first="报修反馈"/>
                			<div className={styles.headerB}>报修反馈</div>
						</div>
						<div className={styles.gutterexample} style={{margin:'28px 28px 0px 28px'}}>
						<Row gutter={32}>
						<Col className={styles.gutterrow} span={18}>
								<div className={styles.gutterbox}>
										<Button type="primary" className={styles.Ybut} onClick={this.showModal}>新增报修</Button>
										<div style={{background:'#FFFFFF'}}>
												<Table style={{padding:'0px 32px 32px 32px'}} rowKey='id' pagination={pageProps} columns={columns} dataSource={maintainList} />
										</div>
								</div>
								{/* <div style={{background:'#FFFFFF'}}>
										<Table style={{padding:'0px 32px 32px 32px'}} columns={columns} dataSource={data} />
								</div> */}
						</Col>
						<Col style={{padding:0}} span={6}>
							<div className={styles.gutterbox} style={{overflow:'hidden'}}>
								<div className={styles.YleftPhone}>
									<div style={{padding:'32px 16px 32px 32px'}}>
											<Icon type="phone" style={{ fontSize: '3em', color: '#328DFF'}} />
									</div>
								</div>
								
								<div className={styles.YrightNumber}>
									<p style={{padding:'32px 0px 0px 0px', fontSize:14, color:'#999999'}}>报修联系电话</p>
									<p style={{padding:'0px 0px 32px 0px', fontSize:20, color:'#333333'}}>{phone}</p>
								</div>
							</div>
						</Col>
						</Row>
						
						</div>
						{this.state.visible?<Modal
						title="新增报修" width='568px' className={styles.modalBox}
						visible={this.state.visible}
						onOk={this.handleOk}
						onCancel={this.handleCancel}
						okText="提交"
						>
							<Form>
								<FormItem {...formItemLayout} label="报修事由" >
									{getFieldDecorator('reason', {
										rules: [{ required: true, message: '请输入报修事由'}],
										initialValue:modalObj?modalObj.title||'':''
									})(
										<Input placeholder="请输入保修事由" />
									)}
								</FormItem>
								<FormItem
									{...formItemLayout}
									label="联系人"
									>
									{getFieldDecorator('member', {
										rules: [{ required: true, message: '请输入联系人'}],
										initialValue:modalObj?modalObj.contactName||'':''
									})(
										<Input placeholder="请输入联系人" />
									)}
								</FormItem>
								<FormItem
									{...formItemLayout}
									label="联系电话"
									>
									{getFieldDecorator('phone', {
										rules: [{type:'string', required: true, message: '请输入联系电话!' },{
											validator: this.checkAccount,
										}],
										initialValue:modalObj?modalObj.contactPhone||'':''
									})(
										<Input placeholder="请输入联系电话" onBlur={this.checkAccount}/>
									)}
								</FormItem>
								<FormItem
									{...formItemLayout}
									label="报修地址"
									>
									{getFieldDecorator('address', {
										rules: [{type:'string', required: true, message: '请输入报修地址!' }],
										initialValue:modalObj?modalObj.address||'':''
									})(
										<Input placeholder="请输入报修地址" />
									)}
								</FormItem>
								{/* <FormItem
									{...formItemLayout}
									label="报修公司"
									>
									{getFieldDecorator('company', {
										rules: [{type:'string', required: true, message: '请输入报修公司!' }],
										initialValue:modalObj?modalObj.companyName||'':''
									})(
										<Input placeholder="请输入报修公司" />
									)}
								</FormItem> */}
								<FormItem
									{...formItemLayout}
									label="报修简述"
									>
									{getFieldDecorator('content',{initialValue:modalObj?modalObj.remark||'':''})(
										<TextArea rows={4} placeholder="请输入保修简述" />
									)}
								</FormItem>
							</Form>
					</Modal>:null}
			</div>
		)
	}
}

export default Form.create()(BasicInfor);