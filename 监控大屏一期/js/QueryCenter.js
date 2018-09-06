require(["jquery",'echarts','config'],function($,echarts,config){
    var urlPrefix = "http://10.8.26.25:8070/ownership_webtransfer/";
    //var urlPrefix="https://183.131.202.165:8080/ownership_webtransfer/";
    // var urlPrefix="http://localhost:8086/ownership_webtransfer/";
    var sessionId = localStorage['sessionId'];
    var ecConfig = echarts.config;
    var timer = null;
    var opOneHeight = $(document).height();
    var brokenLine = echarts.init(document.getElementById('brokenLine'));
    var columnar = echarts.init(document.getElementById('columnar'));
    var mapView = echarts.init(document.getElementById('mapView'));
    var tempList = [];
    var mytimer2;
    var mytimer;

    if(!sessionStorage.getItem('mapData')){
        $.get('./zj.json', function(geoJson) {
            echarts.registerMap('zhejiang', geoJson);
            sessionStorage.setItem('mapData',JSON.stringify(geoJson));
        })
    }else{
        echarts.registerMap('zhejiang', JSON.parse(sessionStorage.getItem('mapData')));
    }
    // if (sessionId == undefined) {
    //     window.location = '../index.html';
    // }
    //异常请求监控;
    function abnormalRequest(){
        $.ajax({
            type: 'post',
            data: {
                SessionId: sessionId
            },
            url: urlPrefix + 'api/monitor/getAllAbnormalVerifyInfo',
            success: function(msg) {
                var $nodes = msg.data.AbnormalList;
                var html = "";
                $.each($nodes, function(i, v) {
                    var sType = "",sName='';
                    if (v.Type == "BankVerify") {
                        sType = "南京银行认证";
                    } else if (v.Type == "CommonVerify") {
                        sType = "商汤科技认证";
                    };
                    if (v.Name) {
                        sName=v.Name.substring(0,1)+'xx';
                    }
                    html += `<li><span>${1 + i++}</span><span>${sName}</span><span>${sType}</span><span>${v.AbnormalReason}</span></li>`;
                });
                var monitoring_area = document.getElementById('tab0');
                var tab1 = document.getElementById('tab1');
                var tab2 = document.getElementById('tab2');
                tab1.innerHTML = html;
                tab2.innerHTML = tab1.innerHTML;
                var time2 = 50;
    
                function scrollUp2() {
                    if (monitoring_area.scrollTop >= tab1.offsetHeight) {
                        monitoring_area.scrollTop = 0;
                    } else {
                        monitoring_area.scrollTop++;
                    }
                }
                mytimer2 = setInterval(scrollUp2, time2);
                monitoring_area.onmouseover = function() {
                    clearInterval(mytimer2);
                };
                monitoring_area.onmouseout = function() {
                    mytimer2 = setInterval(scrollUp2, time2);
                };
            }
        });
    };
    //基本数据
    function basicData(){
        var CommonPercentage = document.getElementById('CommonPercentage');
        var BankPercentage = document.getElementById('BankPercentage');
        $.ajax({
            type: 'post',
            data: {
                SessionId: sessionId
            },
            url: urlPrefix + 'api/monitor/getAllVerifyCountInfo',
            success: function(msg) {
                var Bank='',Common='';
                if(msg.data.TotalBankAbnormalCount=='0'&&msg.data.TotalBankVerifyCount!='0'){
                    Bank='100%';
                }else if(msg.data.TotalBankVerifyCount=='0'){
                    Bank='0%';
                }else{
                    Bank=msg.data.TotalBankAbnormalCount/msg.data.TotalBankVerifyCount*100+"%";
                };
                if(msg.data.TotalCommonAbnormalCount=='0'&&msg.data.TotalCommonVerifyCount!='0'){
                    Common='100%';
                }else if(msg.data.TotalCommonVerifyCount=='0'){
                    Common='0%';
                }else{
                    Common=msg.data.TotalCommonAbnormalCount/msg.data.TotalCommonVerifyCount*100+"%";
                };
                var htmlCommon=`<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: ${Common}"><span class="sr-only">60% Complete</span></div>`;
                var htmlBank=`<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: ${Bank}"><span class="sr-only">60% Complete</span></div>`;
                $('.TotalCommonVerifyCount').html(msg.data.TotalCommonVerifyCount);
                $('.TotalBankVerifyCount').html(msg.data.TotalBankVerifyCount);
                $('.TotalCommonAbnormalCount').html(msg.data.TotalCommonAbnormalCount);
                $('.TotalBankAbnormalCount').html(msg.data.TotalBankAbnormalCount);
                CommonPercentage.innerHTML=htmlCommon;
                BankPercentage.innerHTML=htmlBank;

            }
        });
    }
    //查询认证查询今日总体信息
    function todayPopulation(){
        $.ajax({
            type: 'post',
            data: {
                SessionId: sessionId
            },
            url: urlPrefix + 'api/monitor/getTodayVerifyInfo',
            success: function(msg) {
                $('.TotalTodayBankVerifyCount').html(msg.data.TotalTodayBankVerifyCount);
                $('.TotalTodayCommonVerifyCount').html(msg.data.TotalTodayCommonVerifyCount);
                $('.TotalTodayBankAbnormalCount').html(msg.data.TotalTodayBankAbnormalCount);
                $('.TotalTodayCommonAbnormalCount').html(msg.data.TotalTodayCommonAbnormalCount);
            }
        });
    }
    //地图
    function mapData(tempList){
            //地图
            $.ajax({
                type: 'post',
                data: {
                    SessionId: sessionId
                },
                url: urlPrefix + 'api/monitor/getVerifyDistributionInfo',
                success: function(msg) {
                    if (msg.data.Distribution.湖州市 == undefined) {
                        msg.data.Distribution.湖州市 = 0;
                    };
                    if (msg.data.Distribution.嘉兴市 == undefined) {
                        msg.data.Distribution.嘉兴市 = 0;
                    };
                    if (msg.data.Distribution.杭州市 == undefined) {
                        msg.data.Distribution.杭州市 = 0;
                    };
                    if (msg.data.Distribution.绍兴市 == undefined) {
                        msg.data.Distribution.绍兴市 = 0;
                    };
                    if (msg.data.Distribution.宁波市 == undefined) {
                        msg.data.Distribution.宁波市 = 0;
                    };
                    if (msg.data.Distribution.舟山市 == undefined) {
                        msg.data.Distribution.舟山市 = 0;
                    };
                    if (msg.data.Distribution.衢州市 == undefined) {
                        msg.data.Distribution.衢州市 = 0;
                    };
                    if (msg.data.Distribution.金华市 == undefined) {
                        msg.data.Distribution.金华市 = 0;
                    };
                    if (msg.data.Distribution.台州市 == undefined) {
                        msg.data.Distribution.台州市 = 0;
                    };
                    if (msg.data.Distribution.丽水市 == undefined) {
                        msg.data.Distribution.丽水市 = 0;
                    };
                    if (msg.data.Distribution.温州市 == undefined) {
                        msg.data.Distribution.温州市 = 0;
                    };
                    var bigCity=[msg.data.Distribution.湖州市,msg.data.Distribution.嘉兴市,msg.data.Distribution.杭州市,msg.data.Distribution.绍兴市,msg.data.Distribution.宁波市,msg.data.Distribution.舟山市,msg.data.Distribution.衢州市,msg.data.Distribution.金华市,msg.data.Distribution.台州市,msg.data.Distribution.丽水市,msg.data.Distribution.温州市];
                    var i=j=t=0;
                    for(i=0;i<bigCity.length;i++){
                        for(j=0;j<bigCity.length;j++){
                            if (bigCity[i]<bigCity[j]) {
                                t=bigCity[i];
                                bigCity[i]=bigCity[j];
                                bigCity[j]=t;
                            }
                        }
                    };
                    var geoCoordMapbefore = '{' + $typeList + '}';
                    var geoCoordMap = JSON.parse(geoCoordMapbefore);
    
                        var convertData = function(data) {
                            var res = [];
                            for (var i = 0; i < data.length; i++) {
                                var geoCoord = geoCoordMap[data[i].name];
                                if (geoCoord) {
                                    res.push({
                                        name: data[i].name,
                                        time: data[i].time,
                                        type:data[i].type,
                                        address:data[i].address,
                                        value: geoCoord.concat(data[i].value)
                                    });
                                }
                            }
                            return res;
                        };
                        let options = {
                            // color:['rgba(19,151,255,0.24)','rgba(19,151,255,0.88)','#01FCCC'],
                            title: {
                                text: '省\n内\n累\n积\n查\n询\n次\n数',
                                textStyle:{
                                    width:'20px',
                                    height:'100px',
                                    fontSize:14,
                                    color:'#fff'
                                },
                                top:'67%',left:'82%'
                            },
                            visualMap: {
                                    name: '查询数据量',
                                    min: 0,
                                    align:'left',
                                    max: bigCity[bigCity.length-1]||20,
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
                                formatter: function(param, ticket, callback) 
                                 {
                                     //用定时器模拟异步事件
                                       // setTimeout(function() {
                                        var res='';
                                        // clearInterval(mTime);
                                        if (param.data.time==undefined) {
                                            res=param.data.name+':'+param.data.value;
                                        }else{
                                            res = '时间 ：'+param.data.time+ '<br/>'+'查询人 ：'+ param.data.name + '<br/>'+'查询地区 ：'+ param.data.address + '<br/>' +'查询方式 ：'+param.data.type;
                                        };
                                       // }, 1000);
                                       return res;//内容还没返回时显示的内容
                                  },
                                textStyle: {
                                    fontSize: 10,
                                    align: 'left'
                                }
                            },
                            geo:config.mapData.geo,
                            series: [{
                                type: 'scatter',
                                coordinateSystem: 'geo',
                                geo: config.mapData.geo,
                                data: convertData(tempList),
                                symbolSize: 10,
                                label: config.mapData.series[0].label,
                                itemStyle: {
                                    normal: {
                                        color: '#f00',
                                        borderColor: "rgba(1, 252, 204,0.4)",
                                        shadowBlur: 100,
                                        // shadowColor: '#333'
                                    },
                                    emphasis: {
                                        borderColor: 'rgba(1,252,204,1)',
                                        borderWidth: 1
                                    }
                                },
                                zlevel: 1
                            }, {
                                type: 'map',
                                
                                name:'省内累计查询次数',
                                mapType: 'zhejiang', // 自定义扩展图表类型
                                itemStyle: config.mapData.series[1].itemStyle,
    
                                data: [{
                                    name: '湖州市',
                                    value: msg.data.Distribution.湖州市
                                }, {
                                    name: '嘉兴市',
                                    value: msg.data.Distribution.嘉兴市
                                }, {
                                    name: '杭州市',
                                    value: msg.data.Distribution.杭州市
                                }, {
                                    name: '绍兴市',
                                    value: msg.data.Distribution.绍兴市
                                }, {
                                    name: '宁波市',
                                    value: msg.data.Distribution.宁波市
                                }, {
                                    name: '舟山市',
                                    value: msg.data.Distribution.舟山市
                                }, {
                                    name: '衢州市',
                                    value: msg.data.Distribution.衢州市
                                }, {
                                    name: '金华市',
                                    value: msg.data.Distribution.金华市
                                }, {
                                    name: '台州市',
                                    value: msg.data.Distribution.台州市
                                }, {
                                    name: '丽水市',
                                    value: msg.data.Distribution.丽水市
                                }, {
                                    name: '温州市',
                                    value: msg.data.Distribution.温州市
                                },]
                            }]
                        };
                        mapView.setOption(options);
                        var index = 0; //播放所在下标
                        var mTime=null;
                        function timing(cIndex){
                            mapView.dispatchAction({
                                type: 'showTip',
                                seriesIndex:0,
                                dataIndex: cIndex
                            });
                            index = cIndex+1;
                            // console.log(cIndex,'===index==');
                            if(cIndex>=tempList.length-1){
                                mTime&&clearTimeout(mTime);
                                timing(0);
                            }else{
                                mTime = setTimeout(function(){timing(index);},5000);
                            }
                        };
                        timing(0);
                        mapView.on('mouseover', function (param){
                             if(mTime){
                                clearTimeout(mTime);
                             }
                         });
                        mapView.on('mouseout', function (param){
                            mTime&&clearTimeout(mTime);
                            timing(0);
                         });
                }
            });
    }
    // 1.3.24.   查询所有认证查询信息
    function queryAll(){
        $.ajax({
            type: 'post',
            data: {
                SessionId: sessionId
            },
            url: urlPrefix + 'api/monitor/getAllVerifyInfo',
            async: false,
            success: function(msg) {
                var $orders = msg.data.VerifyList;
                var html = "";
                $typeList = [];
                $nameList = [];
                $resultList = [];
                $orders.map(function(item, index) {
                    let iOIbj = {
                        name: item.Name,
                        time: item.Time,
                        type:item.Type,
                        address:item.Address,
                        value: 20
                    };
                    tempList.push(iOIbj);
                });
                $.each($orders, function(i, v) {
                    $typeList += '"' + v.Name + '":' + '[' + v.Lon + ',' + v.Lat + ']' + ',';
                    // $typeList.push(v.Lat);
    
                    var allType = "",allName="";
                    if (v.Type == "BankVerify") {
                        allType = "南京银行认证";
                    } else if (v.Type == "CommonVerify") {
                        allType = "商汤科技认证";
                    }
                    if(v.Name){
                        allName=v.Name.substring(0,1)+'xx';
                    }
                    html += `<li><span>${v.Time.substr(5,11)}</span><span>${allName}</span><span>${v.Address}</span> <span> ${allType}</span></li>`;
                    // html += `<li><span>${1 + i++}</span><span>${sName}</span><span>${sType}</span><span>${v.AbnormalReason}</span></li>`;
                });
                $typeList = $typeList.slice(0, -1);
                var area = document.getElementById('scrollbox');
                var con1 = document.getElementById('con1');
                var con2 = document.getElementById('con2');
                con1.innerHTML = html;
                con2.innerHTML = con1.innerHTML;
    
                function scrollUp() {
                    if (area.scrollTop >= con1.offsetHeight) {
                        area.scrollTop = 0;
                    } else {
                        area.scrollTop++
                    }
                }
                var time = 50;
                mytimer = setInterval(scrollUp, time);
                area.onmouseover = function() {
                    clearInterval(mytimer);
                };
                area.onmouseout = function() {
                    mytimer = setInterval(scrollUp, time);
                };
                mapData(tempList);
            }
        });
    }
    //异常请求监控趋势（折线图）
    function abnormalRequestLine(){
        $.ajax({
            type: 'post',
            data: {
                SessionId: sessionId
            },
            url: urlPrefix + 'api/monitor/getTotalAbnormalVerifyCountInfo',
            success: function(msg) {
                var $BankAbnormalCount = msg.data.BankVerifyAbnormalList;
                var $CommonAbnormalCount = msg.data.CommonVerifyAbnormalList;
                var $bankAbnormal = [];
                var $commonAbnormal = [];
    
                var $time = [];
                $.each($BankAbnormalCount, function(i, v) {
                    $bankAbnormal.push(v.TotalAbnormal);
                });
    
                //一般銀行數據
                $.each($CommonAbnormalCount, function(i, v) {
                    $commonAbnormal.push(v.TotalAbnormal);
                    $time.push(v.Time);
                });
                var bigY=$bankAbnormal.concat($commonAbnormal);
                var i=j=t=0;
                for(i=0;i<bigY.length;i++){
                    for(j=0;j<bigY.length;j++){
                        if (bigY[i]<bigY[j]) {
                            t=bigY[i];
                            bigY[i]=bigY[j];
                            bigY[j]=t;
                        }
                    }
                }
    
                var option1 = {
                    color:['#1397FF','#01FCCC'],
                    grid:config.abnormalRequest.grid,
                    //节点提示内容
                    tooltip: config.abnormalRequest.tooltip,
                    legend: config.abnormalRequest.legend,
                    //x轴
                    xAxis: {
                        boundaryGap: false,
                        type: 'category',
                        data: $time,
                        // nameTextStyle: {
                        //     color: '#ffffff'
                        // },
                        axisLabel: config.abnormalRequest.xAxis.axisLabel,
                        axisTick: config.abnormalRequest.xAxis.axisLabel,
                        axisLine: config.abnormalRequest.xAxis.axisLine
    
                    },
                    //y轴
                    yAxis: {
                        type: "value",
                        
                        axisTick: config.abnormalRequest.yAxis.axisTick,
                        min: 0,
                        max: bigY[bigY.length-1]||20,
                        splitLine: config.abnormalRequest.yAxis.splitLine,
                        axisLabel:config.abnormalRequest.yAxis.axisLabel ,
                        axisLine: config.abnormalRequest.yAxis.axisLine
    
                    },
                    //图标类型，数据值设定
                    series: [{
                        name: '银行认证异常',
                        type: 'line',
                        stack:'总量',
                        symbolSize:12,
                        symbol:'circle',
                        emphasis:{
                            itemStyle:{
                                borderColor:'#fff'
                            }
                        },
                        data: $bankAbnormal
                        // itemStyle: config.abnormalRequest.series[0].itemStyle,
                        // hoverAnimation: true
    
                    }, {
                        name: '一般认证异常',
                        type: 'line',
                        stack:'总量',
                        symbolSize:12,
                        symbol:'circle',
                        data: $commonAbnormal,
                        // itemStyle: config.abnormalRequest.series[1].itemStyle,
                        emphasis:{
                            itemStyle:{
                                borderColor:'#fff'
                            }
                        }
    
                    }]
                };
                    brokenLine.setOption(option1);
                
            }
        });   
    }
    //五日查询量统计（柱状图）
    function Statistics(){
        $.ajax({
            type: 'post',
            data: {
                SessionId: sessionId
            },
            url: urlPrefix + 'api/monitor/getTodayVerifyCountInfo',
            success: function(msg) {
                var $BankList = msg.data.BankVerifyList;
                var $CommonList = msg.data.CommonVerifyList;
                var $bankList = [];
                var $commonList = [];
                var $ctime = [];
                var $commonTime = '';
                $.each($BankList, function(i, v) {
                    $bankList.push(v.TotalCount);
                });
    
                //一般銀行數據
                $.each($CommonList, function(i, v) {
                    $commonList.push(v.TotalCount);
                    $ctime.push(v.Time);
                    $commonTime = $ctime.sort();
                });
    
                var big=$bankList.concat($commonList);
                var i=j=t=0;
                for(i=0;i<big.length;i++){
                    for(j=0;j<big.length;j++){
                        if (big[i]<big[j]) {
                            t=big[i];
                            big[i]=big[j];
                            big[j]=t;
                        }
                    }
                }
    
                var option11 = {
                    color:['#1397FF','#01FCCC'],
                    grid: config.Statistics.grid,
                    //节点提示内容
                    tooltip: config.Statistics.tooltip,
                    legend: config.Statistics.legend,
                    //x轴
                    xAxis: {
                        boundaryGap:false,
                        type: 'category',
                        data: $commonTime,
                        nameTextStyle: {
                            color: '#ffffff'
                        },
                        axisLabel: config.Statistics.xAxis.axisLabel,
                        axisTick: config.Statistics.xAxis.axisTick,
                        axisLine: config.Statistics.xAxis.axisLine
    
                    },
                    //y轴
                    yAxis: {
                        show: true,
                        type: "value",
                        nameTextStyle: {
                            color: "#ffffff"
                        },
                        axisTick: config.Statistics.yAxis.axisTick,
                        boundaryGap: 'false',
                        splitNumber: 3,
                        min: 0,
                        max: big[big.length-1]||20,
                        splitLine: config.Statistics.yAxis.splitLine,
                        axisLabel: config.Statistics.yAxis.axisLabel,
                        axisLine:config.Statistics.yAxis.axisLine 
    
                    },
                    //图标类型，数据值设定
                    series: [{
                        name: '银行认证',
                        type: 'bar',
                        barWidth: '20',
                        data: $bankList,
                        hoverAnimation: true
    
                    }, {
                        name: '一般认证',
                        type: 'bar',
                        barGap: '1%',
                        barWidth: '20',
                        data: $commonList,
                        hoverAnimation: true
    
                    }]
                };
                    columnar.setOption(option11);
            }
        });
    }
    
    // 执行ajax请求
    // 异常请求监控;
    abnormalRequest();
    //基本数据
    basicData();
    //查询认证查询今日总体信息
    todayPopulation();
    //地图
    // mapData(tempList);
    // 1.3.24.   查询所有认证查询信息
    queryAll();
    //异常请求监控趋势（折线图）
    abnormalRequestLine();
    //五日查询量统计（柱状图）
    Statistics();
    
    // //定时刷新
    //异常请求监控;
    var abnormalRequestY = setInterval(function(){
        clearInterval(mytimer2);
        abnormalRequest();
    },300000);
    
    // //基本数据
    // var basicDataY = setInterval(function(){
    //     basicData();
    // },10000);
    //查询认证查询今日总体信息
    var todayPopulationY = setInterval(function(){
        todayPopulation();
    },10000);
    //地图
    var mapDataY = setInterval(function(){
        mapData(tempList);
    },100000);
    // 1.3.24.   查询所有认证查询信息
    var queryAllY = setInterval(function(){
        clearInterval(mytimer);
        queryAll();
    },300000);
    //异常请求监控趋势（折线图）
    var abnormalRequestY = setInterval(function(){
        abnormalRequestLine();
    },300000);
});
