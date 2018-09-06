/**
 * Created by xutao on 2018/4/20.
 */
import React, { Component } from 'react';
import { Row, Col, Card ,Table,Popconfirm ,Button,message} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchData, receiveData } from '@/action';
import API from '@/mock'

import {post} from '../../axios/tools';
import styles from './person.module.less';
import EditPerson from './Editperson';
import TabComp from '../modules/TableComp';
class PersonInfor extends Component{
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {
            editType:"",
            list:[],page:1,pageSize:10,
            loading:false,count:0,
            formInfo:{
                id:'',
                name:'',title:'',
                avator:'',company:''
            }
        };
    }
    componentDidMount(){
        // const { fetchData } = this.props;
        // fetchData({funcName: 'getNewsList', stateName: 'check'});
        let t=this;
        t.loadData();
    }
    loadData=(page,pageSize)=>{
        let t=this;
        t.setState({loading:true});
        let params = {url:API.API_TALENTS_LIST,data:{page:page||this.state.page,size:pageSize||this.state.pageSize}};
        post(params).then(function(res){
            if(res&&res.code===10000){
                t.setState({list:res.data.list,count:res.data.count,loading:false,editType:""});
            }else{
                t.setState({loading:false,editType:""})
                message.warn(res.message||"系统出错，请联系管理员!");
            }
        }).catch=(err)=>{
            t.setState({loading:false,editType:""})
            console.log("==error==",err)
        }
    }
    loadColumn(){
        let columns = [],t=this;
        columns = [{
            title: '姓名 / 任职公司',
            dataIndex: 'name',
            key: 'name',
            width:400,
            render: (text,record,index)=>{
                let isTop = record.isTopset;
                return <div className={styles.tabItem}>
                    <p key={record.name}>{isTop?<label className={styles.topLabel}>置顶</label>:""}{record.name}</p>
                    <p key={record.companyName}>{record.companyName}</p>
                </div>
            },
        }, {
            title: '头衔',
            dataIndex: 'title',
            key: 'title'
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
                let isTop =record.isTopset;
                let id = record.id||"";
                return <span className={styles.actText}>
                    <a onClick={t.edit.bind(t,record)}>编辑</a>
                    <Popconfirm title="确认删除?" onConfirm={t.delete.bind(t,id,isTop)}>
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                    <a onClick={t.toggTop.bind(t,id,isTop?0:1)} className={isTop?styles.red:""} >{isTop?"取消置顶":"置顶"}</a>
                </span>
            }
        }];
        return columns;
    }
    edit=(record)=>{
        this.setState({editType:"edit",formInfo:{
            id:record.id,
            name:record.name,title:record.title,
            company:record.companyName,avator:record.url
        }});
    }
    delete(id,isTop){
        let t=this,params = {url:API.API_TALENTS_UPDATE,data:{talentsId:id,status:-1,isTopset:isTop?1:0}}
        t.setState({loading:true})
        post(params).then(function(res){
            if(res&&res.code===10000){
                message.info("删除成功");
                t.setState({loading:false})
                t.loadData();
            }else{
                message.warn(res.message)
            }
        }).catch=(err)=>{
            console.log("==error==",err)
        }
    }
    toggTop(id,isTop){
        let t=this,params = {url:API.API_TALENTS_UPDATE,data:{talentsId:id,isTopset:isTop}}
        t.setState({loading:true})
        post(params).then(function(res){
            if(res&&res.code===10000){
                message.info("操作成功");
                t.setState({loading:false})
                t.loadData();
            }else{
                message.warn(res.message)
            }
        }).catch=(err)=>{
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
        let t=this,params = {url:API.API_TALENTS_SAVE_OR_UPDATE,data:iObj};
        t.setState({loading:true})
        post(params).then(function(res){
            if(res&&res.code===10000){
                t.loadData();
                message.success("操作成功！");
                t.setState({loading:false})
            }else{
                message.warn(res.message)
            }
        }).catch=(err)=>{
            console.log("==error==",err)
        }
    }
    render(){
        var t=this,state=t.state;
        let columns = t.loadColumn();
        return (
            <div>
                <div className={styles.topPanel}>
                    {this.state.editType?this.state.editType==="add"?<BreadcrumbCustom first="人才展示管理" second="新增人才" />:
                            <BreadcrumbCustom first="人才展示管理" second="编辑人才" />
                    :<BreadcrumbCustom first="人才展示管理" />}
                    <h3 style={{display:"inline-block"}}>{this.state.editType?this.state.editType==="add"?"新增人才":"编辑人才":"人才展示管理"}</h3>
                    {this.state.editType?<Button size="small" style={{marginLeft:'8px',verticalAlign:"text-bottom"}} icon="rollback" onClick={this.cancel} >返回</Button>:null}
                </div>
                <Row type="flex" justify="center">
                    <Col md={23}>
                        <div className="gutter-box">
                            {!this.state.editType?<Card className={styles.personCard} title={<Button type="primary" className={styles.personBtn} onClick={t.addPerson}>新增人才</Button>} bordered={false}>                                
                                {/* <Table loading={this.state.loading} pagination={pageProps} 
                                        columns={t.loadColumn()} dataSource={this.state.list||[]} rowKey="id" /> */}
                                <TabComp loading={this.state.loading} columns={columns} list={this.state.list||[]} rowKey="id" loadList={this.loadData} total={this.state.count}/>
                            </Card>:<EditPerson type={this.state.editType} name={state.formInfo.name} title={state.formInfo.title} id={state.formInfo.id}
                                    company={state.formInfo.company} avator={state.formInfo.avator} cancel={this.cancel} submitInfo={this.submit} />}
                        </div>
                    </Col>
                </Row>
            </div>
        ) 
    }
}
const mapStateToPorps = state => {
    const { check } = state.httpData;
    return { check };
};
const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToPorps, mapDispatchToProps)(PersonInfor);