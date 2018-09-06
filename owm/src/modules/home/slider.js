import React from "react";
import './home.css';
import {connect } from "react-redux";
import Promise from 'promise';
import homeAction from './homeAction';
import { bindActionCreators } from 'redux';
import {Modal,Button,Table,Icon,Divider,Popconfirm} from 'antd';
import EditSlider from './sliderEdit';
class Slider extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      listVisible:false,
      curSlider:{},
      isEdit:false,
      editType:'',
      bannerList:[],
      loading:false
    };
  }
  componentDidMount(){
    this.setState({bannerList:this.props.list})
  }
  componentWillReceiveProps(props){
    this.setState({bannerList:props.list})
  }
  rendColumns(){
    const {bannerList} =this.state;
    let len = bannerList.length-1,t=this;
    return [
      {title:'Banner 图片',dataIndex:'url',key:'url',render:(r,k,index)=>{
        return <div className="editBannerBox" ><img src={r} alt={r}/></div>
      }},
      {title:'排序',dataIndex:'sort',key:'sort',render:(r,k,index)=>{
        
        return <div style={{fontSize:"20px",color:'#007BFF'}}>
            {!index?null:<a href="javascript:void(0);" title="上移" onClick={t.sortBanner.bind(t,index,'up')}><Icon type="arrow-up" /></a>}
            {index===len?null:<a href="javascript:void(0);" title="下移" onClick={t.sortBanner.bind(t,index,'down')}><Icon type="arrow-down" /></a>}
        </div>
      }},
      {title:'操作',dataIndex:'operate',key:'operate',render:(r,k,index)=>{
        return <div>
          <a onClick={t.editDetail.bind(t,k.id)} href="javascript:void(0);">编辑</a>
          <Divider type="vertical"/>
          <Popconfirm title="确认删除?" onConfirm={() => this.handleDelete(k.id)}>
            <a href="javascript:;">删除</a>
          </Popconfirm>
        </div>
      }},
    ]
  }
  handleDelete =(id)=>{
    this.props.actions.deleteSlider(id);
  }
  sortBanner=(index,type)=>{
    let curBanner = JSON.parse(JSON.stringify(this.state.bannerList));
    let tag = type==='up'?index-1:index+1;
    let curItem = curBanner.splice(index,1);
    curBanner.splice(tag,0,curItem[0]);
    this.setState({bannerList:curBanner});
  }
  editBanner=()=>{
    this.setState({listVisible:true});
  }
  newBanner=()=>{
    this.setState({isEdit:true,editType:'new',curSlider:{}});
  }
  editDetail=(id)=>{
    const {list} = this.props;
    let curObj=null;
    list.filter((item,index)=>{
      if(item.id===id){
        curObj = item;
      }
    });
    this.setState({curSlider:curObj,isEdit:true,editType:'edit'});
  }
  cancelEdit=()=>{
    this.setState({isEdit:false});
  }
  handleCancel=()=>{
    const {isEdit} = this.state;
    if(isEdit){
      this.setState({isEdit:false});
    }else{
      this.setState({isEdit:false,listVisible:false});
    }
  }
  onSaveSlider=(iSlider)=>{
    let t=this,iPromise;
    iPromise = new Promise(function(resolve,reject){
      t.props.actions.saveSlider(iSlider,resolve);
    });
    
    iPromise.then(function(isSuccess){
        if(isSuccess){
          t.setState({isEdit:false});
        }
    });
    iPromise.catch((err)=>{
      t.setState({isEdit:false});
    })
  }
  handleOk=()=>{
    const {bannerList} =this.state;
    let t=this,iPromise;
    iPromise = new Promise(function(resolve,reject){
      t.props.actions.sortSaveSlider(bannerList,resolve,reject);
      t.setState({loading:true});
    });
    
    iPromise.then(function(isSuccess){
        if(isSuccess){
          t.setState({loading:false,listVisible:false});
        }
    });
    iPromise.catch((err)=>{
      t.setState({loading:false});
    })
  }
  render(){
    const {list,imgs,homeState} = this.props;
    const {listVisible,curSlider,isEdit,editType,bannerList,loading} = this.state;
    let iSlider = list.map((item,index)=>{
      let curUrl ='';
      imgs.filter((cItem)=>{if(cItem.id===item.imageId){curUrl=cItem.url;}});
      return <div className={`carousel-item ${!index?'active':''}`} key={item.imageId}>
        <a href={item.href} target="_blank" alt={item.href}><img
          src={curUrl}
          alt={"轮播图"+index}
        /></a>
      </div>
    })
    return (
      <div>
        <div id="myCarousel" class="carousel slide hoverable" data-ride="carousel">
          <i class="editCoin" onClick={this.editBanner}></i>  
          <ol class="carousel-indicators">
            {list.map((item,index)=>{
              return <li data-target="#myCarousel" key={index} data-slide-to={index} className={!index?"active":''} />
            })}
          </ol>
          <div class="carousel-inner">
            {iSlider}
          </div>
          <a
            class="carousel-control-prev"
            href="#myCarousel"
            role="button"
            data-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true" />
            <span class="sr-only">上一页</span>
          </a>
          <a
            class="carousel-control-next"
            href="#myCarousel"
            role="button"
            data-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true" />
            <span class="sr-only">下一页</span>
          </a>
        </div>
        <Modal title={isEdit?<a><Icon type="rollback" title="返回" onClick={this.cancelEdit}/> {editType==='edit'?"编辑 Banner":'新增 Banner'}</a>:"Banner 管理"} 
          footer={isEdit?null:[
            <Button key="back" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>确认</Button>
          ]}
          width={568} visible={listVisible} onCancel={this.handleCancel} maskClosable={false} >
          {isEdit?<EditSlider imgs={imgs} sliderObj={curSlider} saveSlider={this.onSaveSlider} loading={homeState.saveBannerLoading} cancelEdit={this.cancelEdit} />
          :<div>
                <Button disabled={list.length>4} onClick={this.newBanner} className='mb-md-4'>新增 Banner</Button>
                <Table dataSource={bannerList} columns={this.rendColumns()} rowKey='id' pagination={false} />
              </div>}
        </Modal>
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
)(Slider);

