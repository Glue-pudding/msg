import React from "react";

import { Modal, Upload, Radio, Row, Col ,Icon} from "antd";
import commStyle from './common.less';
import CommonEditor from '@/modules/common/editor/normalEditor';
import ImageMonitor from '@/modules/common/image/imgMonitor';
const RadioGroup = Radio.Group;
class LogoPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        visible: props.visible,
        type:props.type,
        imgId:"",
        imgUrl:'',
        text:'',
        imgVisible:false
    };
  }
  
  componentDidMount(){
    const {imgs,logoObj} = this.props;
    let curUrl = "";
    imgs.filter((item,index)=>{
      if(item.id === logoObj.imgID){
        curUrl = item.url;
      }
    });
    this.setState({imgId:logoObj.imgID,imgUrl:curUrl,text:logoObj.word})
  }
  componentWillReceiveProps(props){
    this.setState({visible:props.visible});
  }
  submitLogo = () => {
    const {type,imgId,text} = this.state;

    this.props.submitLogo(type,imgId,text);
  };
  cancelLogo = () => {this.props.cancelLogo();};
  cancelImg =()=>{this.setState({imgVisible:false,visible:true})};
  submitImg = (id)=>{
    const {imgs} = this.props;
    let curUrl = "";
    imgs.filter((item,index)=>{
      if(item.id === id){
        curUrl = item.url;
      }
    });
    this.setState({imgId:id,imgUrl:curUrl,imgVisible:false,visible:true});
  }
  editImg=()=>{this.setState({imgVisible:true,visible:false})};
  onTypeChange = (e) =>{this.setState({type:e.target.value})}
  
  getLogoText=(text)=>{
    this.setState({text})
  }
  render() {
    const { visible, type,text,imgUrl,imgId,imgVisible} = this.state;
    let editConfig = {
      id:'logoEditor',
      value:text,
      type:'inline'
    }
    let imgCont = imgId?<div className={`hoverable ${commStyle.logoImgbox}`}>
    <i class="editCoin" onClick={this.editImg}></i> <img src={imgUrl} />
    </div>:<div className={`${commStyle.logoImgbox} ${commStyle.logoImgIcon}`} onClick={this.editImg}><Icon type="plus" style={{fontSize:'32px'}} /></div>;
    return (
      <Modal
        visible={visible}
        title="编辑Logo"
        onOk={this.submitLogo}
        onCancel={this.cancelLogo.bind(this)}
        width="568px"
      >
        <Row className={`${commStyle.logoRow} mb-md-4 mt-md-4`}>
          <Col span={8} className="textAlignRight">Logo 类型：</Col>
          <Col span={8}>
            <RadioGroup onChange={this.onTypeChange} value={type}>
              <Radio value="img">图片</Radio>
              <Radio value="text" >文字</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row className={commStyle.logoRow}>
          <Col span={8} className="textAlignRight">{type==='img'?`Logo 图片：`:`Logo 文字：`}</Col>
          <Col span={12}>
            {type==='img'?imgCont:<CommonEditor config={editConfig} getValue={this.getLogoText} />}
          </Col>
        </Row>
        
        {imgVisible?<ImageMonitor visible={imgVisible} cancelImg={this.cancelImg} id={imgId} submitImg={this.submitImg}/>:null}
      </Modal>
    );
  }
}

export default LogoPanel;
