/**
 * Created by syy on 2017/8/23.
 */
var urlPrefix="http://10.8.45.10:8080/ownership_webtransfer/";
//var urlPrefix="https://183.131.202.165:8080/ownership_webtransfer/";
// var urlPrefix="http://localhost:8086/ownership_webtransfer/";
var sessionId= localStorage['sessionId'];
var timer=null;
var opOneHeight=$(document).height();
var brokenLine=echarts.init(document.getElementById('brokenLine'));
var columnar=echarts.init(document.getElementById('columnar'));
var pie=echarts.init(document.getElementById('pie'));
var mapView=echarts.init(document.getElementById('mapView'));
var statis=echarts.init(document.getElementById('statis'));
if(sessionId==undefined){
    window.location='../index.html';
}
//根据坐标查询城市名
// function landMarkSearch(val){
//     for(var cityName in geoCoordMap){
//         val=val.toString();
//         geoCoordMap[cityName]=geoCoordMap[cityName].toString();
//         if(val==geoCoordMap[cityName]){
//             console.log(cityName);
//         }
//     }
// }
// var landMark=[114.08,22.2];
// landMarkSearch(landMark);

//节点监控;
$.ajax({
    type:'post',
    data:{SessionId:sessionId},
    url:urlPrefix+'api/monitor/getAllUnusualTradeInfo',
    success:function(msg){
        var $nodes=msg.data.AbnormalList;
        var html="";
        $.each($nodes, function(i, v) {
            var abnormalType = "";
            if(v.AbnormalType=="DataFormatError"){
                abnormalType="数据格式错误";
            }else if(v.AbnormalType=="IllegalOperator"){
                abnormalType="数据违规操作";
            }else if(v.AbnormalType=="LinkError"){
                abnormalType="数据通讯异常";
            }
            html+=`<li><span>${1 + i++}</span><span>${v.SubscriberName}</span><span>${v.DataSetName}</span><span>${abnormalType}</span></li>`;
        });
        var monitoring_area =document.getElementById('tab0');
        var tab1 = document.getElementById('tab1');
        var tab2 = document.getElementById('tab2');
        tab1.innerHTML=html;
        tab2.innerHTML=tab1.innerHTML;
        var time2 = 50;
        function scrollUp2(){
            if(monitoring_area.scrollTop>=tab1.offsetHeight){
                monitoring_area.scrollTop=0;
            }else{
                 //monitoring_area.scrollTop=monitoring_area.scrollTop+28;
                 // monitoring_area.scrollTop=monitoring_area.scrollTop+56;
                 monitoring_area.scrollTop++;
            }
        }
        var mytimer2=setInterval(scrollUp2,time2);
        monitoring_area.onmouseover=function(){
            clearInterval(mytimer2);
        };
        monitoring_area.onmouseout=function(){
            mytimer2=setInterval(scrollUp2,time2);
        };
    }
});

//基本数据 + 实时交易
$.ajax({
    type:'post',
    data:{SessionId:sessionId},
    url:urlPrefix+'api/monitor/getAllConfirmInfo',
    success:function(msg){
        $('.totalAuthDataSets-count').html(msg.data.TotalAuthDataSets);
        $('.totalTrade-count').html(msg.data.TotalTrade);
        $('.activeChannel-count').html(msg.data.TotalActiveTrade);
        $('.singularNode-count').html(msg.data.TotalAbnormalTrade);
    }
});

