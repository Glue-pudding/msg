/**
 * authored on 2017/4/15.
 */
import React, { Component } from 'react';
import { Row, Col, Table, Popconfirm, Button, message, Tabs, LocaleProvider } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { connect } from 'react-redux';
import TabComp from '../modules/TableComp';

import API from '@/mock';
import EditPolicy from './Editpolicy';

import {get,post} from '../../axios/tools';
import styles from './Banner.module.less';
const TabPane = Tabs.TabPane;


class BannerInfor extends Component{
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {
            editType:"",
            list:[],
            page:1,
            pageSize:10,
            loading:false,iconLoading:false,
            formInfo:{
                policyId:'',title:'',
                avator:'',company:'',
                subject:'',
                typeName:'',
                typeId:'',
                filePath:''
            },
            filePath:'',
            count:0,key:1,
            defaultActiveKey:"1",
            bannerContent:"1",
        };
        this.loadData = this.loadData.bind(this);
        
    }
    
    componentDidMount(){
        // const { fetchData } = this.props;
        // fetchData({funcName: 'getNewsList', stateName: 'check'});
        let t=this;
        t.loadData(this.state.page,this.state.pageSize,1);
    }
    loadData=(page,size,key)=>{
        let t=this;
        t.setState({loading:true});
        let params = {url:API.API_POLICY_LIST,data:{page:page||this.state.page,size:size||this.state.pageSize,typeId:key}};
        post(params).then(function(res){
            if(res&&res.code===10000){
                t.setState({list:res.data.list,loading:false,editType:"",count:res.data.count});
            }else{
                t.setState({loading:false,editType:""})
                message.warn(res.message||"系统出错，请联系管理员!");
            }
        }).catch=(err)=>{
            t.setState({loading:false,editType:""});
            console.log("==error==",err);
        }
    }

    callback(key, me) {
        let t=this,iType=key.toString();
        t.setState({loading:true,bannerContent:key});
        let params = {url:API.API_POLICY_LIST,data:{page:this.state.page,size:this.state.pageSize,typeId:key}};
        post(params).then(function(res){
            // console.log(res);
            if(res&&res.code===10000){
                t.setState({list:res.data.list,loading:false,editType:"",count:res.data.count,defaultActiveKey:iType});
            }else{
                t.setState({loading:false,editType:""})
                message.warn(res.message||"系统出错，请联系管理员!");
            }
        }).catch=(err)=>{
            t.setState({loading:false,editType:""});
            console.log("==error==",err);
        }
 
     }

    loadColumn(){
        let columns = [],t=this;
        columns = [{
            title: '企业名称',
            dataIndex: 'title',
            key: 'title',
            width:200,
            render: (text,record,index)=>{
                let isTop = record.isTopset;
                return <div className={styles.tabItem}>
                    <p key={record.title}>{isTop?<label className={styles.topLabel}>置顶</label>:""}{record.title}</p>
                    <p key={record.companyName}>{record.companyName}</p>
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
                let time = new Date(text),
                    year = time.getFullYear(),month=time.getMonth()+1,day=time.getDate();
                return year+"-"+(month>9?month:"0"+month)+"-"+(day>9?day:"0"+day);
            }
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => {
                let iType = record.typeId||"",isTop =record.isTopset;
                let id = record.id||"";
                return <span className={styles.actText}>
                    <a onClick={t.edit.bind(t,record)}>编辑</a>
                    <Popconfirm title="确认删除?" onConfirm={t.delete.bind(t,id,isTop,iType)}>
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                    <a onClick={t.toggTop.bind(t,id,isTop?1:0,iType)} className={isTop?styles.red:""} >{isTop?"取消置顶":"置顶"}</a>
                </span>
            }
        }];
        return columns;
    }
    edit=(record)=>{
        // this.setState({editType:"edit",formInfo:{
        //     policyId:record.id,
        //     subject:record.subject,
        //     title:record.title,
        //     typeName:record.typeName,
        //     filePath:record.url,
        //     content:record.content
        // }});
        let t=this;
        t.setState({loading:true});
        let params = {url:API.API_POLICY_GET,data:{policyId:record.id}};
        post(params).then(function(res){
            if(res&&res.code===10000){
                t.setState({loading:false})
                 let str=[];
                res.data.filePath.map((item,index)=>{
                    for (let i=0;i<(res.data.filePath).length/2;i++){
                        var obj = {
                            uid: index+1,
                            name: item.name,
                            status: 'done',
                            url: item.url,
                        };
                        str.push(obj);
                    }
                });

                t.setState({formInfo:res.data,editType:"edit",filePath:str});

            }else{
                t.setState({loading:false})
                message.warn(res.message||"系统出错，请联系管理员!");
            }

        }).catch=(err)=>{
            t.setState({loading:false,editType:""});
            console.log("==error==",err);
        }

    }
    delete(id,isTop,iType){
        let t=this,params = {url:API.API_POLICY_UPDATE,data:{policyId:id,status:-1,isTopset:isTop?1:0}}
        t.setState({loading:true})
        post(params).then(function(res){
            if(res&&res.code===10000){
                message.success("删除成功");
                let PolicyId="";
                PolicyId=iType.toString();
                t.setState({defaultActiveKey:PolicyId,loading:false});
                t.loadData(t.state.page,t.state.pageSize,iType);
            }else{
                t.setState({loading:false})
                message.warn(res.message||"系统出错，请联系管理员!");
            }

        }).catch=(err)=>{
            console.log("==error==",err)
        }
    }
    toggTop(id,isTop,iType){
        if(isTop===1){
            isTop = 0;
        }else if (isTop===0) {
            isTop = 1;
        }
        let t=this,params = {url:API.API_POLICY_UPDATE,data:{policyId:id,isTopset:isTop}}
        t.setState({loading:true})
        post(params).then(function(res){
            if(res&&res.code===10000){
                message.success("操作成功");
                let PolicyId="";
                PolicyId=iType.toString();
                t.setState({defaultActiveKey:PolicyId,loading:false});
                t.loadData(t.state.page,t.state.pageSize,iType);
            }else{
                t.setState({loading:false})
                message.warn(res.message||"系统出错，请联系管理员!");
            }

        }).catch=(err)=>{
            console.log("==error==",err)
        }
    }
    addPerson=()=>{
        this.setState({editType:"add",formInfo:{id:"",subject:"",title:"",typeName:"",avator:""},filePath:''});
    }
    cancel=()=>{
        let PolicyId="";

        if(this.state.formInfo.typeId!==undefined){PolicyId=this.state.formInfo.typeId.toString();}else{
            PolicyId=this.state.defaultActiveKey;
        }
        this.setState({editType:"",loading:false,defaultActiveKey:PolicyId});
    }
    submit=(iObj)=>{
        let t=this,params = {url:API.API_POLICY_SAVE_OR_UPDATE,data:iObj};
        t.setState({loading:true})
        const {page,pageSize} = t.state;
        let PolicyId="";
            PolicyId=iObj.typeId.toString();
            debugger;
        post(params).then(function(res){
            if(res&&res.code===10000){
                t.setState({loading:true,defaultActiveKey:PolicyId});
                let params = {url:API.API_POLICY_LIST,data:{page:page,size:pageSize,typeId:iObj.typeId}};
                post(params).then(function(res){
                    if(res&&res.code===10000){
                        t.setState({list:res.data.list,loading:false,editType:"",count:res.data.count});
                        message.success("操作成功！");
                    }else{
                        t.setState({loading:false,editType:""})
                        message.warn(res.message||"系统出错，请联系管理员!");
                    }
                }).catch=(err)=>{
                    t.setState({loading:false,editType:""});
                    console.log("==error==",err);
                }
            }else{
                t.setState({loading:false})
                message.warn(res.message||"系统出错，请联系管理员!");
            }

        }).catch=(err)=>{
            console.log("==error==",err)
        }
    }
    showTotal=(total)=>{
        return `共 ${total} 条`;
    }
    render(){
        var t=this,state=t.state;
        let columns = t.loadColumn(),bContent="";
        const operations = <Button className={styles.addpolicy} onClick={t.addPerson}>新增政策</Button>;
        const {bannerContent} = this.state;
        if(bannerContent === '1'){
            bContent="政策服务";
        }else if(bannerContent === '2'){
            bContent="特色服务";
        }else if(bannerContent === '3'){
            bContent="基础服务";
        }
        return (
            <div>
                <div className={styles.topPanel}>
                <div className={styles.header}>
                {this.state.editType?this.state.editType==="add"?<BreadcrumbCustom first="展示管理" second={bContent} third="新增政策" />:
                            <BreadcrumbCustom first="园区服务管理" second={bContent} />
                    :<BreadcrumbCustom first="园区服务管理" second={bContent} />}
                    <h3 style={{display:"inline-block"}}>{this.state.editType?this.state.editType==="add"?"新增政策":"新增政策":"政策服务"}</h3>
                    {this.state.editType?<Button size="small" style={{marginLeft:'8px',verticalAlign:"text-bottom"}} icon="rollback" onClick={this.cancel} >返回</Button>:null}
                </div>
                </div>
                <Row type="flex" justify="center">
                    <Col md={23}>
                        <div className="gutter-box">
                        <div className={styles.Ytab}>
                        {!this.state.editType ?
                            <Tabs defaultActiveKey={state.defaultActiveKey} onChange={(key) => this.callback(key, t)} style={{padding:'15px 32px'}} tabBarExtraContent={operations} size="large">
                                <TabPane tab="扶持政策" key="1">
                                    <TabComp loading={state.loading} columns={columns} list={state.list||[]} rowKey="id" loadList={this.loadData} total={state.count} typeId="1" />
                                </TabPane>
                                <TabPane tab="基础服务" key="3">
                                     <TabComp loading={state.loading} columns={columns} list={state.list||[]} rowKey="id" loadList={this.loadData} total={state.count} typeId="3" />
                                </TabPane>
                                <TabPane tab="特色服务" key="2">
                                     <TabComp loading={state.loading} columns={columns} list={state.list||[]} rowKey="id" loadList={this.loadData} total={state.count} typeId="2" />
                                </TabPane>
                            </Tabs>
                            :<EditPolicy type={this.state.editType} subject={state.formInfo.subject} title={state.formInfo.title} id={state.formInfo.policyId} typeName={state.formInfo.typeName} typeId={state.formInfo.typeId} filePath={this.state.filePath} 
                                cancel={this.cancel} submitInfo={this.submit} content={state.formInfo.content} url={state.formInfo.filePath}/>}
                        </div>
                        </div>
                    </Col>
                </Row>
            </div>
        ) 
    }
}

export default connect()(BannerInfor);