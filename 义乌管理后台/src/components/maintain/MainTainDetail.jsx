/**
 * Created by author on 2017/4/25.
 */
import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { Steps, Popover, Button, Modal, Icon, message,Rate,Input,Badge } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import styles from './maintain.module.less'
import API from '@/mock';
import {post} from '../../axios/tools';
import 'antd/dist/antd.css';
import moment from 'moment';

const Step = Steps.Step;
// const monthFormat = 'YYYY-MM';
const { TextArea } = Input;
class DetailInfor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			loading: false,
			id: null,
			dataList: [],
			stepDataList: [],
			nowCurrent: 0,
			retaValue:'',
			ratevalue:'',
			phone:""
		}
	};
	componentDidMount(){
        let iStr = window.location.hash;
		let id = null;
		iStr.replace(/\d+/g,function(r,index,str){
			id = r;
		});
		if(id){
			this.setState({id: id});
			this.getMainTainStep(id);
			this.getMainTainDetail(id);
		}
		
		this.loadPhoneInfo();
	}
	loadPhoneInfo(){
		let t=this,params = {url:API.API_COMPANY_REPAIR_GET_PHONE};
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
	getMainTainDetail(id) {
		let t=this,
		state=this.state,
		params = {url:API.API_COMPANY_REPAIR_GET,data:{repairId: id}};
        t.setState({loading:true});
        post(params).then(function(res){
            if(res&&res.code===10000){
                t.setState({dataList:res.data||[],loading:false});
            }else{
                message.warn((res&&res.message)||'系统出错，请联系管理员!');
            }
        }).catch=(err)=>{
            t.setState({loading:false})
            console.log("==error==",err)
        }
	}
	getMainTainStep(id) {
		let t=this,
		state=this.state,
		params = {url:API.API_COMPANY_REPAIR_STEP,data:{repairId: id}};
        t.setState({loading:true});
        post(params).then(function(res){
            if(res&&res.code===10000){
                t.setState({stepDataList:res.data||[],loading:false});
				res.data.map(function(item, i){
					if(item.type == 1){
						t.setState({nowCurrent: i});
					}
				})
            }else{
                message.warn((res&&res.message)||'系统出错，请联系管理员!');
            }
        }).catch=(err)=>{
            t.setState({loading:false})
            console.log("==error==",err)
        }
	}
	showModal = () => {
		this.setState({
			visible: true,
		});
	}
	handleOk = () => {
		this.setState({ loading: true });
		let t=this,
		id = this.state.id,
		params = {url:API.API_COMPANY_REPAIR_UPDATE,data:{repairId: id}};
        post(params).then(function(res){
            if(res&&res.code===10000){
                // t.setState({dataList:res.data||[],loading:false});
				message.success('操作成功！');
				t.handleCancel();
				t.getMainTainDetail(id);
            }else{
                message.warn((res&&res.message)||'系统出错，请联系管理员!');
            }
        }).catch=(err)=>{
            t.setState({loading:false})
            console.log("==error==",err)
        }
	}
	handleCancel = () => {
		this.setState({ visible: false });
	}
	  rateChange = (value) => {
	    this.setState({ ratevalue:value });
	  }
    rateOk = () => {
		if(!this.state.ratevalue){
			message.warn('请为服务打分！');
		}else{
			let param='';
			if(!this.state.retaValue){param={score:this.state.ratevalue,repairId:this.state.id}}else{param={score:this.state.ratevalue,scoreRemark:this.state.retaValue,repairId:this.state.id}}
			const t=this, params = {url:API.API_COMPANY_REPAIR_COMMENT,data:param};
			post(params).then(function(res){
				if(res&&res.code===10000){
					message.success('操作成功！');
					t.setState({reatvisible: false});
					t.getMainTainDetail(t.state.id);
				}else{
					message.warn(res.message||'系统出错，请联系管理员!');
				}
			}).catch=(err)=>{
				t.setState({loading:false})
				console.log("==error==",err)
			}
		}
	  }
    rateCancel = () => {
        this.setState({
			reatvisible: false,
		});
	  }
    rateModal=(id)=>{
		this.setState({
			reatvisible: true
		});
	  }

	renderCurrrentState() {
		const { dataList } = this.state;
		const time = moment(dataList.modifyTime).format("YYYY-MM-DD, HH:mm:ss");
		let iCont = null;
		switch(dataList.status){
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
		};
		return (
			<div className={styles.currentStateChunk}>
				<div className={styles.state_left}>
					<span style={{marginRight: '20px'}}>当前状态: &nbsp;&nbsp;{iCont}{
						dataList.status === 'WSL'?' 未受理':(dataList.status === 'YSL'?' 已受理':(dataList.status === 'YXF'?' 已修复':(dataList.status === 'DH'?' 打回':'撤回')))
					}</span>
					<span>状态更新时间: {time}</span>
				</div>
				<div className={styles.state_right}>
					{
						dataList.canRevoke === 1?<Button className={styles.reback} onClick={this.showModal}>撤销</Button>
						:
						(dataList.status === 'CH'?<span>撤回原因: {dataList.closeReason}</span>:'')
					 }
					 { 
					 	dataList.canComment===1?<Button className={styles.rate} onClick={this.rateModal}>服务评价</Button>:null
					 }
					
					<Modal
						title="报修打分"
						visible={this.state.reatvisible}
						onOk={this.rateOk}
						onCancel={this.rateCancel}
						>
						<span style={{color:"red"}}>*</span>服务评价：<Rate onChange={this.rateChange}/><br />
						<span style={{marginTop:"30px",display:"inline-block"}}>评价内容：</span><TextArea 
						placeholder="请对此次报修进行评价（选填内容在50字以内）" 
						autosize={{ minRows: 5, maxRows: 6 }} 
						style={{marginTop:"30px",verticalAlign:"top",width:"80%"}} 
						maxLength="50"
						onChange={(e) => {
							  this.setState({
								  retaValue: e.target.value
							  });
							  }
						} />
					</Modal>
				</div>
			</div>
		)
	}

	renderRepairDetail() {
		const { dataList } = this.state;
		return (
			<div className={styles.detailLeft}>
				<div  className={styles.detailLeft_title}><span className={styles.title_l} /><span>报修详情</span></div>
				<div className={styles.detailLeft_content}>
					<div className={styles.detailLeft_content_chunk}>
						<span className={styles.detailLeft_content_title}>报修事由</span>
						<div className={styles.detailLeft_content_date}>{dataList.title||""}</div>
					</div>
			
					<div className={styles.detailLeft_content_chunk}>
						<span className={styles.detailLeft_content_title}>报修简述</span>
						<div className={styles.detailLeft_content_date}>{dataList.remark||""}</div>
					</div>
					<div className={styles.detailLeft_content_contact}>
						<div className={styles.detailLeft_content_contact_left}>
							<span className={styles.detailLeft_content_title}>报修企业</span>
							<div>{dataList.companyName||""}</div>
						</div>
						<div className={styles.detailLeft_content_contact_right}>
							<span className={styles.detailLeft_content_title}>报修地址</span>
							<div>{dataList.address||""}</div>
						</div>
					</div>
					<div className={styles.detailLeft_content_contact}>
						<div className={styles.detailLeft_content_contact_left}>
							<span className={styles.detailLeft_content_title}>联系人</span>
							<div>{dataList.contactName||""}</div>
						</div>
						<div className={styles.detailLeft_content_contact_right}>
							<span className={styles.detailLeft_content_title}>联系电话</span>
							<div>{dataList.contactPhone||""}</div>
						</div>
					</div>
					<div className={styles.detailLeft_content_chunk}>
						<span className={styles.detailLeft_content_title}>报修评价</span><Rate disabled value={dataList.score || ""} style={{float:'right'}}/>
						<div className={styles.detailLeft_content_date}>{dataList.scoreRemark || "暂无评价"}</div>
					</div>
				</div>
			</div>
		);
	}

	renderProgress() {
		const { stepDataList, nowCurrent,phone } = this.state;
		return (
			<div>
				<div className={styles.progress}>
					<div><span className={styles.title_l} /><span className={styles.progress_title}>处理进度</span></div>
					<div className={styles.stepsContent}>
						<Steps
							current={nowCurrent}
							direction="vertical"
							size="small"
							progressDot
						>
						{stepDataList?stepDataList.map(function (item,i) {
							return (
								<Step title={item.statusTitle} key={item.status} description={moment(item.modifyTime).format("YYYY-MM-DD, HH:mm:ss")} />
							)
						}):''}
						</Steps>
					</div>
				</div>
				<div className={styles.telphone}>
					<div className={styles.gutterbox} style={{overflow:'hidden'}}>
						<div className={styles.YleftPhone}>
								<div style={{padding:'15px 16px 32px 32px'}}>
										<Icon type="phone" style={{ fontSize: 42, color: '#328DFF'}} />
								</div>
						</div>
						
						<div className={styles.YrightNumber}>
								<p style={{padding:'15px 0px 0px 0px', fontSize:14, color:'#999999'}}>报修联系电话</p>
								<p style={{padding:'0px 0px 32px 0px', fontSize:20, color:'#333333'}}>{phone}</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
	render() {
		const { visible, confirmLoading, ModalText } = this.state;
		return (
			<div className={styles.gutterexample}>
				<div className={styles.header}>
					<BreadcrumbCustom first="报修反馈" second="报修详情"/>
					<div>
						<span className={styles.headerB}>报修详情</span>
						<Link to={"/app/maintain"}>
							<Button icon="rollback" className={styles.returnBtn}>返回</Button>
						</Link>
					</div>
					
				</div>
				{
					this.renderCurrrentState()
				}
				<div className={styles.repairContent}>
					<div className={styles.repairLeft}>
						{this.renderRepairDetail()}
					</div>
					<div className={styles.repairRight}>
						{this.renderProgress()}
					</div>
				</div>
				<Modal
				visible={visible}
				title="是否确认要撤销报修申请"
				onOk={this.handleOk}
				onCancel={this.handleCancel}
				footer={[
					<Button key="back" onClick={this.handleCancel} style={{borderRadius:"100px"}}>取消</Button>,
					<Button key="submit" type="primary" loading={this.loading} onClick={this.handleOk} style={{borderRadius:"100px"}}>
					提交
					</Button>,
				]}
				>
					<p>确认后您的报修申请将被关闭</p>
				</Modal>
			</div>
		)
	}
}

export default DetailInfor;