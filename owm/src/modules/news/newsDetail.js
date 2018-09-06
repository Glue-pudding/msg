import React from "react";
import './news.css';
import comStyle from './comm.less';
import {Link } from 'react-router-dom';
import {Input,Form,DatePicker,Icon} from 'antd';
import TopBG from "../common/topBG";
// import CKEditor from '../common/ckEditor';
// import { connect } from "tls";
import {connect } from "react-redux";
import { bindActionCreators } from 'redux'
import NewsAction from './newsAction';
const TextArea = Input.TextArea;
const FormItem = Form.Item;

const { MonthPicker, RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';
class newsDetail extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
      };
  }
  componentDidMount(){
    var newsId=this.props.match.params.id;
    console.log(newsId);
    const {getNewsDetail}=this.props.actions;
    getNewsDetail(newsId);
  }
  componentWillReceiveProps(){
      // this.setState({activeKey:window.location.pathname})
  }

  
  render(){
    
      const t = this;
      const {newsState,actions,commonState}=this.props;
      const {NewsDetail,top}=newsState;
      const {imgList} = commonState;
      console.log(newsState);
      
      return (
        <div >
          <TopBG text={top.title||"新闻资讯"} imgID={top.picId} imgs={imgList||[]} setBGTitle={actions.setBGTitle} setBGImg={actions.setBGImg}/>
          <div class="container" style={{overflow:'hidden'}}>
            <h2 className={comStyle.detailTitle}>{NewsDetail.newsTitle}</h2>
            <p className={comStyle.time}><Icon type="clock-circle-o" className={comStyle.icontime}/>{NewsDetail.newsTime}</p>
            <p className={comStyle.neiContent}>{NewsDetail.newsContent}</p>
          </div>
        </div>
      );
  }
}
const mapStateToProps=function(state) {
  return {
      newsState: state.newsState,
      commonState:state.commonState
  }
}

const mapDispatchToProps=(dispatch)=> {
  return {
      actions:bindActionCreators(NewsAction, dispatch)
  }
}

newsDetail = Form.create()(newsDetail);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(newsDetail);