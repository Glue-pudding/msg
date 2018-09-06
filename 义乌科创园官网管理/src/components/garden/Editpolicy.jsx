/**
 * Created by xutao on 2018/4/22.
 */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { EditorState, convertToRaw, ContentState,convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import {Upload,Select,message,Form,Icon,Input,Button,} from "antd";
import API from "@/mock";
import styles from "./Banner.module.less";
import draftToMarkdown from 'draftjs-to-markdown';
import htmlToDraft from 'html-to-draftjs';

const FormItem = Form.Item;
const Option = Select.Option;
class EditPerson extends Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    const contentBlock = htmlToDraft(this.props.content||"");
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
    this.state = {
        content:this.props.content,
        loading: false, iconLoading: false,
        previewVisible:false,previewImage:"",
        editorContent:this.props.content||"",addVisible:false,
        avatar:this.props.filePath || [],
        editorState:this.props.content?editorState:EditorState.createEmpty(),
      defaultFileList:this.props.filePath,
      url:'',
      subject:this.props.subject||"",
    };
  }
  }
  checkText=(rule,value,callback)=>{
    let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

    if(regEn.test(value) || regCn.test(value)) {
        callback("不能包含特殊字符.");
    }else{
        callback();
    }
  }
  addNewtype=()=>{
    this.setState({addVisible:true});
  }
  cancelAdd=()=>{this.setState({addVisible:false,eidtName:""})}
  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  onEditorChange = (editorContent) => {
    this.setState({
          editorContent,
      });
  }
  onEditorStateChange=(editorState)=>{
    console.log(draftToHtml(this.state.editorContent),"===edit===")
  this.setState({editorState});
  }

  // handleCancel = () => this.setState({ previewVisible: false })
  beforeUpload=(file)=>{
    const isPic = file.type === 'image/jpeg'||file.type==="image/png";
    const isLt1M = file.size / 1024/1024 < 10;
    if (!isPic) {
      message.error('请上传文件');
    }
    if (!isLt1M) {
      message.error('图片大小不能超过10MB!');
    }
    return isPic && isLt1M;
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
 

  handleChange = (info) => {
    let status = info.file.status,t=this;
    let SaveList=[];
    let PolicyUrl=[...this.state.avatar]
    if (status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (status === 'removed'||status==='error') {
      let curId = info.file.uid,curIndex=null;
      PolicyUrl.map((item,index)=>{
        if(item.uid === curId){
          curIndex = index;
        }
      });
      if(curIndex!==null){
        PolicyUrl.splice(curIndex,1);
      };
      t.setState({avatar:PolicyUrl});
    }
    if (status === 'done') {
      let url = info.file.response&&info.file.response.data;
      let urll={url:url,uid:info.file.uid}
       PolicyUrl.push(urll);
       console.log(PolicyUrl);
       this.setState({avatar:PolicyUrl,loading:false})
    }
  }
  submit=(e)=>{
    e.preventDefault();
    let t=this;
    t.setState({loading:true})
    const {avatar}=this.state;
    this.props.form.validateFields((err, values) => {
      console.log(values.usertitle);
      if (err) {
        console.log('请确认表单信息: ', values);
        return false;
      }else{
        let content="",t=this;
        const {editorState} =this.state;
        content=draftToHtml(convertToRaw(editorState.getCurrentContent()));
        let Editcontent=draftToMarkdown(convertToRaw(editorState.getCurrentContent()));
        if(Editcontent.length ===1){
          message.warn("请填写政策细则！")
        }else{
        if(!avatar.length){
          let iObj = {
            typeId:values.typeId,
            title:values.username,
            subject:values.subject,
            content:content,
            
          }
          if(t.props.type&&t.props.type==="edit"){
            iObj["policyId"] = t.props.id
          }
          t.props.submitInfo(iObj);  
        }else{
          let tempList=[];
          avatar.map((item,index)=>{
            tempList.push(item.url);
          })
          let iObj = {
            typeId:values.typeId,
            title:values.username,
            subject:values.subject,
            content:content,
            filePath:tempList,
            
          }
          if(t.props.type&&t.props.type==="edit"){
            iObj["policyId"] = t.props.id
          }
          t.props.submitInfo(iObj);  
        }
       }
      }
    });
  }
  cancel=()=>{
    this.props.cancel();
    this.setState({loading:false})
  }

  uploadImageCallBack(file) {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', API.API_FILE_UPLOAD);
        xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
        const data = new FormData();
        data.append('file', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          // Modal.info({title:'message',content:xhr.responseText})
          const response = JSON.parse(xhr.responseText);
          let iObj = { data: { link: response.data||""}}
          resolve(iObj);
          message.warn("上传成功");
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  }
  render() {
    var t = this;
    const props = {
      action: API.API_FILE_UPLOAD,
    };
    const { getFieldDecorator } = this.props.form;
    let username=this.props.title||"",
        typeName=this.props.typeName||"", 
        content=this.props.content||"",
        subject=this.props.subject||"",
        typeId=this.props.typeId||"",
        url=this.props.filePath||"";
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
      let typeList = [{id:1,name:'扶持政策'},{id:2,name:'特色服务'},{id:3,name:'基础服务'}];
    return (
      <div style={{background:"#fff"}} className={styles.editPanel}>
        <Form>
          <FormItem {...formItemLayout} hasFeedback label="政策名称">
            {getFieldDecorator("username", {
              rules: [
                {required: true,message: "政策名称不能为空"},
                {validator:this.checkText}
              ],
              initialValue:username
            })(<Input placeholder="请输入政策名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="政策类型">
            {getFieldDecorator("typeId", {
              rules: [
                { required: true,message: "政策类型不能为空" },
                {validator:this.checkText}
              ],
              initialValue:typeId
            })(<Select placeholder="请选择政策类型">
            {typeList.map((item,index)=><Option key={item.id} value={item.id}>{item.name}</Option>)}
           </Select>)}
          </FormItem>
          <FormItem {...formItemLayout} label="政策细则">
            {getFieldDecorator("content", {
               rules: [
                {required: true,message: "政策细则不能为空"},
              ],
              initialValue:content
            })(
                <Editor
                editorState={this.state.editorState}
                wrapperClassName={styles.editorWrap}
                editorClassName={styles.editorCont}
                // blockRendererFn={myBlockRenderer}
                onEditorStateChange={this.onEditorStateChange}
                onContentStateChange={this.onEditorChange}
                placeholder="请输入政策细则"
                localization={{
                  locale: 'zh',
                }}
                toolbar={{
                  image: { uploadCallback:this.uploadImageCallBack,
                      previewImage: true,
                      urlEnabled: true,
                      uploadEnabled: true,
                      inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                      defaultSize: {
                        height: 'auto',
                        width: '500',
                      },
                     },
                 }}
                />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="上传附件"
            extra={<div>附件 要求： 10M 以下</div>}
          >
            <div className={styles.dropbox}>
                {getFieldDecorator('avator', {
                    // valuePropName: 'fileList',
                    getValueFromEvent: this.normFile,
                    initialValue:url
                })(
                    <Upload name="file" {...props} onChange={this.handleChange} defaultFileList={this.state.defaultFileList}>
                    <Button>
                      <Icon type="file-add" /> 上传附件
                    </Button>
                   </Upload>
                )}
            </div>
            </FormItem>
            <FormItem {...formItemLayout} hasFeedback label="新闻摘要">
            {getFieldDecorator("subject", {
              rules: [
                {validator:this.checkText}
              ],
              initialValue:subject
            })(<Input placeholder="请输入新闻摘要" />)}
          </FormItem>
            <FormItem wrapperCol={{ span: 12, offset: 5 }} >
                <Button type="primary" onClick={this.submit} className={styles.personBtn} loading={this.state.loading}>提交</Button>
                <Button type="default" onClick={this.cancel} className={styles.personBtn}>取消</Button>
            </FormItem>
        </Form>
      </div>
    );
  }
}
export default Form.create()(EditPerson);
