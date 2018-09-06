import React from "react";
import "./home.css";
import {connect } from "react-redux";
import { bindActionCreators } from 'redux';
import InlineEditor from '@/modules/common/editor/inlineEditor';
import NewsManager from  './newsManager';
import HomeAction from './homeAction';
class News extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
        curObj:props.infor,
        newsVisible:false
    };
  }
  componentDidMount(){
    this.props.loadNews();
  }
  componentWillReceiveProps(props){
    this.setState({curObj:props.infor});
  }
  getData=(tag,data)=>{
    this.props.changeInfor(tag,data);
  }
  editNews=()=>this.setState({newsVisible:true})
  cancelEdit=()=>this.setState({newsVisible:false})
  render(){
    const {curObj,newsVisible} = this.state;
    const {actions} = this.props;
    let curList =curObj.list||[];

    return <div class="spacer newsbox pbr6">
      <div class="container">
        <div class="row wrap-news-box ">
          <div class="col-md-8 align-self-center">
            <div class="max-500 m-auto">
              <h2 class="title font-bold text-center mb-5"><InlineEditor config={{text:curObj.title,id:`newsTitleBox`}} getValue={this.getData.bind(this,"title")}/></h2>
              <ul class="list-block with-underline font-medium mb-5 hoverable"  data-aos="slide-up" data-aos-duration="1200">
                <i class="editCoin" onClick={this.editNews}></i>
                {curList.map((item,index)=>{
                  return index<3?<li key={index}>
                    <span>{item.subject}</span>
                    <div class="ml-auto"><i class="fa fa-clock-o fa-lg fa-flip-horizontal "></i>{item.time}</div>
                  </li>:null
                })}
              </ul>
              <div class="col-md-12 text-center ">
                <a class="btn btn-info-gradiant newsbtn" data-toggle="collapse" href="./news"><span>全部新闻 </span></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {newsVisible?<NewsManager visible={newsVisible} infor={curObj} action={actions} cancelEdit={this.cancelEdit} handleEdit={this.handleEdit} />:null}
    </div>
  }
}

const mapDispatchToProps=(dispatch)=> {
  return {
    actions:bindActionCreators(HomeAction, dispatch)
  }
}
export default connect(
  null,
  mapDispatchToProps
)(News);
