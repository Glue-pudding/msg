/**
 * authored on 2017/4/15.
 */
import React, { Component } from 'react';
import { Row, Col, Card ,Popconfirm ,Button,message} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchData, receiveData } from '@/action';
import API from '@/mock';
import comStyle from '../../index.css';
import {post} from '../../axios/tools';
import styles from './Banner.module.less';
import HouseInfor from './HouseInfor';
import TabComp from '../modules/TableComp';
class BannerInfor extends Component{
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {
            editType:"",
            list:[],page:1,pageSize:10,
            loading:false,
            formInfo:{
                id:'',
                href:'',title:'',
                avator:'',subject:''
            }
        };
    }
    componentDidMount(){
        let t=this;
        t.loadData();
    }
    loadData=()=>{
        let t=this;
        t.setState({loading:true});
        let params = {url:API.API_BANNER_LIST,data:{type:1}};
        post(params).then(function(res){
            if(res&&res.code===10000){
                t.setState({list:res.data,loading:false,editType:""});
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
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width:200
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
                    <Popconfirm title="确认删除?" onConfirm={t.delete.bind(t,id)}>
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                </span>
            }
        }];
        return columns;
    }
    edit=(record)=>{
        this.setState({editType:"edit",formInfo:{
            id:record.id,
            title:record.title,subject:record.subject,href:record.href,
            avator:record.url
        }});
    }
    delete(id){
        let t=this,params = {url:API.API_BANNER_DELETE,data:{bannerId:id}}
        t.setState({loading:true})
        post(params).then(function(res){
            if(res&&res.code===10000){
                message.info("删除成功");
                t.setState({loading:false})
                t.loadData();
            }else{
                message.warn(res.message||"系统出错，请联系管理员!");
            }
        }).catch=(err)=>{
            message.error(err||"系统出错，请联系管理员!");
        }
    }
    addPerson=()=>{
        this.setState({editType:"add",formInfo:{id:"",name:"",title:"",company:"",avator:""}});
    }
    cancel=()=>{
        this.setState({editType:""});
    }
    submit=(iObj)=>{
        let t=this,params = {url:API.API_BANNER_SAVE_OR_UPDATE,data:iObj};
        t.setState({loading:true});
        post(params).then(function(res){
            if(res&&res.code===10000){
                t.loadData();
                t.setState({loading:false});
                message.success("操作成功！");
            }else{
                message.warn(res.message||"系统出错，请联系管理员!");
            }
        }).catch=(err)=>{
            message.error(err||"系统出错，请联系管理员!");
        }
    }
    render(){
        var t=this,state=t.state;
        let columns = t.loadColumn();
        return (
            <div>
                <div className={styles.topPanel}>
                <div className={styles.header}>
                <BreadcrumbCustom first="首页管理" second="Banner位" />
                <div className={styles.headerB}>
                    {this.state.editType?<div>
                        <h3 style={{display:"inline-block"}}>Banner位</h3>
                        <Button style={{marginLeft:'8px',verticalAlign:"text-bottom"}} size="small" icon="rollback" onClick={this.cancel} >返回</Button>
                        </div>:
                    <h3>Banner位</h3>}
                </div>
              </div>
                </div>
                <Row type="flex" justify="center">
                    <Col md={23}>
                        <div className="gutter-box">
                            {!this.state.editType?<Card className={styles.personCard} title={<Button type="primary" className={styles.peronBtn} onClick={t.addPerson}>新增Banner</Button>} bordered={false}>
                                <TabComp loading={this.state.loading} columns={columns} list={this.state.list||[]} rowKey="id" loadList={this.loadData} />
                                {/* <Table loading={this.state.loading} pagination={pageProps} columns={t.loadColumn()} dataSource={this.state.list||[]} rowKey="id" /> */}
                            </Card>:<HouseInfor href={state.formInfo.href} subject={state.formInfo.subject} title={state.formInfo.title} id={state.formInfo.id}
                                     avator={state.formInfo.avator} cancel={this.cancel} submitInfo={this.submit} url={state.formInfo.avator} />}
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

export default connect(mapStateToPorps, mapDispatchToProps)(BannerInfor);