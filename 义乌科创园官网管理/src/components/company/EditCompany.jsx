/**
 * Created by xutao on 2018/4/26.
 */
import React, { Component } from "react";
import { EditorState, convertToRaw, ContentState,convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { Link } from "react-router-dom";
import {
  Row,
  Col,Upload,
  message,Select,
  Form,Modal,
  Icon,
  Input,
  Button
} from "antd";
import PropTypes from "prop-types";
import API from "@/mock";
import { get, post } from "../../axios/tools";
import styles from "./company.module.less";
import AddPanel from '@/components/modules/addPanel';
import draftToMarkdown from 'draftjs-to-markdown';
import htmlToDraft from 'html-to-draftjs';

const FormItem = Form.Item;
const Option = Select.Option;
class EditCompany extends Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    const contentBlock = htmlToDraft(this.props.content||"");
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
    this.state = {
        loading: false,editorState:this.props.content?editorState:EditorState.createEmpty(),
        previewVisible:false,previewImage:"",
        editorContent:this.props.content||"",addVisible:false,
        avatar:this.props.avator?[{
          uid: -1,
          name: 'logo',
          status: 'done',
          url: this.props.avator,
        }]:null,
        CompanyUrl:this.props.avator,

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
      this.setState({avatar:iObj,loading:false,CompanyUrl:url})
    }
  }
  onEditorChange = (editorContent) => {
        this.setState({
            editorContent,
        });
    }
  onEditorStateChange=(editorState)=>{
      // console.log(draftToHtml(this.state.editorContent),"===edit===")
    this.setState({editorState});
  }
  submit=(e)=>{
    e.preventDefault();
    let t=this;

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
            message.warn("请填写企业正文！")
        }else{ 
        let iObj = {
            companyName:values.companyName,
            typeId:values.companyType,
            content:content,
            url:t.state.CompanyUrl,
        }
        if(t.props.type&&t.props.type==="edit"){
          iObj["companyId"] = t.props.companyId
        }
        t.props.submitInfo(iObj);
       }
      }
    });
  }
  cancel=()=>{
    this.props.cancel();
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
  submitType=(name)=>{
    let t=this;
    t.setState({loading:true})
    let params = {url:API.API_COMPANY_TYPE_ADD,data:{typeNames:[name]}};
    post(params).then(function(res){
        if(res&&res.code===10000){
            message.success("操作成功！");
            t.setState({addVisible:false,eidtName:""});
            t.props.loadTypeList();
        }else{
            message.warning(res.message||"服务出错，请联系管理员")
        }
    }).catch=(err)=>{
        t.setState({loading:false,editType:""})
        console.log("==error==",err)
    }
  }
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  render() {
    var t = this;
    const { getFieldDecorator } = t.props.form;
    let companyName=t.props.company||"",typeId=t.props.typeId||"",
        content=t.props.content||"";
    const {typeList} = t.props;

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
    
    return (
      <div style={{background:"#fff"}} className={styles.editPanel}>
        <Form>
          <FormItem {...formItemLayout} hasFeedback label="企业名称">
            {getFieldDecorator("companyName", {
              rules: [
                {required: true,message: "企业名称不能为空"},
                {validator:this.checkText}
              ],
              initialValue:companyName
            })(<Input placeholder="请输入企业名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="企业类型">
            {getFieldDecorator("companyType", {
              rules: [
                { required: true,message: "企业类型不能为空" }
              ],
              initialValue:typeId
            })(
                <Select placeholder="请选择企业类型" style={{width:"60%"}}>
                    {typeList.map((item,index)=><Option key={item.id} value={item.id}>{item.name}</Option>)}
                </Select>
            )}
            <a className={`"ant-form-text" ${styles.formText}`} onClick={this.addNewtype} > <Icon type="plus-circle-o" /> 新增企业类型</a>
          </FormItem>
          <FormItem {...formItemLayout} label="正文">
            {getFieldDecorator("content", {
              rules: [
                {required: true,message: "正文内容不能为空"}
              ],
              initialValue:this.state.editorContent
            })(
                <Editor
                editorState={this.state.editorState}
                wrapperClassName={styles.editorWrap}
                editorClassName={styles.editorCont}
                // blockRendererFn={myBlockRenderer}
                onEditorStateChange={this.onEditorStateChange}
                // onContentStateChange={this.onEditorChange}
                placeholder="请填写企业正文内容"
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
            label="企业Logo"
            extra={<div>Logo 要求：png 或 jpg格式 / 536 x 200 (px) / 1M 以下</div>}
          >
            <div className={styles.dropbox}>
                {getFieldDecorator('avator', {
                    rules: [
                        { required: true,message: "请上传Logo" },
                    ],
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
                    >
                        {this.state.avatar ?null : uploadButton}
                    </Upload>
                )}
            </div>
            </FormItem>
            <FormItem wrapperCol={{ span: 12, offset: 5 }} >
                <Button type="primary" onClick={this.submit} className={styles.personBtn} loading={this.state.loading}>提交</Button>
                <Button type="default" onClick={this.cancel} className={styles.personBtn}>取消</Button>
            </FormItem>
        </Form>
        {this.state.addVisible?<AddPanel title="新增企业类型" onCancel={this.cancelAdd} onSubmit={this.submitType} />:null}
        <Modal title="图片预览" visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="pic" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </div>
    );
  }
}
EditCompany.propTypes = {
  // username: PropTypes.string.isRequired,
  // usertitle: PropTypes.string.isRequired,
//   companyName:PropTypes.string.isRequired
};
export default Form.create()(EditCompany);
