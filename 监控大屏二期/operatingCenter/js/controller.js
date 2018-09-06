/**
 * Created by syy on 2017/9/28.
 */
var urlPrefix="http://10.8.45.10:8080/ownership_webtransfer/";
//var urlPrefix="https://183.131.202.165:8080/ownership_webtransfer/";
var sessionId= localStorage['sessionId'];
if(sessionId==undefined){
    window.location='../index.html';
}
var siteCtrs=angular.module('siteCtrs',['ui.bootstrap']);
siteCtrs.controller('operatingIndex',['$scope','$http',function($scope,$http){
    $scope.allFun={};
    $scope.allData={};

    //（登录）退出登录 + 清除缓存
    $scope.allFun.loginOut=function(){
        localStorage.removeItem('sessionId');
        window.location.href="../index.html";
    };

    //节点运行列表显示 + 分页
    $http({
        method:'post',
        url:urlPrefix+'api/monitor/getOrderByReq',
        params:{SessionId:sessionId}
    }).success(function (response) {
        // console.log(response);
        //总条数
        $scope.total=response.data.SpecificOrderList.length;
        //反转函数转化abcd转dcba
        $scope.data = response.data.SpecificOrderList.reverse();
         // console.log($scope.data);
        $scope.data.forEach(function(item,index,c){
        if (c[index].OrderStatus=="Pending") {
          return c[index].OrderStatus='待确认';
        }else if(c[index].OrderStatus=='Normal'){
          return c[index].OrderStatus='正常';
        }else if (c[index].OrderStatus=='Abnormal') {
          return c[index].OrderStatus='异常';
        }else if(c[index].OrderStatus=='Expired'){
          return c[index].OrderStatus='已过期';
        }else if(c[index].OrderStatus=='Stopped'){
          return c[index].OrderStatus='被终止';
        }else if(c[index].OrderStatus=="Unpaid"){
          return c[index].OrderStatus='未支付';
        };
    });
        //选择显示的条数
        $scope.values = [{"limit":10},{"limit":15},{"limit":20},{"limit":25},{"limit":30}];
        ////默认显示的条数
        $scope.selectedLimit=$scope.values[0];
        ////默认显示当前页数
        $scope.currentPage = 1;
        if($scope.data != null){
            $scope.datas = $scope.data.slice($scope.selectedLimit.limit*($scope.currentPage-1),$scope.selectedLimit.limit*$scope.currentPage);
        }else{
            console.log($scope.data);
        }
        $scope.page = {"limit":$scope.selectedLimit.limit,"pageSize":5,"pageNo":$scope.currentPage,"totalCount":$scope.total};
        // console.log($scope.datas);
        
        //任务名称转化
        $scope.TaskName=function(taskName){
            if (taskName=="0") {
              return $scope.taskName='数据传输任务';
            }else if(taskName=='1'){
              return $scope.taskName='数据操作任务';
            }
        };
    });
    // $scope.Dstatu=function(statu){
    //     if (statu=="Pending") {
    //       return $scope.statu='待确认';
    //     }else if(statu=='Normal'){
    //       return $scope.statu='正常';
    //     }else if (statu=='Abnormal') {
    //       return $scope.statu='异常';
    //     }else if(statu=='Expired'){
    //       return $scope.statu='已过期';
    //     }else if(statu=='Stopped'){
    //       return $scope.statu='被终止';
    //     }else if(statu=="Unpaid"){
    //       return $scope.statu='未支付';
    //     }
    //    };

    // //每页条目数设置
    $scope.change = function(selectedLimit){
        $scope.page.limit = selectedLimit.limit;
        $scope.datas = $scope.data.slice(selectedLimit.limit*($scope.page.pageNo-1),selectedLimit.limit*$scope.page.pageNo);
    };
    //分页 通过页脚切换
    $scope.pageChanged = function(selectedLimit){
        $scope.page.limit = selectedLimit.limit;
        $scope.datas = $scope.data.slice(selectedLimit.limit*($scope.page.pageNo-1),selectedLimit.limit*$scope.page.pageNo);
    };
    //跳转 指定页面
    $scope.setPage = function (go,selectedLimit) {
        $scope.length = Math.ceil($scope.total/selectedLimit.limit);
        console.log($scope.length);
        if(go > $scope.length){
            $scope.page.pageNo =  $scope.length;
            console.log($scope.length);

        }else{
            $scope.page.pageNo=go;
        }
        $scope.datas = $scope.data.slice(selectedLimit.limit*($scope.page.pageNo-1),selectedLimit.limit*$scope.page.pageNo);
    };

    //中断链路
    $scope.stopLink=function(dataBank,subscriber,dataSet){
        $http({
            method:'post',
            url:urlPrefix+'api/monitor/stopOrder',
            params:{
                SessionId:sessionId,
                SubscriberName:subscriber,
                DataBankName:dataBank,
                DataSetName:dataSet
            }
        }).success(function(res){
            console.log(res);
            window.location.reload();
        });
    };

    //恢复链路
    $scope.runLink=function(dataBank,subscriber,dataSet){
        $http({
            method:'post',
            url:urlPrefix+'api/monitor/recoverOrder',
            params:{
                SessionId:sessionId,
                SubscriberName:subscriber,
                DataBankName:dataBank,
                DataSetName:dataSet
            }
        }).success(function(res){
            console.log(res);
            window.location.reload();
        });
    };


    //搜索 条件：买方名称
    $scope.subscriberName={kw:''};
    $scope.$watch('subscriberName.kw',function(){
        if($scope.subscriberName.kw){
            $http({
                method:'post',
                url:urlPrefix+'api/monitor/getOrderByReq',
                params:{SessionId:sessionId,SubscriberName:$scope.subscriberName.kw}
            }).success(function (response) {
                console.log(response);

                //总条数
                $scope.total=response.data.SpecificOrderList.length;
                //反转函数转化abcd转dcba
                $scope.data = response.data.SpecificOrderList.reverse();
                //选择显示的条数
                $scope.values = [{"limit":10},{"limit":15},{"limit":20},{"limit":25},{"limit":30}];
                //默认显示的条数
                $scope.selectedLimit=$scope.values[0];
                //默认显示当前页数
                $scope.currentPage = 1;
                if($scope.data != null){
                    $scope.datas = $scope.data.slice($scope.selectedLimit.limit*($scope.currentPage-1),$scope.selectedLimit.limit*$scope.currentPage);
                }else{
                    console.log($scope.data);
                }
                $scope.page = {"limit":$scope.selectedLimit.limit,"pageSize":5,"pageNo":$scope.currentPage,"totalCount":$scope.total};
            });
        }
    });

    $scope.seDetails=function(appid,task,DataSetName,SubscriberName,DataBankName){
        console.log(task);
        // localStorage['AppId']=appid;
        // localStorage['DataSetName']=DataSetName;
        // localStorage['SubscriberName']=SubscriberName;
        // localStorage['DataBankName']=DataBankName;
        if (task==0) {
            return $scope.nodeMan="#nodeManage/"+SubscriberName+"/"+DataBankName+"/"+DataSetName;
        }else{
            return $scope.nodeMan="#nodeManageDetail/"+SubscriberName+"/"+DataBankName+"/"+DataSetName+"/"+appid;
        }
    };

    //数据类型 筛选
    $scope.currentEnttiy={
        dataType:["全部类型","金融数据","政务数据","交通数据","医疗卫生","人工智能","电商营销","服务数据"],
        runStatus:["全部状态","正常","异常","未支付","已过期","被终止"]
    };
    $scope.currentMetric=["全部类型","全部状态"];
    $scope.searchRlt = function() {
        $scope.rltArr=$scope.changeSelect();
        $scope.rltArr=$scope.rltArr.split(',');
        console.log("下拉框的值："+$scope.rltArr);
        console.log($scope.data);
        $scope.test=[];
        $scope.data.forEach(function(item,index,c){
        if (c[index].OrderStatus=="Pending") {
          return c[index].OrderStatus='待确认';
        }else if(c[index].OrderStatus=='Normal'){
          return c[index].OrderStatus='正常';
        }else if (c[index].OrderStatus=='Abnormal') {
          return c[index].OrderStatus='异常';
        }else if(c[index].OrderStatus=='Expired'){
          return c[index].OrderStatus='已过期';
        }else if(c[index].OrderStatus=='Stopped'){
          return c[index].OrderStatus='被终止';
        }else if(c[index].OrderStatus=="Unpaid"){
          return c[index].OrderStatus='未支付';
        };
      

            //选择了初始值时；
            if(($scope.rltArr[0]=="全部类型") && ($scope.rltArr[1]=="全部状态")){
                $scope.test.push(c[index]);
            }
            //选择第一个,是否在结果集；(第二个没变)
            else if(($scope.rltArr[0]==c[index].DataType) && ($scope.rltArr[1]=="全部状态")){
                $scope.test.push(c[index]);
            }

            //选择第二个，是否在结果集;（第一个没变）
            else if(($scope.rltArr[0]=="全部类型") && ($scope.rltArr[1]==c[index].OrderStatus)){
                $scope.test.push(c[index]);
                console.log(c);
            }
            
            //选择两个；（两者都变了）
            else if(($scope.rltArr[0]==c[index].DataType) && ($scope.rltArr[1]==c[index].OrderStatus)){
                $scope.test.push(c[index]);
            }

            else{
                console.log("NO..");
            }

        });

        //console.log($scope.test);
        //总条数
        $scope.total=$scope.test.length;
        //选择显示的条数
        $scope.values = [{"limit":10},{"limit":15},{"limit":20},{"limit":25},{"limit":30}];
        ////默认显示的条数
        $scope.selectedLimit=$scope.values[0];
        ////默认显示当前页数
        $scope.currentPage = 1;
        $scope.datas=$scope.test.slice($scope.selectedLimit.limit*($scope.currentPage-1),$scope.selectedLimit.limit*$scope.currentPage);
        $scope.page = {"limit":$scope.selectedLimit.limit,"pageSize":5,"pageNo":$scope.currentPage,"totalCount":$scope.total};

        //每页条目数设置
        $scope.change = function(selectedLimit){
            $scope.page.limit = selectedLimit.limit;
            $scope.datas =$scope.test.slice(selectedLimit.limit*($scope.page.pageNo-1),selectedLimit.limit*$scope.page.pageNo);
        };
        //分页 通过页脚切换
        $scope.pageChanged = function(selectedLimit){
            $scope.page.limit = selectedLimit.limit;
            $scope.datas = $scope.test.slice(selectedLimit.limit*($scope.page.pageNo-1),selectedLimit.limit*$scope.page.pageNo);
        };
        //跳转 指定页面
        $scope.setPage = function (go,selectedLimit) {
            $scope.length = Math.ceil($scope.total/selectedLimit.limit);
            console.log($scope.length);
            if(go > $scope.length){
                $scope.page.pageNo =  $scope.length;
                console.log($scope.length);

            }else{
                $scope.page.pageNo=go;
            }
            $scope.datas = $scope.test.slice(selectedLimit.limit*($scope.page.pageNo-1),selectedLimit.limit*$scope.page.pageNo);
        };
    };

    // 下拉选项变化时触发
    $scope.changeSelect=function(){
        return $scope.currentMetric[0]+','+$scope.currentMetric[1];
        console.log(11);
    };

}]);

