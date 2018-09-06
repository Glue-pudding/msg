import React from 'react';
import {Row, Col, Card,Tabs,Avatar,Button,List,message} from 'antd';
const TabPane = Tabs.TabPane;
import {Link,hashHistory} from 'react-router';
import axios from '@axios';
import API from '../../common/api';
const formatDate = (iTime) => {
  if (!iTime) return;
  let time = new Date(iTime),
    year = time.getFullYear(),month = time.getMonth()+1,day = time.getDate();
  month = month >9?month:'0'+month;
  day  = day>9?day:'0'+day;
  return year +'-'+month+'-'+day;
};
export default class News extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      newsInfor:null,msgList:[]
    };
  }
  tabChange(key){
    this.setState({actKey:key});
  }
  componentDidMount(){
    this.loadHomeMsg(1);
    this.loadHomeMsg(2);
  }
  loadHomeMsg(id){
    let t=this,url = API.NEWS_LIST;
    axios({
      method: 'post',
      url:url,
      data:{typeId:id,page:1,size:3}
    }).then(data => {
      let datas = data.data.data,code = data.data.code;
      if(code===10000&&datas){
        if(id===1){
          t.setState({ 'msgList': datas.list||[]});
        }else{
          t.setState({ 'newsInfor': datas.list&&datas.list[0]});
        }
      }else{
        message.warn(datas.message||'新闻信息获取出错');
      }
    }).catch(error => {
      message.error(error);// 异常处理
    });
  }
  render() {
    const {newsInfor,msgList} =this.state;
    // if(newsInfor){console.log(newsInfor,'====',msgList);}
    let list = this.props.news||[],styles=this.props.style;
    let listCont = list.map(function(item,index){
      let str = `${item.title} : ${item.subject}`;
      // console.log(item,'===item===');
      if(index<4){
        return <Col span={11} key={index} className={styles.cardItem} >
          <Card>
            <Row gutter={16} offset={4}>
              <Col span={8}><Avatar src={item.url} alt={item.title} /></Col>
              <Col span={12}>
                <h3 >{item.title}</h3>
                <div>{item.content}</div>
                <span>{item.modifyTime}</span>
              </Col>
            </Row>
          </Card>
        </Col>;
      }
    });
    return (
      <div id='newsBox' style={{width:'1168px',margin:'40px auto 20px'}}>
        <Row  gutter={24} className={`${styles.newsBox} clearfix`} justify="center">
          <Col span={12}>
            <Card title="新闻资讯" bordered={false} className={styles.cardItem}>
              {newsInfor?<Row gutter={16} className={styles.newsCont}>
                <Col span={12} className={styles.newsImg}><Link to={'/news/newsDetail/?type=news&key=2&id='+newsInfor.id}><img src={newsInfor.url} /></Link></Col>
                <Col span={12}>
                  <h3><Link to={'/news/newsDetail/?type=news&key=2&id='+newsInfor.id}>{newsInfor.title}</Link></h3>
                  <article>{newsInfor.subject||newsInfor.content||''}</article>
                  <label>{newsInfor.modifier||''} · {newsInfor.modifyTime&&formatDate(newsInfor.modifyTime)}</label>
                </Col>
              </Row>:null}
            </Card>
          </Col>
          <Col span={12}>
            <Card title="信息公示"  bordered={false} className={styles.cardItem}>
              <List itemLayout="vertical">
                {msgList&&msgList.length?
                  msgList.map((item,index)=>{
                    return <List.Item key={item.id} extra={<label>{item.modifyTime&&formatDate(item.modifyTime)}</label>}>
                      <Link to={'/news/newsDetail/?type=news&key=1&id='+item.id}>{item.title}</Link>
                    </List.Item>;
                  })
                  :null}
              </List>
            </Card>
          </Col>
        </Row>
        <div className={styles.viewBtn} ><Button ><Link to='/news/newsList'>查看全部新闻</Link></Button></div>
      </div>
    );
  }
}