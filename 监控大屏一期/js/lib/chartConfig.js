define(function () {
    let mapConfig = {
        name:'chart'
    };
    //异常请求监控趋势（折线图）配置
    let abnormalRequest={
    	grid: {
	        show: false,
	        right: '8%',
	        left: '12%',
	        top: '16%',
	        bottom: '14%'
	    },
	    //节点提示内容
        tooltip: {
            backgroundColor:'#000000',
            padding:12,
        },
        legend: {
            data: ['银行认证异常', '一般认证异常'],
            textStyle: {
                color: "#ffffff"
            },
        },
        xAxis: {
            axisLabel: {
                textStyle: {
                    color: '#ffffff',
                    fontSize:10
                }
            },
            axisTick: {
                show: false,
                alignWithLabel: true,
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
            axisTick: {
                show: false
            },
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
            // name: '银行认证',
            // type: 'line',
            // data: $bankAbnormal,
            itemStyle: {
                normal: {
                    borderColor: '#007AC4',
                    borderWidth: 6
                }
            }

        }, {
            // name: '一般认证',
            // type: 'line',
            // data: $commonAbnormal,
            itemStyle: {
                normal: {
                    borderColor: '#007AC4',
                    borderWidth: 6
                }
            }

        }]
    }
    //五日查询量统计（柱状图）配置
    let Statistics={
    	grid: {
            show: false,
            right: '8%',
            left: '12%',
            top: '16%',
            bottom: '14%'
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
            textStyle: {
                fontSize: 14,
                align: 'left'
            }
        },
        legend: {
            data: ['银行认证', '一般认证'],
            textStyle: {
                color: "#ffffff"
            },
        },
        //x轴
        xAxis: {
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
            axisTick: {
                show: false,
                length: 5
            },
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

        }
    }
    //地图 配置
    let mapData={

        geo: {
            map: 'zhejiang',
            label: {
                emphasis: {
                    show: false
                }
            },
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
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: false
                }
            },
            // itemStyle: {
            //     normal: {
            //         color: 'rgba(1, 252, 204,1)',
            //         borderColor: "rgba(1, 252, 204,0.4)",
            //         shadowBlur: 10,
            //         // shadowColor: '#333'
            //     },
            //     emphasis: {
            //         borderColor: '#fff',
            //         borderWidth: 1
            //     }
            // }
        }, {
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

    }
    return {
        mapObj: mapConfig,
        abnormalRequest:abnormalRequest,
        Statistics:Statistics,
        mapData:mapData
    }
});