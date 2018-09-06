import React from "react";
import TopBG from '../common/topBG';
import TopProduct from './topProduct';
import {connect } from "react-redux";
import { bindActionCreators } from 'redux';
import productAction from './productAction';
import ProductList from './productList'
import {DatePicker} from 'antd';
class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalObj:props.commonState.productBox
    };
  }
  componentDidMount(){
    const {loadProductList}=this.props.actions;
    loadProductList();
    
  }

  componentWillReceiveProps(props){
    this.setState({modalObj:props.commonState.productBox});
  }
  render() {
    const {productState,actions,commonState}=this.props;
    const {productList,top,productTitle}=productState;
    const {imgList} = commonState;
    const {modalObj} = this.state;
    return (
      <div>
        {modalObj.banner.visible?<TopBG text={top.title||"服务案例"} imgID={top.picId} imgs={imgList} setBGTitle={actions.setBGTitle} setBGImg={actions.setBGImg}/>:null}
        {modalObj.classic.visible?<TopProduct infor={productState.infor} imgs={imgList||[]} actions={actions}/>:null}
        {modalObj.list.visible?<ProductList list={productList} actions={actions} imgs={imgList||[]} productTitle={productTitle} />:null}
      </div>
    );
  }
}
const mapStateToProps=function(state) {
  return {
    productState: state.productState,
    commonState:state.commonState
  }
}

const mapDispatchToProps=(dispatch)=> {
  return {
    actions:bindActionCreators(productAction, dispatch)
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Product);
