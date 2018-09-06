/**
 * Created by xutao on 2018/4/26.
 */
import React, { Component } from 'react';
import { Row, Col, Card ,Table,Popconfirm ,Button,message} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import API from '@/mock'
import TabComp from '../modules/TableComp';

import {post} from '../../axios/tools';
import styles from './company.module.less';
import AddPanel from '@/components/modules/addPanel';

class CompanyType extends Component {
	constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {
            editType:"",
            list:[],page:1,pageSize:10,
			loading:false,
			typeList:[],
            editName:"",editId:"",
            status:'',
        };
    }
    componentDidMount(){
        let t=this;
		t.loadData();
        t.loadTypeList();
	}
	loadTypeList=()=>{
		let t=this;
		let params = {url:API.API_COMPANY_TYPE_LIST,data:{source:2}};
		post(params).then(function(res){
			if(res&&res.code===10000){
                t.setState({typeList:res.data.list});
            }else{
                message.warning(res.data.message||"系统出错，请联系管理员");
                t.setState({loading:false})
			}
        }).catch=(err)=>{
            t.setState({loading:false,editType:""})
            console.log("==error==",err)
        }
	}
    loadData=(page,pageSize)=>{
        let t=this;
        t.setState({loading:true});
        let params = {url:API.API_COMPANY_TYPE_LIST,data:{page:page||this.state.page,size:pageSize||this.state.pageSize}};
        post(params).then(function(res){
            if(res&&res.code===10000){
                t.setState({list:res.data.list,loading:false,editType:""});
            }else{
                t.setState({loading:false,editType:""});
            }
        }).catch=(err)=>{
            t.setState({loading:false,editType:""})
            console.log("==error==",err)
        }
    }
    loadColumn(){
        let columns = [],t=this;
        columns = [{
            title: '类型名称',
            dataIndex: 'name',
            key: 'name',
            width:400
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => {
                let id = record.id||"",name=record.name||"",status=record.status||"";
                return <span>{name==='未知'?null:<span className={styles.actText}>
                    <a onClick={t.edit.bind(t,record)}>编辑</a>
                    <Popconfirm title="确认删除?" onConfirm={t.delete.bind(t,id)}>
                        <a href="###">删除</a>
                    </Popconfirm></span>}
                </span>
            }
        }];
        return columns;
    }
    edit=(record,status)=>{
         this.setState({editName:record.name,editId:record.id,addVisible:true,editType:"edit",status:record.status});
    }
    delete(id){
        let t=this,params = {url:API.API_COMPANY_TYPE_UPDATE,data:{id:id,status:-1}}
        t.setState({loading:true})
        post(params).then(function(res){
            if(res&&res.code===10000){
                message.info("删除成功");
                t.setState({loading:false})
                t.loadData();
            }else{
                message.warning(res.data.message||"系统出错，请联系管理员");
                t.setState({loading:false})
			}
        }).catch=(err)=>{
            console.log("==error==",err);
            t.setState({loading:false})
        }
    }
    addType=()=>{
        this.setState({editType:"add",addVisible:true});
    }
    cancelAdd=()=>{
        this.setState({editType:"",addVisible:false,editName:""});
    }
    submitType=(name)=>{
        let t=this,state=this.state;
        //根据类型确定是编辑提交还是新增提交
        t.setState({loading:true})
		let params = state.editType==="edit"?{url:API.API_COMPANY_TYPE_UPDATE,data:{id:state.editId,name:name}}:{url:API.API_COMPANY_TYPE_ADD,data:{typeNames:[name]}};
		post(params).then(function(res){
			if(res&&res.code===10000){
				message.success("操作成功！");
				t.setState({addVisible:false,editName:"",editType:"",loading:false});
				t.loadData();
			}else{
                message.warning(res.data.message||"服务出错，请联系管理员")
                t.setState({loading:false})
			}
		}).catch=(err)=>{
			t.setState({loading:false,editType:""})
			console.log("==error==",err)
		}
    }
    render(){
        var t=this,state=t.state;
        let pageProps ={
            page:state.page,pageSize:state.pageSize,
            showSizeChanger:true,showQuickJumper:true,
            showTotal:this.showTotal
        };
        let columns = t.loadColumn();
        return (
            <div>
                <div className={styles.topPanel}>
					<BreadcrumbCustom first="入驻企业管理" second="企业类型" />
                    <h3>企业类型</h3>
                </div>
                <Row type="flex" justify="center">
                    <Col md={23}>
                        <div className="gutter-box">
                            <Card className={styles.personCard} title={<Button type="primary" className={styles.personBtn} onClick={t.addType}>新增类型</Button>} bordered={false}>                                
                                <TabComp loading={this.state.loading} columns={columns} list={state.list||[]} rowKey="id" loadList={this.loadData} total={state.count} />
                                {/* <Table loading={this.state.loading} pagination={pageProps} columns={t.loadColumn()} dataSource={this.state.list||[]} rowKey="id" />                                 */}
                            </Card>
                        </div>
                    </Col>
                </Row>
				{this.state.addVisible?<AddPanel title={state.editType==="add"?"新增企业类型":"编辑企业类型"} name={this.state.editName} onCancel={this.cancelAdd} onSubmit={this.submitType} />:null}
            </div>
        ) 
    }
}

export default CompanyType;