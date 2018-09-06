import React, { Component } from 'react';
import axios from '@axios';
import { Table, Avatar,message,Carousel,Icon} from 'antd';
import API from '../../common/api';
import styles from './style.less';

class Industrial extends Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.state = {
      IndustrialList:[]
    };
  }
  componentDidMount() {
    this.loadNews();
  }
  loadNews(){
    let params = '',t=this;
    axios({
      method: 'post',
      url:API.INDUSTRY_LIST,
      data:params,
    }).then(data => {
      let datas = data.data,code = data.data.code;
      if(code===10000){
        t.setState({ IndustrialList:data.data.data.list});
      }else{
        message.warn(datas.message||'系统出错，请联系管理员');
      }
    }).catch(error => {
      message.error(error);// 异常处理
    });
  }



  render(){
    const IndustrialList = this.state.IndustrialList;
    return(
      <div className={styles.IndustrialContent}>
        <h2>园区产业方向</h2>
        <span>涵盖多产业方向 全面满足业务需求</span>
        <ul>
          {
            this.state.IndustrialList.map((item,index)=>{
              return(
                <li key={index} className={styles.IndustrialList}><img src={item.url} /><br />{item.name}</li>
              );
            })   
          }
        </ul>
      </div>
      
    );
  }
}

export default Industrial;
