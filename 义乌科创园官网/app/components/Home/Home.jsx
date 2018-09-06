import React, { Component } from 'react';
import axios from '@axios';
import { Table, Avatar,message} from 'antd';
import NewHome from './News.jsx';
import ParkHome from './Parks.jsx';
import BusinessHome from './Business.jsx';
import ContactHome from './Contact.jsx';
import styles from './style.less';
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.state = {
      list: [],
      title: '',
      newsList:[],newsType:1
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
    let params = {type:this.state.newsType,page:1,size:4},t=this;
    axios({
      method: 'post',
      url:'/api/index/news/list',
      data:params,
    }).then(data => {
      let datas = data.data.data,code = data.data.code;
      if(code===10000){
        t.setState({ newsList: data.data.data.list });
      }else{
        message.warn(datas.message||'系统出错，请联系管理员');
      }
    }).catch(error => {
      message.error(error);// 异常处理
    });
  }
  getColumns() {
    var columns = [];
    columns = [
      { title: '名称', dataIndex: 'title', key: 'title' },
      {
        title: '海报', dataIndex: 'images', key: 'images', render: (text, record, index) => {
          var imgUrl = text['small'];
          return <img src={imgUrl} width="120" />;
        }
      },
      { title: '时间', dataIndex: 'year', key: 'year' },
      {
        title: '类型', dataIndex: 'genres', key: 'genres', render: (text, record, index) => {
          var typeStr = text.join(',');
          return <label key={text + index}>{typeStr}</label>;
        }
      },
      { title: '地址', dataIndex: 'alt', key: 'alt', render: (text) => <a href={text}>{text}</a> },
    ];
    return columns;
  }
  render() {
    var t=this;
    return (
      <div>
        <div className={styles.contBox}>
          <h2 className={styles.boxTitle}>新闻公告，及时掌握园区动态</h2>
          <div className={styles.boxSubtitle}>新闻实时发布，获取行业资讯、园区动态的第一手资料</div>
          <NewHome loadNews={this.loadNews.bind(this)} news={this.state.newsList} style={styles}  />
        </div>
        <div className={`${styles.contBox} ${styles.parkBox}`}>
          <h2 className={styles.boxTitle}>专业的园区服务，助力企业发展</h2>
          <div className={styles.boxSubtitle}>依托浙江大学、网新集团、浙大校友战略资源要素，为企业提供专业的服务</div>
          <ParkHome loadNews={this.loadNews.bind(this)} news={this.state.newsList} style={styles} />
        </div>
        <div className={styles.contBox}>
          <h2 className={styles.boxTitle}>他们都选择义乌市科技创业园</h2>
          <div className={styles.boxSubtitle}>企业的信任托付，品质科创园首选</div>
          <BusinessHome loadNews={this.loadNews.bind(this)} news={this.state.newsList} style={styles} />
        </div>
        <div className={`${styles.contBox} ${styles.contBg}`}>
          <div className={styles.bottomCont} >
            <ContactHome loadNews={this.loadNews.bind(this)} news={this.state.newsList} style={styles} />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;