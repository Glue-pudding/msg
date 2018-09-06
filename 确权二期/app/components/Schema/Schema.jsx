import React, { Component } from 'react';

import { Table, Icon, Divider ,message,Row,Col,Card, Select,Button, Input, Modal, Upload} from 'antd';
import TabComp from '../../common/modules/PageTable';

import residences2, { columns, dataList } from './const';
import API from '@api';
import styles from '../Supply/ConStyle.less';

const Search = Input.Search;

class Schema extends Component {
  constructor(props) {
    super(props);

    console.log('props.schData', props);
    const addKeyData = props.schData && props.schData.map((item, index) => {
      item.key = item.SchemaID;
      return item;
    });
    console.log(addKeyData);
    
    this.state = {
      // schemaTabList: props.schData || dataList ||[],
      schemaTabList: addKeyData || [],
      editKey: '', // 点击编辑，保存行key值
      isEditing: false,
      newAdding: false,
      editData: {
        typeVal: undefined
      },
      isAdding: false,
      DataSetName:props.DataSetName||'',
      DataSetID:props.DataSetID||'',
      SchemaFile:'',
      defaultFileList:[],
      WhetherEdit:0,
    };
    
    this.beforeEditCopyData = {}; // 点击编辑复制原本数据
    this.editing = false;  // 根据编辑状态 取消存入原来的数据
    this.firstEditKey = ''; // 编辑的哪条数据
  }

  // 属性名称搜索
  nameSwatch(val){
    // this.loadData(val);
    this.props.swatch(val);

  }

  isEditing(record) {
    return record.key === this.state.editingKey || 'a';
  }

  // // 原函数 可以删除
  // editChange=(id,name,e)=>{
  //   let iList = [...this.state.seniorList];
  //   iList.filter((item,index)=>{
  //     if(item.id===id||item.newID===id){
  //       item[name] = e.target.value;
  //     }
  //     return item;
  //   });
  //   this.setState({seniorList:iList});
  // }

  // 编辑属性名称 -- 保存
  oneEditChange(rowData,name,e) {
    const { schemaTabList } = this.state;

    schemaTabList.filter((item, index) => {
      // if(rowData.SchemaName==item.SchemaName){
      //   Modal.warning({title:'提示',content:'属性名称不能重复！'});
      //   return false;
      // }
      if(rowData.key === item.key) {
        if(name === 'SchemaName' || name === 'SchemaType' || name === 'SchemaDescription') {
          item[name] = e.target && e.target.value ? e.target.value : e.label;
        }
        if (name === 'Sensitive') {
          item[name] = e;
        }
      }
      return item;
    });
    this.setState({schemaTabList,WhetherEdit:1});
  }

  editblur(rowData,name,e){
    const { schemaTabList } = this.state;
    let sche=schemaTabList.slice(1);
    sche.map((item,index)=>{
      if(rowData.SchemaName==item.SchemaName){
        Modal.warning({title:'提示',content:'属性名称不能重复！'});
        return false;
      }
    });
    
  }


  // 保存
  saveRowData(rowData) {
    let {schemaTabList}=this.state;
    let Sign=0;
    console.log(schemaTabList);
    // schemaTabList.map((item,index)=>{
    //   if(rowData.SchemaName==item.SchemaName){
    //     Modal.warning({title:'提示',content:'属性名称不能重复！'});
    //     return false;
    //   }
    // });
    if(rowData.SchemaType==''){
      rowData.SchemaType='string';
    }
    if(!rowData.SchemaName || !rowData.SchemaDescription) {
      Modal.warning({title:'提示',content:'请正确填写数据！'});
      return false;
    }
    let sche=schemaTabList.slice(1);
    sche.map((item,index)=>{
      if(rowData.SchemaName==item.SchemaName){
        Modal.warning({title:'提示',content:'属性名称不能重复！'});
        Sign=1;
        return false;
      }
    });
    if(Sign==1){
      return false;
    }
    console.log(rowData);
    if(rowData.Sensitive){
      rowData.Sensitive=1;
    }else{
      rowData.Sensitive=0;
    }
    const { editKey } = this.state;
    if (rowData.key === editKey) {
      this.setState({
        isEditing: false,
        WhetherEdit:1
      });
    }
    
    this.props.getData(rowData,this.state.WhetherEdit);
  }
  //  编辑
  editRowData(rowData) {
    const state = this.state;
    if(state.isEditing){
      return false;
    }
    this.beforeEditCopyData = Object.assign({}, rowData);
    this.editing = true;
    this.firstEditKey = rowData.key;

    // 初次进来  

    state.editKey = rowData.key;
    state.isEditing = true;
    this.setState({
      state,WhetherEdit:1
    });

  }
  // 取消
  cancelRowData(rowData) {
    const { editKey, schemaTabList } = this.state;

    if (this.editing) { // 编辑了一部分  然后就点取消, 保存之前的数据
      const preSchemaTabList = schemaTabList.filter((item, index) => {
        if(rowData.key === item.key) {
          Object.assign(item, this.beforeEditCopyData);
        }
        return item;
      });
      this.setState({schemaTabList: preSchemaTabList, isEditing: false});
      this.editing = false;
      return ;
    }


    if (this.state.isAdding) { // 正在新增的时候 点击取消，删除当前新增
      // const preSchemaTabList = schemaTabList.filter((item, index) => {
      //   if(rowData.key === item.key) {
      //     item === 1;
      //   }
      //   return item;
      // });
      schemaTabList.shift();
      this.setState({schemaTabList, isEditing: false});
      return ;

    }

    this.setState({
      // editKey: rowData.key,
      isEditing: false
    });
    this.editing = false;
  }
  // 删除 
  delRowData(rowData) {
    const { schemaTabList } = this.state;
    let index = '';
    for (let i = 0; i < schemaTabList.length; i++) {
      if (rowData.key === schemaTabList[i].key) {
        index = i;
      }
    }

    schemaTabList.splice(index, 1);
    // if (schemaTabList.length === 0) {
    //   schemaTabList.push({
    //     SchemaName: '1',
    //     SchemaType: '2',
    //     SchemaDescription: '3',
    //     Sensitive: true,
    //     key: `${Math.random()}`
    //   });
    // }
  
    this.setState({
      schemaTabList,WhetherEdit:1
    });
    this.props.delSchema(schemaTabList,this.state.WhetherEdit);
  }

