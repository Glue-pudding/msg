/**
 * 表格组件
 * @argument
    * list:列表数据
    * total:数据总条数
    * columns:列表标题数据
    * loading:loading状态
    * rowKey:表格唯一标示
 * @function
    * loadList:加载表格数据的方法
 * @author xutao 2018/05/17
 */
import { Input,Card,Table,Icon} from 'antd';
import React, { Component } from "react";
import PropTypes from "prop-types";
const {Meta} = Card;
class TableCompnent extends Component{
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {
            page:this.props.page||1,pageSize:this.props.pageSize||10
        };
    }
    showTotal=(total)=>{
        return `共 ${total} 条`;
    }
    pageChange=(page,pageSize)=>{ 
        const {loadList,typeId} = this.props;
        this.setState({page,pageSize})
        !typeId?loadList(page,pageSize):loadList(page,pageSize,typeId)
    }
    sizeChange=(current,size)=>{
        const {loadList,typeId} = this.props;
        this.setState({page:current,pageSize:size});
        !typeId?loadList(current,size):loadList(current,size,typeId)
    }
    render(){
        const {list,columns,loading,rowKey,total} = this.props;
        let t=this,state=t.state;
        let pageProps ={
            page:state.page,pageSize:state.pageSize,
            showSizeChanger:true,showQuickJumper:true,
            showTotal:this.showTotal,onChange:this.pageChange,
            onShowSizeChange:this.sizeChange,total:total||list.length
        }
        return <Table loading={loading} pagination={pageProps} columns={columns} dataSource={list||[]} rowKey={rowKey} />
    }
}
TableCompnent.propTypes = {
    rowKey:PropTypes.string.isRequired,
    columns:PropTypes.array.isRequired,
    list: PropTypes.array.isRequired
}
export default TableCompnent;