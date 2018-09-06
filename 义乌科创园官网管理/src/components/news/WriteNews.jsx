/**
 * authored on 2017/4/15.
 */
import React, { Component } from "react";
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState,ContentState,convertFromHTML ,convertToRaw} from 'draft-js';
import draftToMarkdown from 'draftjs-to-markdown';
import htmlToDraft from 'html-to-draftjs';
import {Upload, Select, message,Form,Icon,Input,Button,Modal } from "antd";
import PropTypes from "prop-types";
import API from "@/mock";
import styles from './report.module.less';



const FormItem = Form.Item;
const Option = Select.Option;
class WriteNews extends Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    const contentBlock = htmlToDraft(this.props.content||"");
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
    this.state = {
        loading: false,
        editorState:this.props.content?editorState:EditorState.createEmpty(),
      previewVisible:false,previewImage:"",
      editorContent:this.props.content||"",addVisible:false,
      url:this.props.avator,
      avatar:this.props.avator?[{
        uid: -1,
        name: 'logo',
        status: 'done',
        url: this.props.avator,
      }]:null,
      id:this.props.id
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
  normFile = (e) => {
    // console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  getBase64=(img,callback)=>{
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  beforeUpload=(file)=>{
    const isPic = file.type === 'image/jpeg'||file.type==="image/png";
    const isLt1M = file.size / 1024/1024 < 1;
    if (!isPic) {
      message.error('请上传图片文件');
    }
    if (!isLt1M) {
      message.error('图片大小不能超过1MB!');
    }
    return isPic && isLt1M;
  }
  handleChange = (info) => {
    let status = info.file.status;
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (status === 'removed'||status==='error') {
      this.setState({ avatar: "",loading:false });
      return;
    }
    if (info.file.status === 'done') {
      let url = info.file.response&&info.file.response.data;
      let iObj = [{
        uid: -1,
        name: 'logo',
        status: 'done',
        url: url,
      }]
      this.setState({avatar:iObj,loading:false,url:url})
    }
  }
  submit=(e)=>{
    e.preventDefault();
    let t=this;
    t.setState({loading:true})
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log('请确认表单信息: ', values);
        return false;
      }else{
        let content="",t=this;
        const {editorState} =this.state;
        content=draftToHtml(convertToRaw(editorState.getCurrentContent()));
        let Editcontent=draftToMarkdown(convertToRaw(editorState.getCurrentContent()));
        if(Editcontent.length ===1){
           message.warn("请填写新闻正文！")
       }else{  
      
        let iObj = {
          title:values.newstitle,
          typeId:values.newstypeId,
          content:content,
          url:this.state.url,
          subject:values.newssubject
        }
        if(t.props.type&&t.props.type==="edit"){
          iObj["newsId"] = t.props.newsId
        }
        t.props.submitInfo(iObj);
        }
      }
    });
  }
  cancel=()=>{
    this.props.cancel();
  }
  onEditorStateChange=(editorState)=>{
    //  console.log(draftToHtml(this.state.editorContent),"===edit===")
   this.setState({editorState});

}
// onEditorChange=(e)=>{
//   console.log(e,"===edit===")
// // this.setState({editorState});
// }


handleCancel = () => this.setState({ previewVisible: false })

handlePreview = (file) => {
  // console.log(file);
  this.setState({
    previewImage: file.url || file.thumbUrl,
    previewVisible: true,
  });
}
onRemove=()=>{
  this.setState({url:undefined});
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
    let typeList = [{id:1,name:'信息公示'},{id:2,name:'新闻资讯'},{id:3,name:'园区文化'},{id:4,name:'领导关怀'}];
    const { getFieldDecorator } = this.props.form;
    let title=this.props.title||"",
        subject=this.props.subject||"",
        content=this.props.content||"",
        newsId=this.props.newsId||'',
        typeId=this.props.id || '',
        url=this.props.url||'';
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
    const uploadButton = (
        <div>
          <Icon type={this.state.loading ? 'loading' : 'plus-square'} />
        </div>
      );
      const { editorState } = this.state;
    return (
      <div style={{background:"#fff"}} className={styles.editPanel}>
        <Form>
          <FormItem {...formItemLayout} hasFeedback label="新闻标题">
            {getFieldDecorator("newstitle", {
              rules: [
                {required: true,message: "新闻标题不能为空"},
                {validator:this.checkText}
              ],
              initialValue:title
            })(<Input placeholder="请输入新闻标题30字以内" maxLength="30"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="新闻类型" hasFeedback >
          {getFieldDecorator('newstypeId', {
            rules: [
              { required: true, message: '请选择新闻类型!' },
              {validator:this.checkText}
            ],
            initialValue:typeId
          })(
            <Select placeholder="请选择新闻类型" style={{width:"60%"}}>
            {typeList.map((item,index)=><Option key={item.id} value={item.id}>{item.name}</Option>)}
           </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="正文">
            {getFieldDecorator("content", {
              rules: [
                {required: true,message: "正文内容不能为空"}
              ],
              initialValue:this.state.editorContent
            })(
                <Editor
                editorState={editorState}
                wrapperClassName={styles.editorWrap}
                editorClassName={styles.editorCont}
                // blockRendererFn={myBlockRenderer}
                onEditorStateChange={this.onEditorStateChange}
                // onContentStateChange={this.onEditorChange}
                placeholder="请输入新闻正文"
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
            label="新闻截图"
            extra={<div>banner 要求：png 格式 / 320 x 240 (px) / 1M 以下</div>}
          >
             <div className={styles.dropbox}>
                {getFieldDecorator('avator', {
                    getValueFromEvent: this.normFile,
                    initialValue:this.state.avatar
                })(
                    <Upload
                        name="file"
                        listType="picture-card"
                        className="avatar-uploader"
                        onPreview={this.handlePreview}
                        action={API.API_FILE_UPLOAD}
                        // action="//jsonplaceholder.typicode.com/posts/"
                        beforeUpload={this.beforeUpload}
                        onChange={this.handleChange}
                        defaultFileList={this.state.avatar}
                        onRemove={this.onRemove}
                    >
                        {this.state.avatar ?null : uploadButton}
                    </Upload>
                )}
            </div>
            </FormItem>
            <FormItem {...formItemLayout} hasFeedback label="新闻摘要">
                {getFieldDecorator("newssubject", {
                rules: [
                    {validator:this.checkText}
                ],
                initialValue:subject
                })(<Input placeholder="选填" />)}
           </FormItem>
            <FormItem wrapperCol={{ span: 12, offset: 6 }} >
                <Button type="primary" onClick={this.submit} loading={this.state.loading}>提交</Button>
                <Button type="default" onClick={this.cancel} >取消</Button>
            </FormItem>
        </Form>
        <Modal title="图片预览" visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="pic" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </div>
    );
  }
}
WriteNews.propTypes = {
  // username: PropTypes.string.isRequired,
   newstitle: PropTypes.string.isRequired,
//   newstypeId:PropTypes.string.isRequired
};
export default Form.create()(WriteNews);
