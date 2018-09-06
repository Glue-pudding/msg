import React from 'react';
import {Row, Col, Card,Tabs,Avatar,Button} from 'antd';
const TabPane = Tabs.TabPane;
const { Meta } = Card;
import {Link,hashHistory} from 'react-router';
import policyPic from '@img/policy.png';
import specialPic from '@img/special.png';
import basicPic from '@img/basic.png';
export default class Parks extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let list = this.props.news||[],styles=this.props.style;
    let listCont = list.map(function(item,index){
      let str = `${item.title} : ${item.subject}`;
      // console.log(item,'===item===');
      if(index<3){
        return <Col span={5} key={index}  >            
          <Card className={styles.cardItem} bordered={false} 
            cover={<img alt={item.title} src={item.url} height='80px' width='80px' />}
          >
            <Meta
              title={item.title}
              description={item.content}
            />
          </Card>
        </Col>;
      }
    });
    return (
      <div id='newsBox' style={{width:'94%',margin:'40px auto 20px'}} >
        <Row  gutter={16} type='flex' justify="center" className={styles.parkCard}>
          <Col span={5} >            
            <Link to='/park?type=top'><Card className={styles.cardItem} bordered={false} 
              cover={<img alt='园区产业方向' src={basicPic} />}
            >
              <Meta
                title='园区产业方向'
                description={<ul>
                  <li>多产业方向</li>
                  <li>全面满足</li>
                  <li>业务需求</li>
                  <li>…</li>
                </ul>}
              />
            </Card></Link>
          </Col>
          <Col span={5} >            
            <Link to='/park?type=middle'><Card className={styles.cardItem} bordered={false} 
              cover={<img alt='政策服务' src={policyPic} />}
            >
              <Meta
                title='政策服务'
                description={<ul>
                  <li>扶持政策</li>
                  <li>基础服务</li>
                  <li>特色服务</li>
                  <li>…</li>
                </ul>}
              />
            </Card></Link>
          </Col>   
          <Col span={5} >            
            <Link to='/park?type=bottom'><Card className={styles.cardItem} bordered={false} 
              cover={<img alt='配套设施' src={specialPic} />}
            >
              <Meta
                title='配套设施'
                description={<ul>
                  <li>配套设施</li>
                  <li>配套设施</li>
                  <li>创业辅导活动</li>
                  <li>…</li>
                </ul>}
              />
            </Card></Link>
          </Col>  
        </Row>
        <div className={`${styles.viewBtn} ${styles.parkBtn}`}><Button ><Link to='/park'>查看全部服务</Link></Button></div>
      </div>
    );
  }
}