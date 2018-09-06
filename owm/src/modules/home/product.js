import React from "react";
import "./home.css";
import ImageMonitor from '@/modules/common/image/imgMonitor';
import InlineEditor from '@/modules/common/editor/inlineEditor';
class Product extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
          curObj:props.infor,
          picVisible:false,
          curPicId:null,
          curIndex:0
      };
  }
  componentWillReceiveProps(props){
    this.setState({curObj:props.infor});
  }
  getData=(name,key,data)=>{
    let iObj = JSON.parse(JSON.stringify(this.state.curObj)),
        curMsg = iObj['messageInfor'];
    curMsg[name][key] =data;
    this.props.changeProduct('messageInfor',curMsg);
  }
  getList=(index,tag,data)=>{
    let iObj = JSON.parse(JSON.stringify(this.state.curObj)),
        curList = iObj['list'];
    curList[index][tag] =data;
    this.props.changeProduct('list',curList);
  }
  getName=(name,data)=>{
    this.props.changeProduct(name,data);
  }
  onEditpic=(id,index)=>this.setState({picVisible:true,curPicId:id,curIndex:index})
  cancelImg=()=>this.setState({picVisible:false})
  submitImg=(id)=>{
    this.getList(this.state.curIndex,'picId',id);
    this.setState({picVisible:false});
  }
  render(){
    const {curObj,picVisible,curPicId} = this.state;
    const {imgs} = this.props;
    let t=this,numberCont=[];
    if(curObj&&curObj.messageInfor){
      for(var item in curObj.messageInfor){
        numberCont.push(<div class="col-lg-3 counter col-md-6" key={item}>
            <h3><InlineEditor config={{text:curObj.messageInfor[item]['number'],id:`home${item}Number`}} getValue={this.getData.bind(this,item,"number")}/></h3>
            <span><InlineEditor config={{text:curObj.messageInfor[item]['name'],id:`home${item}Name`}} getValue={this.getData.bind(this,item,"name")}/></span>
        </div>)
      }
    }
    return <div>
      <div class="spacer product pbr6">
        <div class="container">
          <div class="row justify-content-center mb-5">
            <div class="col-md-7 text-center">
              <h2 class="title"><InlineEditor config={{text:curObj.title,id:`homeProductTitle`}} getValue={this.getName.bind(this,"title")}/></h2>
            </div>
          </div>
          <div class="row m-t-40">
            {curObj&&curObj.list.length&&curObj.list.map((item,index)=>{
              let curUrl = "",animateType="flip-left";
              imgs.filter((cItem,index)=>{
                  if(cItem.id===item.picId){
                      curUrl = cItem.url;
                  }
              })
              if(!index){
                animateType = index===1?"flip-up":"flip-right";
              }              
              return <div class="col-md-4 wrap-product-box" key={index}>
                <div class="" data-aos={animateType} data-aos-duration="1200">
                  <div class="imgbox mb-2 hoverable">
                    <i class="editCoin" onClick={t.onEditpic.bind(t,item.picId,index)}></i> 
                    <img class="rounded img-responsive" src={curUrl} alt="wrappixel kit" />
                  </div>
                  <div class="m-t-30">
                    <h5 class="font-medium"><InlineEditor config={{text:item.name,id:`homePic${index}Name`}} getValue={this.getList.bind(this,index,"name")}/></h5>
                  </div>
                </div>
              </div>
            })}
          </div>
        </div>
      </div>
      <div class="product-data-box">
        <div class="container">
            <div class="row m-t-30 p-t-30 client-box">
               {numberCont}
            </div>
        </div>
      </div>
      <ImageMonitor visible={picVisible} cancelImg={this.cancelImg} id={curPicId} submitImg={this.submitImg}/>
    </div>
  }
}
export default Product;
