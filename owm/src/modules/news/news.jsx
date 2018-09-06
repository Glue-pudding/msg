import React from "react";
import TopBG from "../common/topBG";
import {connect } from "react-redux";
import { bindActionCreators } from 'redux';
import NewsAction from './newsAction';
import NewsList from "./newsList";
import NewsDetail from "./newsDetail";
import {Modal,Table,Switch} from 'antd';
class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isList:true ,modalObj:props.commonState.newsBox};
  }
  componentWillReceiveProps(props){
    this.setState({modalObj:props.commonState.newsBox});
  }
  render() {
    const {newsState,actions,commonState}=this.props;
    const {top} = newsState;
    const {imgList} = commonState;
    const {modalObj} = this.state;
    return (
      <div>
        {modalObj.banner.visible?<TopBG text={top.title||"新闻资讯"} imgID={top.picId} imgs={imgList||[]} setBGTitle={actions.setBGTitle} setBGImg={actions.setBGImg}/>:null}
        {this.state.isList?modalObj.list.visible?<NewsList />:null:<NewsDetail/>}
      </div>
    );
  }
}

// export default News;

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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(News);
