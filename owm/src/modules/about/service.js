import React,{Component} from "react";
import InlineEditor from '@/modules/common/editor/inlineEditor';
import ImageMonitor from '@/modules/common/image/imgMonitor';
import "./about.css";
export default class Service extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            curPicId:0,
            curPicName:''
        };
    }
    getData=(type,tag,data)=>{
        console.log(type,tag,data);
        const {changeAboutService}=this.props.actions;
        changeAboutService(type,tag,data);
    }
    onEditpic=(id,name)=>{
        this.setState({visible:true,curPicId:id,curPicName:name});
    }
    cancelImg=()=>{
        this.setState({visible:false});
    }
    submitImg=(id)=>{
        const {curPicName} = this.state;
        const {changePicService}=this.props.actions;
        changePicService(id,curPicName);
        this.setState({
          visible:false
        })
    }
    getTitle=(data)=>{
        const {changeServiceTitle} = this.props.actions;
        changeServiceTitle(data);
    }
    getContent=(data)=>{
        const {changeServiceContent} =this.props.actions;
        changeServiceContent(data);
    }
    render(){
        const {visible,curPicId}=this.state;
        const {actions,imgs,service}=this.props;
        console.log(service);
        let editorConfig = {
            text:service.serviceTitle,
            id:'serviceTitle'
        };
        let serviceContent = {
            text:service.serviceContent,
            id:'serviceContent'
        }
        let inforCont = [];
        for(var item in service){
            if(item!=="serviceTitle"&&item!=="serviceContent"){
                let url = '';
                imgs.filter((pitem,index)=>{
                    if(pitem.id==service[item]['fieldPicId']){
                        url=pitem.url;
                        return false;
                    }
                });
                inforCont.push(<div class="col-lg-4 col-md-4 wrap-feature3-box" key={item}>
                    <div class="card card_shadow" data-aos="fade-right" data-aos-duration="1200">
                        <div class="card-body text-center">
                           <div class="text-center hoverable title">
                             <img src={url} style={{width:'3em',height:'3em'}} />
                             <i class="editCoin" onClick={this.onEditpic.bind(this,service[item]['fieldPicId'],item)}></i>
                           </div>
                            <h5 class="service-title">
                             <InlineEditor config={{text:service[item]['fieldTitle'],id:`${item}FieldTitle`}} getValue={this.getData.bind(this,item,"fieldTitle")}/>
                           </h5>
                           <div class="m-t-20"><InlineEditor config={{text:service[item]['fieldValut'],id:`${item}FieldValut`}} getValue={this.getData.bind(this,item,"fieldValut")}/></div>                     
                        </div>
                    </div>
                    
                </div>);
            }
            
        }

        return (
            <div className="bg-light serviceBox pbr6">
                <div class="spacer">
                    <div class="container">
                        <div class="row justify-content-center mb-5">
                            <div class="col-md-7 text-center">
                                <h2 class="title"><InlineEditor config={editorConfig} getValue={this.getTitle} /></h2>
                                <h6 class="subtitle"><InlineEditor config={serviceContent} getValue={this.getContent} /></h6>
                            </div>
                        </div>
                        <div class="row">
                            {inforCont}
                        </div>
                    </div>
                    <ImageMonitor visible={visible} cancelImg={this.cancelImg} id={curPicId} submitImg={this.submitImg}/>
                </div>
            </div>        
        )
    }
}