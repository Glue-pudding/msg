import React from "react";
import {connect } from "react-redux";
import { bindActionCreators } from 'redux';
import SlideCont from '@/modules/home/slider';
import InforCont from '@/modules/home/infor';
import AdvanceCont from '@/modules/home/advance';
import ProductCont from '@/modules/home/product';
import NewsCont from '@/modules/home/news';

import homeAction from './homeAction';
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalObj:props.commonState.homeBox
    };
  }
  componentDidMount(){    
    this.props.actions.loadBanner();
  }
  componentWillReceiveProps(props){
    this.setState({modalObj:props.commonState.homeBox});
  }
  render(){
    const {actions,commonState,homeState}=this.props;
    const {modalObj} = this.state;
    const {imgList} = commonState;
    const {sliderList,infor,advance,product,news} = homeState;
    return (
      <div>
        {modalObj.slider.visible?<SlideCont list={sliderList} imgs={imgList} />:null}
        {modalObj.infor.visible?<InforCont infor={infor} changeInfor={actions.changeInforAction} imgs={imgList} />:null}
        {modalObj.advance.visible?<AdvanceCont infor={advance} imgs={imgList} changeAdvance={actions.changeAdvanceAction} />:null}
        {modalObj.product.visible?<ProductCont infor={product} imgs={imgList} changeProduct={actions.changeProductAction} />:null}
        {modalObj.news.visible?<NewsCont infor={news} loadNews={actions.loadNews} />:null}
      </div>
    );
  }
}
const mapStateToProps=function(state) {
  return {
    commonState:state.commonState,
    homeState:state.homeState
  }
}

const mapDispatchToProps=(dispatch)=> {
  return {
    actions:bindActionCreators(homeAction, dispatch)
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