//节点列表详情页
siteCtrs.controller('nodeManageDetail',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    // $scope.appid=localStorage['AppId'];
    // $scope.DataSetName=localStorage['DataSetName'];
    // $scope.SubscriberName=localStorage['SubscriberName'];
    // $scope.DataBankName=localStorage['DataBankName'];
    console.log($scope.appid);
    var myUrl= urlPrefix+'api/monitor/searchOptsDetail?DataBankName='+$routeParams.DataBankName+'&SubscriberName='+$routeParams.SubscriberName+'&DataSetName='+$routeParams.DataSetName+'&SessionId='+sessionId+'&AppID='+$routeParams.appid;
    $http.get(myUrl).success(function(res){
        $scope.datas=res.data.DetailInfo;
        $scope.res=res.data;
        $scope.behavior=res.data.DataOptsCount;
        $scope.a=[$scope.behavior.DataSourceFromFile, $scope.behavior.Split, $scope.behavior.Select, $scope.behavior.Union, $scope.behavior.Statistic, $scope.behavior.LinearRegression, $scope.behavior.LogisticRegression, $scope.behavior.RequestRealData, $scope.behavior.DataFileSink,$scope.behavior.VectorAssemble];
        var i=j=t=0;
        for(i=0;i<$scope.a.length;i++){
            for(j=0;j<$scope.a.length;j++){
                if ($scope.a[i]<$scope.a[j]) {
                    t=$scope.a[i];
                    $scope.a[i]=$scope.a[j];
                    $scope.a[j]=t;
                }
            }
        }
        // alert($scope.a[$scope.a.length-1]);
        $scope.ProcessFlowInfo=res.data.ProcessFlowInfo;
        console.log($scope.res.RelatedDataInfo.length);
        if ($scope.res.RelatedDataInfo.length==undefined) {
            $scope.down=false;
            $scope.bigData=false;
            $scope.dafaultData=true;
        }else if ($scope.res.RelatedDataInfo.length<=2) {
            $scope.down=false;
            $scope.dafault=$scope.res.RelatedDataInfo;
            $scope.defaultData=true;
            $scope.bigData=false;
        }else if ($scope.res.RelatedDataInfo.length>2) {
            $scope.dafault=$scope.res.RelatedDataInfo.slice(0,2);
            $scope.down=true;
            $scope.defaultData=true;
            $scope.bigData=false;
        }
        //柱状图
        var myChart = echarts.init(document.getElementById('dataOperation-content'));
        option = {
        // title: {
        //     text: '大规模散点图'
        // },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        color:['#065c9e'],
        toolbox: {
            feature: {
                // dataView: {show: true, readOnly: false},
                // magicType: {show: true, type: ['line', 'bar']},
                // restore: {show: true},
                // saveAsImage: {show: true}
            }
        },
        legend: {
            data:['操作次数'],
            orient: 'vertical',
            bottom: 'bottom',
            left:'right'
        },
        xAxis: [
            {
                type: 'category',
                data: ['DataSourceFromFile','Split','Select','Union','Statistic','LineraRegression','LogisticRegression','RequestRealData','DataFileSink','VectorAssemble'],
                axisPointer: {
                    type: 'shadow'
                },
                axisLabel: {
                    interval: 0,
                    color:'#ffffff',
                    formatter:function(value)  
                     {  
                         debugger  
                         var ret = "";//拼接加\n返回的类目项  
                         var maxLength = 12;//每项显示文字个数  
                         var valLength = value.length;//X轴类目项的文字个数  
                         var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
                         if (rowN > 1)//如果类目项的文字大于3,  
                         {  
                             for (var i = 0; i < rowN; i++) {  
                                 var temp = "";//每次截取的字符串  
                                 var start = i * maxLength;//开始截取的位置  
                                 var end = start + maxLength;//结束截取的位置  
                                 //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
                                 temp = value.substring(start, end) + "\n";  
                                 ret += temp; //凭借最终的字符串  
                             }  
                             return ret;  
                         }  
                         else {  
                             return value;  
                         }  
                     }
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '数据操作行为统计',
                min: 0,
                max: $scope.a[$scope.a.length-1],
                color:'#ffffff',
                splitLine:{ 
                    show:false 
                },
                interval: 10,
                axisLabel: {
                    formatter: '{value}',
                    color:'#ffffff'
                },
                nameTextStyle:{
                    color:['#ffffff']
                }
            },

            {
                type: 'value',
                name: '数据操作行为统计',
                min: 0,
                max: $scope.a[$scope.a.length-1],
                interval: 10,
                splitLine:{ 
                    show:false 
                },
                axisLabel: {
                    formatter: '{value}',
                    color:'#ffffff'
                },
                nameTextStyle:{
                    color:['#ffffff']
                }

            }
        ],
        series: [
            {
                name:'操作次数',
                type:'bar',
                barWidth:30,
                data:[$scope.behavior.DataSourceFromFile, $scope.behavior.Split, $scope.behavior.Select, $scope.behavior.Union, $scope.behavior.Statistic, $scope.behavior.LinearRegression, $scope.behavior.LogisticRegression, $scope.behavior.RequestRealData, $scope.behavior.DataFileSink,$scope.behavior.VectorAssemble]
            }
        ]
    };
    myChart.setOption(option);

    //数据流图
  (function () {
    'use strict';
    window.DAG = {
        displayGraph: function (graph, dagNameElem, svgElem) {
            dagNameElem.text(graph.name);
            this.renderGraph(graph, svgElem);
        },

        renderGraph: function(graph, svgParent) {
            var nodes = graph.nodes;
            var links = graph.links;

            var graphElem = svgParent.children('g').get(0);
            var svg = d3.select(graphElem);
            var renderer = new dagreD3.Renderer();   //创建渲染
            var layout = dagreD3.layout().rankDir('LR');
            renderer.layout(layout).run(dagreD3.json.decode(nodes, links), svg.append('g'));
            $(".label").attr("class",function(index){return index});
            for(var i=0; i<nodes.length; i++){
                if ($('g.'+i).children("g").children('text').children().text().indexOf('0')>=0) {
                    console.log($('g.'+i).text().replace("0",""));
                    var b0=$('g.'+i).text().replace("0","");
                    console.log($('g.'+i).children("g").children('text').children().text(b0));
                    // console.log($('g.'+i).children("g").children('text').children().text());
                    $('g.'+i).attr('class',"end");
                }else if($('g.'+i).children("g").children('text').children().text().indexOf('1')>=0){
                    console.log($('g.'+i).text().replace("1",""));
                    var b1=$('g.'+i).text().replace("1","");
                    console.log($('g.'+i).children("g").children('text').children().text(b1));
                    // console.log($('g.'+i).children("g").children('text').children().text());
                    $('g.'+i).attr('class',"start");
                };
            }
            
            //运行渲染
            // Adjust SVG height to content
            var main = svgParent.find('g > g');
            var h = main.get(0).getBoundingClientRect().height;
            var w = main.get(0).getBoundingClientRect().width;
            var newHeight = h + 40;
            newHeight = newHeight < 80 ? 80 : newHeight;
            svgParent.height(newHeight);
            // svgParent.width(newWidth);
            // console.log(newWidth);

            //Zoom
            // d3.select(svgParent.get(0)).call(d3.behavior.zoom().on('zoom', function() {
            //     var ev = d3.event;
            //     svg.select('g')
            //         .attr('transform', 'translate(' + ev.translate + ') scale(' + ev.scale + ')');
            // }));
        }
    };
})();


(function () {
    'use strict';

    // load data on dom ready
    jQuery(function () {
        // load script with graph data
        // var fileName = window.location.search ? window.location.search.slice(1) : 'loadData';
        // var dataScript = document.createElement('script');
        // dataScript.src = fileName;
        // document.body.appendChild(dataScript);
    });

    // callback for graph data loading
    window.loadData = function (data) {
        DAG.displayGraph(data, jQuery('#dag-name'), jQuery('#dag > svg'));
    };
})();

loadData(
    {
        name: $scope.ProcessFlowInfo[0].name,
        nodes: $scope.ProcessFlowInfo[0].nodes,
        links: $scope.ProcessFlowInfo[0].links
    }
);
});
    //展开
    $scope.open=function(){
        $scope.defaultData=false;
        $scope.bigData=true;
        $scope.dafault=$scope.res.RelatedDataInfo
    };
    //收起
    $scope.retract=function(){
        $scope.defaultData=true;
        $scope.dafault=$scope.res.RelatedDataInfo.slice(0,2);
        $scope.bigData=false;
        $scope.down=true;
    };


    $scope.Dstatu=function(statu){
    if (statu=="Pending") {
      return $scope.statu='待确认';
    }else if(statu=='Normal'){
      return $scope.statu='正常';
    }else if (statu=='Abnormal') {
      return $scope.statu='异常';
    }else if(statu=='Expired'){
      return $scope.statu='已过期';
    }else if(statu=='Stopped'){
      return $scope.statu='被终止';
    }else if(statu=="Unpaid"){
      return $scope.statu='未支付';
    }
   };
   
 

   
}]);


siteCtrs.controller('nodeManage',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    // $scope.appid=localStorage['AppId'];
    // $scope.DataSetName=localStorage['DataSetName'];
    // $scope.SubscriberName=localStorage['SubscriberName'];
    // $scope.DataBankName=localStorage['DataBankName'];
    var myUrl= urlPrefix+'api/monitor/searchOrderDetail?DataBankName='+$routeParams.DataBankName+'&SubscriberName='+$routeParams.SubscriberName+'&DataSetName='+$routeParams.DataSetName+'&SessionId='+sessionId;
    $http.get(myUrl).success(function(res){
        $scope.datas=res.data.DetailInfo;
    })   
}]);
