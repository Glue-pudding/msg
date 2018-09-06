import React from 'react';
import { render } from 'react-dom';
import API from '@api';
import {post,get} from '@axios';
import { Table, Icon, Divider ,message,Row,Col,Card, Select,Button, Input} from 'antd';
import TabComp from '@common/PageTable';
import Details from './details';
import styles from './ConStyle.less';
import commStyle from '../../app.less';
import { Route, Link } from 'react-router';

const Search = Input.Search;
export default class ManageHome extends React.Component {
  constructor(props){
    super(props);
    this.state={
      loading:false,
      list:[],
      editType:'',
      count:'',
      dropdownVisible:false,
      curType:'all',

    };
  }
  componentDidMount() {
    let t = this;
    t.loadData();
  }
  loadData(val){
    let t = this;
    t.setState({ loading: true });
    let params = '';
    if(val){
      params={ url: API.DATASOURCE_LIST,params:{
        DataSetName:val
      }};
    }else{
      params = { url: API.DATASOURCE_LIST };
    }
    get(params).then(function (res) {
      if (res && res.code === 10000) {
        t.setState({ list: res.data.DataSets,  loading: false, editType: '' });
      } else {
        t.setState({ loading: false, editType: '' });
        message.warn(res.message || '系统出错，请联系管理员!');
      }
    }).catch = (err) => {
      t.setState({ loading: false, editType: '' });
      // console.log('==error==', err);
    };
  }
  edit(){
    // console.log(1);
  }
  nameSwatch(val){
    this.loadData(val);
  }

  typeChange(val){
    let t=this;
    t.setState({typeId:val});
    t.setState({loading:true});
    let params = {url:API.API_NEWS_LIST,data:{page:this.state.page,size:this.state.pageSize,typeId:val}};
    post(params).then(function(res){
      if(res&&res.code===10000){
        t.setState({list:res.data.list,loading:false,editType:'',count:res.data.count});
        t.setState({loading:false});
      }else{
        t.setState({loading:false,editType:''});
      }
    }).catch=(err)=>{
      t.setState({loading:false,editType:''});
      // console.log('==error==',err);
    };
  }

  changeType=(type)=>{
    console.log(type);
    
    this.setState({curType:type,dropdownVisible:false});
  }

  loadColumn() {
    let columns = [], t = this;
    const {curType,dropdownVisible} = this.state;
    let typeList = [
      { text: '全部数据', value:'all'},
      { text: '政务数据', value: 'GovernmentDataSets' },
      { text: '金融数据', value: 'FinanceDataSets' },
      { text: '医疗卫生', value: 'MedicalDataSets' },
      { text: '人工智能', value: 'AIDataSets' },
      { text: '电商营销', value: 'ElectronicBusinessDataSets' },
      { text: '交通数据', value: 'TrafficDataSets' },
      { text: '应用开发', value: 'ServiceDataSets' },
    ];
    columns = [{
      title: '数据名称',
      dataIndex: 'DataSetName',
      key: 'DataSetName',
    }, {
      title: '数据分类',
      dataIndex: 'DataType',
      key: 'DataType',
      render: (text, record) => {
        return <span>
          {
            record.DataType==='FinanceDataSets'?'金融数据':(record.DataType==='TrafficDataSets'?'交通数据':
              (record.DataType==='GovernmentDataSets'?'政务数据':
                (record.DataType==='MedicalDataSets'?'医疗卫生':
                  (record.DataType==='AIDataSets'?'人工智能':
                    (record.DataType==='ElectronicBusinessDataSets'?'电商营销':'应用开发'
                      
                    )
                  )
              
                )
              )
            )
          }
        </span>;
      },
      // filters: [
      //   { text: '政务数据', value: 'GovernmentDataSets' },
      //   { text: '金融数据', value: 'FinanceDataSets' },
      //   { text: '医疗卫生', value: 'MedicalDataSets' },
      //   { text: '人工智能', value: 'AIDataSets' },
      //   { text: '电商营销', value: 'ElectronicBusinessDataSets' },
      //   { text: '交通数据', value: 'TrafficDataSets' },
      //   { text: '应用开发', value: 'ServiceDataSets' },
      // ],
      filterIcon: <Icon type="caret-down" />,
      filterDropdownVisible:dropdownVisible,
      onFilterDropdownVisibleChange:(visible)=>{
        t.setState({dropdownVisible:visible});
      },
      filterDropdown: (
        <div className={commStyle.dropdownBox}>
          <ul>
            {typeList.map((item,index)=>{
              return <li onClick={t.changeType.bind(t,item.value)} key={item.value} className={curType===item.value?commStyle.active:''}>
                <a href="javascript:void(0);">{item.text}</a>
              </li>;
            })}  
          </ul>
        </div>
      ),
    },  {
      title: '数据规模',
      dataIndex: 'DataSize',
      key: 'DataSize',
      render:(text,record)=>{
        return (
          record.DataSize?record.DataSize:'--'
        );
      }
    },{
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return <span>
          <Link to={'/supply/resource/details/'+record.DataSetID}>详情</Link>
        </span>;
      }
    }];
    return columns;
  }
  addData(){
    this.setState({editType:'add'});
  }
  render() {
    var t = this, state = t.state;
    let columns = t.loadColumn();
    const { curType } = this.state;
    let curList = curType==='all'? this.state.list:this.state.list.filter((item,index)=>{
      if(item.DataType===curType){
        return item;
      }
    });
    return (
      <div>
        <Row type="flex" justify="center">
          <Col md={23}>
            <div style={{marginBottom:28}}>
              <span className={styles.header} >数据资源管理</span>
            </div>
            {!this.state.editType?
              <div className="gutter-box">
                <div style={{background:'#fff',padding:'28px 24px 0px 24px',borderTopLeftRadius:10,borderTopRightRadius:10}}>
                  <Button onClick={t.addData.bind(this)} type="primary" >
                    <Link to={'/supply/resource/addData'}>新增数据</Link>
                  </Button>
                  <Search
                    placeholder="数据名称检索"
                    onSearch={this.nameSwatch.bind(this)}
                    style={{ width: 200 ,float:'right'}}
                  />
                
                </div>
                <Card bordered={false} style={{borderTopLeftRadius:0,borderTopRightRadius:0}}>
                  <TabComp loading={this.state.loading} columns={columns} list={curList || []} rowKey="id" loadList={this.loadData} />
                </Card>
              </div>:<Details />
            }
          </Col>
        </Row>
      </div>
    );
  }
}