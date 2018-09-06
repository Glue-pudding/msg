import { Input,Modal,Button,Form} from 'antd';
import React, { Component } from "react";
const FormItem = Form.Item;
class AddPanel extends Component{
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {
            typeName:this.props.name||""
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
    onSubmit=()=>{
        let submitInfo = this.props.onSubmit,state=this.state;
        this.props.form.validateFields((err, values) => {
            if (err) {
              console.log('请确认表单信息: ', values);
              return false;
            }else{
                submitInfo&&submitInfo(state.typeName);
            }
        })
    }
    onChange=(e)=>{
        let val = e.target.value;
        this.props.form.setFieldsValue({"typename":val})
        this.setState({typeName:val});
    }
    render(){
        let t=this,title = this.props.title;
        const { getFieldDecorator } = this.props.form;
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
        return <Modal title={title} footer={<div>
            <Button onClick={this.props.onCancel}>取消</Button>
            <Button onClick={this.onSubmit} type="primary">提交</Button>
        </div>} visible={true} onCancel={this.props.onCancel} >
            <Form>
                <FormItem {...formItemLayout} hasFeedback label="类型名称">
                    {getFieldDecorator("typename", {
                    rules: [
                        {required: true,message: "类型名称不能为空"},
                        {validator:this.checkText}
                    ],
                    initialValue:t.state.typeName
                    })(<Input placeholder="请输入新增企业类型名称(20字以内)" onChange={this.onChange} maxLength="20"/>)}
                </FormItem>
            </Form>
        </Modal>
    }
}
export default Form.create()(AddPanel)