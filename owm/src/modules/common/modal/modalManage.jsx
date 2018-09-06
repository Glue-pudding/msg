import React from "react";
import PropTypes from "prop-types";
import {connect } from "react-redux";
import { bindActionCreators } from 'redux';
import {Table,Modal,Switch} from 'antd';
import commonAction from '../commonAction';
class ModalManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curBlock:{},
      datas:[]
    };
  }
  getColumns=()=>{
      return [
          {title:"栏目",dataIndex:'name'},
          {title:"是否可见",dataIndex:'visible',render:(r,k,index)=><Switch defaultChecked={r} onChange={this.onSwitch.bind(this,k.key)} />}
      ];
  }
  onSwitch=(key,checked)=>{
    const {curBlock}=this.state;
    let tempObj = {...curBlock[key],visible:checked};
    let iObj = {...curBlock,[key]:tempObj};
    this.setState({curBlock:iObj});
  }
  componentDidMount(){
    const {commonState} = this.props;
    let curObj = commonState[commonState.selectedMenuKey+"Box"],iArr=[];
    for(var item in curObj){
      iArr.push({...curObj[item],key:item});
    }
    this.setState({datas:iArr,curBlock:curObj});
  }
  componentWillReceiveProps(props){
    const {commonState} = props;
    this.setState({curBlock:commonState[commonState.selectedMenuKey+"Box"]});
  }
  handleManage=()=>{
    const {submitManage} = this.props.actions;
    submitManage(this.state.curBlock);
    this.props.cancelManage();
  }
  render() {
    const {visible,cancelManage} = this.props;
    return (
      <Modal title="模块管理" width="568px" maskClosable={false} visible={visible} onCancel={cancelManage} onOk={this.handleManage.bind(this)}>
        <Table dataSource={this.state.datas} columns={this.getColumns()} pagination={false} />
      </Modal>      
    );
  }
}
const mapStateToProps=function(state) {
  return {
    commonState:state.commonState
  }
}

const mapDispatchToProps=(dispatch)=> {
  return {
    actions:bindActionCreators(commonAction, dispatch)
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(ModalManage);
