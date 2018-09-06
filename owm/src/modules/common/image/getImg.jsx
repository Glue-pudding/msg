/**
 * 图片组件
 * @argument
    * imgList:所有图片数据(组件初始化图片列表所需)
    * visible:窗体是否可见,默认不可见
    * id:图片id，和imgList对应
 * @function
    * submitImg(id):确认图片选择，传递图片id
    * cancelImg:取消图片选择，回调函数控制visible变化
 * @author xutao 2018/08/10
 */
import React from "react";
import PropTypes from "prop-types";
import {Button,Row,Col,Tabs,Upload,message} from 'antd';
import styles from './monitor.less';
import {connect } from "react-redux";
import { bindActionCreators } from 'redux'
import CommonAction from '../commonAction'; 
import API from '@/tools/api';
// import fontList from './fontAwesome';
const TabPane = Tabs.TabPane;

class ImgMonitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curId:props.id||"",
      loading:false
    };
  }
  componentWillReceiveProps(props){
      console.log(this.props,'==diff==',props);
      this.setState({visible:props.visible,curId:props.id});
  }
  renderImg(){
      const list = this.props.commonState.imgList;
      const {curId}=this.state;
      let t=this;
      return list.map((item,index)=>{
          let activeClass = curId&&curId===item.id?styles.active:"";
          return <Col span={6} className={styles.imgItem} key={item.id} onClick={t.imgClick.bind(t,item.id)}>
            <div className={activeClass}><img alt={item.id} src={item.url}/></div>
          </Col>
      })
  }
  imgClick=(id)=>this.setState({curId:id})
  beforeUpload=(file)=>{
    const isPic = file.type === 'image/jpeg'||file.type==='image/gif'||file.type==='image/png';
    const isLt1M = file.size / 1024 /1024 < 1;
    if (!isPic) {
      message.error('只能上传图片格式文件!');
      return false;
    }
    if (!isLt1M) {
      message.error('图片大小不建议超过1M!');
      return false;
    }
    return isPic && isLt1M;
  }
  okImg=()=>{
      const {submitImg} = this.props;
      let imgId = this.state.curId;
      submitImg(imgId);
  }
  render() {
    const {loading} = this.state;
    const {actions}=this.props;
    let t=this;
    const uploadProps = {
        action: API.UPLOAD_NEW_IMG,
        beforeUpload:this.beforeUpload,
        showUploadList:false,
        onChange(info) {
          const {status,name} = info.file;
          if(status === 'uploading'){
              t.setState({loading:true});
          }
          if (status === 'done') {
            actions.loadImgList();
            t.setState({loading:false});
            message.success(`${name} 文件上传成功！`);
          } else if (status === 'error') {
            t.setState({loading:false});
            message.error(`${name} 文件上传失败。`);
          }
        },
      };
    return (
        <div>
          <Upload {...uploadProps}><Button icon={loading?'':'upload'} loading={loading} >上传图片</Button></Upload>
          <p className={styles.imgDesc}>支持格式：jpg / jpeg / gif / png，图片大小不超过 1 M</p>
          <div className={styles.imgBox}>
            <Row gutter={16}>
                {this.renderImg()}
            </Row>
          </div>
        </div>
    );
  }
}
ImgMonitor.propTypes = {};

const mapStateToProps=function(state) {
    return {
        commonState: state.commonState
    }
}
const mapDispatchToProps=(dispatch)=> {
    return {
        actions:bindActionCreators(CommonAction, dispatch)
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(ImgMonitor);