//数据操作行为统计
$.ajax({
    type:'post',
    data:{SessionId:sessionId},
    url:urlPrefix+'api/monitor/getOptsCountByReq',
    success:function(msg){
      var $statis = msg.data.DataOptsCount;
      $statis.sort(function(a,b){
        return a.index-b.index;
      });
      var $totalnormal=[];
      var $totaldataName=[];
      $.each($statis,function(i,v){
        $totalnormal.push(v.value);
        $totaldataName.push(v);
     }); 
      //显示数据
      var option11 = {
        grid: {
            show:false,
            right:'14%',
            left:'20%',
            top:'5%',
            bottom:'5%'
          },
        xAxis: {
            show:false,
            type: 'value'
          }, 
        yAxis: {
            type: 'category',
            inverse: true,
            data: $totalnormal,
            axisLabel:{
                inside:false,
                textStyle:{
                    color:'#ffffff'
                },
                interval: 0
               
            },
            axisTick:{
                show:false
             },
            axisLine:{
                lineStyle:{
                    color:['#007AC4']
                }
             }
          },
        series: [
              {
                type: 'bar',
                data: $totaldataName,
                itemStyle:{
                 normal:{
                    color:'#094770',
                    borderColor:'#007AC4',
                    borderWidth:1,
                    label:{
                            show: true,   //显示文本
                            position: 'insideLeft',  //数据值位置
                            textStyle:{
                                color:'#fff',
                            },
                            formatter:function (a) {
                                return a.data.name
                        }
                     }
                 }
              }
            },
        ]
    };
            if(opOneHeight<899){
                statis.clear();;
                option11.grid.bottom='14%';
                statis.setOption(option11);
                $(window).resize(function(){
                    statis.clear();
                    option11.grid.bottom='14%';
                    statis.setOption(option11);
                    window.location.reload();
                });
            }else if(opOneHeight>=899){
                $(window).resize(function(){
                    statis.clear();
                    option11.grid.bottom='10%';
                    statis.setOption(option11);
                    window.location.reload();
                });
            
            }
     statis.setOption(option11,true);
 }
});
//交易动态
$.ajax({
    type:'post',
    data:{SessionId:sessionId},
    url:urlPrefix+'api/monitor/getAllOrderInfo',
    success:function(msg){
        var $orders=msg.data.OrderList;
        var html="";
        $.each($orders, function(i, v) {
            html+=`<li>用户 <span>${v.SubscriberName}</span>  购买了<span> ${v.DataSetName}</span></li>`;
        });
        var area =document.getElementById('scrollBox');
        var con1 = document.getElementById('con1');
        var con2 = document.getElementById('con2');
        con1.innerHTML=html;
        con2.innerHTML=con1.innerHTML;
        function scrollUp(){
            if(area.scrollTop>=con1.offsetHeight){
                area.scrollTop=0;
            }else{
                area.scrollTop++
            }
        }
        var time = 50;
        var mytimer=setInterval(scrollUp,time);
        area.onmouseover=function(){
            clearInterval(mytimer);
        };
        area.onmouseout=function(){
            mytimer=setInterval(scrollUp,time);
        };
    }
});

//监控动态（折线图）
$.ajax({
        type:'post',
        data:{SessionId:sessionId},
        url:urlPrefix+'api/monitor/getNumOfTotalUnusualTrade',
        success:function(msg){
            var $abnormalList=msg.data.AbnormalList;
            var $totalAbnormal=[];
            var $time=[];
            $.each($abnormalList,function(i,v){
                $totalAbnormal.push(v.TotalAbnormal);
                $time.push(v.Time);
            });

            var option1={
                grid:{
                    show:false,
                    right:'14%',
                    left:'12%',
                    top:'16%',
                    bottom:'10%'
                },
                //节点提示内容
                tooltip:{
                    trigger:"axis",
                    axisPointer:{
                        type:'line',
                        label:{
                            show:true
                        }
                    },
                    textStyle:{
                        fontSize:14,
                        align:'left'
                    }
                },
                //x轴
                xAxis:{
                    show:true,
                    name:'时间',
                    type: 'category',
                    data:$time,
                    nameTextStyle:{
                        color:'#ffffff'
                    },
                    axisLabel:{
                        textStyle:{
                            color:'#ffffff'
                        }
                    },
                    axisTick:{
                        show:false,
                        alignWithLabel:true
                    },
                    axisLine:{
                        lineStyle:{
                            color:['#007AC4']
                        }
                    }

                },
                //y轴
                yAxis:{
                    show:true,
                    name:"数量",
                    type:"value",
                    nameTextStyle:{
                        color:"#ffffff"
                    },
                    axisTick:{
                        show:false,
                        length:5
                    },
                    boundaryGap:'false',
                    splitNumber:3,
                    min:0,
                    max:20,
                    splitLine:{
                        show:'true',
                        lineStyle:{
                            color:['#034B79']
                        }
                    },
                    axisLabel:{
                        inside:false,
                        textStyle:{
                            color:'#ffffff'
                        },
                        interval:'1'
                    },
                    axisLine:{
                        lineStyle:{
                            color:['#007AC4']
                        }
                    }

                },
                //图标类型，数据值设定
                series:[
                    {
                        name:'数量',
                        type:'line',
                        data:$totalAbnormal,
                        itemStyle:{
                            normal:{
                                borderColor:'#007AC4',
                                borderWidth:6
                            }
                        },
                        lineStyle:{
                            normal:{
                                color:'#034B79'
                            }
                        },
                        hoverAnimation:true

                    }
                ]
            };
            if(opOneHeight<899){
                brokenLine.clear();
                option1.grid.bottom='14%';
                brokenLine.setOption(option1);
                $(window).resize(function(){
                    brokenLine.clear();
                    option1.grid.bottom='14%';
                    brokenLine.setOption(option1);
                    window.location.reload();
                });
            }else if(opOneHeight>=899){
                $(window).resize(function(){
                    brokenLine.clear();
                    option1.grid.bottom='10%';
                    brokenLine.setOption(option1);
                    window.location.reload();
                });
                brokenLine.setOption(option1);
            }
        }
    });

