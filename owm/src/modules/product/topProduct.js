import React ,{Component} from "react";
import "./product.css";
import InlineEditor from '@/modules/common/editor/inlineEditor';
import ImageMonitor from '@/modules/common/image/imgMonitor';
export default class TopProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
        imgVisible:false,
        visible:false,
        curPicId:0,
        curPicName:''
    };
  }
  getTitle=(data)=>{
    const {changeInforTitle} = this.props.actions;
    changeInforTitle(data);
  }
  getData=(type,tag,data)=>{
    const {changeProductInfor}=this.props.actions;
    changeProductInfor(type,tag,data);
  }
  cancelImg=()=>{
    this.setState({visible:false,productModalVisible:true});
  }
  submitImg=(id,url)=>{
    const {curPicName} = this.state;
    const {changePic}=this.props.actions;
    changePic(id,curPicName);
    this.setState({curPicId:id,visible:false})
  }
  Classic=(id,name)=>{
    console.log(id);
    this.setState({
      visible:true,
      curPicId:id,
      curPicName:name
    });
  }
  render(){
    const {infor,actions,imgs}=this.props;
    const {curPicId} = this.state;
    let t=this;
    let editorConfig = {
      text:infor.title,
      id:'productTitle'
    }
    let inforCont = [];
        for(var item in infor){
          console.log(item.productPic);
            if(item!=="title"){
              let url = '';
                imgs.filter((pitem,index)=>{
                    if(pitem.id==infor[item]['productPicId']){
                        url=pitem.url;
                        return false;
                    }
                });
                inforCont.push(<div class="col-lg-6 wrap-product-box" key={item}>
                    <div class="card card_shadow" data-aos="fade-right" data-aos-duration="1200">
                        <ul class="img-inline">
                        <li class="half-width hoverable">
                        <i class="editCoin" onClick={this.Classic.bind(this,infor[item]['productPicId'],item)} ></i>
                          <img
                            src={url}
                            alt="wrapkit"
                            class="img-responsive rounded"
                          />
                        </li>
                        <li class="img-text half-width">
                          <h5 class="font-medium m-t-10">
                            <a href="javascript:void(0)" class="linking">
                            <InlineEditor config={{text:infor[item]['title'],id:`${item}title`}} getValue={this.getData.bind(this,item,"title")}/>
                            </a>
                          </h5>
                          <div class="m-t-20">
                          <InlineEditor config={{text:infor[item]['constants'],id:`${item}constants`}} getValue={this.getData.bind(this,item,"constants")}/>
                          </div>
                        </li>
                        </ul>
                    </div>
                </div>);
            }
            
        }
    return (
      <div class="topProduct ptr5">
        <div class="container">
          <div class="row justify-content-center mb-4">
            <div class="col-md-7 text-center">
              <h2 class="title"><InlineEditor config={editorConfig} getValue={this.getTitle} /></h2>
            </div>
          </div>
          <div class="row m-t-40">
            {inforCont}
          </div>
          <ImageMonitor visible={this.state.visible} cancelImg={this.cancelImg} id={curPicId} submitImg={this.submitImg}/>
        </div>
      </div>
    );
  }
}
