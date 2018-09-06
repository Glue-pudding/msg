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
import EditGarden from './EditGarden';
const { TextArea } = Input;
class gardenIntro extends Component{
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {
            type:1,
            editable:false,
            editType:"",
            list:[],page:1,pageSize:10,
            loading:false,count:0,
            formInfo:{
                exhibitionId:'',
                subject:'',title:'',
                url:''
            },
            grdenIntro:'',
            style:{border:"none",background:'#F7F8FB'},
            disabled:true,
            id:'',
        };
        this.priValue = '';
    }
    componentDidMount(){
        
        let t=this;
        t.loadData();
    }

    //加载信息列表
    loadData=()=>{
        let t=this;
        //获取简介内容
        let params = {url:API.API_EXHIBITION_EQUEMENT_DATA_GET,data:{type:t.state.type}};
        post(params).then(function(res){
            //{id: 2, modifyTime: 1524614325000, subject: "subject2", title: "title2", url: "url2"}
            if(res&&res.code===10000){
                console.log(res);
                if(res.data.abstract == undefined){
                    t.setState({list:res.data.list,loading:false,editType:"",grdenIntro:"暂无简介！",priValue:"暂无简介！",count:res.data.count})
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
            subject:record.subject,title:record.title,
            url:record.url
        }});
    }
    //删除
    delete(id,isTop){
        let t=this,params = {url:API.API_EXHIBITION_DELETE,data:{exhibitionId:id}}
        t.setState({loading:true})
        post(params).then(function(res){
            if(res&&res.code===10000){
                message.info("删除成功");
                t.setState({loading:false})
                t.loadData();
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

    introSubmit=()=>{
        this.setState({
            editType:'',
            style:{border:"none",background:'#F7F8FB'},
            disabled:true,
            editable:false,

        });
        this.setState({loading:true});
        if(!this.state.id){
            this.priValue = this.state.grdenIntro;
            let t=this,params = {url:API.API_EXHIBITION_ABSTRACT_UPDATE,data:{content:this.priValue}};
            post(params).then(function(res){
                if(res&&res.code===10000){
                    t.loadData();
                    message.success("操作成功！");
                    t.setState({loading:false})
                }
            })
        }else{
            this.priValue = this.state.grdenIntro;
            let t=this,params = {url:API.API_EXHIBITION_ABSTRACT_UPDATE,data:{content:this.priValue,abstractId:this.state.id}};
            post(params).then(function(res){
                if(res&&res.code===10000){
                    t.loadData();
                    message.success("操作成功！");
                    t.setState({loading:false})
                }
            })
        }
       
    }
    //点击保存编辑/新增
    submit=(iObj)=>{
        let t=this,params = {url:API.API_EXHIBITION_SAVE_OR_UPDATE,data:iObj};
        t.setState({loading:true})
        post(params).then(function(res){
            if(res&&res.code===10000){
                t.loadData();
                message.success("操作成功！");
                t.setState({loading:false})
            }
        })
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
                    {this.state.editType?this.state.editType==="add"?<BreadcrumbCustom first="园区服务管理" second="园区简介" third="新增图片" />:
                            <BreadcrumbCustom first="园区服务管理" second="园区简介" third="编辑图片" />
                    :<BreadcrumbCustom first="园区服务管理" second="园区简介" />}
                    <h3 style={{display:"inline-block"}}>{this.state.editType?this.state.editType==="add"?"新增图片":"编辑图片":"园区服务管理"}</h3>
                    {this.state.editType?<Button size="small" style={{marginLeft:'8px',verticalAlign:"text-bottom"}} icon="rollback" onClick={this.cancel} >返回</Button>:null}
                </div>
           
                <Row type="flex" justify="center">
                    <Col md={23}>
                        <div className="gutter-box">
                            {!this.state.editType?
                            <div>
                            <Card className={styles.gardenCard} title={<h2>园区简介文案</h2>}
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
                                        if(Input.maxLength >200 ){
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
                            :<EditGarden type={this.state.editType} subject={this.state.formInfo.subject} title={this.state.formInfo.title} exhibitionId={this.state.formInfo.exhibitionId}
                                     url={this.state.formInfo.url} cancel={this.cancel} submitInfo={this.submit} />}
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

export default connect(mapStateToPorps, mapDispatchToProps)(gardenIntro);