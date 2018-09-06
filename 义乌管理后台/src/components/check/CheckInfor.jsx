/**
 * Created by author on 2017/4/15.
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card ,Table,Modal,message,Badge } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchData, receiveData } from '@/action';
import API from '@/mock';
import {post} from '../../axios/tools';
import styles from './checkout.module.less';

class CheckInfor extends Component{
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {
            visible:false,checkList:[],listCount:0,
            page:1,pageSize:10,loading:false
        };
    }
    componentDidMount(){
        this.loadCheckList();
    }
    loadCheckList(page,size){
        let t=this,state=this.state,
            params = {url:API.API_COMPANY_BILL_LIST,data:{page:page||state.page,size:size||state.pageSize}};
        t.setState({loading:true});
        post(params).then(function(res){
            if(res&&res.code===10000){
                t.setState({checkList:res.data.list,loading:false,listCount:res.data.count});
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
    getColumns(){
        let columns = [];
        columns = [{
            title: '账期',
            dataIndex: 'time',
            key: 'time',
            render: (r,k,index)=>{
                return <label>{k.startTime}至{k.endTime}</label>
            },
        },  {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render:function(r,k,index){
                return r==='YJN'?<label><Badge status="success" />已缴纳</label>:<label><Badge status="error" />未缴纳</label>
            }
        }, {
            title: '金额',
            dataIndex: 'totalCharge',
            key: 'totalCharge',
            render:(r,k)=>'￥'+r
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => {
                let iStatus = record.status||"";
                let id = record.billId||"";
                return <span>
                    <Link to={"/app/checkInfor/detail?status="+iStatus+"&id="+id}>详情</Link>
                </span>
            }
        }];
        return columns;
    }
    pageChange=(page,pageSize)=>{
        this.setState({page,pageSize})
        this.loadCheckList(page,pageSize);
    }
    sizeChange=(current,size)=>{
        this.setState({page:current,pageSize:size});
        this.loadCheckList(current,size);
    }
    render(){
        var t=this;
        const {checkList,loading,pageSize,page} = this.state;
        const columns = this.getColumns();
        let pageProps ={
            page:page,pageSize:pageSize,
            showSizeChanger:true,showQuickJumper:true,
            onShowSizeChange:this.sizeChange,onChange:this.pageChange,
            showTotal:(total)=>`共 ${total} 条`
        }
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="账单明细"  />
                <Row gutter={16} type="flex" >
                    <Col md={23} style={{marginLeft:"30px"}} >
                        <div className={styles.checkBox}>
                            <Card title="账单明细" bordered={false}>
                                {/* <BasicTable /> */}
                                <Table columns={columns} pagination={pageProps} dataSource={checkList} rowKey='billId' loading={loading}/>
                            </Card>
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

export default connect(mapStateToPorps, mapDispatchToProps)(CheckInfor);