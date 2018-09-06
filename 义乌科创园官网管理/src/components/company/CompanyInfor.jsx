/**
 * Created by xutao on 2018/4/26.
 */
import React, { Component } from 'react';
import { Row, Col, Card ,Table,Popconfirm ,Button,message,Select} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import API from '@/mock'
import TabComp from '../modules/TableComp';
import moment from 'moment';
import {post} from '../../axios/tools';
import styles from './company.module.less';
import EditCompany from './EditCompany';

const Option = Select.Option;
class CompanyInfor extends Component {
	constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {
            editType:"",
            list:[],page:1,pageSize:10,
			loading:false,count:0,
			typeList:[],typeID:null,
            formInfo:{
                companyId:'',
                companyName:'',content:'',
                url:'',typeId:''
            }
        };
    }
	componentWillMount(){
		this.loadTypeList();
    }
    componentDidMount(){
        // const { fetchData } = this.props;
        // fetchData({funcName: 'getNewsList', stateName: 'check'});
        let t=this;
		t.loadData();
	}
	loadTypeList=()=>{
		let t=this;
		let params = {url:API.API_COMPANY_TYPE_LIST,data:{source:2}};
		post(params).then(function(res){
			if(res&&res.code===10000){
                t.setState({typeList:res.data.list});
            }else{
                t.setState({loading:false,editType:""})
				message.warning(res.data.message||"系统出错，请联系管理员")
			}
        }).catch=(err)=>{
            t.setState({loading:false,editType:""})
            console.log("==error==",err)
        }
	}
    loadData=(page,size,id)=>{
        let t=this;
        t.setState({loading:true});
        let params = {url:API.API_COMPANY_LIST,data:{page:page||this.state.page,size:size||this.state.pageSize,source:2,typeId:id||t.state.typeID}};
        if(id!=='all'){
            params["typeId"] = id ||'';
        }
        post(params).then(function(res){
            if(res&&res.code===10000){
                t.setState({list:res.data.list,loading:false,editType:""});
            }else{
                t.setState({loading:false,editType:""})
				message.warning(res.data.message||"系统出错，请联系管理员")
			}
        }).catch=(err)=>{
            t.setState({loading:false,editType:""})
            console.log("==error==",err)
        }
	}
	typeChange=(val)=>{
        this.setState({typeID:val})
		this.loadData(this.state.page,this.state.pageSize,val);
	}
    loadColumn(){
        let columns = [],t=this;
        columns = [{
            title: '企业名称',
            dataIndex: 'name',
            key: 'name',
            width:400,
            render: (text,record,index)=>{
                let isTop = record.isTopset;
                return <div className={styles.tabItem}>
                    <p key={record.name}>{isTop?<label className={styles.topLabel}>置顶</label>:""}{record.name}</p>
                </div>
            },
        }, {
            title: '类型',
            dataIndex: 'typeName',
            key: 'typeName'
        }, {
            title: '操作人',
            dataIndex: 'modifier',
            key: 'modifier',
        }, {
            title: '操作时间',
            dataIndex: 'modifyTime',
            key: 'modifyTime',render:(text) =>{
                return moment(text).format('YYYY-MM-DD');
            }
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => {
                let isTop =record.isTopset;
                let id = record.id||"";
                return <span className={styles.actText}>
                    <a onClick={t.edit.bind(t,id)}>编辑</a>
                    <Popconfirm title="确认删除?" onConfirm={t.delete.bind(t,id,isTop)}>
                        <a href="###">删除</a>
                    </Popconfirm>
                    <a onClick={t.toggTop.bind(t,id,isTop?0:1)} className={isTop?styles.red:""} >{isTop?"取消置顶":"置顶"}</a>
                </span>
            }
        }];
        return columns;
    }
    edit=(id)=>{
        let t=this,params = {url:API.API_COMPANY_GET,data:{companyId:id}};
        t.setState({loading:true})
		post(params).then(function(res){
            if(res&&res.code===10000){
                t.setState({
					editType:"edit",
                    formInfo:{...res.data},
                    loading:false
				})
            }else{
                message.warn(res.message)
                t.setState({loading:false})
            }
        }).catch=(err)=>{
            t.setState({loading:false})
            console.log("==error==",err)
        }
    }
    delete(id,isTop){
        let t=this,params = {url:API.API_COMPANY_UPDATE,data:{companyId:id,status:-1}}
        t.setState({loading:true})
        post(params).then(function(res){
            if(res&&res.code===10000){
                message.info("删除成功");
                t.setState({loading:false})
                t.loadData();
            }else{
                message.warn(res.message);
                t.setState({loading:false})
            }
        }).catch=(err)=>{
            t.setState({loading:false})
            console.log("==error==",err)
        }
    }
    toggTop(id,isTop){
        let t=this,params = {url:API.API_COMPANY_UPDATE,data:{companyId:id,isTopset:isTop}}
        t.setState({loading:true})
        post(params).then(function(res){
            if(res&&res.code===10000){
                message.info("操作成功");
                t.setState({loading:false})
                t.loadData();
            }else{
                message.warn(res.message);
                t.setState({loading:false})
            }
        }).catch=(err)=>{
            t.setState({loading:false})
            console.log("==error==",err)
        }
    }
    addPerson=()=>{
        this.setState({editType:"add",formInfo:{id:"",name:"",title:"",company:"",avator:""}});
    }
    cancel=()=>{
        this.setState({editType:""});
    }
    submit=(iObj)=>{
        let t=this,params = {url:API.API_COMPANY_SAVE_OR_UPDATE,data:iObj};
        t.setState({loading:true})
        post(params).then(function(res){
            if(res&&res.code===10000){
                t.loadData();
                message.success("操作成功！");
                t.setState({loading:false})
            }else{
                message.warn(res.message);
                t.setState({loading:false})
            }
        }).catch=(err)=>{
            t.setState({loading:false})
            console.log("==error==",err)
        }
    }
    render(){
        var t=this,state=t.state;
        let columns = t.loadColumn();
		let titleCont =<div>
			<Button type="primary" className={styles.personBtn} onClick={t.addPerson}>新增企业</Button>
			<Select style={{marginLeft:"20px",width:"128px"}} defaultValue="0" onChange={t.typeChange}>
				<Option key="all" value="0">所有企业类型</Option>
				{state.typeList&&state.typeList.length?
					state.typeList.map((item,index)=><Option key={item.id} value={item.id}>{item.name}</Option>)
					:null}
			</Select>
		</div>
		
        return (
            <div>
                <div className={styles.topPanel}>
                    {this.state.editType?this.state.editType==="add"?<BreadcrumbCustom first="入驻企业管理" second="新增企业" />:
                            <BreadcrumbCustom first="入驻企业管理" second="编辑企业" />
                    :<BreadcrumbCustom first="入驻企业管理" />}
                    <h3 style={{display:"inline-block"}}>{this.state.editType?this.state.editType==="add"?"新增企业":"编辑企业":"入驻企业管理"}</h3>
                    {this.state.editType?<Button size="small" style={{marginLeft:'8px',verticalAlign:"text-bottom"}} icon="rollback" onClick={this.cancel} >返回</Button>:null}
                </div>
                <Row type="flex" justify="center">
                    <Col md={23}>
                        <div className="gutter-box">
                            {!this.state.editType?<Card className={styles.personCard} title={titleCont} bordered={false}>
                            <TabComp loading={this.state.loading} columns={columns} list={state.list||[]} rowKey="id" loadList={this.loadData} total={state.count} />
                            {/* <Table loading={this.state.loading} pagination={pageProps} columns={t.loadColumn()} dataSource={this.state.list||[]} rowKey="id" /> */}
                            </Card>:<EditCompany typeList={state.typeList} type={this.state.editType} content={state.formInfo.content} typeId={state.formInfo.typeId}
                                loadTypeList={t.loadTypeList} company={state.formInfo.companyName} companyId={state.formInfo.companyId} avator={state.formInfo.url} cancel={this.cancel} submitInfo={this.submit} />}
                        </div>
                    </Col>
                </Row>
            </div>
        ) 
    }
}

export default CompanyInfor;