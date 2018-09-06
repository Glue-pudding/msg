/**
 * authored on 2017/4/15.
 */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,Upload,
  DatePicker,
  TimePicker,
  Select,
  message,
  InputNumber,
  Table,
  Form,
  Modal,
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
import styles from "./Banner.module.less";

const FormItem = Form.Item;
const Option = Select.Option;
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
class EditPerson extends Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.state = {
        loading: false,
        avatar:this.props.avator?[{
          uid: -1,
          name: 'logo',
          status: 'done',
          url: this.props.avator,
        }]:null,
        previewVisible: false,
        previewImage: '',
        fileList: [
        ],
        url:this.props.url,
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
  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  // getBase64=(img,callback)=>{
  //   const reader = new FileReader();
  //   reader.addEventListener('load', () => callback(reader.result));
  //   reader.readAsDataURL(img);
  // }
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
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
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

        let iObj = {
          bannerId:this.props.id || "",
          title:values.title,
          subject:values.Sketch,
          url:this.state.url,
          type:1,
          href:values.typeurl,
        }
                
        // console.log(iObj);
        if(t.props.type&&t.props.type==="edit"){
          iObj["bannerId"] = t.props.id
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
    let title=this.props.title||"",
        subject=this.props.subject||"",
        url=this.props.avator||"",
        typeurl=this.props.href||"";
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
    // const uploadButton = (
    //     <div>
    //       <Icon type={this.state.loading ? 'loading' : 'plus-square'} />
    //     </div>
    //   );
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div style={{background:"#fff"}} className={styles.editPanel}>
        <Form>
          <FormItem {...formItemLayout} hasFeedback label="标题">
            {getFieldDecorator("title", {
              rules: [
                {required: true,message: "标题不能为空"},
                {validator:this.checkText}
              ],
              initialValue:title
            })(<Input placeholder="请输入标题" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="简述">
            {getFieldDecorator("Sketch", {
              rules: [
                { required: true,message: "简述不能为空" },
                {validator:this.checkText}
              ],
              initialValue:subject
            })(<Input placeholder="请输入简述" />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="banner"
            extra={<div>头像 要求：png 格式 / 320 x 240 (px) / 1M 以下</div>}
          >
            <div className={styles.dropbox}>
                {getFieldDecorator('avator', {
                    rules: [
                        { required: true,message: "请上传banner" },
                    ],
                    // valuePropName: 'fileList',
                    getValueFromEvent: this.normFile,
                    initialValue:this.state.avatar,
                })(
                    <Upload
                      name="file"
                      action={API.API_FILE_UPLOAD}
                      listType="picture-card"
                      //  fileList={fileList}
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}
                      style={{width:'100%'}}
                      defaultFileList={this.state.avatar}
                    >
                      {this.state.avatar ?null : uploadButton}
                    </Upload>
                )}
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
            </div>
            </FormItem>
            <FormItem {...formItemLayout} hasFeedback label="跳转地址">
            {getFieldDecorator("typeurl", {
              initialValue:typeurl
            })(<Input placeholder="请输入地址（选填）" />)}
          </FormItem>
            <FormItem wrapperCol={{ span: 12, offset: 6 }} >
                <Button type="primary" onClick={this.submit} loading={this.state.loading}>提交</Button>
                <Button type="default" onClick={this.cancel} >取消</Button>
            </FormItem>
        </Form>
        
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
