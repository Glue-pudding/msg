import React from 'react';
import {Row, Col, Card,Tabs,Avatar,Button,List,message} from 'antd';
const TabPane = Tabs.TabPane;
const { Meta } = Card;
import {Link,hashHistory} from 'react-router';
import axios from '@axios';
import API from '../../common/api';
import comPic1 from '@img/school.png';
import comPic2 from '@img/realmaker.png';
export default class Business extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      list:null,msgList:[]
    };
  }
  componentDidMount(){
    this.loadBusinessList();
  }
  loadBusinessList(){
    let url = API.COMPANY_LIST,t=this;
    axios({
      method: 'post',
      url:url,
      data:{page:1,size:20,source:1}
    }).then(data => {
      let datas = data.data.data,code = data.data.code;
      if(code===10000&&datas){
        t.setState({ 'list': datas.list||[]});
      }else{
        message.warn(datas.message||'系统出错，请联系管理员');
      }
    }).catch(error => {
      message.error(error);// 异常处理
    });
  }
  render() {
    let list = this.state.list||[],styles=this.props.style;

    if (list.length>8) {
      list=list.slice(0,8);
    }
    
   
    return (
      <div id='newsBox' style={{width:'58%',margin:'40px auto 20px',textAlign:'center'}} >
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={list}
          renderItem={(item,index) => {
            let itemCont =<List.Item className={styles.businessBox} >
              <Link to={'/company/companyDetail/?type=company&key='+(item.typeId||'')+'&name='+(item.name||'')+'&id='+item.id}><Card className={styles.cardItem} bordered={false}>
                <img alt={item.title} src={item.url} height='100px' width='100%' />
              </Card></Link>
            </List.Item>;
            return itemCont;
          }}
        />
        <div className={styles.viewBtn} ><Button><Link to='/company'>查看全部企业</Link></Button></div>
      </div>
    );
  }
}