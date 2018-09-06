import React, { Component } from 'react';
import axios from '@axios';
import Slider from 'react-slick';
import { Table, Avatar,message,Carousel,Icon} from 'antd';
import API from '../../common/api';
import styles from './style.less';

const createMarkup = function(cont) { return {__html: cont}; };

class ParkIntro extends Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.state = {
      abstractList:'',
      abstractImg:[]
    };
  }
  componentDidMount() {
    this.loadNews();
  }
  loadNews(){
    let params = {type:1},t=this;
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

  render(){
    const abstractList= this.state.abstractList;
    const abstractImg= this.state.abstractImg;
    var settings = {
      dots: false,
    };
    return(
      <div className={styles.ParkIntroContent}>
        <div className={styles.ParkIntroLeft} style={{display:'table',height:'355px'}}>
          <div className={styles.Con} style={{display:'table-cell',verticalAlign:'middle'}}>
            <h2 style={{marginTop:'15px'}}>义乌市科技创业园</h2>
            <article className={styles.newsCont} dangerouslySetInnerHTML={createMarkup(abstractList.content)} />
          </div>
        </div>
        <div className={styles.ParkIntroRight}>
          <div className={styles.parkslideBox}>
            <Slider {...settings}>
              {
                this.state.abstractImg.map((item,index)=>{
                  return (
                    <div key={index} className={styles.IntroBox}><img src={item.url} /></div>
                  );
                })
              }
            </Slider>
          </div>
        </div>
      </div>
      
    );
  }
}

export default ParkIntro;
