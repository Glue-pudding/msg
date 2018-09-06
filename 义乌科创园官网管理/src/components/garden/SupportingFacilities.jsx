/**
 * Created by xutao on 2018/4/20.
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card ,Table,Popconfirm ,Button,message,LocaleProvider,Input} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchData, receiveData } from '@/action';
import TabComp from '../modules/TableComp';

import API from '@/mock'

import {post} from '../../axios/tools';
import styles from './Banner.module.less';
import EditSupporting from './EditSupporting';
const { TextArea } = Input;

class supportFacilities extends Component{
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {
            type:2,
            editable:false,
            editType:"",
            list:[],page:1,pageSize:10,
            loading:false,
            formInfo:{
                exhibitionId:'',
                subject:'',title:'',
                url:'',
                modifier:''

            },
            grdenIntro:'',
            style:{border:"none",background:'#F7F8FB'},
            disabled:true,
            id:'',
        };
    }
    componentDidMount(){
        
        let t=this;
        t.loadData();
    }
    //加载信息列表
    loadData=()=>{
        let t=this;
        let params = {url:API.API_EXHIBITION_EQUEMENT_DATA_GET,data:{type:this.state.type}};
        post(params).then(function(res){
            console.log(res);
            //{id: 2, modifyTime: 1524614325000, subject: "subject2", title: "title2", url: "url2"}
            if(res&&res.code===10000){
                console.log(res);
                if(res.data.abstract == undefined){
                    t.setState({list:res.data.list,loading:false,editType:"",grdenIntro:"暂无简介！",priValue:"暂无简介！",id:res.data.abstract.id})
                }else{
                    t.setState({list:res.data.list,loading:false,editType:"",grdenIntro:res.data.abstract.content,priValue:res.data.abstract.content,id:res.data.abstract.id,count:res.data.count});
                }
            }
        }).catch=(err)=>{
            t.setState({loading:false,editType:""})
            console.log("==error==",err)
        }
    }
    loadColumn(){
        let columns = [],t=this;
        columns = [{
            title: '图片标题',
            dataIndex: 'title',
            key: 'title',
            render: (text,record,index)=>{
                let isTop = record.isTopset;
                return <div className={styles.tabItem}>
                    <p key={record.title}>{record.title}</p>
                </div>
            },
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
                let iType = record.type||"",isTop =record.isTopset;
                let id = record.id||"";
                return <span className={styles.actText}>
                    <a onClick={t.edit.bind(t,record)}>编辑</a>
                    <Popconfirm title="确认删除?" onConfirm={t.delete.bind(t,id,isTop)}>
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                </span>
            }
        }];
        return columns;
    }
    //编辑图片
    edit=(record)=>{
        this.setState({editType:"edit",formInfo:{
            exhibitionId:record.id,
            subject:record.subject,title:record.title,url:record.url
        }});
    }
    //删除
    delete(id){
        let t=this,params = {url:API.API_EQUEMENT_DELETE,data:{equementId:id}}
        t.setState({loading:true})
        post(params).then(function(res){
            if(res&&res.code===10000){
                message.success("删除成功");
                t.loadData();
                t.setState({loading:false})
            }
        }).catch=(err)=>{
            console.log("==error==",err)
        }
    }
     //新增图片
    addPerson=()=>{
        this.setState({editType:"add",formInfo:{exhibitionId:"",subject:"",title:"",url:""}});
    }
    //点击取消编辑/新增
    cancel=()=>{
        this.setState({
            editType:"",
            style:{border:"none",background:'#F7F8FB'},
            disabled:true,
            editable:false,
            grdenIntro:this.state.priValue
        });
    }
   //点击保存编辑/新增简介
    introSubmit=()=>{
        this.setState({
            editType:'',
            style:{border:"none",background:'#F7F8FB'},
            disabled:true,
            editable:false,

        });
        this.priValue = this.state.grdenIntro;
        this.setState({loading:true})
        let t=this,id=t.state.id,params = {url:API.API_EQUEMENT_ABSTRACT_UPDATE,data:{content:this.priValue,abstractId:id}};
        post(params).then(function(res){
            if(res&&res.code===10000){
                t.loadData();
                message.success("操作成功！");
                t.setState({loading:false})
            }
        })
    }
    //点击保存编辑/新增配套设施
    submit=(iObj)=>{
        let t=this,params = {url:API.API_EQUEMENT_SAVE_OR_UPDATE,data:iObj};
        t.setState({loading:true})
        post(params).then(function(res){
            if(res&&res.code===10000){
                t.loadData();
                message.success("操作成功！");
                t.setState({loading:false})
            }
        }).catch=(err)=>{
            t.setState({loading:false,editType:""})
            console.log("==error==",err)
        }
    }
    showTotal=(total)=>{
        return `共 ${total} 条`;
    }
    introEdit=()=>{
        this.setState({editable:true,style:{background:'#F7F8FB'},disabled:false});
    }
    render(){
        var t=this,state=t.state;
        let columns = t.loadColumn();
        return (
            <div>
                <div className={styles.topPanel}>
                    {this.state.editType?this.state.editType==="add"?<BreadcrumbCustom first="园区服务管理" second="配套设施" third="新增图片" />:
                            <BreadcrumbCustom first="园区服务管理" second="配套设施" third="编辑图片" />
                    :<BreadcrumbCustom first="园区服务管理" second="配套设施" />}
                    <h3 style={{display:"inline-block"}}>{this.state.editType?this.state.editType==="add"?"新增图片":"编辑图片":"配套设施"}</h3>
                    {this.state.editType?<Button size="small" style={{marginLeft:'8px',verticalAlign:"text-bottom"}} icon="rollback" onClick={this.cancel} >返回</Button>:null}
                </div>
           
                <Row type="flex" justify="center">
                    <Col md={23}>
                        <div className="gutter-box">
                            {!this.state.editType?
                            <div>
                            <Card className={styles.gardenCard} title={<h2>配套设施文案</h2>}
                             extra={<div className="editable-row-operations">
                                {
                                    this.state.editable ?
                                        <span>
                                        <Button type="primary" size="small" onClick={this.introSubmit}>保存</Button>
                                        <Button type="primary" size="small" onClick={this.cancel}>取消</Button>
                                        </span>
                                        : <Button type="primary" size="small" onClick={this.introEdit}>编辑</Button>
                                    }
                              </div>}>
                            <div className={styles.grdenIntro}>
                            <TextArea rows={4} value={this.state.grdenIntro} maxLength="200" onChange={(e) => {
                                       if(Input.maxLength == 200 ){
                                          message.info("内容请控制在200字以内");
                                       }else{
                                        this.setState({
                                            grdenIntro: e.target.value
                                        });
                                        }
                                    }}
                                     style={this.state.style} disabled={this.state.disabled} />
                            </div>
                          </Card>
                        <Card className={styles.personCard} title={<div><h2 style={{display:"inline"}}>图片轮播</h2><Button type="primary" className={styles.gardenBtn} onClick={t.addPerson}>新增图片</Button></div>} bordered={false}>
                                {/* <BasicTable /> */}
                                <TabComp loading={state.loading} columns={columns} list={state.list||[]} rowKey="id" loadList={this.loadData} total={state.count} />
                            </Card></div>
                            :<EditSupporting type={this.state.editType} subject={state.formInfo.subject} title={state.formInfo.title} id={state.formInfo.exhibitionId}
                            url={state.formInfo.url} cancel={this.cancel} submitInfo={this.submit} />}
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

export default connect(mapStateToPorps, mapDispatchToProps)(supportFacilities);