//异常类别统计（柱状图）
$.ajax({
    type:'post',
    data:{SessionId:sessionId},
    url:urlPrefix+'api/monitor/getUnusualTradeType',
    success:function(msg){
        var $abnormity=msg.data.AbnormalList;
        var totalAbnormals=[];
        var abnormalTypes=[];
        $.each($abnormity,function(i,v){
            totalAbnormals.push(v.TotalAbnormal);
            if(v.AbnormalType=="DataFormatError"){
                v.AbnormalType="数据格式错误";
            }else if(v.AbnormalType=="IllegalOperator"){
                v.AbnormalType="数据违规操作";
            }else if(v.AbnormalType=="LinkError"){
                v.AbnormalType="数据通讯异常";
            }
            abnormalTypes.push(v.AbnormalType);
        });
        var totalAbnormals_max=Math.max.apply(null,totalAbnormals)+1;
        var option2={
            grid:{
                top:'10%',
                right:'10%',
                left:'12%',
                bottom:'12%'
            },
            //节点提示内容
            tooltip:{
                trigger:"axis",
                axisPointer:{
                    type:'line',
                    label:{
                        show:true
                    }
                },
                textStyle:{
                    fontSize:12,
                    align:'left'
                }
            },
            //x轴
            xAxis:{
                show:true,
                type: 'category',
                data:abnormalTypes,
                axisLabel:{
                    textStyle:{
                        color:'#ffffff'
                    }
                },
                axisTick:{
                    show:false,
                    alignWithLabel:true
                },
                axisLine:{
                    lineStyle:{
                        color:['#007AC4']
                    }
                }

            },
            //y轴
            yAxis:{
                show:true,
                type:"value",
                nameTextStyle:{
                    color:"#ffffff"
                },
                axisTick:{
                    show:false,
                    length:5
                },
                splitNumber:4,
                min:0,
                max:totalAbnormals_max,
                splitLine:{
                    show:'true',
                    lineStyle:{
                        color:['#034B79']
                    }
                },
                axisLabel:{
                    inside:false,
                    textStyle:{
                        color:'#ffffff'
                    }
                },
                axisLine:{
                    lineStyle:{
                        color:['#007AC4']
                    }
                }

            },
            //图标类型，数据值设定
            series:[
                {
                    name:'数量',
                    type:'bar',
                    data:totalAbnormals,
                    itemStyle:{
                        normal:{
                            color:'#094770',
                            borderColor:'#007AC4',
                            borderWidth:1,
                            opacity:0.8
                        }
                    },
                    barWidth:40
                }
            ]
        };
        if(opOneHeight<899){
            columnar.clear();
            option2.grid.right='4%';
            columnar.setOption(option2);
            $(window).resize(function(){
                columnar.clear();
                option2.grid.right='4%';
                columnar.setOption(option2);
                window.location.reload();
            });
        }else if(opOneHeight==900){
            $(window).resize(function(){
                columnar.clear();
                option2.grid.right='10%';
                columnar.setOption(option2);
                window.location.reload();
            });
            columnar.setOption(option2);
        }
        columnar.setOption(option2);
    }
});

