/**
 * Created by author on 2017/4/25.
 */
import React, { Component } from 'react';
import { Row, Col, Card, Tabs, Icon, Table, Button ,Input,message,Popconfirm,Modal} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import styles from './business.module.less'
import API from '@/mock';
import {post} from '../../axios/tools';
const TabPane = Tabs.TabPane;
class HourseInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            houseList:[],
            roomNum:'',
            isAdd:false
        };
    }
    componentDidMount(){
        this.loadHouseList();
    }
    loadHouseList(){
        let t=this,state=this.state,
            params = {url:API.API_COMPANY_OCCUPANT_LIST};
        t.setState({loading:true});
        post(params).then(function(res){
            if(res&&res.code===10000){
                t.setState({houseList:res.data,loading:false});
            }else{
                t.setState({loading:false});
                message.warn((res&&res.message)||'系统出错，请联系管理员!');
            }
        }).catch=(err)=>{
            t.setState({loading:false});
        }
    }
    getColumns=(buildingId)=>{
        let columns = [],t=this;
        const renderContent = (value, row, index) => {
            const obj = {
                props: {},
            };
            obj.props.colSpan = 0;
            return obj;
        };
        columns = [
            { title: '房间号',dataIndex: 'roomNum',key: 'roomNum',width:120}, 
            { title: '入住人',dataIndex: 'occupantName',width:260,key: 'occupantName1',render:function(r,k,index){
                let noAdd = k.occupantList.length>3,
                    disableAdd = noAdd||t.state.isAdd;    
                return {
                    children: <Button style={{width:'100%'}} onClick={t.newRoomer.bind(t,k.roomId,buildingId,k.roomNum)} disabled={disableAdd} > 
                                <Icon type="plus" />新增入住人{noAdd?'  (每个房间最多容纳四人)':''}</Button>,
                    props: {
                        colSpan: 4,
                    },
                };
            
            }},
            { title: '身份证',dataIndex: 'occupantIdcard',width:360,key: 'occupantIdcard1',render: renderContent}, 
            { title: '联系电话',dataIndex: 'occupantPhone',width:360,key: 'occupantPhone1',render: renderContent},
            { title: '操作',dataIndex: 'operate',key: 'operate1',render: renderContent}
        ]
        return columns;
    }
    newRoomer =(roomId,buildingId,roomNum)=>{
        this.setState({roomNum:roomNum,isAdd:true});
        const tempList = [...this.state.houseList];
        tempList.filter((item,index)=>{
            if(item.buildingId===buildingId&&item.roomList){
                return item.roomList.filter((rItem,rIndex)=>{
                    if(rItem.roomId===roomId&&rItem.occupantList){
                        rItem.occupantList.push({occupantName:'',occupantIdcard:'',occupantPhone:'',edit:true});
                        return rItem;
                    }else{
                        return rItem;
                    }
                })
            }else{
                return item;
            }
        })
        this.setState({houseList:tempList});
    }
    editCol=(id,roomId,buildingId)=>{
        // console.log("==roomId==",roomId,"==buildingId==",buildingId,"==id==",id,"==list==",this.state.houseList);
        let tempList = [...this.state.houseList];
        tempList.filter((item,index)=>{
            if(item.buildingId===buildingId&&item.roomList){
                return item.roomList.filter((rItem,rIndex)=>{
                    if(rItem.roomId===roomId&&rItem.occupantList){
                        return rItem.occupantList.filter((oItem,oIndex)=>{
                            if(oItem.occupantId===id){
                                oItem["edit"] = true;
                                return oItem;
                            }else{
                                return oItem;
                            }
                        })
                    }else{
                        return rItem;
                    }
                })
            }else{
                return item;
            }
        })
        // console.log("==tempList",tempList);
        this.setState({houseList:tempList,isAdd:true});
    }
    
    changeCol=(name,id,roomId,buildingId,cIndex,e)=>{
        //编辑时传occupantId，新建时传roomId
        let val = e.target.value||"",tempList = [...this.state.houseList];
        tempList.filter((item,index)=>{
            if(item.buildingId===buildingId&&item.roomList){
                return item.roomList.filter((rItem,rIndex)=>{
                    if(rItem.roomId===roomId&&rItem.occupantList){
                        return rItem.occupantList.filter((oItem,oIndex)=>{
                            if((oItem.occupantId&&oItem.occupantId===id)||oIndex===cIndex){
                                if(!oItem["old"]){
                                    oItem["old"] = {};
                                }
                                if(!oItem['old'][name]){
                                    oItem["old"][name] = oItem[name];
                                }
                                oItem[name] = val;
                                return oItem;
                            }else{
                                return oItem;
                            }
                        })
                    }else{
                        return rItem;
                    }
                })
            }else{
                return item;
            }
        });
        this.setState({houseList:tempList});
    }
    cancelCol=(id,roomId,buildingId,cIndex)=>{
        let tempList = [...this.state.houseList];
        if(id===undefined){
            tempList.filter((item,index)=>{
                if(item.buildingId===buildingId&&item.roomList){
                    return item.roomList.filter((rItem,rIndex)=>{
                        if(rItem.roomId===roomId&&rItem.occupantList){
                            rItem.occupantList.splice(cIndex,1);
                            return rItem;
                        }
                    });
                }
            })
            this.setState({houseList:tempList,isAdd:false});
            return false;
        }
        tempList.filter((item,index)=>{
            if(item.buildingId===buildingId&&item.roomList){
                return item.roomList.filter((rItem,rIndex)=>{
                    if(rItem.roomId===roomId&&rItem.occupantList){
                        return rItem.occupantList.filter((oItem,oIndex)=>{
                            if(oItem.occupantId===id){
                                oItem["occupantName"] = (oItem["old"]&&oItem.old["occupantName"])||oItem.occupantName;
                                oItem["occupantIdcard"] = (oItem["old"]&&oItem.old["occupantIdcard"])||oItem.occupantIdcard;
                                oItem["occupantPhone"] = (oItem["old"]&&oItem.old["occupantPhone"])||oItem.occupantPhone;
                                oItem["old"] = null;
                                oItem["edit"] = false;
                                return oItem;
                            }else{
                                return oItem;
                            }
                        })
                    }else{
                        return rItem;
                    }
                })
            }else{
                return item;
            }
        });
        this.setState({houseList:tempList,isAdd:false});
    }
    delCol=(id)=>{
        let t=this,state =t.state;
        const params ={url:API.API_COMPANY_OCCUPANT_DELETE,data:{occupantId:id}};
        post(params).then(function(res){
            if(res&&res.code===10000){
                message.success("操作成功！");
                t.loadHouseList();
            }else{
                message.warn((res&&res.message)||'系统出错，请联系管理员!');
            }
        }).catch=(err)=>{
            message.error("系统出错，请联系管理员!");
        }
    }
    saveCol=(record,roomId)=>{
        let t=this,state =t.state;
        let checkMES = record.occupantIdcard&&record.occupantName&&record.occupantPhone;
        if(!checkMES){
            Modal.warning({title:'提示',content:'请补全信息.'});
            return false;
        }
        const params ={url:API.API_COMPANY_OCCUPANT_SAVE_OR_UPDATE,data:{
                        occupantIdcard:record.occupantIdcard,
                        occupantName:record.occupantName,occupantPhone:record.occupantPhone}
                    };
        if(record.occupantId===undefined){
            params.data["roomId"] = roomId;
        }else{
            params.data["occupantId"] = record.occupantId;
        }
        post(params).then(function(res){
            if(res&&res.code===10000){
                message.success("操作成功！");
                t.loadHouseList();
            }else{
                message.warn((res&&res.message)||'系统出错，请联系管理员!');
            }
            t.setState({isAdd:false})
        }).catch=(err)=>{
            t.setState({isAdd:false})
            message.error("系统出错，请联系管理员!");
        }
    }
    //展开数据表结构
    expandedRowRender = (data,roomId,buildingId) => {
        let t=this;
        const renderCont = function(name,value,row,index){
            return row.edit?<Input value={value} onChange={t.changeCol.bind(t,name,row.occupantId,roomId,buildingId,index)} />:<label>{value}</label>;
        }
        const columns = [
            { title: '',dataIndex: '',key: 'name',width:120}, 
            { title: '',dataIndex: 'occupantName',width:240,key: 'occupantName',render:(value,row,index)=>renderCont("occupantName",value,row,index)},
            { title: '',dataIndex: 'occupantIdcard',width:360,key: 'occupantIdcard',render:(value,row,index)=>renderCont("occupantIdcard",value,row,index)},
            { title: '',dataIndex: 'occupantPhone',width:360,key: 'occupantPhone',render:(value,row,index)=>renderCont("occupantPhone",value,row,index)},
            { title: '',dataIndex: 'operate',key: 'operate',render(r,k,index){
                return !k.edit?<div key={k.occupantName+index}>
                                <a style={{marginRight:'15px'}} onClick={t.editCol.bind(t,k.occupantId,roomId,buildingId)}>编辑</a>
                                <Popconfirm title="确定删除?" onConfirm={t.delCol.bind(t,k.occupantId)}><a>删除</a></Popconfirm></div>:<div>
                                    <a style={{marginRight:'15px'}} onClick={t.saveCol.bind(t,k,roomId)}>保存</a>
                                    <a onClick={t.cancelCol.bind(t,k.occupantId,roomId,buildingId,index)}>取消</a>
                                </div>
            }},
        ]
    
        return (
          <Table
            columns={columns} dataSource={data} 
            pagination={false} rowKey="occupantId"
          />
        );
    }
    render() {
        const {houseList,loading} = this.state;
        let t=this;
        return (
            <div >
                <BreadcrumbCustom first="企业信息" second="住宿信息" />
                <Row gutter={16} type="flex">
                    <Col className={styles.reportPanel} md={23} style={{marginLeft:"30px"}} >
                        {houseList.length?houseList.map((item,index)=>{
                            return <Card title={item.buildingName} bordered={false} key={item.buildingName+index} className={styles.roomCard}>
                                <Table columns={t.getColumns(item.buildingId)} dataSource={item.roomList} loading={loading} defaultExpandAllRows size="middle" pagination={false}
                                expandedRowRender={record => t.expandedRowRender(record.occupantList,record.roomId,item.buildingId)} rowKey="buildingId" />
                            </Card>
                        }):<div style={{height:'200px',padding:"40px",textAlign:"center",lineHeight:"180px",fontSize:"24px",color:"#323C47"}}><Icon type="frown-o" /> 暂无住宿信息</div>}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default HourseInfor;