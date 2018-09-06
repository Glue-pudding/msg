import React, { Component } from 'react';
import axios from '@axios';
import Slider from 'react-slick';
import { Table, Avatar,message,Carousel,Icon,Modal} from 'antd';
import API from '../../common/api';
import styles from './style.less';

class SupportFacilities extends Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.state = {
      abstractList:'',
      item:'',
      abstractImg:[],
      previewVisible:false,previewImage:'',
    };
  }
  componentDidMount() {
    // axios({
    //   method: 'post',
    //   url:'/v2/movie/in_theaters'
    // }).then(data => {
    //   this.setState({ list: data.data.subjects, title: data.data.title });
    //   console.log(data); // 这个地方返回，完整的请求对象
    // }).catch(error => {
    //   console.error(error);// 异常处理
    // });
    this.loadNews();
  }
  loadNews(){
    let params = {type:2},t=this;
    axios({
      method: 'post',
      url:API.GET_BASICINFOR,
      data:params,
    }).then(data => {
      let datas = data.data,code = data.data.code;
      if(code===10000){
        t.setState({ abstractImg: data.data.data.list ,abstractList:data.data.data.abstract});
      }else{
        message.warn(datas.message||'系统出错，请联系管理员');
      }
    }).catch(error => {
      message.error(error);// 异常处理
    });
  }



  onChange(a, b, c) {
    
  }

  handlePreview(e)  {
    console.log(e);
    this.setState({
      item:e.title,
      previewImage:e.url,
      previewVisible: true,
    });
  }

  handleCancel(e){
    this.setState({ previewVisible: false });
  }

  render(){
    const abstractList= this.state.abstractList;
    const abstractImg= this.state.abstractImg;
    let len = abstractImg?abstractImg.length:0;
    var settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow:4,
      slidesToScroll: 4
    };
    return(
      <div className={styles.supportContent}>
        <h2 style={{marginTop:'15px'}}>配套设施</h2>
        <div className={styles.Con}>{abstractList.content}</div>
        <div  className={styles.slideBox}>
          <Slider {...settings}>
            {
              this.state.abstractImg.map((item,index)=>{
                return (
                  <div key={index} className={styles.coverBox}>
                    <div className={styles.coverImg} onClick={this.handlePreview.bind(this,item)}><button className={styles.btn}><Icon type="search" /></button><p>{item.title}</p></div>
                    <img src={item.url} />
                  </div>
                );
              })
            }
          </Slider>
          
        </div>
        <Modal title={this.state.item} visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel.bind(this)}>
          <img alt="pic" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </div>
      
    );
  }
}

export default SupportFacilities;