//商品分类（南丁格尔玫瑰圆形）
$.ajax({
    type:'post',
    data:{SessionId:sessionId},
    url:urlPrefix+'api/monitor/getAllConfirmType',
    success:function(msg){
        var $itemTypes=msg.data;
        var $itemTypes_name=[];
        var $itemTypes_obj={};
        var $itemTypes_obj_arr=[];
        $.each($itemTypes,function(i,v){
            if(i=="FinanceDataSets"){
                i="金融类";
                $itemTypes_name.push(i);
                $itemTypes_obj={name:i,value:v};
                $itemTypes_obj_arr.push($itemTypes_obj);
            }else if(i=="GovernmentDataSets"){
                i="政务类";
                $itemTypes_name.push(i);
                $itemTypes_obj={name:i,value:v};
                $itemTypes_obj_arr.push($itemTypes_obj);
            }else if(i=="MedicalDataSets"){
                i="医疗类";
                $itemTypes_name.push(i);
                $itemTypes_obj={name:i,value:v};
                $itemTypes_obj_arr.push($itemTypes_obj);
            }else if(i=="AIDataSets"){
                i="AI类 ";
                $itemTypes_name.push(i);
                $itemTypes_obj={name:i,value:v};
                $itemTypes_obj_arr.push($itemTypes_obj);
            }else if(i=="ElectronicBusinessDataSets"){
                i="电商类";
                $itemTypes_name.push(i);
                $itemTypes_obj={name:i,value:v};
                $itemTypes_obj_arr.push($itemTypes_obj);
            }else if(i=="TrafficDataSets"){
                i="交通类";
                $itemTypes_name.push(i);
                $itemTypes_obj={name:i,value:v};
                $itemTypes_obj_arr.push($itemTypes_obj);
            }else if(i=="ServiceDataSets"){
                i="服务类";
                $itemTypes_name.push(i);
                $itemTypes_obj={name:i,value:v};
                $itemTypes_obj_arr.push($itemTypes_obj);
            }
        });
        var option3 = {
            tooltip : {
                trigger: 'item',
                formatter: "{b}&nbsp;,&nbsp;{c}%"
            },
            legend: {
                data:$itemTypes_name,
                x:'center',
                bottom:0,
                itemWidth:10,
                itemHeight:10,
                textStyle:{
                    color:['#ffffff']
                }
            },
            calculable : true,
            series : [
                {
                    name:'比例：',
                    type:'pie',
                    radius : [20, 60],
                    center : ['50%', '40%'],
                    roseType : 'radius',
                    label:{
                        normal:{
                            formatter: '{c}%'
                        }
                    },
                    data:$itemTypes_obj_arr
                }
            ]
        };
        if(opOneHeight<899){
            pie.clear();
            option3.series[0].radius=[20,50];
            pie.setOption(option3);
            $(window).resize(function(){
                pie.clear();
                pie.setOption(option3);
                window.location.reload();
            });
        }else if(opOneHeight>=899) {
            $(window).resize(function () {
                pie.clear();
                option3.series[0].radius = [20, 90];
                pie.setOption(option3);
                window.location.reload();
            });
        }
        pie.setOption(option3);
    }
});

