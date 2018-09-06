import React, {PropTypes, Component} from 'react';
import './connect.css';
import {Tooltip} from 'antd';
import InlineEditor from '@/modules/common/editor/inlineEditor';
import ClassicEditor from '@/modules/common/editor/normalEditor';
import ImageMonitor from '@/modules/common/image/imgMonitor';
// import QuillEidtor from '@/modules/common/editor/normalEditor';
// import Editor from '@/tools/ckeditor';
export default class ConnectInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgVisible:false,
            curPicId:0,
            curPicName:''
        };
    }
    getTitle=(data)=>{
        const {changeInforTitle} = this.props.actions;
        changeInforTitle(data);
    }
    getContent=(data)=>{
        console.log("==block data==",data);
    }
    getData=(type,tag,data)=>{
        const {changeConnectInfor}=this.props.actions;
        changeConnectInfor(type,tag,data);
    }
    onEditpic=(id,name)=>{
        this.setState({visible:true,curPicId:id,curPicName:name});
    }
    cancelImg=()=>{
        this.setState({visible:false});
    }
    submitImg=(id)=>{
        const {curPicName} = this.state;
        const {changePic}=this.props.actions;
        changePic(id,curPicName);
        this.setState({curPicId:id,visible:false})
    }
    render(){
        const {visible,curPicId} = this.state;
        const {infor,actions,imgs}=this.props;
        const {changeConnectInfor}=actions;
        
        let editorConfig = {
            text:infor.title,
            id:'connectTitle'
        }
        let inforCont = [];
        for(var item in infor){
            if(item!=="title"){
                let url = '';
                imgs.filter((pitem,index)=>{
                    if(pitem.id==infor[item]['icon']){
                        console.log(infor[item]['icon']);
                        url=pitem.url;
                        return false;
                    }
                });
                inforCont.push(<div class="col-lg-4 col-md-4 infor-box" key={item}>
                    <div class="d-flex no-block pt-md-3 pb-md-3">
                        <div class="display-4 mr-md-3 mt-mb-2 hoverable inforIconBox" style={{background:`url(${url}) center`}}>
                            <i class="editCoin" onClick={this.onEditpic.bind(this,infor[item]['icon'],item)}></i>                            
                        </div>
                        <div class="pt-md-2">
                            <h2 class="m-b-0 infor-title"><InlineEditor config={{text:infor[item]['name'],id:`${item}Name`}} getValue={this.getData.bind(this,item,"name")}/></h2>
                            <h6 class="subtitle"><InlineEditor config={{text:infor[item]['value'],id:`${item}Value`}} getValue={this.getData.bind(this,item,"value")}/></h6>
                        </div>
                    </div>
                </div>);
            }
            
        }
        return (
            <div class="col-lg-12 connect-infor ptr5">
                <div class="container p-20">
                    {/* <h3 id="sampleTitle" style={infor.title["styles"]} class={!isEdit?"editable":""} onClick={this.onEdit}>{infor.title["text"]}</h3> */}
                    <h3><InlineEditor config={editorConfig} getValue={this.getTitle} /></h3>
                    {/* <ClassicEditor config={{id:'cEditor',value:'富文本编辑器'}} getValue={this.getContent} /> */}
                    <div class="row">
                        {inforCont}
                    </div>
                </div>
                <ImageMonitor visible={visible} cancelImg={this.cancelImg} id={curPicId} submitImg={this.submitImg}/>
            </div>
        )
    }
}