import React, { Component } from 'react';
import { Row, Col, Card ,Table,Modal,message,Badge,Button} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Link } from 'react-router-dom';
import styles from './checkout.module.less';
import API from '@/mock';
import {post} from '../../axios/tools';
class CheckDetail extends Component{
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {
            status:"",listArr:[],loading:false,basicInfo:null
        };
    }
    componentDidMount(){
        let iStr = window.location.hash.match(/([^\\?]+)$/)[0],iStatus ='',id = '';
        iStr.replace(/(?=(status=)).*?(?=&)/,function(i,k,m){
            iStatus = i.substring(k.length);
        });
        iStr.replace(/(?=(id=)).*$/,function(i,k,m){
            id = i.substring(k.length);
        });
        if(!iStatus||!id){
            Modal.warning({title:"提示",content:"地址信息不全!"});
            return false;
        }else{
            this.setState({status:iStatus});
            this.loadInforList(id);
        }
    }
    loadInforList=(id)=>{
        let t=this,state=this.state,
        params = {url:API.API_COMPANY_BILL_GET,data:{billId:id}};
        t.setState({loading:true});
        post(params).then(function(res){
            if(res&&res.code===10000){
                let tempArr = state.listArr.concat(res.data.water||[]).concat(res.data.electric||[]).concat(res.data.otherFee||[]);
                t.setState({
                    basicInfo:res.data.baseInfo,loading:false,
                    listArr:tempArr
                });
            }else{
                t.setState({loading:false});
                message.warn(res.message||'系统出错，请联系管理员!');
            }
        }).catch=(err)=>{
            t.setState({loading:false});
        }
    }
    toggle(){
        this.setState({visible:!this.state.visible})
    }
    getColumns=()=>{
        const columns = [
            { title: '账单项',dataIndex: 'title',key: 'title',width:220,render:(r,k,index)=>{
                if(index>1){
                    return <label>其他</label>;
                }else{
                    return <label>{r}</label>;
                }
            }}, 
            { title: '读数',dataIndex: 'degree',key: 'degree',width:220,render:(r,k,index)=>index>1?<label>- -</label>:<label>{r}</label>},
            { title: '金额',dataIndex: 'totalCharge',key: 'totalCharge',width:420,render:(r,k,index)=><label>￥{r}</label>},
        ];
        return columns;
    }
    renderExpand=(data,list)=>{
        let t=this;
        const columns = list?[
            { title: '电表编号',dataIndex: 'meterCode',key: 'meterCode',width:120},
            { title: '关联位置',dataIndex: 'location',key: 'location',width:120},
            { title: '上期抄录时间',dataIndex: 'lastReadTime',key: 'lastReadTime',width:120},
            { title: '上期读数',dataIndex: 'lastReading',key: 'lastReading',width:120},
            { title: '本期抄表时间',dataIndex: 'thisReadTime',key: 'thisReadTime',width:120},
            { title: '本期读数',dataIndex: 'thisRead',key: 'thisRead',width:120},
            { title: '应缴读数',dataIndex: 'degree',key: 'degree',width:120},
            { title: '本期费用',dataIndex: 'payFee',key: 'payFee',width:120,render:(r,k,index)=>"￥"+(r||"")},
        ]:[
            { title: '名称',dataIndex: 'name',key: 'name'},
            { title: '开始时间',dataIndex: 'startTime',key: 'startTime'},
            { title: '结束时间',dataIndex: 'endTime',key: 'endTime'},
            { title: '总费用',dataIndex: 'totalCharge',key: 'totalCharge',render:(r)=>"￥"+(r||"")},
            { title: '备注',dataIndex: 'remark',key: 'remark'}
        ];
        let tabCont = list? <Table
                    columns={columns} dataSource={list||[]} 
                    pagination={false} 
                />:<Table
                    columns={columns} dataSource={[data]} 
                    pagination={false} rowKey="name"
                />
        return tabCont;
    }
    render(){
        var t=this;
        const {status,loading,listArr,basicInfo} = this.state;
        let statusCont = status&&status==='YJN'?<label><Badge status="success" />已缴纳</label>:<label><Badge status="error" />未缴纳</label>;
        let totalMoney = basicInfo&&parseFloat(basicInfo.totalCharge).toFixed(2);
        return (
            <div className="gutter-example">
                <div>
                    <BreadcrumbCustom first="账单明细" second="账单详情" />
                    <div className={styles.boxTitle}><h2>账单详情</h2><Link to={"/app/checkInfor"}><Button  icon="rollback">返回</Button></Link></div>
                </div>
                <Row type="flex" justify="center">
                    <Col md={23} className={styles.boxTop}>
                        <Card bordered={false} className={status&&status!=='YJN'?styles.errorBorder:''}>
                            <Col span={6}><span>账期：</span><label>{basicInfo&&`${basicInfo.startTime}至${basicInfo.endTime}`}</label></Col>
                            <Col span={6}><span>账单类型：</span><label>水电费账单</label></Col>
                            <Col span={6}><span>当前状态：</span><label>{statusCont}</label></Col>
                            <Col span={5} className={styles.allText}><label>支付金额：<span>￥{totalMoney}</span></label></Col>
                        </Card>
                    </Col>
                    <Col md={23} >
                        <Card title="水电费用明细" bordered={false} className={styles.boxTab}>
                            <Table columns={t.getColumns()} loading={loading} pagination={false} footer={()=><label>合计金额：<span>￥{totalMoney}</span></label>}
                                    dataSource={listArr} rowKey="title" expandedRowRender={(record)=>t.renderExpand(record,record.list)} defaultExpandAllRows />
                        </Card>
                    </Col>
                </Row>
            </div>
        ) 
    }
}

export default CheckDetail;