//地图
var name = 'china';
var nameTab='';
var pro_series=[];
var level=0;
//1、授权用户分布
$.ajax({
    type:'post',
    data:{SessionId:sessionId},
    url:urlPrefix+'api/monitor/getNumOfProvinces',
    success:function(msg){
        var distribution=msg.data.Distribution;
        var distribution_new=[{name:"南海诸岛",value:0, itemStyle:{normal:{opacity:0,label:{show:false}}}}];
        for(var k in distribution){
            distribution_new.push({name:k,value:(distribution[k]*1000),label:{show:true, normal:{
                show:true,
                textStyle:{
                    color:'#fff'
                }
            }, emphasis:{
                show:true,
                textStyle:{
                    color:'#fff'
                }
            }}});
        }
        var option4={
            tooltip:{
                trigger:'item',
                formatter:function(data){
                    if(!isNaN(data.value)){
                        return '城市名：'+data.name+'<br>用户量：'+data.value;
                    }
                }

            },
            legend:{
                orient:'horizontal',
                show:true
            },
            visualMap:{
                min:0,
                max:1000,
                orient:'horizontal',
                seriesIndex:0,
                left:30,
                bottom:30,
                text:['高','用户分布：低'],
                textStyle:{
                    color:'#ffffff'
                },
                inRange:{
                    color:['#F4D136','#DA1D0A']
                }
            },
            geo:{
                type:'map',
                map:'china',
                regions: [{name: '南海诸岛', value: 0, itemStyle: {normal: {opacity: 0, label: {show: false}}}}],
                zlevel:0,
                aspectScale:0.8,
                zoom:1.2,
                center:[104,35.5],
                label:{
                    normal:{
                        show:false,
                        color:'#fff'
                    },
                    emphasis:{
                        textStyle:{
                            color:'#fff'
                        },
                        show:false
                    }
                },
                itemStyle:{
                    normal:{
                        areaColor:'transparent',
                        borderColor:'#007ac4',
                        borderWidth:1,
                        show:false
                    },
                    emphasis:{
                        show:false
                    }
                }
                //,animation:false
            },
            series:[
                {
                    name:'用户分布',
                    type:'map',
                    mapType:'china',
                    center:[104,35.5],
                    zlevel:3,
                    aspectScale:0.8,
                    zoom:1.2,
                    showLegendSymbol: false,//去除省会城市的点*-
                    // label:{
                    //     show:true,
                    //     normal:{
                    //         show:true,
                    //         textStyle:{
                    //             color:'#fff'
                    //         }
                    //     },
                    //     emphasis:{
                    //         show:true,
                    //         textStyle:{
                    //             color:'#fff'
                    //         }
                    //     }
                    // },
                    itemStyle:{
                        normal:{
                            //areaColor:'transparent',
                            areaColor:'rgba(255,255,255,0.04)',
                            borderColor:'#007ac4',
                            borderWidth:1
                            ,show:true
                        },
                        emphasis:{
                            show:false
                        }
                    },
                    animation:false,
                    data:distribution_new
                }
            ]
        };
        mapView.setOption(option4);
        //数据银行和授权用户切换 ------ 授权用户
        // $('#t1').click(function(){
        //     clearInterval(timer);
        //     $('#t1').addClass('sel');
        //     $('#t2').removeClass('sel');
        //     mapView.dispose();
        //     mapView=echarts.init(document.getElementById('mapView'));
        //     mapView.setOption(option4,true);
        //     mapView.on('click',reRender);
        //     level=0;
        //     if(!$('.tooltips').hasClass('hide')){
        //         $('.tooltips').addClass('hide');
        //     }
        // });

        //数据银行分布+授权用户
            mapView.dispose();
            mapView=echarts.init(document.getElementById('mapView'));
            mapView.setOption(option4,true);
            mapView.on('click',reRender);
            level=0;
            if(!$('.tooltips').hasClass('hide')){
                $('.tooltips').addClass('hide');
             };
            $.ajax({
                type:'post',
                data:{SessionId:sessionId},
                url:urlPrefix+'api/monitor/getBankInfoOfProvinces',
                success:function(msg){
                    var distribution=msg.data.Distribution;
                    var distribution_new=[{name:"南海诸岛",value:0, itemStyle:{normal:{opacity:0,label:{show:false}}}}];
                    for(var k in distribution){
                        distribution_new.push({name:k,value:(distribution[k]*1000),label:{show:true, normal:{
                            show:true,
                            textStyle:{
                                color:'#fff'
                            }
                        }, emphasis:{
                            show:true,
                            textStyle:{
                                color:'#fff'
                            }
                        }}});
                    }
                    var bankInfos=msg.data.BankInfos;
                    var industryData=[];//行业数据
                    var standardData=[];//通用数据
                    bankInfos[0].symbolSize=[35,45];
                    for(var i=0;i<bankInfos.length;i++){
                        if(bankInfos[i].BankType=="行业数据银行"){
                            bankInfos[i]["name"]="行业型数据银行";
                            bankInfos[i]["value"]=([bankInfos[i].Latitude,bankInfos[i].Longitude]);
                            industryData.push(bankInfos[i]);
                        }else{
                            bankInfos[i]["name"]="通用型数据银行";
                            bankInfos[i]["value"]=([bankInfos[i].Latitude,bankInfos[i].Longitude]);
                            standardData.push(bankInfos[i]);
                        }
                    }
                    var option5={
                        tooltip:{
                            trigger:'item',
                            formatter:function(data){
                                if(!isNaN(data.value)){
                                    return '城市名：'+data.name+'<br>交易量：'+data.value;
                                }
                            }

                        },
                        legend:{
                            show:true,
                            orient:'vertical',
                            left:30,
                            bottom:40,
                            zlevel:4,
                            itemWidth:22,
                            itemHeight:32,
                            data:[
                                {
                                    name:'通用型数据银行',
                                    icon:'image://../images/point_L.png',
                                    textStyle:{
                                        color:'#fff',
                                        fontSize:14
                                    }
                                },
                                {
                                    name:'行业型数据银行',
                                    icon:'image://../images/point_Z.png',
                                    textStyle:{
                                        color:'#fff',
                                        fontSize:14
                                    }
                                }
                            ]
                        },
                        visualMap:{
                            show:true,
                            min:0,
                            max:1000,
                            orient:'horizontal',
                            seriesIndex:0,
                            text:['高','用户分布：低'],
                            textStyle:{
                                color:'#ffffff'
                            },
                            inRange:{
                                color:['#F4D136','#DA1D0A']
                            }
                        },
                        geo:{
                            type:'map',
                            map:'china',
                            regions: [{name: '南海诸岛', value: 0, itemStyle: {normal: {opacity: 0, label: {show: false}}}}],
                            zlevel:0,
                            aspectScale:0.8,
                            zoom:1.2,
                            center:[104,35.5],
                            label:{
                                normal:{
                                    show:false,
                                    color:'#fff'
                                },
                                emphasis:{
                                    textStyle:{
                                        color:'#fff'
                                    },
                                    show:false
                                }
                            },
                            itemStyle:{
                                normal:{
                                    areaColor:'transparent',
                                    borderColor:'#007ac4',
                                    borderWidth:1,
                                    show:false
                                },
                                emphasis:{
                                    show:false
                                }
                            }
                        },
                        series:[
                            {
                                name:'交易量分布',
                                type:'map',
                                mapType:'china',
                                center:[104,35.5],
                                zlevel:3,
                                aspectScale:0.8,
                                zoom:1.2,
                                showLegendSymbol: false,//去除省会城市的点*-
                                itemStyle:{
                                    normal:{
                                        areaColor:'rgba(255,255,255,0.04)',
                                        borderColor:'#007ac4',
                                        borderWidth:1
                                        ,show:true
                                    },
                                    emphasis:{
                                        show:false
                                    }
                                },
                                animation:false,
                                data:distribution_new
                            },
                            //通用数据银行标记
                            {
                                name:'通用型数据银行',
                                type: 'scatter',
                                silent:true,
                                coordinateSystem: 'geo',
                                zlevel: 4,
                                symbol:'image://../images/point_L.png',
                                symbolSize:[25,35],
                                label: {
                                    normal: {
                                        show : true,
                                        backgroundColor:'rgba(0,0,0,0.8)',
                                        position:'bottom',
                                        distance:-1,
                                        formatter:'{b}',
                                        textStyle: {
                                            color: '#fff',
                                            fontSize:14
                                        },
                                        padding:[4,10],
                                        borderRadius:10
                                    },
                                    emphasis: {
                                        show: true,
                                        position:'bottom',
                                        formatter: '{b}',
                                        textStyle: {
                                            color: '#fff'
                                        }
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#9932CC'
                                    }
                                },
                                data:standardData
                            },
                            //行业数据银行标记
                            {
                                name:'行业型数据银行',
                                type: 'scatter',
                                silent:true,
                                coordinateSystem: 'geo',
                                zlevel: 4,
                                symbol:'image://../images/point_Z.png',
                                symbolSize: [25,35],
                                label: {
                                    normal: {
                                        show : true,
                                        backgroundColor:'rgba(0,0,0,0.8)',
                                        position:'bottom',
                                        distance:-1,
                                        formatter:'{b}',
                                        textStyle: {
                                            color: '#fff',
                                            fontSize:14
                                        },
                                        padding:[4,10],
                                        borderRadius:10
                                    },
                                    emphasis: {
                                        show: true,
                                        position:'bottom',
                                        formatter: '{b}',
                                        textStyle: {
                                            color: '#fff'
                                        }
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#9932CC'
                                    }
                                },
                                data:industryData
                            },
                            //待插入的隐藏 饼图
                            {
                                type:'pie',
                                name:'认证牌照',
                                center:['88%','48%'],
                                radius:['8%','12%'],
                                zlevel:5,
                                label:{
                                    normal:{
                                        formatter: '{b}',
                                        align:'left',
                                        verticalAlign:'bottom'
                                    },
                                    emphasis:{
                                        show:true,
                                        textStyle:{
                                            fontWeight:'bold'
                                        }
                                    }
                                },
                                labelLine:{
                                    normal:{
                                        show:true,
                                        length:10,
                                        length2:14
                                    }
                                },
                                data:[]
                            }
                        ]
                    };
                    mapView.setOption(option5,true);
                    bankInfos[0].symbolSize=[25,35];
                    mapView.on('click',reRender);
                    level=0;
                    var cityPosInit=mapView.convertToPixel('geo',[bankInfos[0].Latitude,bankInfos[0].Longitude]);
                    //tooltips 循环显示
                    if($('.tooltips').hasClass('hide')) {
                        $('.tooltips').removeClass('hide');
                        $('.tooltips').css("left",cityPosInit[0]-142+"px");
                        $('.tooltips').css("top",cityPosInit[1]-50+"px");
                        $('.bankSize').html(bankInfos[0].BankLevel);
                        $('.dataSize').html(bankInfos[0].TotalDataSize);
                    }
                    var i=1;
                    var value={};
                    timer=setInterval(function(){
                        if(i<bankInfos.length){
                            var landMark=[bankInfos[i].Latitude,bankInfos[i].Longitude];
                            var bankType=bankInfos[i].BankType;
                            bankInfos[i].symbolSize=[35,45];
                            var cityPos= mapView.convertToPixel('geo',landMark);
                            $('.tooltips').css("left",cityPos[0]-142+"px");
                            $('.tooltips').css("top",cityPos[1]-50+"px");
                            //tips提示 数据注入
                            $('.bankSize').html(bankInfos[i].BankLevel);
                            $('.dataSize').html(bankInfos[i].TotalDataSize);
                            // 饼图 数据注入
                            if(bankType=="通用数据银行"){
                                option5.title={
                                    show:true,
                                    text:'已认证',
                                    left:'85%',
                                    top:'46%',
                                    zlevel:5,
                                    textStyle:{
                                        color:'#ffffff',
                                        fontSize:16
                                    }
                                };
                               var DataTypeComponents=[];
                               for(var name in bankInfos[i].DataTypeComponent){
                                   value=(bankInfos[i].DataTypeComponent)[name];
                                   DataTypeComponents.push({name,value});
                               }
                                option5.series[3].data=DataTypeComponents;
                                mapView.setOption(option5);
                            }else{
                                option5.title={
                                    show:true,
                                    borderWidth:0,
                                    text:''
                                };
                                option5.series[3].data=[];
                                mapView.setOption(option5);
                            }
                            bankInfos[i].symbolSize=[25,35];
                            i=i+1;

                        }else{
                            i=0;
                        }
                    },3000);

                }
            });
    }
});

