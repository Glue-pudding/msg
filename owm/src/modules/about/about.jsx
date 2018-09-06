import React from "react";
import {connect } from "react-redux";
import { bindActionCreators } from 'redux';

import TopBG from '../common/topBG';
import Infor from './aboutInfor';
import Service from './service';
import Team from './team';
import commonAction from '../common/commonAction';
import aboutAction from './aboutAction';
class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalObj:props.commonState.aboutBox
    };
  }
  componentWillReceiveProps(props){
    this.setState({modalObj:props.commonState.aboutBox});
  }
  render() {
    const {aboutState,commonState,actions} = this.props;
    const {modalObj} = this.state;
    const {topObj} = aboutState;
    return (
      <div>
        {modalObj.banner.visible?<TopBG text={topObj.title||"关于我们"} imgID={topObj.picId} imgs={commonState.imgList} setBGTitle={actions.setBGTitle} setBGImg={actions.setBGImg}/>:null}
        {modalObj.infor.visible?<Infor infor={aboutState.infor} imgs={commonState.imgList} actions={actions}/>:null}
        {modalObj.service.visible?<Service imgs={commonState.imgList} service={aboutState.service}  actions={actions}/>:null}
        {modalObj.team.visible?<Team imgs={commonState.imgList} team={aboutState.professionTeam} actions={actions} />:null}
      </div>
    );
  }
}
const mapStateToProps=function(state) {
  return {
    aboutState:state.aboutState,
    commonState:state.commonState
  }
}

const mapDispatchToProps=(dispatch)=> {
  return {
    actions:bindActionCreators(aboutAction, dispatch)
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(About);
