import React from 'react';
import {Carousel,message,Icon} from 'antd';
import styles from '../app.less';
import axios from '@axios';
import API from '../../common/api';
import bannerImg from '@img/bg_Banner.png';
import { domainToASCII } from 'url';
class CarouselBox extends React.Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.state = {
      bannerList: []
    };
  }
  componentDidMount(){
    let t=this;
    axios({
      method: 'post',
      url:API.BANNER_LIST,
      data:{type:1}
    }).then(data => {
      let datas = data.data.data,code = data.data.code;
      if(code===10000){
        t.setState({bannerList:datas});
      }else{
        message.warn(data.message||'系统出错，请联系管理员');
      }
    }).catch(error => {
      message.error(error);// 异常处理
    });
  }
  next() {
    this.slider.next();
  }
  previous() {
    this.slider.prev();
  }
  render() {
    const {bannerList} =this.state;
    return (
      <div className={styles.Bhidden}>
        <button className={`${styles.btnLeft} ${styles.carBtn}`} onClick={this.previous}> <Icon type="left" /> </button>
        <button className={`${styles.btnRight} ${styles.carBtn}` } onClick={this.next}>  <Icon type="right" /></button>
        <Carousel autoplay ref={c => (this.slider = c)}>
          {bannerList.map((item,index)=>{
            return <div  className={styles.bannerBox} key={index}><a href={item.href||''} target='new'><img alt='轮播图' src={item.url||bannerImg} /></a></div>;
          })}
        </Carousel>
      </div>
    );
  }
}

export default CarouselBox;