//3、省份地图
//---------省份切换跳转
function showProvince() {
    clearInterval(timer);
    if(!$('.tooltips').hasClass('hide')){
        $('.tooltips').addClass('hide');
    }
    //获取对应省份线集容器
    if (nameTab=='zhejiang') {
        pro_series=zhejiang_series;
    }else{
        pro_series=[];
    }
    mapView.clear();
    mapView.setOption(
        prov = {
            visualMap: {//省内地图图例visualMap
                type:'piecewise',
                orient:'horizontal',
                left:30,
                bottom:30,
                textStyle:{
                    color:'#ffffff'
                },
                pieces:[
                    {min: 0, max: 10, label: '交易过程'},//value默认10
                    {min: 11, max: 20, label: '授权过程'},//value默认20
                    {min: 90, max: 110, label: '数据银行'}//value默认100
                ],
                color: ['#A366DC','#EB6607','#2BB269'],//渲染线集颜色，默认全部数据
                show:true
            },
            geo:{   //省内xy经纬度
                type: 'map',
                map: name,
                zlevel:1,
                aspectScale:0.8,
                zoom:0.9,
                label: {
                    normal: {
                        show: false,
                        textStyle: {
                            color: '#fff',
                            fontSize:14
                        }
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            color: '#fff',
                            fontSize:14
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        borderColor:'#007ac4',
                        borderWidth:1,
                        areaColor:'rgba(255,255,255,0.04)',
                        show:true
                    },
                    emphasis: {
                        show:false
                    }
                },
                animation: false

            },
            series: pro_series//pro_series为对应线图容器名
        });

}
function reRender(params){
    clearInterval(timer);
    if(!$('.tooltips').hasClass('hide')){
        $('.tooltips').addClass('hide');
    }
    localStorage['cityName']=params.name;
    var city = params.name;
    //根据level等级判定地图切换省内或全国
    if(level==0){
        for(i=0;i<(provincesText.length+1);i++){
            if(city==provincesText[i]){
                name=city;
                nameTab=provinces[i];
                showProvince();
                break;
            }
            level=1;
        }}
}
mapView.on('click',reRender);
var cityName=localStorage['cityName'];
// $.ajax({
//     type:'post',
//     data:{SessionId:sessionId,Province:cityName},
//     url:urlPrefix+'api/monitor/getSubLinksByProvince',
//     success:function(msg){
//     }
// });
var provinces = ['shanghai', 'hebei','shanxi','neimenggu', 'liaoning','jilin','heilongjiang','jiangsu','zhejiang','anhui','fujian','jiangxi','shandong','henan','hubei', 'hunan','guangdong','guangxi','hainan','sichuan','guizhou',
    'yunnan','xizang','shanxi','gansu','qinghai','ningxia', 'xinjiang', 'beijing', 'tianjin', 'chongqing', 'xianggang', 'aomen','taiwan'];
