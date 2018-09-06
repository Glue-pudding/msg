import React from 'react';
import {post} from '@/tools/axios';
import { message ,Alert } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import "echarts/lib/component/legend";
import 'echarts/lib/component/tooltip';
import styles from './productDetails.less';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/line';
import moment from 'moment';

class Volume extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productName: '',
            volumeList: [],
            isTop: '',tabp:this.props.tabp,
        };
    }
    componentWillReceiveProps(props){
        const {startDate,endDate,tabp} =props;
        if(tabp==="2"){
            this.VolumeDetail(startDate,endDate);
        }


    }
    VolumeDetail(sTime,eTime){
        const {name} = this.props;
        let startTime=moment(sTime).format("YYYY-MM-DD");
        let endTime=moment(eTime).format("YYYY-MM-DD");
        let t=this,
        params = {url:'/api/report/getVolumeDetail',data:{productName: name,startDate:startTime,endDate:endTime}};
        t.setState({loading:true});
        post(params).then(function(res){
          if(res&&res.code===10000){
            t.setState({volumeList:res.volumeList||[],loading:false,isTop:res.isTop});
            if(res.volumeList.length!==0){
                if(res.volumeList.length>180){
                    t.getVolumeLine();
                }else{
                    t.getVolumeDetail();
                }
            }

        }else{
            message.warn((res&&res.info)||'系统出错，请联系管理员!');
          }
        }).catch=(err)=>{
          t.setState({loading:false});
        };
    }

    //销量
    getVolumeDetail() {
        let myChart = echarts.init(document.getElementById('maina'));
        const {volumeList} = this.state;
        let payTime = [],volume = [];
        volumeList.map((item,index)=>{
           payTime.push(item.date);
           volume.push(item.volume);
        }) 
        myChart.setOption({
		    legend: {
              data: ['销量'],
            },
            grid :{
              left:50,
              right:3,
              bottom:50
            },
            color: ['#4DA1FF'],
            tooltip: { trigger: 'axis'},
            xAxis: {
                type: 'category',
                data: payTime,
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
                type: 'value',
                name: '单位（kg）',
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
                },
            },
            series: [{
                name: '销量',
                data: volume,
                type: 'bar',
                barWidth: '20px',
                itemStyle: {
                  normal: {
                    //柱形图圆角，初始化效果
                    barBorderRadius:[10, 10, 0, 0],
                  }
              },
            }]
        });
    }
  //数据超过180条变成折线图
    getVolumeLine() {
        let myChart = echarts.init(document.getElementById('maina'));
        const {volumeList} = this.state;
        let payTime = [],volume = [];
        volumeList.map((item,index)=>{
           payTime.push(item.date);
           volume.push(item.volume);
        }) 
        myChart.setOption({
		    legend: {
              data: ['销量'],
            },
            grid :{
              left:50,
              right:3,
              bottom:50
            },
            color: ['#4DA1FF'],
            tooltip: { trigger: 'axis'},
            xAxis: {
                type: 'category',
                data: payTime,
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
                type: 'value',
                name: '单位（kg）',
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
                name: '销量',
                data: volume,
                type: 'line',
                barWidth: '20px',
                itemStyle: {
                  normal: {
                    //柱形图圆角，初始化效果
                    barBorderRadius:[10, 10, 0, 0],
                  }
              },
              areaStyle: {
                color:' #4DA1FF',
              },
            }]
        });
    }
    render() {
        return (
            this.state.volumeList.length===0?<Alert message="本时段内暂无数据上报，请选择其他时段，或稍后再试" type="info" showIcon className={styles.alert} />:<div id="maina" style={{ width: '100%', height: 400 }}></div>
        );
    }
}

export default Volume;