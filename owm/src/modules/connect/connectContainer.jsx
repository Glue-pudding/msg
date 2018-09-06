import React from "react";
import TopBG from '../common/topBG';
import Infor from './infor';
import Map from './map';
import {connect } from "react-redux";
import { bindActionCreators } from 'redux'
import ConnectAction from './connectAction';
import styles from './connect.css';
class Connect extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isList:true ,modalObj:props.commonState.connectBox};
  }
  componentWillReceiveProps(props){
    this.setState({modalObj:props.commonState.connectBox});
  }
  render() {
    const {connectState,actions,commonState}=this.props;
    const {topObj}=connectState;
    const {imgList} = commonState;
    const {modalObj} =this.state;
    return (
      <div>
        {modalObj.banner.visible?<TopBG text={topObj.title||"联系我们"} imgID={topObj.picId} imgs={imgList||[]} setBGTitle={actions.setBGTitle} setBGImg={actions.setBGImg}/>:null}
        {modalObj.infor.visible?<Infor infor={connectState.infor} actions={actions} imgs={imgList||[]}/>:null}
        {modalObj.map.visible?<Map map={connectState.map} styles={styles} changeMap={actions.changeMap}/>:null}
      </div>
    );
  }
}

const mapStateToProps=function(state) {
  return {
    connectState: state.connectState,
    commonState:state.commonState
  }
}

const mapDispatchToProps=(dispatch)=> {
  return {
    actions:bindActionCreators(ConnectAction, dispatch)
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Connect);