var provincesText = ['上海', '河北', '山西', '内蒙古', '辽宁', '吉林','黑龙江','江苏', '浙江', '安徽', '福建', '江西', '山东','河南', '湖北', '湖南', '广东', '广西', '海南', '四川', '贵州',
    '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆', '北京', '天津', '重庆', '香港', '澳门','台湾'];

//mapbtab标签切换
var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = geoCoordMap[dataItem[0].name];
        var toCoord = geoCoordMap[dataItem[1].name];
        if (fromCoord && toCoord) {
            res.push([
                {
                    coord:fromCoord

                },
                {
                    coord: toCoord,
                    value: dataItem[1].value
                }
            ]);
        }
    }
    return res;
};

//浙江省内线集
var zhejiangData = [
    [{name:'杭州'},{name:'嘉兴',value:10}],
    [{name:'杭州'},{name:'宁波',value:20}],
    [{name:'杭州'},{name:'宁波测试点一',value:20}],
    [{name:'杭州'},{name:'宁波测试点二',value:20}],
    [{name:'杭州'},{name:'宁波测试点三',value:20}],
    [{name:'杭州'},{name:'温州',value:20}],
    [{name:'杭州'},{name:'台州',value:20}],
    [{name:'杭州'},{name:'丽水',value:10}],
    [{name:'杭州'},{name:'衢州',value:10}],
    [{name:'杭州'},{name:'衢州测试点一',value:10}],
    [{name:'杭州'},{name:'衢州测试点二',value:10}],
    [{name:'杭州'},{name:'湖州',value:10}],
    [{name:'杭州'},{name:'湖州测试点一',value:10}],
    [{name:'杭州'},{name:'湖州测试点二',value:10}],
    [{name:'杭州'},{name:'金华',value:10}],
    //[{name:'杭州'},{name:'金华测试点一',value:10}],
    [{name:'杭州'},{name:'金华测试点二',value:10}],
    [{name:'杭州'},{name:'金华测试点三',value:10}],
    [{name:'杭州'},{name:'金华测试点四',value:10}]
];
var zhejiang_series = [];//浙江线集容器

