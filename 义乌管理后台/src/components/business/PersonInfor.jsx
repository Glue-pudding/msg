/**
 * 
 */
import React, { Component } from 'react';
import { Row, Col, Card,Button ,Input,Table,Divider,Popconfirm, message,Modal} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import styles from './business.module.less';
import {post} from '../../axios/tools';
import API from '@/mock';
class PersonInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page:1,pageSize:10,
            mode: 'top',editObj:{},
            personObj:null,
            seniorList:[],seniorCont:0,loading:false,
            isAdd:false,
        };
    }
    componentDidMount(){
        this.loadInfor();
        this.loadList();
    }
    loadList(page,size){
        let t=this,params={page:page||t.state.page,size:size||t.state.pageSize};
        this.setState({loading:true});
        post({url:API.API_COMPANY_TALENT_SENIOR_LIST,data:params}).then(function(res){
            if(res&&res.code===10000){
                let datas = res.data;
                datas.list.filter((item,index)=>{
                    item['newID'] = item.id;
                    return item;
                })
                t.setState({seniorList:datas.list,seniorCont:datas.count,loading:false});
            }else{
                t.setState({loading:false});
                message.warn((res&&res.message)||'系统出错，请联系管理员!');
            }
        }).catch=(err)=>{
            t.setState({loading:false})
            console.log("==error==",err)
        }
    }
    loadInfor(){
        let t=this;
        post({url:API.API_COMPANY_TALENT_COUNT_GET}).then(function(res){
            if(res&&res.code===10000){
                t.setState({personObj:res.data});
            }else{
                message.warn((res&&res.message)||'系统出错，请联系管理员!');
            }
        }).catch=(err)=>{
            console.log("==error==",err)
        }
    }
    editChange=(id,name,e)=>{
        let iList = [...this.state.seniorList];
        iList.filter((item,index)=>{
            if(item.id===id||item.newID===id){
                item[name] = e.target.value;
            }
            return item;
        });
        this.setState({seniorList:iList});
    }
    colEdit=(id)=>{
        let iList = [...this.state.seniorList];
        iList.filter((item,index)=>{
            if(item.id===id){
                item['isEdit'] = true;
            }
            return item;
        });
        this.setState({seniorList:iList,isAdd:true});
    }
    newAdd=()=>{
        let iList = [...this.state.seniorList],time= new Date(),
            tempObj={id:'',name:'',job:'',honor:'',profile:'',isEdit:true,newID:time.getTime()};
        iList.unshift(tempObj);
        this.setState({seniorList:iList,isAdd:true});
    }
    colCancel=(data)=>{
        let id = data.id,iList = [...this.state.seniorList];
        this.setState({isAdd:false});
        // let newID = data.newID;
        if(!data.id){
            this.loadList();
            return false;
        }
        if(!data.name&&!data.job&&!data.honor){
            Modal.warning({title:"提示",content:"请补全信息！"});
            return false;
        }
        iList.filter((item,index)=>{
            if(item.id===id){
                item['isEdit'] = false;
            }
            return item;
        });
        this.setState({seniorList:iList});
    }
    colSave=(data)=>{
        if(!data.name){
            Modal.warning({title:"提示",content:"请填写姓名信息！"});
            return false;
        }else if(!data.job){
            Modal.warning({title:"提示",content:"请填写职务信息！"});
            return false;
        }else if(!data.honor){
            Modal.warning({title:"提示",content:"请填写头衔信息！"});
            return false;
        }
        let t=this,params = {name:data.name||"",job:data.job||"",profile:data.profile||"",honor:data.honor||""};
        if(data.id){
            params["seniorTalentId"] = data.id;
        }
        post({url:API.API_COMPANY_TALENT_SENIOR_SAVE_OR_UPDATE,data:params}).then(function(res){
            if(res&&res.code===10000){
                message.success("操作成功！");
                t.setState({isAdd:false})
                t.loadList();
            }else{
                message.warn((res&&res.message)||'系统出错，请联系管理员!');
            }
        }).catch=(err)=>{
            console.log("==error==",err)
        }
    }
    getColumns(){
        let columns = [],t=this;
        columns = [{
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            render:(r,k,index)=>{
                return k.isEdit?<Input value={r} onChange={t.editChange.bind(t,k.id||k.newID,"name")} />:r;
            }
          }, {
            title: '职务',
            dataIndex: 'job',
            key: 'job',render:(r,k,index)=>{
                return k.isEdit?<Input value={r} onChange={t.editChange.bind(t,k.id||k.newID,"job")} />:r;
            }
          }, {
            title: '荣誉头衔',
            dataIndex: 'honor',
            key: 'honor',render:(r,k,index)=>{
                return k.isEdit?<Input value={r} onChange={t.editChange.bind(t,k.id||k.newID,"honor")} />:r;
            }
          },{
            title: '简介',
            dataIndex: 'profile',
            key: 'profile',render:(r,k,index)=>{
                return k.isEdit?<Input value={r} onChange={t.editChange.bind(t,k.id||k.newID,"profile")} />:r;
            }
          }, {
            title: '操作',
            key: 'action',
            render: (text, record) => {
                let isEdit = record.isEdit;
              return isEdit?<span>
                <a href="javascript:;" onClick={t.colSave.bind(t,record)}>保存</a>
                <Divider type="vertical" /><a href="javascript:;" onClick={t.colCancel.bind(t,record)}>取消</a>
              </span>:<span>
                <a href="javascript:;" onClick={t.colEdit.bind(t,record.id)}>编辑</a>
                <Divider type="vertical" />
                    <Popconfirm title="是否要删除选项?" onConfirm={t.confirm.bind(t,record.id)} onCancel={t.cancel} okText="Yes" cancelText="No">
                        <a href="javascript:;" >删除</a>
                    </Popconfirm>
                <Divider type="vertical" />
              </span>
            },
        }];
        return columns;
    }
    confirm(id) {
        let t=this;
        post({url:API.API_COMPANY_TALENT_SENIOR_DELETE,data:{seniorTalentId:id}}).then(function(res){
            if(res&&res.code===10000){
                message.success("操作成功！");
                t.loadList();
            }else{
                message.warn((res&&res.message)||'系统出错，请联系管理员!');
            }
        }).catch=(err)=>{
            console.log("==error==",err)
        }
    }
      
    cancel(e) {
        console.log(e);
        message.error('Click on No');
    }
      
    onEdit=(type)=>{
        let iObj = {...this.state.editObj};
        iObj[type] = true;
        this.setState({editObj:iObj})
    }
    cancelEdit=(type)=>{
        let iObj = {...this.state.editObj};
        iObj[type] = false;
        this.setState({editObj:iObj});
        this.loadInfor();
    }
    saveInfo=(type)=>{
        let t=this;
        post({url:API.API_COMPANY_TALENT_COUNT_UPDATE,data:t.state.personObj}).then(function(res){
            if(res&&res.code===10000){
                message.success("保存成功！");
                t.cancelEdit(type);
                t.setState({isAdd:false});
            }else{
                message.warn((res&&res.message)||'系统出错，请联系管理员!');
            }
        }).catch=(err)=>{
            console.log("==error==",err)
        }
    }
    textChange=(name,e)=>{
        let iObj = {...this.state.personObj};
        iObj[name] = e.target.value||"";
        this.setState({personObj:iObj});
    }
    pageChange=(page,pageSize)=>{
        this.setState({page,pageSize})
        this.loadList(page,pageSize);
    }
    sizeChange=(current,size)=>{
        this.setState({page:current,pageSize:size});
        this.loadList(current,size);
    }
    render() {
        const {seniorList,seniorCont,personObj,loading,page,pageSize,editObj} =this.state;
        const columns = this.getColumns();
        let t=this,editBasic = editObj&&editObj['basic'];
        const data =seniorList;
        const rendInput = function(name,type){
            if(type==='textarea'){
                return <Input type="textarea" value={personObj&&personObj[name]} onChange={t.textChange.bind(this,name)} />;
            }
        }
        let pageProps ={
            page:page,pageSize:pageSize,
            showSizeChanger:true,showQuickJumper:true,
            onShowSizeChange:this.sizeChange,onChange:this.pageChange,
            showTotal:(total)=>`共 ${total} 条`
        }
        return (
          <div className="gutter-example button-demo">
            <div className={styles.header}>
              <BreadcrumbCustom first="企业信息" second="人才信息" />
              <div className={styles.headerB}>人才信息</div>
            </div>  
            <Row gutter={16}>
             <Col className="gutter-row" md={24}>
                <div className={styles.PersonInfor}>
                    <div className="gutter-box">
                      <Card title={<h2>员工学历统计</h2>} bordered={false} 
                            extra={editBasic?null:<Button className={styles.btn} onClick={this.onEdit.bind(this,"basic")}>编辑</Button>}>
                            <Row gutter={16}>
                                <Col span={6} className={styles.cardBox}>
                                    <div className={styles.boxDiv}>
                                        <label htmlFor="">总人数:</label>
                                        {editBasic?rendInput("employeeCount",'textarea'):<div>{personObj&&personObj.employeeCount}</div>}
                                    </div>
                                </Col>
                                <Col span={6} className={styles.cardBox}>
                                    <div className={styles.boxDiv}>
                                        <label htmlFor="">本科人数:</label>
                                        {editBasic?rendInput("undergraduateCount",'textarea'):<div>{personObj&&personObj.undergraduateCount}</div>}
                                    </div>
                                </Col>
                                <Col span={6} className={styles.cardBox}>
                                    <div className={styles.boxDiv}>
                                    <label htmlFor="">硕士人数:</label>
                                    {editBasic?rendInput("masterCount",'textarea'):<div>{personObj&&personObj.masterCount}</div>}
                                    </div>
                                </Col>
                                <Col span={6} className={styles.cardBox}>
                                    <div className={styles.boxDiv}>
                                    <label htmlFor="">博士人数:</label>
                                    {editBasic?rendInput("doctorateCount",'textarea'):<div>{personObj&&personObj.doctorateCount}</div>}
                                    </div>
                                </Col>
                            </Row>
                            {editBasic?<Row className={styles.footerBox}>
                                    <Button onClick={this.cancelEdit.bind(this,"basic")}>取消</Button> 
                                        <Button type="primary" onClick={this.saveInfo.bind(this,'basic')}>保存</Button>
                                </Row>:null}
                        </Card>
                        </div>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Card title={<h2>高级人才</h2>} bordered={false} extra={<Button onClick={t.newAdd} disabled={t.state.isAdd}>新增人才</Button> }>
                                <Table columns={columns} pagination={pageProps} dataSource={data} rowKey="newID" loading={loading} />
                                </Card>
                            </Col>
                        </Row>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default PersonInfor;