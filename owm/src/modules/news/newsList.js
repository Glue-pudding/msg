import React from "react";
import './news.css';
import comStyle from './comm.less';
import {Link } from 'react-router-dom';
import {Pagination,Modal,Table,Switch,Button,Input,Divider,Popconfirm,Form,DatePicker,Icon,message} from 'antd';
import moment from 'moment';
import ClassicEditor from '@/modules/common/editor/normalEditor';
// import { connect } from "tls";
import {connect } from "react-redux";
import { bindActionCreators } from 'redux'
import NewsAction from './newsAction';
import PageTalle from '../common/pageTable';
import InlineEditor from '@/modules/common/editor/inlineEditor';
const TextArea = Input.TextArea;
const FormItem = Form.Item;

const { MonthPicker, RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';
class News extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
          titleEdit:false,
          menuEdit:false,
          editKey:'',
          isEditing:false,
          activeKey:'home',
          menuModalVisible:false,
          editModalVisible:false,
          newsListDefau:[],
          details:[],
          detailsTime:'',
          deteailsSubject:'',
          oneId:'',
          size:5,
          current:1
      };
      this.firstEditKey = '';
  }
  componentDidMount(){
    const {loadNewsList}=this.props.actions;
    loadNewsList();
    const {newsState}=this.props;
    const {news} = newsState;
    let pagenews=news.slice(0,5);
    this.setState({
      newsListDefau:pagenews
    })
  }
  loadData=(page,size)=>{
  }
  componentWillReceiveProps(){
      // this.setState({activeKey:window.location.pathname})
  }
  onEdit=()=>{
      this.setState({
        menuModalVisible:true,
        editModalVisible:false
      });
  }

  //点击编辑
  editRowData(rowData) {
    console.log(rowData);
    this.setState({
      oneId:rowData.id,
      details:rowData,
      detailsTime:rowData.time,
      deteailsSubject:rowData.subject,
      editModalVisible:true
    })
    
  }
  // 取消
  cancelRowData(rowData) {
    const { editKey, schemaTabList } = this.state;

    this.setState({
      // editKey: rowData.key,
      isEditing: false
    });
    this.editing = false;
  }

  // 删除 
  delRowData(rowData) {
    const {deleteNewsList}=this.props.actions;
    deleteNewsList(rowData.id);
  }
  // 新增
  handleAdd(){
    this.setState({
      oneId:'',
      details:'',
      editModalVisible:true
    })
  }
  dataform=(date,dateString)=>{
    this.setState({
      detailsTime:dateString
    });
    console.log(dateString);
  }
  //model返回
  editReturn=()=>{
    this.setState({
      detailsTime:'',
      deteailsSubject:'',
      editModalVisible:false
    })
  }
  //新增或提交
  menuOk=()=>{
    const {addAndEdit}=this.props.actions;
    let formdata;
    this.props.form.validateFields((err, values) => {
      console.log(values);
      if(err){
        message.info('请完善信息');
      }else{
        const {detailsTime,deteailsSubject}=this.state;
        if(this.state.oneId){
          formdata={
            newsId:this.state.oneId,
            newstitle:values.title,
            newsTime:detailsTime,
            newsContent:deteailsSubject
          }
        }else{
          formdata={
            newstitle:values.title,
            newsTime:detailsTime,
            newsContent:deteailsSubject
          }
        }
        console.log(formdata);
        addAndEdit(formdata);
      }
    });
  }
  //页码改变
  pageChange=(page,size)=>{
    // const {loadNewsList}=this.props.actions;
    // loadNewsList(5);
    const {newsState}=this.props;
    const {news} = newsState;
    // console.log(news);
    let pagenews=news.slice((page-1)*5,page*5);

    this.setState({
      newsListDefau:pagenews,
      current:page
    })
  }
  getContent=(data)=>{
    console.log("==block data==",data);
    this.setState({
      deteailsSubject:data
    })
  }

  newsListTitle=(data)=>{
    console.log(data);
    const {newsListTitle} = this.props.actions;
    newsListTitle(data);
  }

  rendernews=()=>{
      const {newsState}=this.props;
      const {news} = newsState;
      const {newsListDefau}=this.state;
      let curKey = this.state.activeKey;
      return newsListDefau.map((item,index)=>{
          return <li key={item.id}>
          <h3><Link to={'/newsDetail/'+item.id}>{item.title}</Link></h3>
          <p class="mb-4 time"><i class="fa fa-clock-o fa-lg fa-flip-horizontal text-primary"></i>{item.time}</p>
          <p class="text">{item.subject}</p>
        </li>
          
      })
  }
  list=()=>{
    const t = this;
      const {isEditing,editKey}=t.state;
      const {newsState}=this.props;
      const {news,count} = newsState;
    let menuColumns = [
        {title:'新闻标题',dataIndex:'title',key:'title',
          render: (text, record) => {
            return (
              <div>
                {
                    text
                }
              </div>
            );
          }
        },
        {title:'新闻时间',dataIndex:'time',key:'time',
          render: (text,record) => {
            return (
              <div>
                {
                  text
                }
              </div>
            )
          }
        },
        {title:'操作',dataIndex:'content',key:'content',render:(text, record)=>{
            return (
              <div>
                {
                    <span>
                      <a onClick={() => t.editRowData(record)}>编辑</a>
                      <Divider type="vertical" style={{margin:'0 5px'}}/>
                      <Popconfirm title="是否删除" onConfirm={() => t.delRowData(record)}>
                        <a href="javascript:;">删除</a>
                      </Popconfirm>
                    </span>
                }
              </div>
            );
        }}
    ]
    return (
      <div>
      <Button onClick={this.handleAdd.bind(this)} type="primary" style={{ marginBottom: 8 }}>
         新增新闻
      </Button>
      <PageTalle
          // loading={this.state.loading} 
          columns={menuColumns} 
          // list={dataList}
          list={news|| []}
          loadList={this.loadData}
          rowKey={(record) => record.key}
          total={count}
        />
      {/* <Table columns={menuColumns} dataSource={news} pagination={false} rowKey="id"></Table> */}
      </div>
    )
  }
  edit=()=>{
    const t = this;
    const {details,detailsTime,deteailsSubject}=t.state;
    const { getFieldDecorator } = this.props.form;
    let title=details.title||'',
      time=detailsTime||'',
      subject=deteailsSubject||'';
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      }
    };
    return (
      <Form>
      <FormItem {...formItemLayout}  label="新闻标题">
        {getFieldDecorator('title', {
          rules: [
            {required: true,message: '请输入新闻标题'},
            {validator:this.checkText}
          ],
          initialValue:title
        })(<Input placeholder="请输入新闻标题,2-20个中英文字符" />)}
      </FormItem>
      <FormItem {...formItemLayout}  label="新闻时间">
        {getFieldDecorator('time', {
          rules: [
            { required: true,message: '请选择新闻时间' }
          ],
          initialValue:time?moment(time):''
        })(<DatePicker format={dateFormat} onChange={this.dataform.bind(this)}/>)}
      </FormItem>
      <FormItem {...formItemLayout}  label="新闻正文">
        {getFieldDecorator('subject', {
          rules: [
            { required: true,message: '请输入新闻正文' }
          ],
          initialValue:subject
        })(<ClassicEditor config={{id:'cEditor',value:subject}} getValue={this.getContent.bind(this)} />)}
      </FormItem>
      
    </Form>
    )
  }
  menuClose=()=>{
      this.setState({menuModalVisible:false});
  }
  editClose=()=>{
    this.setState({editModalVisible:false});
  }
  render(){
    
      const t = this;
      const {isEditing,editKey,menuModalVisible,current}=t.state;
      const {newsState}=this.props;
      const {news,count,newsListTitle} = newsState;
      console.log(typeof(count));
      
      return (
        <div class="newsList ptr5 pbr6">
          <div class="container">
            <div class="row wrap-news-box">
              <div class="col-md-8 align-self-center">
                <div class="max-500 m-auto">
                  <h2 class="title font-bold text-center mb-5">
                  <InlineEditor config={{text:newsListTitle,id:"newsListTitle"}} getValue={this.newsListTitle} />
                  </h2>
                  <div style={{overflow:"hidden"}}>
                    <ul class=" with-underline font-medium mb-5 hoverable" data-aos="fade-in" data-aos-duration="1200">
                    <i class="editCoin" onClick={this.onEdit}></i>
                    {this.rendernews()}
                    </ul>
                  </div>
                  <Pagination current={current} pageSize={5} total={count} className={comStyle.pagePanel} onChange={t.pageChange.bind(t)}/>
                </div>
              </div>
            </div>
          </div>
          <Modal onCancel={this.menuClose} visible={menuModalVisible} title={this.state.editModalVisible?<div><Icon style={{color:'#328DFF'}} type="enter" onClick={this.editReturn}/>编辑新闻</div>:"新闻管理"} footer={this.state.editModalVisible?[
            <Button key="back" onClick={this.menuClose}>取消</Button>,
            <Button key="submit" type="primary" onClick={this.menuOk}>
              保存
            </Button>,
          ]:null}  width="700px">
              {this.state.editModalVisible?this.edit():this.list()}
          </Modal>
        </div>
      );
  }
}
const mapStateToProps=function(state) {
  return {
      newsState: state.newsState
  }
}

const mapDispatchToProps=(dispatch)=> {
  return {
      actions:bindActionCreators(NewsAction, dispatch)
  }
}

News = Form.create()(News);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(News);