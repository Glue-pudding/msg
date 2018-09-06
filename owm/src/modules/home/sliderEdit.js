import React from "react";
import './home.css';
import {Form,Input,Upload,Icon,Button} from 'antd';

import ImageMonitor from '@/modules/common/image/imgMonitor';
const FormItem = Form.Item;
class EditSlider extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            curObj:props.sliderObj,
            picVisible:false
        };
    }
    compoenntWillReceivePorps(props){
        this.setState({curObj:props.sliderObj})
    }
    onEditpic=()=>{this.setState({picVisible:true});}
    cancelImg=()=>{this.setState({picVisible:false});}
    submitImg=(id)=>{
        let iObj = JSON.parse(JSON.stringify(this.state.curObj));
        const {imgs} = this.props;
        let curUrl = '';
        imgs.filter((cItem)=>{if(cItem.id===id){curUrl=cItem.url;}});
        iObj['imageId'] = id;
        iObj['url'] = curUrl||"";
        this.setState({curObj:iObj,picVisible:false})
        this.props.form.setFieldsValue({'pic':id});
    }
    saveEdit=(e)=>{
        const {saveSlider} = this.props;
        let sliderObj = JSON.parse(JSON.stringify(this.state.curObj));
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(err){
                console.log('表单出错!');
            }else{
                sliderObj['href'] = values['href'];
                saveSlider(sliderObj);
            }
        });
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const {cancelEdit,loading} = this.props;
        const {curObj,picVisible} =this.state;


        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
          },
        };
        const tailFormItemLayout = {
            wrapperCol: {
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: 16,
                offset: 8,
              },
            },
          };
        return <div>
            <Form>
                <FormItem
                    {...formItemLayout}
                    label="Banner 链接"
                >
                    {getFieldDecorator('href', {
                        rules: [{type: 'url', message: '请输入有效的链接地址!'}],
                        initialValue:curObj&&curObj.href
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                        label="Banner 图片"
                        extra="建议尺寸：2880 x 1120 像素"
                    >
                    {getFieldDecorator('pic', {
                        rules: [{required: true, message: '请选择图片!'}],
                        initialValue:curObj&&curObj.imageId
                    })(
                        curObj&&curObj.imageId?<div className='bannerDetailBox hoverable'>
                            <i class="editCoin" onClick={this.onEditpic}></i> 
                            <img src={curObj.url} alt='banner 图'/>
                        </div>:<div className='bannerDetailBox' onClick={this.onEditpic} style={{cursor:'pointer'}}><Icon type="plus" /></div>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button key="back" onClick={cancelEdit} className="mr-md-4">返回</Button>
                    <Button key="submit" type="primary" onClick={this.saveEdit} loading={loading}>保存</Button>
                </FormItem>
            </Form>
            <ImageMonitor visible={picVisible} cancelImg={this.cancelImg} id={curObj&&curObj.imageId} submitImg={this.submitImg}/>
        </div>
    }
}

export default Form.create()(EditSlider);