import React, { Component } from 'react';
import { render } from 'react-dom';
import { Pagination ,Table} from 'antd';


class Page extends Component{
  constructor(props){
    super(props);
    this.state={
      page:this.props.page||1,pageSize:this.props.pageSize||10
    };
  }
  onShowSizeChange(current, pageSize) {
    this.setState({page:current,pageSize:pageSize});
  }
  showTotal(total){
    return `共 ${total} 条`;
  }
  pageChange(page,pageSize){ 
    this.setState({page,pageSize});
  }

  render(){
    const {list,columns,loading,rowKey,total} = this.props;
    let t=this,state=t.state;
    let pageProps ={
      page:state.page,pageSize:state.pageSize,
      showSizeChanger:true,showQuickJumper:true,
      showTotal:this.showTotal,onChange:this.pageChange.bind(this),
      onShowSizeChange:this.onShowSizeChange.bind(this),total:list.length
    };
    return <Table loading={loading} pagination={pageProps} columns={columns} dataSource={list||[]} rowKey={rowKey} />;
  }
}

export default Page;