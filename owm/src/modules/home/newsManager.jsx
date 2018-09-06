import React from "react";
import TableComp from '@/modules/common/table/TableComp';
import CommonEditor from '@/modules/common/editor/normalEditor';
import {Divider,Popconfirm,Modal,Button,Form,Input,DatePicker,Icon} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
class NewsComp extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        curObj:props.infor||null,
        curID:null,
        newsVisible:false,
        isEdit:false,
        isNew:false,
        editorCont:''
      };
    }
    componentWillReceiveProps(props){
        let nowInfor= JSON.stringify(props.infor),curInfor=JSON.stringify(this.props.infor);
        if(nowInfor !== curInfor){
            this.setState({curObj:props.infor});
        }
    }
    delRowData=(id)=>{
        this.props.action.delNewsAction(id);
    }
    editRowData=(id)=>{
        this.props.action.getNewsDetail(id);
        this.setState({isEdit:true,curID:id})
    }
    getColumns(){
        let t=this;
        let menuColumns = [
            {title:'新闻标题',dataIndex:'title',key:'title'},
            {title:'新闻时间',dataIndex:'time',key:'time'},
            {title:'操作',dataIndex:'content',key:'content',render:(text, record)=>{
                return (
                  <div>
                    <span>
                        <a href="javascript:;" onClick={() => t.editRowData(record.id)}>编辑</a>
                        <Divider type="vertical" style={{margin:'0 5px'}}/>
                        <Popconfirm title="是否删除" onConfirm={() => t.delRowData(record.id)}>
                            <a href="javascript:;">删除</a>
                        </Popconfirm>
                    </span>
                  </div>
                );
            }}
        ];
        return menuColumns;
    }
    newAdd=()=>{
        let iObj = JSON.parse(JSON.stringify(this.state.curObj));
        iObj['detail'] = {};
        this.setState({isEdit:true,isNew:true,curObj:iObj,curID:null});
    }
    validateText=(rule, value, callback)=>{
        const form = this.props.form;
        if(value&&value.length>50){
            callback('标题内容建议不超过50个字符。');
        }else{
            callback();
        }
    }
    getNewsText=(text)=>{
        this.props.form.setFieldsValue({"content":text});
    }
    cancel=()=>{
        const {isEdit} = this.state;
        if(isEdit) {
            this.setState({isEdit:false,isNew:false});
        }else{
            this.props.cancelEdit();
        }
    }
    renderForm=()=>{
        const { getFieldDecorator } = this.props.form;
        let t=this;
        const {curObj} = this.state;
        let newsObj = curObj&&curObj['detail']||null;
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
          },
        };
        let editConfig = {
            id:'newsEditor',
            value:newsObj&&newsObj.newsContent,
        }
        return <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="新闻标题" >
            {getFieldDecorator('title', {
                rules: [ {required: true, message: '请输入新闻标题!'},{
                    validator: t.validateText,
                }],
                initialValue:newsObj&&newsObj.newsTitle
            })(
                <Input />
            )}
            </FormItem>
            <FormItem {...formItemLayout} label="新闻时间" >
            {getFieldDecorator('time', {
                rules: [ {required: true, message: '请选择时间!'}],
                initialValue:newsObj&&newsObj.newsTime&&moment(newsObj.newsTime,"YYYY-MM-DD")
            })(
                <DatePicker  />
            )}
            </FormItem>
            <FormItem {...formItemLayout} label="新闻正文" >
            {getFieldDecorator('content', {
                rules: [ {required: true, message: '请填写正文!'}],
                initialValue:newsObj&&newsObj.newsContent
            })(
                <CommonEditor config={editConfig} getValue={this.getNewsText} />
            )}
            </FormItem>
        </Form>
    }
    handleOk=(e)=>{
        e.preventDefault();
        let t=this;
        const {curObj,curID} = this.state;
        this.props.form.validateFields((err, values) => {
            if(err){
                console.log('表单出错！');
                return false;
            }else{
                let iObj={newsTitle:values.title,newsTime:moment(values.time).format('YYYY-MM-DD'),newsContent:values.content};
                if(curID){iObj['newsId']=curID;}
                t.props.action.submitNews(iObj);
                t.cancel();
            }            
        });
    }
    render(){
        const {isEdit,curObj,isNew} = this.state;
        const {total,visible,cancelEdit,handleEdit,action,infor} = this.props;
        let list = curObj&&curObj.list||[];
        return <Modal visible={visible} title={isEdit?<span><Icon type="rollback" title="返回" onClick={this.cancel}/> 编辑新闻</span>:'新闻管理'} 
                        footer={!isEdit?null:[
                            <Button key="back" onClick={this.cancel}>返回</Button>,
                            <Button key="submit" type="primary" onClick={this.handleOk}>保存</Button>
                        ]}
                        width='968px'  maskClosable={false} onCancel={this.cancel} >
            {isEdit?null:<Button type="primary" onClick={this.newAdd} className="mb-md-4" disabled={list.length>50} >新增新闻</Button>}
            {(isEdit&&curObj&&Object.keys(curObj['detail']).length)||isNew?this.renderForm()
                    :<TableComp list={list} columns={this.getColumns()} rowKey="id" loading={infor.tableLoading}   />}
        </Modal>
    }
}
export default Form.create()(NewsComp);