//以杭州为中心的线集内容
[['杭州', zhejiangData]].forEach(function (item, i) {
    zhejiang_series.push(
        {
            type: 'lines',//线条
            name:'线条',
            zlevel: 2,
            effect: {
                show: true,
                period: 4,
                trailLength: 0.02,
                symbol:'circle',
                symbolSize: 10
            },
            lineStyle: {
                normal: {
                    width: 1,
                    curveness: 0.3
                }
            },
            data: convertData(item[1])
        },
        {
            type: 'effectScatter',
            legendHoverLink:true,
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
                period:4,
                brushType: 'stroke',
                scale: 2
            },
            label: {
                normal: {
                    show: false,
                    position: 'right',
                    offset:[5, 0],
                    formatter: '{b}'
                },
                emphasis: {
                    show: true
                }
            },
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
                normal: {
                    show: false,
                    color: '#fff'
                }
            },
            data: item[1].map(function (dataItem) {
                return {
                    name: dataItem[1].name,
                    value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                };
            })
        },
        //围绕中心点
        {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
                period:4,
                brushType: 'stroke',
                scale: 4
            },

            label: {
                normal: {
                    show: true,
                    position: 'right',
                    color:'#00ffff',
                    formatter: '{b}',
                    textStyle: {
                        color:"#00ffff"
                    }
                },
                emphasis: {
                    show: true
                }
            },
            symbol: 'circle',
            symbolSize:20,
            itemStyle: {
                normal: {
                    show: true,
                    color: '#4B0082'
                }
            },
            data:[{
                name: item[0],
                value: geoCoordMap[item[0]].concat([100])
            }]
        }
    );
});

var windowTimer=setInterval(function(){
    window.location.reload();
},900000);

// setInterval(function() {
//     alert("Hello");
// }, 1000);