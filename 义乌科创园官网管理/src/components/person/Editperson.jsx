/**
 * Created by xutao on 2018/4/22.
 */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,Upload,
  Modal,
  TimePicker,
  Select,
  message,
  InputNumber,
  Table,
  Form,
  Icon,
  Input,
  Button,
  Checkbox
} from "antd";
import BreadcrumbCustom from "../BreadcrumbCustom";
import PropTypes from "prop-types";
import { fetchData, receiveData } from "@/action";
import API from "@/mock";
import { get, post } from "../../axios/tools";
import styles from "./person.module.less";
const { TextArea } = Input;

const FormItem = Form.Item;
const Option = Select.Option;
class EditPerson extends Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.state = {
        loading: false,
        previewVisible:false,previewImage:"",
        avatar:this.props.avator?[{
          uid: -1,
          name: 'logo',
          status: 'done',
          url: this.props.avator,
        }]:null,
        PersonUrl:this.props.avator,
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
      console.log(url);
      let iObj = [{
        uid: -1,
        name: 'logo',
        status: 'done',
        url: url,
      }]
      this.setState({avatar:iObj,loading:false,PersonUrl:url})
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
        let iObj = {
          talentsName:values.username,
          title:values.usertitle,
          companyName:values.company,
          url:t.state.PersonUrl
        }
        if(t.props.type&&t.props.type==="edit"){
          iObj["talentsId"] = t.props.id
        }
        t.props.submitInfo(iObj);
      }
    });
  }
  cancel=()=>{
    this.props.cancel();
  }
  render() {
    var t = this;
    const { getFieldDecorator } = this.props.form;
    let username=this.props.name||"",
        usertitle=this.props.title||"",
        company=this.props.company||"";
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
          <FormItem {...formItemLayout} hasFeedback label="人才姓名">
            {getFieldDecorator("username", {
              rules: [
                {required: true,message: "人才名称不能为空"},
                {validator:this.checkText}
              ],
              initialValue:username
            })(<Input placeholder="请输入人才姓名" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="人才头衔">
            {getFieldDecorator("usertitle", {
              rules: [
                { required: true,message: "人才头衔不能为空" },
                {validator:this.checkText}
              ],
              initialValue:usertitle
            })(<TextArea autosize={{ minRows: 5, maxRows: 5 }} placeholder="请输入人才头衔" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="所在公司">
            {getFieldDecorator("company", {
              rules: [
                {required: true,message: "公司名称不能为空"},
                {validator:this.checkText}
              ],
              initialValue:company
            })(<Input placeholder="请输入公司名称" />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="人才头像"
            extra={<div>头像 要求：png 或 jpg格式 / 320 x 240 (px) / 1M 以下</div>}
          >
            <div className={styles.dropbox}>
                {getFieldDecorator('avator', {
                    rules: [
                        { required: true,message: "请上传头像" },
                    ],
                    // valuePropName: 'fileList',
                    getValueFromEvent: this.normFile,
                    initialValue:this.state.avatar
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
                <Button type="primary" onClick={this.submit} className={styles.personBtn} loading={this.state.loading}>提交</Button>
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
EditPerson.propTypes = {
  // username: PropTypes.string.isRequired,
  // usertitle: PropTypes.string.isRequired,
  company:PropTypes.string.isRequired
};
export default Form.create()(EditPerson);
