import React from "react";
import './home.css';
import ImageMonitor from '@/modules/common/image/imgMonitor';
import InlineEditor from '@/modules/common/editor/inlineEditor';
class Infor extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
        curObj:props.infor,
        picVisible:false
    };
  }
  onEditpic=()=>{
    this.setState({picVisible:true});
  }
  getData=(tag,data)=>{
    this.props.changeInfor(tag,data);
  }
  submitImg=(id)=>{
    this.props.changeInfor('picId',id);
    this.setState({picVisible:false});
  }
  componentWillReceiveProps(props){
    this.setState({curObj:props.infor});
  }
  render(){
    const {curObj,picVisible} = this.state;
    const {imgs} = this.props;
    let curUrl = "";
    imgs.filter((item,index)=>{
      if(item.id===curObj.picId){
        curUrl = item.url;
      }
    })
    return (
      <div class="container">
        <div class="row featurette">
          <div class="col-md-7">
            <h2 class="featurette-heading"><InlineEditor config={{text:curObj.title,id:`inforTitleBox`}} getValue={this.getData.bind(this,"title")}/></h2>
            <div class="lead"><InlineEditor config={{text:curObj.content,id:`inforContentBox`}} getValue={this.getData.bind(this,"content")}/></div>
          </div>
          <div class="col-md-5 hoverable">
            <i class="editCoin" onClick={this.onEditpic}></i> 
            <img class="featurette-image img-fluid mx-auto" src={curUrl} alt="Generic placeholder image" />
          </div>
        </div>
        
        <ImageMonitor visible={picVisible} cancelImg={this.cancelImg} id={curObj.picId} submitImg={this.submitImg}/>
      </div>
    ); 
  }
}
export default Infor;
