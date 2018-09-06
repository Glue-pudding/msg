import React from 'react';
import { Icon, message, Breadcrumb, Tabs, DatePicker, Button,Alert } from 'antd';
import styles from './productDetails.less';
import { Link } from 'react-router-dom';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { post } from '@/tools/axios';
import moment from 'moment';
import 'moment/locale/zh-cn';
import echarts from 'echarts/lib/echarts';
import "echarts/lib/component/legend";
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import Volume from './Volume';
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

var now = new Date();
var nowTime = now.getTime();
var day = now.getDay();
var oneDayTime = 24 * 60 * 60 * 1000;
let stDate = new Date(nowTime - (day - 1) * oneDayTime)//显示周一
let eDate =new Date(nowTime + (7 - day) * oneDayTime);//显示周日
class productDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: '',
      priceList: [],
      isTop: '',keyId:2,tabp:"1",
      endDate:eDate,
      startDate:stDate,
    };
  }
  componentDidMount() {
    let t = this;
    const {startDate,endDate} = this.state;
    let startTime=moment(startDate).format("YYYY-MM-DD");
    let endTime=moment(endDate).format("YYYY-MM-DD");
    let iStr = window.location.search;
    var productName = iStr.substring(iStr.lastIndexOf('=')+1, iStr.length); 
    if (productName) {
      t.setState({ productName: productName });
      t.getProductDetail(productName,startTime,endTime);

    }
  }
  //获取详情
  getProductDetail(name,startDate,endDate) {
    let t = this,
      params = { url: '/api/report/getPriceDetail', data: { productName: name, startDate: startDate, endDate: endDate } };
    t.setState({ loading: true });
    post(params).then(function (res) {
      if (res && res.code === 10000) {
        t.setState({ priceList: res.priceList || [], loading: false, isTop: res.isTop });
        if(res.priceList.length!==0){
          t.getPriceDetail();
        }
      } else {
        message.warn((res && res.info) || '系统出错，请联系管理员!');
      }
    }).catch = (err) => {
      t.setState({ loading: false });
    };
  }
  //切换价格销量
  callback(key) {
    const {productName,startDate,endDate} = this.state;
    this.setState({tabp:key});
    let startTime=moment(startDate).format("YYYY-MM-DD");
    let endTime=moment(endDate).format("YYYY-MM-DD");
    this.getProductDetail(productName,startTime,endTime);

  }
  //选取时间
  timeChange(data,dateString) {
    let startDate= dateString[0];
    let endDate = dateString[1];
    this.setState({startDate:dateString[0],
      endDate:dateString[1],
    });
    this.getProductDetail(this.state.productName,startDate,endDate);
  }
  //渲染图标
  getPriceDetail() {
    const { priceList } = this.state;
    let myChart = echarts.init(document.getElementById('main'));
    let payTime = [], txnPrice = [], marketPrice = [],arr=[],arr1=[];
    priceList.map((item, index) => {
      payTime.push(item.date);
      txnPrice.push(item.txnPrice);
      marketPrice.push(item.marketPrice);
      arr.push(item.txnPriceChange);
      arr1.push(item.marketPriceChange);
    })
    myChart.setOption({
      tooltip: {
         trigger: 'axis',
         formatter:function(params){
           const logo = arr[params[0].dataIndex]==0?'':arr[params[0].dataIndex]>0?'▲':'▼';
           let clsName = arr[params[0].dataIndex]==0?'':arr[params[0].dataIndex]>0?'red':'green';
          return (
              params[0].name+'<br/>'+
              params[0].seriesName+' : '+params[0].data+'kg'+'&nbsp;&nbsp;'+'<span class="'+clsName+'" >'+arr[params[0].dataIndex]+'%'+logo+'&nbsp;'+'</span>'+'<br/>'+
              params[1].seriesName+' : '+params[1].data+'kg'+'&nbsp;&nbsp;'+'<span class="'+clsName+'" >'+arr[params[0].dataIndex]+'%'+'&nbsp;'+logo+'</span>'
              )
      }
      },
      legend: {
        data: ['成交价','市场成交均价'],
      },
      grid :{
        left:50,
        right:50,
        bottom:70
      },
      xAxis: {
        data: payTime,
        boundaryGap: false,
        axisLine: {
          lineStyle: {
              color: '#DEE2E6'
          }
      },
      axisLabel: {
          show: true,
          textStyle: {
              color: '#757575'
          }
      }
      },
      yAxis: {
        name: '单位（元/kg）',
        scale:true,
        axisLine: {
          show: false
      },
      axisTick: {
          show: false
      },
      splitLine: {
        lineStyle: {
            type: 'dashed'
        }
    }
      },
      series: [{
        name: '成交价',
        type: 'line',
        data: txnPrice,
        itemStyle: {
          normal: {
            color: '#4A88FF'
          }
        },
        areaStyle: {
          color: 'rgba(49,204,150,0.08)'
        },
      }, {
        name: '市场成交均价',
        type: 'line',
        data: marketPrice,
        itemStyle: {
          normal: {
            color: '#31CC96'
          }
        },
        areaStyle: {
          color: 'rgba(49,204,150,0.08)'
        },
      }]
    });
    window.onresize = myChart.resize; 
  }

  extraTime() {
    const dateFormat = 'YYYY-MM-DD';
    const {startDate,endDate} = this.state;
    let arr = [
      {id:1,name:'本日'},
      {id:2,name:'本周'},
      {id:3,name:'本月'},
      {id:4,name:'全年'},
    ]
    return (
      <div>
        <ul className={styles.extraTime}>
          {arr.map((item,index)=>{
            return <li key={item.id}>
              <Button value={item.name} className={item.id===this.state.keyId?styles.active:''}
                onClick={this.typeChange.bind(this)}>
                {item.name}
              </Button></li>
          })}
        </ul>
        <RangePicker 
        onChange={this.timeChange.bind(this)} 
        style={{ width: 251, height: 38, marginTop: 5 }} 
        value={[moment(startDate, dateFormat), moment(endDate, dateFormat)]}
        format={dateFormat}
        locale={locale}
        />
      </div>
    )
  }
  //获取时间
  typeChange(e) {
    let useTime = e.target.value, startDate = '', endDate = '';
    if (useTime === '本日') {
      startDate = moment(new Date().toLocaleDateString()).format("YYYY-MM-DD");
      endDate = startDate;
      this.setState({
        startDate:new Date().toLocaleDateString(),
        endDate:new Date().toLocaleDateString(),
        keyId:1,
      });
    } else if (useTime === '本周') {
      var now = new Date();
      var nowTime = now.getTime();
      var day = now.getDay();
      var oneDayTime = 24 * 60 * 60 * 1000;
      startDate = moment(new Date(nowTime - (day - 1) * oneDayTime)).format("YYYY-MM-DD");//显示周一
      endDate = moment(new Date(nowTime + (7 - day) * oneDayTime)).format("YYYY-MM-DD");//显示周日
      this.setState({startDate:new Date(nowTime - (day - 1) * oneDayTime),
        endDate:new Date(nowTime + (7 - day) * oneDayTime),
        keyId:2,
      });
    } else if (useTime === '本月') {
      var start = new Date();
      start.setDate(1);
      // 获取当前月的最后一天
      var date = new Date();
      var currentMonth = date.getMonth();
      var nextMonth = ++currentMonth;
      var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
      var oneDay = 1000 * 60 * 60 * 24;
      var end = new Date(nextMonthFirstDay - oneDay);
      startDate = moment(start).format("YYYY-MM-DD");
      endDate = moment(end).format("YYYY-MM-DD");
      this.setState({startDate:start,endDate:end,keyId:3,
      });
    } else if (useTime === '全年') {
      let year = new Date().getFullYear();
      startDate = year+'-01-01';
      endDate = year+'-12-31';
      this.setState({startDate:startDate,
        endDate:endDate,
        keyId:4,
      });
    }
    if(this.state.tabp==="1"){
      this.getProductDetail(this.state.productName,startDate,endDate);
    }

  }
  toggTop() {
    const {productName,startDate,endDate} = this.state;
    let start = moment(startDate).format("YYYY-MM-DD");
    let end = moment(endDate).format("YYYY-MM-DD");
    let t = this, params = { url: "/api/report/changeTop", data: { productName: productName, isTop:this.state.isTop=="true"?false:true } }
    t.setState({ loading: true })
    post(params).then(function (res) {
        if (res && res.code === 10000) {
            message.success("操作成功");
            t.setState({ loading: false})
            t.getProductDetail(productName,start,end);
        } else {
            message.warn(res.info)
        }
    }).catch = (err) => {
        console.log("==error==", err)
    }
}
  render() {
    const operations = this.extraTime();
    let proName =this.state.productName.replace(/(.{3})/,'$1 ');
    return (

      <div style={{ padding: "0 136px", marginTop: -70, minHeight: '500px', marginBottom: 42 }}>
        <div className={styles.banner}>
        <div style={{float:'left'}}>
          <span className={styles.nav}>{proName}</span>
          <Breadcrumb style={{ margin: "8px 0 20px 24px" }}>
            <Breadcrumb.Item><Link to={'/'}><Icon type="home" style={{ fontSize: '14px', color: '#4A88FF' }} /></Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={'/'} >化工指标报表</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{proName}</Breadcrumb.Item>
          </Breadcrumb>
          </div>
          <div style={{float:'right',marginTop:30,marginRight:24}}>
          <Button 
          style={{borderRadius:'19px',border:'1px solid rgba(74,136,255,1)',color:'#4A88FF'}}
          onClick={this.toggTop.bind(this)}
          >{this.state.isTop=="true"?'取消置顶':'置顶'}</Button>
          </div>
        </div>
        <div className={styles.CardBox}>
          <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)} style={{ marginTop: '31px', marginLeft: '24px', marginRight: '24px' }} tabBarExtraContent={operations}>
            <TabPane tab="成交价格统计" key="1">
              {this.state.priceList.length===0?<Alert message="本时段内暂无数据上报，请选择其他时段，或稍后再试" type="info" showIcon className={styles.alert}/>:<div id="main" style={{ width: '100%', height: 400 }}></div>}
            </TabPane>
            <TabPane tab="销量统计" key="2">
            <Volume name={this.state.productName} startDate={this.state.startDate} endDate={this.state.endDate} tabp={this.state.tabp}/>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
export default productDetails;