  // 新增
  addNewSchData() {
    const { schemaTabList,isEditing } = this.state;
    const newDataList = {
      SchemaName: '',
      SchemaType: '',
      SchemaDescription: '',
      Sensitive: true,
      key: `${Math.random()}`
    };
    if(!isEditing){
      schemaTabList.unshift(newDataList);

      this.setState({
        schemaTabList,
        isEditing: true,
        isAdding: true,
        // newAdding: true,
        editKey: newDataList.key
      });
    }else{
      Modal.warning({title:'提示',content:'请保存信息！'});
    }
  }

  //批量传入
  handleChange2(info){
    let status = info.file.status,t=this;
    let SaveList=[];
    let PolicyUrl=[];
    if (status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (status === 'removed'||status==='error') {
      let curId = info.file.uid,curIndex=null;
      PolicyUrl.map((item,index)=>{
        if(item.uid === curId){
          curIndex = index;
        }
      });
      if(curIndex!==null){
        PolicyUrl.splice(curIndex,1);
      }
      t.setState({defaultFileList:PolicyUrl});
    }
    if (status === 'done') {
      let res = info.file.response,scheamArr = res.data.SchemaList||[];
      let curArr = [...this.state.schemaTabList];
      let urll={uid:info.file.uid,name:info.file.name};
      let filelist=scheamArr.map((item, index) => {
        item.key = `${Math.random()}`; 
        return item;
      });
      const fileArr = [...curArr,...filelist];
      PolicyUrl.push(urll);
      console.log(info.file);
      this.setState({SchemaFile:info.file.name,schemaTabList:filelist,defaultFileList:PolicyUrl,loading:false});
      this.props.chuanSchema(filelist);
    }
    
  }

  //批量传入前验证
  beforeUpload2(file){
    // console.log(file);
    const name=file.name;
    this.setState({SchemaFile:file.name});
    let subname=name.substr(name.length-5,5);
    const isLt1M = file.size / 1024/1024 < 10;
    if (name!=='schema.file') {
      message.error('请上传schema.file文件');
      return false;
    }
    if (!isLt1M) {
      message.error('文件大小不能超过1MB!');
      this.setState({defaultFileList:''});
      return false;
    }
  }


  renderStateIcon(rowData) {
    // console.log(rowData.Sensitive,'bool');
    return (
      <div>
        {
          rowData.Sensitive ? 
            <Icon type="check" style={{color: '#7EC856', fontWeight: 'bold'}} />
            :
            <Icon type="close" style={{color: 'red', fontWeight: 'bold'}} />
        }
      </div>
    );
  }

  render() {
    const t = this;
    var r = [];
    function unique5(array){ 
       
      for(var i = 0, l = array.length; i < l; i++) { 
        for(var j = i + 1; j < l; j++) 
          if (array[i].key === array[j].key) j = ++i; 
        r.push(array[i]); 
      } 
      return r; 
    }
    unique5(t.state.schemaTabList);
    let sessionId = sessionStorage.getItem('localSession');
    return (
      <div>
        <div style={{paddingBottom:'24px',overflow:'hidden'}}>
          <div style={{float:'left',width:88,marginRight:8}} className={styles.SchemaUpload}>
            <Upload 
              action={API.SCHEMA_FILE_UPLOAD+'?'+'SessionId='+sessionId}
              name="file" 
              onChange={this.handleChange2.bind(this)}
              beforeUpload={this.beforeUpload2.bind(this)}
            >
              <Button
                type="primary" 
                style={{marginRight:8}}
              >批量导入</Button>
            </Upload>
          </div>
          <Button
            style={{float:'left'}}
            onClick={() => this.addNewSchData()}
          >新增</Button>
          {/* <Search
            placeholder="数据名称检索"
            onSearch={this.nameSwatch.bind(this)}
            style={{ width: 200 ,float:'right'}}
          /> */}
        </div>
        <TabComp
          // loading={this.state.loading} 
          columns={columns(t)} 
          // list={dataList}
          list={r || []}
          loadList={this.loadData}
          rowKey={(record) => record.key}
        />
      </div>
    );
  }
}

export default Schema;