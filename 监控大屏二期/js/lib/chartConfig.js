define(function () {
    let mapConfig = {
        name:'chart'
    };
    //异常请求监控趋势（折线图）配置
    let abnormalRequest={
        color:['#1397FF','#01FCCC'],
        grid: {
            show: false,
            right: '0%',
            left: '12%',
            top: '18%',
            bottom: '10%'
        },
        //节点提示内容
        tooltip: {
            backgroundColor:'#000000',
            padding:12,
            confine:true,
            trigger: 'axis',
            textStyle: {
                fontSize: 14,
                align: 'left'
            }
        },
        legend: {
            data: ['银行认证异常', '一般认证异常'],
            textStyle: {
                color: "#ffffff"
            },
        },
        //x轴
        xAxis: {
            boundaryGap: true,
            type: 'category',
            // nameTextStyle: {
            //     color: '#ffffff'
            // },
            axisLabel: {
                textStyle: {
                    color: '#ffffff',
                    fontSize:10
                },
                interval:0
            },
            axisTick: {
                show: false,
                alignWithLabel: false,
                lineStyle:{
                    color:'#3E6CD8'
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#3E6CD8',
                    width:2
                }
            }

        },
        //y轴
        yAxis: {
            type: "value",
            
            axisTick: {
                show: false
            },
            min: 0,
            splitLine: {
                lineStyle: {
                    color: '#3E6CD8',
                    type:'dashed'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#ffffff',
                    fontSize:10
                },
                interval: '1'
            },
            axisLine: {
                show:false
            }

        },
        //图标类型，数据值设定
        series: [{
            name: '银行认证异常',
            type: 'line',
            stack:'总量',
            symbolSize:8,
            symbol:'circle',
            emphasis:{
                itemStyle:{
                    borderColor:'#fff'
                }
            },
            // itemStyle: config.abnormalRequest.series[0].itemStyle,
            // hoverAnimation: true

        }, {
            name: '一般认证异常',
            type: 'line',
            stack:'总量',
            symbolSize:8,
            symbol:'circle',
            // itemStyle: config.abnormalRequest.series[1].itemStyle,
            emphasis:{
                itemStyle:{
                    borderColor:'#fff'
                }
            }

        }]
    };
    //五日查询量统计（柱状图）配置
    let Statistics={
        color:['#1397FF','#01FCCC'],
        grid: {
            show: false,
            right: '0%',
            left: '10%',
            top: '18%',
            bottom: '10%'
        },
        //节点提示内容
        tooltip: {
            trigger: "axis",
            // axisPointer:{
            //     type:'line',
            //     label:{
            //         show:true
            //     }
            // },
            axisPointer: {
                type: 'shadow'
            },
            confine:true,
            textStyle: {
                fontSize: 14,
                align: 'left'
            }
        },
        legend: {
            data: ['银行认证', '一般认证'],
            textStyle: {
                color: "#ffffff",
                fontSize:12
                
            }
        },
        //x轴
        xAxis: {
            boundaryGap:true,
            type: 'category',
            nameTextStyle: {
                color: '#ffffff'
            },
            axisLabel: {
                textStyle: {
                    color: '#ffffff',
                    fontSize:10
                }
            },
            axisTick: {
                lineStyle:{
                    color:'#3E6CD8',
                    width:2
                }
            },
            axisLine: {
                lineStyle: {
                    color: ['#3E6CD8']
                }
            }

        },
        //y轴
        yAxis: {
            show: true,
            type: "value",
            nameTextStyle: {
                color: "#ffffff"
            },
            axisTick: {
                show: false,
                length: 5
            },
            boundaryGap: 'false',
            splitNumber: 3,
            min: 0,
            splitLine: {
                show: 'true',
                lineStyle: {
                    color: '#034B79',
                    type:'dashed'
                }
            },
            axisLabel: {
                color:'#ffffff',
                fontSize:10
            },
            axisLine: {
                show:false,
                lineStyle: {
                    color: '#3E6CD8'
                }
            } 

        },
        //图标类型，数据值设定
        series: [{
            name: '银行认证',
            type: 'bar',
            barWidth: '20',
            hoverAnimation: true

        }, {
            name: '一般认证',
            type: 'bar',
            barGap: '1%',
            barWidth: '20',
            hoverAnimation: true

        }]
    };
    //地图 配置
    let mapData={
        // color:['rgba(19,151,255,0.24)','rgba(19,151,255,0.88)','#01FCCC'],
        title: {
            text: '省\n内\n累\n积\n查\n询\n次\n数',
            textStyle:{
                width:'20px',
                height:'100px',
                fontSize:14,
                color:'#fff'
            },
            top:'73%',right:'75em'
        },
        visualMap: {
                name: '查询数据量',
                min: 0,
                align:'left',
                text: ['高', '低'],
                textStyle: {
                    color: '#ffffff'
                },
                inRange: {
                    color: ['rgba(19,151,255,0.24)','rgba(19,151,255,0.88)']
                },
                left:"right",
                calculable : true,
                borderColor:"#f00",
            },
        tooltip: {
            trigger: "item",
            // axisPointer:{
            //     type:'line',
            //     label:{
            //         show:true
            //     }
            // },
            padding:5,
            confine:true,
            formatter: function(param, ticket, callback) 
             {
                 //用定时器模拟异步事件
                   // setTimeout(function() {
                    var res='',NameMap='';
                    // clearInterval(mTime);
                    if (param.data.time==undefined) {
                        res=param.data.name+':'+param.data.value;
                    }else{
                        if(param.data.name){
                            NameMap=param.data.name.substring(0,1)+'**';
                        }
                        res = '时间 ：'+param.data.time+ '<br/>'+'查询人 ：'+ NameMap + '<br/>'+'查询地区 ：'+ param.data.address + '<br/>' +'查询方式 ：'+param.data.type;
                    };
                   // }, 1000);
                   return res;//内容还没返回时显示的内容
              },
            textStyle: {
                fontSize: 10,
                align: 'left'
            }
        },
        geo: {
            map: 'zhejiang',
            label: {
                emphasis: {
                    show: false
                }
            },
            zoom:1.1,
            itemStyle: {
                normal: {
                    areaColor: '#323c48',
                    borderColor: '#111'
                },
                emphasis: {
                    areaColor: '#2a333d'
                }
            }
        },
        series: [{
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: 10,
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: false
                }
            },
            itemStyle: {
                normal: {
                    color: '#01FCCC',
                    borderColor: "rgba(1, 252, 204,0.4)",
                    borderWidth:8
                },
                emphasis: {
                    borderColor: 'rgba(1,252,204,1)',
                    borderWidth: 1
                }
            },
            zlevel: 1
        }, {
            type: 'map',
            zoom:1.1,
            name:'省内累计查询次数',
            mapType: 'zhejiang', // 自定义扩展图表类型
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        color:'#fff'
                    },
                    textStyle: {
                        fontSize: '8px',
                    },
                    borderWidth: 1, //省份的边框宽度
                    borderColor: '#00bfff'
                }, //地图背景颜色
                emphasis: {
                    label: {
                        show: true,
                        color:'#fff'
                    },

                    areaColor:'#1397FF',
                },

            }
        }]
    };
    return {
        mapObj: mapConfig,
        abnormalRequest:abnormalRequest,
        Statistics:Statistics,
        mapData:mapData
    }
});