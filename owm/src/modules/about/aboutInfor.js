import React,{Component} from "react";
import './about.css';
import ImageMonitor from '@/modules/common/image/imgMonitor';
import InlineEditor from '@/modules/common/editor/inlineEditor';
export default class Infor extends Component{
  constructor(props) {
    super(props);
    this.state = {
        visible:false,
        curPicId:0,
        curPicName:''
    };
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
    this.setState({
      visible:false
    })
  }
  getData=(type,tag,data)=>{
    const {changeAboutInfor}=this.props.actions;
    changeAboutInfor(type,tag,data);
  }
  render(){
    const {visible,curPicId}=this.state;
    const {actions,imgs,infor}=this.props;
    console.log(imgs);
    let url='';
    imgs.filter((pitem,index)=>{
      if(pitem.id==infor.proContentImgID){
        url=pitem.url;
      }
    });
    let inforCont = [];
    for(var item in infor){
      let url = '';
      imgs.filter((pitem,index)=>{
          if(pitem.id==infor[item]['proContentImgID']){
              url=pitem.url;
              return false;
          }
      });
      inforCont.push(
          <div class="row featurette aboutInfor" key={item}>
            <div class="col-md-5 hoverable">
              <img class="featurette-image img-fluid mx-auto" src={url} alt="Generic placeholder image" />
              <i class="editCoin" onClick={this.onEditpic.bind(this,infor[item]['proContentImgID'],item)}></i> 
            </div>
            <div class="col-md-7">
              <h2 class="featurette-heading title">
              <InlineEditor config={{text:infor[item]['introduce'],id:`${item}Introduce`}} getValue={this.getData.bind(this,item,"introduce")}/></h2>
              <div class="lead">
              <InlineEditor config={{text:infor[item]['proContent'],id:`${item}ProContent`}} getValue={this.getData.bind(this,item,"proContent")}/></div>
            </div>
          </div>
      );
      
    }

    return (
      <div class="container">
      {inforCont}
        <ImageMonitor visible={visible} cancelImg={this.cancelImg} id={curPicId} submitImg={this.submitImg}/>
      </div>
    );
  }
}
