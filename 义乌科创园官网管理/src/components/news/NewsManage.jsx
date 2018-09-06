/**
 * Created by Qin sijia on 2018/4/24.
 */
import React, { Component } from 'react';
import { Row, Col, Card ,Divider,Popconfirm,Table,message,Button,Select } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import styles from './report.module.less';
import API from '@/mock';

import TabComp from '../modules/TableComp';
import {post} from '../../axios/tools';
import WriteNews from './WriteNews.jsx';

const Option = Select.Option;


class NewsManage extends Component{
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {
            editType:'',
            list:[],page:1,pageSize:10,typeId:0,
            loading:false,count:0,
            formInfor:{
              id:'',title:'',newsId:'',subject:'',content:'',url:''
            }
        };
     }

     componentDidMount(){
      let me=this;
       me.loadData();
  }
  loadData=(page,size)=>{
    let t=this;
    t.setState({loading:true});
    let params = {url:API.API_NEWS_LIST,data:{page:page||this.state.page,size:size||this.state.pageSize,typeId:this.state.typeId}};
    post(params).then(function(res){
        if(res&&res.code===10000){
            t.setState({list:res.data.list,loading:false,editType:"",count:res.data.count});
        }else{
            t.setState({loading:false,editType:""});
        }
    }).catch=(err)=>{
        t.setState({loading:false,editType:""})
        console.log("==error==",err)
    }
}

  loadColumn(){
    let columns=[],me=this;
      columns = [{
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text,record,index)=>{
        let isTop = record.isTopset;
        return <div>
            <p key={record.title}>{isTop?<label className={styles.topLabel}>置顶</label>:""}{record.title}</p>
        </div>
    },
    }, {
      title: '类型',
      dataIndex: 'typeName',
      key: 'typeName',
    }, {
      title: '操作人',
      dataIndex: 'modifier',
      key: 'modifier',
    }, {
      title: '操作时间',
      dataIndex: 'modifyTime',
      key: 'modifyTime',
      render:(text) =>{
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
              <a onClick={me.edit.bind(me,id)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="确认删除?" onConfirm={me.delete.bind(me,id,isTop)}>
                  <a href="javascript:;">删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a onClick={me.toggTop.bind(me,id,isTop?0:1)} className={isTop?styles.red:""} >{isTop?"取消置顶":"置顶"}</a>
          </span>
      }
    }];
    return columns;
  }

  edit=(id)=>{
    let t=this,params = {url:API.API_NEWS_GET,data:{newsId:id}}
    post(params).then(function(res){
        if(res&&res.code===10000){
            t.setState({
					editType:"edit",
					formInfor:{...res.data}
				})
            }
            // t.loadData();
        }).catch=(err)=>{
        t.setState({loading:false})
        console.log("==error==",err)
    }
   
  }

  delete(id,isTop){
    let t=this,params = {url:API.API_NEWS_UPDATE,data:{newsId:id,status:-1,isTopset:isTop?1:0}}
    t.setState({loading:true})
    post(params).then(function(res){
        if(res&&res.code===10000){
            message.info("删除成功");
            t.setState({loading:false});
            t.loadData();
        }
    }).catch=(err)=>{
        console.log("==error==",err)
        t.setState({loading:false})
    }
}
toggTop(id,isTop){
    let t=this,params = {url:API.API_NEWS_UPDATE,data:{newsId:id,isTopset:isTop}}
    t.setState({loading:true})
    post(params).then(function(res){
        if(res&&res.code===10000){
            message.success("操作成功");
            t.setState({loading:false});
            t.loadData();
        }
    }).catch=(err)=>{
        t.setState({loading:false})
        console.log("==error==",err)
    }
}
addPerson=()=>{
    this.setState({editType:"add",formInfor:{id:'',title:'',newsId:'',subject:'',content:'',avator:'' }});
   
}
cancel=()=>{
    this.setState({editType:""});
}
submit=(iObj)=>{
    let t=this,params = {url:API.API_NEWS_SAVE_OR_UPDATE,data:iObj};
    t.setState({loading:true})
    post(params).then(function(res){
        if(res&&res.code===10000){
            t.loadData();
            message.success("操作成功");
            t.setState({loading:false});
        }
    }).catch=(err)=>{
        t.setState({loading:false})
        console.log("==error==",err)
    }
}
showTotal=(total)=>{
    return `共 ${total} 条`;
}

typeChange=(val)=>{
    let t=this
     t.setState({typeId:val});
     t.setState({loading:true})
     let params = {url:API.API_NEWS_LIST,data:{page:this.state.page,size:this.state.pageSize,typeId:val}};
     post(params).then(function(res){
         if(res&&res.code===10000){
             t.setState({list:res.data.list,loading:false,editType:""});
             message.success("操作成功");
             t.setState({loading:false});
         }else{
             t.setState({loading:false,editType:""});
         }
     }).catch=(err)=>{
         t.setState({loading:false,editType:""})
         console.log("==error==",err)
     }
} 
  
  render() {
    var me = this,state=me.state;
    let pageProps ={
      page:state.page,pageSize:state.pageSize,
      showSizeChanger:true,showQuickJumper:true,
      showTotal:this.showTotal
    }
    const typeList = [ {
        value: 1,
        name: '信息公示',
        id:1
    },{
        value: 2,
        name: '新闻资讯',
        id:2
    },{
        value: 3,
        name: '园区文化',
        id:3
    },{
        value: 4,
        name: '领导关怀',
        id:4
    }];
    let columns = me.loadColumn();
    let titleCont =<div>
                <Button type="primary" className={styles.personBtn} onClick={me.addPerson}>撰写新闻</Button>
                <Select style={{marginLeft:"20px",width:"128px"}} defaultValue={0} onChange={me.typeChange.bind(this)}>
                    <Option key={0} value={0}>所有信息类型</Option>
                    {typeList.map((item,index)=><Option key={item.id} value={item.id}>{item.name}</Option>)}
                </Select>
            </div>
    return ( 
      <div className=" button-demo">
        <div className={styles.topPanel}>
            {this.state.editType?this.state.editType==="add"?<BreadcrumbCustom first="新闻管理" second="撰写新闻" />:
                    <BreadcrumbCustom first="新闻管理" second="编辑新闻" />
            :<BreadcrumbCustom first="新闻管理" />}
            <h2 style={{display:'inline-block'}}>{this.state.editType?this.state.editType==="add"?"撰写新闻":"编辑新闻":"新闻管理"}</h2>
            {this.state.editType?<Button size="small" style={{marginLeft:'8px',verticalAlign:"text-bottom"}} icon="rollback" onClick={this.cancel} >返回</Button>:null}
        </div>
        <Row type="flex" justify="center">
            <Col md={23}>
                <div className="gutter-box">
                    {!this.state.editType?<Card className={styles.personCard} title={titleCont} bordered={false}>
                    <TabComp loading={state.loading} columns={columns} list={state.list||[]} rowKey="id" loadList={this.loadData} total={state.count} />
                    {/* <Table loading={this.state.loading} pagination={pageProps} columns={me.loadColumn()} dataSource={this.state.list||[]} rowKey="id" /> */}
                    </Card>:<WriteNews type={this.state.editType} title={state.formInfor.title} id={state.formInfor.typeId}
                            newsId={state.formInfor.newsId} avator={state.formInfor.url} cancel={this.cancel} submitInfo={this.submit} 
                            subject={state.formInfor.subject} content={state.formInfor.content} />}
                </div>
            </Col>
        </Row>
   </div>  
        )
  }
}
export default NewsManage;