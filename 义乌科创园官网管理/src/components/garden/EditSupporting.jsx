/**
 * Created by xutao on 2018/4/22.
 */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {Upload,Modal,Select,message,Form,Icon,Input,Button} from "antd";
import PropTypes from "prop-types";
import API from "@/mock";
import { get, post } from "../../axios/tools";
import styles from "./Banner.module.less";

const FormItem = Form.Item;
class EditSupporting extends Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.state = {
        loading: false,
        previewVisible:false,previewImage:"",
        url:this.props.url,
        id:this.props.id,
        avatar:this.props.url?[{
          uid: -1,
          name: 'logo',
          status: 'done',
          url: this.props.url,
        }]:null
    };
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
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
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
    if (status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (status === 'removed'||status==='error') {
      this.setState({ avatar: "",loading:false });
      return;
    }
    if (status === 'done') {
      let url = info.file.response&&info.file.response.data;
      let iObj = [{
        uid: -1,
        name: 'logo',
        status: 'done',
        url: url,
      }]
      this.setState({avatar:iObj,loading:false})
    }
  }
  submit=(e)=>{
    e.preventDefault();
    let t=this;

    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log('请确认表单信息: ', values);
        return false;
      }else{
        if(values.avator[0].response === undefined ){
          let iObj = {
            title:values.username,
            url:values.avator,
          }
          if(t.props.type&&t.props.type==="edit"){
            iObj["equementId"] = t.props.id
          }
          t.props.submitInfo(iObj);
        }else{
        let iObj = {
          title:values.username,
          url:values.avator[0].response.data,
        }
        if(t.props.type&&t.props.type==="edit"){
          iObj["equementId"] = t.props.id
        }
        t.props.submitInfo(iObj);
       }
      }
    });
  }
  cancel=()=>{
    this.props.cancel();
  }
  render() {
    var t = this;
    const { getFieldDecorator } = this.props.form;
    let username=this.props.title||"",
        id = this.props.id||"",
        url=this.props.url||"";
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
          <FormItem {...formItemLayout} hasFeedback label="图像标题">
            {getFieldDecorator("username", {
              rules: [
                {required: true,message: "图像标题不能为空"},
                {validator:this.checkText}
              ],
              initialValue:username
            })(<Input placeholder="请输入图像标题" />)}
          </FormItem>
         <FormItem
            {...formItemLayout}
            label="轮播图像"
            extra={<div>轮播图像 要求：png 或 jpg格式 / 320 x 240 (px) / 1M 以下</div>}
          >
            <div className={styles.dropbox}>
                {getFieldDecorator('avator', {
                    rules: [
                        { required: true,message: "请上传轮播图像" },
                    ],
                    // valuePropName: 'fileList',
                    getValueFromEvent: this.normFile,
                    initialValue:url
                })(
                    <Upload
                        name="file"
                        listType="picture-card"
                        className="avatar-uploader"
                        action={API.API_FILE_UPLOAD}
                        beforeUpload={this.beforeUpload}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                        defaultFileList={this.state.avatar}
                    >
                        {this.state.avatar ? null : uploadButton}
                    </Upload>
                )}
            </div>
            </FormItem>
            <FormItem wrapperCol={{ span: 12, offset: 5 }} >
                <Button type="primary" onClick={this.submit.bind(this)} className={styles.personBtn}>提交</Button>
                <Button type="default" onClick={this.cancel} className={styles.personBtn}>取消</Button>
            </FormItem>
        </Form>
        <Modal title="图片预览" visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="pic" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </div>
    );
  }
}
EditSupporting.propTypes = {
  
};
export default Form.create()(EditSupporting);
