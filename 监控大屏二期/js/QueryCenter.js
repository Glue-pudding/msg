require(["jquery",'echarts','config','countUp'],function($,echarts,config,CountUp){
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
    var mytimer2;
    var mytimer;
    var tempList = [];
    var mTime=null;
    var orders;

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
                        sType = "银行认证";
                    } else if (v.Type == "CommonVerify") {
                        sType = "一般认证";
                    };
                    if (v.Name) {
                        sName=v.Name.substring(0,1)+'**';
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
                var commonNum=msg.data.TotalCommonVerifyCount*1;
                var commonStr=msg.data.TotalCommonVerifyCount;
                var bankNum=msg.data.TotalBankVerifyCount*1;
                var bankStr=msg.data.TotalBankVerifyCount;
                var bankNumcommonNum=commonNum+bankNum;
                var CommonAbnormal=msg.data.TotalCommonAbnormalCount*1;
                var CommonAbnormalStr=msg.data.TotalCommonAbnormalCount;
                var BankAbnormal=msg.data.TotalBankAbnormalCount*1;
                var BankAbnormalStr=msg.data.TotalBankAbnormalCount;
                var bankCommonAbnormal=CommonAbnormal+BankAbnormal;
                var a=`<div class="progress-bar progress-bar-success" title='一般认证查询' style="max-width:95%;width: ${commonNum/bankNumcommonNum*100+'%'}">
                        ${commonStr.toLocaleString()}
                      </div>
                      <div title="银行认证查询" class="progress-bar progress-bar-warning progress-bar-striped" style="min-width: 5%;width: ${bankNum/bankNumcommonNum*100+'%'}">
                      ${bankStr.toLocaleString()}
                      </div>`;
                var b=`<div class="progress-bar progress-bar-success" title="一般认证异常" style="max-width:95%;width: ${CommonAbnormal/bankCommonAbnormal*100+'%'}">
                        ${CommonAbnormalStr.toLocaleString()}
                      </div>
                      <div title="银行认证异常" class="progress-bar progress-bar-warning progress-bar-striped" style="min-width: 5%;width: ${BankAbnormal/bankCommonAbnormal*100+'%'}">
                      ${BankAbnormalStr.toLocaleString()}
                      </div>`;
                CommonPercentage.innerHTML=a;
                BankPercentage.innerHTML=b;

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
                var options = {
                    useEasing: true, 
                    useGrouping: true, 
                    separator: ',', 
                    decimal: '.', 
                };
                var TotalTodayBankVerifyCount = new CountUp('TotalTodayBankVerifyCount', 0, msg.data.TotalTodayBankVerifyCount, 0, 2.5, options);
                if (!TotalTodayBankVerifyCount.error) {
                    TotalTodayBankVerifyCount.start();
                } else {
                    console.error(TotalTodayBankVerifyCount.error);
                }
                var TotalTodayCommonVerifyCount = new CountUp('TotalTodayCommonVerifyCount', 0, msg.data.TotalTodayCommonVerifyCount, 0, 2.5, options);
                if (!TotalTodayCommonVerifyCount.error) {
                    TotalTodayCommonVerifyCount.start();
                } else {
                    console.error(TotalTodayCommonVerifyCount.error);
                }
                var TotalTodayBankAbnormalCount = new CountUp('TotalTodayBankAbnormalCount', 0, msg.data.TotalTodayBankAbnormalCount, 0, 2.5, options);
                if (!TotalTodayBankAbnormalCount.error) {
                    TotalTodayBankAbnormalCount.start();
                } else {
                    console.error(TotalTodayBankAbnormalCount.error);
                }
                var TotalTodayCommonAbnormalCount = new CountUp('TotalTodayCommonAbnormalCount', 0, msg.data.TotalTodayCommonAbnormalCount, 0, 2.5, options);
                if (!TotalTodayCommonAbnormalCount.error) {
                    TotalTodayCommonAbnormalCount.start();
                } else {
                    console.error(TotalTodayCommonAbnormalCount.error);
                }
                // $('.TotalTodayBankVerifyCount').html(msg.data.TotalTodayBankVerifyCount);
                // $('.TotalTodayCommonVerifyCount').html(msg.data.TotalTodayCommonVerifyCount);
                // $('.TotalTodayBankAbnormalCount').html(msg.data.TotalTodayBankAbnormalCount);
                // $('.TotalTodayCommonAbnormalCount').html(msg.data.TotalTodayCommonAbnormalCount);
            }
        });
    }
    //地图
    function mapData(firstList){
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
                        let renderMap = function(list){
                            let options = config.mapData,curList = list||[];
                            options.visualMap.max=bigCity[bigCity.length-1]||20;
                            options.series[0].data=convertData(curList);
                            options.series[1].data=[{
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
                            },];
                            mapView.setOption(options);
                            var index = 0; //播放所在下标
                            
                            function timing(cIndex){
                                mapView.dispatchAction({
                                    type: 'showTip',
                                    seriesIndex:0,
                                    dataIndex: cIndex
                                });
                                index = cIndex+1;
                                if(cIndex>=curList.length-1){
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
                        if(firstList&&firstList.length){
                            renderMap(firstList);
                        }else{
                            queryAll(renderMap);
                        }
                }
            });
    }
    // 1.3.24.   查询所有认证查询信息
    function queryAll(fn){
        $.ajax({
            type: 'post',
            data: {
                SessionId: sessionId
            },
            url: urlPrefix + 'api/monitor/getAllVerifyInfo',
            async: false,
            success: function(msg) {
                var $orders = msg.data.VerifyList;
                orders=$orders;
                // var html = "";
                $typeList = [];
                $nameList = [];
                $resultList = [];
                $orders.map(function(item, index) {
                    var TypeMap='';
                    if (item.Type == "BankVerify") {
                        TypeMap = "银行认证";
                    } else if (item.Type == "CommonVerify") {
                        TypeMap = "一般认证";
                    }
                    let iOIbj = {
                        name: item.Name,
                        time: item.Time,
                        type:TypeMap,
                        address:item.Address
                    };
                    tempList.push(iOIbj);
                    $typeList += '"' + item.Name + '":' + '[' + item.Lon + ',' + item.Lat + ']' + ',';
                });
                $typeList = $typeList.slice(0, -1);
                
                if(fn==undefined){
                    renderQueryAll($orders);
                }else{
                    fn(tempList);
                }
                
            }
        });
    }
    //查询所有认证查询信息接口

    function renderQueryAll(orders){
        var html='';
        $.each(orders, function(i, v) {
            // $typeList.push(v.Lat);

            var allType = "",allName="",allAddress='';
            if (v.Type == "BankVerify") {
                allType = "银行认证";
            } else if (v.Type == "CommonVerify") {
                allType = "一般认证";
            }
            if(v.Name){
                allName=v.Name.substring(0,1)+'**';
            }
            if(v.Address==''){
                allAddress='无';
            }else if(v.Address.substring(0,1)=='1'){
                allAddress='无';
            }else if(v.Address.substring(0,1)=='0'){
                allAddress='无';
            }else{
                allAddress=v.Address;
            }

            html += `<li><span>${v.Time.substr(5,11)}</span><span>${allName}</span><span>${allAddress}</span> <span> ${allType}</span></li>`;
            // html += `<li><span>${1 + i++}</span><span>${sName}</span><span>${sType}</span><span>${v.AbnormalReason}</span></li>`;
        });
        
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
                // $.each($BankAbnormalCount, function(i, v) {
                //     $bankAbnormal.push(v.TotalAbnormal);
                // });
    
                //一般銀行數據
                // $.each($CommonAbnormalCount, function(i, v) {
                //     $commonAbnormal.push(v.TotalAbnormal);
                //     $time.push(v.Time);
                // });
                for(var i=$BankAbnormalCount.length-1;i>=0;i--){
                    $bankAbnormal.push($BankAbnormalCount[i].TotalAbnormal);
                }
                for(var i=$CommonAbnormalCount.length-1;i>=0;i--){
                    $commonAbnormal.push($CommonAbnormalCount[i].TotalAbnormal);
                    $time.push($CommonAbnormalCount[i].Time);
                }

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
    
                var option1 = config.abnormalRequest;
                option1.xAxis.data=$time;
                option1.yAxis.max=bigY[bigY.length-1]||20;
                option1.series[0].data=$bankAbnormal;
                option1.series[1].data=$commonAbnormal;
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
                // $.each($BankList, function(i, v) {
                //     $bankList.push(v.TotalCount);
                // });
                for(var i=$BankList.length-1;i>=0;i--){
                    $bankList.push($BankList[i].TotalCount);
                }
                //一般銀行數據
                // $.each($CommonList, function(i, v) {
                //     $commonList.push(v.TotalCount);
                //     $ctime.push(v.Time);
                //     $commonTime = $ctime.sort();
                // });
                for(var i=$CommonList.length-1;i>=0;i--){
                    $commonList.push($CommonList[i].TotalCount);
                    $ctime.push($CommonList[i].Time);
                }
    
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
    
                var option11 = config.Statistics;
                option11.xAxis.data=$ctime;
                option11.yAxis.max=big[big.length-1]||20;
                option11.series[0].data=$bankList;
                option11.series[1].data=$commonList;
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
    mapData(tempList);
    // 1.3.24.   查询所有认证查询信息
    queryAll();
    //异常请求监控趋势（折线图）
    abnormalRequestLine();
    //五日查询量统计（柱状图）
    Statistics();
    
    // //定时刷新
    //异常请求监控;
    var abnormalRequestX = setInterval(function(){
        abnormalRequestX&&clearInterval(abnormalRequestX);
        clearInterval(mytimer2);
        abnormalRequest();
    },300000);
    
     //基本数据
     var basicDataY = setInterval(function(){
         basicData();
     },300000);
    //查询认证查询今日总体信息
    var todayPopulationY = setInterval(function(){
        todayPopulation();
    },10000);
    //地图
    var mapDataY = setInterval(function(){
        clearTimeout(mTime);
        mapData();
    },1000*100);
    // 1.3.24.   查询所有认证查询信息
    var queryAllY = setInterval(function(){
        clearInterval(mytimer);
        renderQueryAll(orders);
    },1000*300);
    //异常请求监控趋势（折线图）
    var abnormalRequestY = setInterval(function(){
        abnormalRequestY&&clearInterval(abnormalRequestY);
        abnormalRequestLine();
    },300000);
    window.onresize = function(){
        brokenLine && brokenLine.resize&&brokenLine.resize();
        columnar && columnar.resize&&columnar.resize();
        mapView && mapView.resize&&mapView.resize();
    }
});
