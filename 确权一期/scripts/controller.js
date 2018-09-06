/**
 * Created by syy on 2017/9/28.
 */
//接口url-heade
var urlPrefix="http://10.8.45.10:8080/ownership_webtransfer/";
//var urlPrefix="https://183.131.202.165:8080/ownership_webtransfer/";
var SessionId="";
var UserName="";
// var TelNumber="";
//事件容器
var siteCtrs=angular.module('siteCtrs',[]);

//首页
siteCtrs.controller('indexCtr',['$scope','$http','$rootScope',function($scope,$http,$rootScope){
    $scope.SessionId=bfd.getCookie('SessionId');
    $scope.UserName = bfd.getCookie('UserName'); 
    $scope.loginClick=function(){
        window.location.href='index.html';
    };

    $scope.loginOut=function(){
      var myUrl=urlPrefix+"api/login/logout";
      $http({
          method:'GET',
          url:urlPrefix+'api/login/logout',
          params:{
            SessionId:$scope.SessionId
          }
       }).success(function(msg){
          alert('已退出');
          bfd.removeCookie('SessionId');
          bfd.removeCookie('UserName');
          bfd.removeCookie('administratorsSessionId');
          location.href="#login";
        })
    };

}]);

//未授权数据
siteCtrs.controller('dataUnpower',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.SessionId = bfd.getCookie('SessionId');
    $scope.UserName = bfd.getCookie('UserName');
    $scope.DataOwnerUniqueID = bfd.getCookie('DataOwnerUniqueID');
    $scope.data = '';

    //请求数据
    $http({
    method:'GET', 
    url:urlPrefix+'api/databank/getAllUnGrantedDataByOwner',
    params:{
       SessionId:$scope.SessionId,
       DataOwnerName:$scope.UserName
       }
    }).then(function(response){
    //成功时执行
        $scope.data = response.data.data.DataSets;
        $scope.imgSrc=urlPrefix+'api/file/getImage?fileName=';
         if($scope.data.length == 0){
             $("#auth").html("暂无数据");
         };
          if($scope.data.length<2){
              $scope.pageShow=false;
          }else{
            $scope.pageShow=true;
          };
          $scope.pageSize = 2;
          $scope.pages = Math.ceil($scope.data.length / $scope.pageSize); //分页数
          $scope.newPages = $scope.pages > 5 ? 5 : $scope.pages;
          $scope.pageList = [];
          $scope.selPage = 1;
          //设置表格数据源(分页)
          $scope.setData = function () {
          $scope.items = $scope.data.slice(($scope.pageSize * ($scope.selPage - 1)), ($scope.selPage * $scope.pageSize));//通过当前页数筛选出表格当前显示数据
          }
          $scope.items = $scope.data.slice(0, $scope.pageSize);
          //分页要repeat的数组
          for (var i = 0; i < $scope.newPages; i++) {
          $scope.pageList.push(i + 1);
          }
          //打印当前选中页索引
          $scope.selectPage = function (page) {
          //不能小于1大于最大
          if (page < 1 || page > $scope.pages) return;
          //最多显示分页数5
          if (page > 2) {
          //因为只显示5个页数，大于2页开始分页转换
          var newpageList = [];
          for (var i = (page - 3) ; i < ((page + 2) > $scope.pages ? $scope.pages : (page + 2)) ; i++) {
          newpageList.push(i + 1);
          }
          $scope.pageList = newpageList;
          }
          $scope.selPage = page;
          $scope.setData();
          $scope.isActivePage(page);
          };
          //设置当前选中页样式
          $scope.isActivePage = function (page) {
          return $scope.selPage == page;
          };
          //上一页
          $scope.Previous = function () {
          $scope.selectPage($scope.selPage - 1);
          }
          //下一页
          $scope.Next = function () {
          $scope.selectPage($scope.selPage + 1);
          };
        
    },function(response){
    //失败时执行 
         console.log("response");
   });

      
     //全选  全不选
      $scope.m = [];
      $scope.checked = [];
      $scope.selectAll = function () {
          if($scope.select_all) {
              $scope.checked = [];
              angular.forEach($scope.data, function (i) {
                  i.checked = true;
                  $scope.checked.push(i);
              })
          }else {
              angular.forEach($scope.data, function (i) {
                  i.checked = false;
                  $scope.checked = [];
              })
          }
      };
    $scope.selectOne = function (DataBankName,DataSetName) {
        var sel = {"DataSetName":DataSetName,"DataBankName":DataBankName}; 
        angular.forEach($scope.data , function (i) {
            var index = $scope.checked.indexOf(i);
            if(i.checked && index === -1) {
                $scope.checked.push(i);
            } else if (!i.checked && index !== -1){
                $scope.checked.splice(index, 1);
            };
        })

        if ($scope.data.length === $scope.checked.length) {
            $scope.select_all = true;
        } else {
            $scope.select_all = false;
        }
     };
        //提交  
       $scope.handleSubmit = function () {
              if ($scope.checked.length === 0) {
                  alert("请选择你要授权的数据");
                 }else{
                    location.href="#assets-management";
                 };

             $http({
                method:'GET', 
                url:urlPrefix+'api/databank/setDataSetStatusAsWait',
                params:{
                   SessionId:$scope.SessionId,
                   DataOwnerName:$scope.UserName,
                   DataSets:[$scope.checked]
               }
            }).then(function(response){

            },function(response){
                //失败时执行 
                console.log("response");
            }); 

              };
      
          //点击展开 点击隐藏
    $scope.orderShow = false;
    $scope.getMore = function (index,value) {
       this.orderShow = !$scope.orderShow;
       };
    $scope.pickUp = function (index,value) {
        this.orderShow = false;
       };
    
}]);


//已授权页面
siteCtrs.controller('dataPower',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.SessionId = bfd.getCookie('SessionId');
    $scope.UserName = bfd.getCookie('UserName');
    $scope.DataOwnerUniqueID = bfd.getCookie('DataOwnerUniqueID');
    $scope.NewStatus = false;
    $scope.data = '';
    $scope._data = [];
    $scope.LogoFigPath = [];

    $http({
    method:'GET', 
    url:urlPrefix+'api/databank/getAllGrantedDataByOwner',
    params:{
       SessionId:$scope.SessionId,
       DataOwnerName:$scope.UserName
       }
    }).then(function(response){
        //成功时执行
         $scope.data = response.data.data.DataSets;
       if($scope.data.length == 0){
             $("#noMessage").html("暂无数据!");
         };
         $scope.imgSrc=urlPrefix+'api/file/getImage?fileName=';
          $scope.pageSize = 5;
          if($scope.data.length<5){
              $scope.pageShow=false;
          }else{
            $scope.pageShow=true;
          };
          $scope.pages = Math.ceil($scope.data.length / $scope.pageSize); //分页数
          $scope.newPages = $scope.pages > 5 ? 5 : $scope.pages;
          $scope.pageList = [];
          $scope.selPage = 1;
          //设置表格数据源(分页)
          $scope.setData = function () {
          $scope.items = $scope.data.slice(($scope.pageSize * ($scope.selPage - 1)), ($scope.selPage * $scope.pageSize));//通过当前页数筛选出表格当前显示数据
          }
          $scope.items = $scope.data.slice(0, $scope.pageSize);
          //分页要repeat的数组
          for (var i = 0; i < $scope.newPages; i++) {
          $scope.pageList.push(i + 1);
          }
          //打印当前选中页索引
          $scope.selectPage = function (page) {
          //不能小于1大于最大
          if (page < 1 || page > $scope.pages) return;
          //最多显示分页数5
          if (page > 2) {
          //因为只显示5个页数，大于2页开始分页转换
          var newpageList = [];
          for (var i = (page - 3) ; i < ((page + 2) > $scope.pages ? $scope.pages : (page + 2)) ; i++) {
          newpageList.push(i + 1);
          }
          $scope.pageList = newpageList;
          }
          $scope.selPage = page;
          $scope.setData();
          $scope.isActivePage(page);
          };
          //设置当前选中页样式
          $scope.isActivePage = function (page) {
          return $scope.selPage == page;
          };
          //上一页
          $scope.Previous = function () {
          $scope.selectPage($scope.selPage - 1);
          }
          //下一页
          $scope.Next = function () {
          $scope.selectPage($scope.selPage + 1);
          };

       });

    


    //取消授权
    $scope.cancelAccredit = function(index,DataSetName,DataBankName){
     $scope.DataSetName = DataSetName;
     $scope.DataBankName = DataBankName;
     $scope.data.splice(index,1); 
     $http({
        method:'GET', 
        url:urlPrefix+'api/databank/setDataSetStatusAsNotAuth',
        params:{
           SessionId:$scope.SessionId,
           DataOwnerName:$scope.UserName,
           DataSets:[{
                DataSetName:$scope.DataSetName,
                DataBankName:$scope.DataBankName,
                   }]
             }
    }).then(function(response){
        //成功时执行
       location.href="#data-power";
    },function(response){
        //失败时执行 
        console.log("response");
    });
  };
    //展开  收起 
    $scope.orderShow = false;
    $scope.getMore = function (index,value) {

       this.orderShow = !$scope.orderShow;
       };
    $scope.pickUp = function (index,value) {
          // console.log(index);
        this.orderShow = false;
       };
    
  }]);


//用户信息查询
siteCtrs.controller('userMessage',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.SessionId = bfd.getCookie('SessionId');
    $scope.UserName=bfd.getCookie('UserName');
    $scope.changeBill = true;
    $("#cc").hide();
     //请求用户信息
            $http({
            method:'GET',
            url:urlPrefix+'api/user/getUserInfo',
            params:{
               SessionId:$scope.SessionId,
               UserName:$scope.UserName
            }
        }).then(function(response){
            //成功时执行
            $scope.data = response.data;
              if($scope.data.data.BillCompanyName!=undefined){
                 }else{
                    $("#changeShow").html("暂无发票信息!").css({"text-align":"center","margin-bottom":"20px"});
                };
            // bfd.addCookie('DataOwnerUniqueID',$scope.data.data.TelNumber,10);
        },function(response){
            //失败时执行 
            console.log("response");
        });


      //修改用户信息 
      $scope.MessageChange = true;
      $scope.changeMessage = function(){
           $scope.MessageChange = !$scope.MessageChange;
         };
      $scope.handleChange = function(CompanyName,CompanyQualification,CompanyAddress,CompanyContactName,CompanyContactTelNumber,CompanyContactEmail,Email){
        $scope.MessageChange = !$scope.MessageChange;
        $http({
            method:'GET', 
            url:urlPrefix+'api/user/saveUserInfo',
            params:{
              SessionId: $scope.SessionId,
              UserName:$scope.UserName,
              CompanyName:CompanyName,
              CompanyQualification:CompanyQualification,
              CompanyAddress:CompanyAddress,
              CompanyContactName:CompanyContactName,
              CompanyContactTelNumber:CompanyContactTelNumber,
              CompanyContactEmail:CompanyContactEmail,
              Email:Email
            } 
           }).then(function(){
              // location.href="#userMessage";
            },function(response){
        //失败时执行 
        console.log("response");
    });

       
      };

      $scope.changeBillContent = function(){
        $scope.changeBill = !$scope.changeBill;


      };

      $scope.billChange = function(BillCompanyName,BillTaxpayerId,BillBankName,BillCompanyTelNumber,BillCompanyAddress,BillBankAccount,BillTelNumber,BillContact,BillAddress){
           $scope.changeBill = !$scope.changeBill;
   
          $http({
            method:'GET', 
            url:urlPrefix+'/api/user/saveBillInfo',
            params:{
              SessionId:$scope.SessionId,
              UserName:$scope.UserName,
              BillCompanyName:BillCompanyName,
              BillTaxpayerId:BillTaxpayerId,
              BillBankName:BillBankName,
              BillCompanyTelNumber:BillCompanyTelNumber,
              BillCompanyAddress:BillCompanyAddress,
              BillBankAccount:BillBankAccount,
              BillTelNumber:BillTelNumber,
              BillContact:BillContact,
              BillAddress:BillAddress
            }}).then(function(){
              location.reload();
            },function(response){
        //失败时执行 
        console.log("response");
    
        });
      };
}]);


//拟授权页面
siteCtrs.controller('assetsManagement',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.SessionId = bfd.getCookie('SessionId');
    $scope.UserName = bfd.getCookie('UserName');
    $scope.DataOwnerUniqueID = 'unique1';
    $scope.NewStatus = true;
    $scope.data = [];

    $http({
    method:'GET',   
    url:urlPrefix+'api/databank/queryWaitAuthDataSetForOwner',
    params:{
       SessionId:$scope.SessionId,
       DataOwnerName:$scope.UserName
       }
    }).then(function(response){
        //成功时执行
        $scope.data = response.data.data.DataSets;
    },function(response){
        //失败时执行 
        console.log("response");
    });

        //勾选阅读协议才可提交
     $scope.checkInput = false;
     $scope.checkShow = function(){
       if($scope.checkedText == true){
         $http({
           method:'GET', 
           url:urlPrefix+'api/databank/setDataSetStatusAsAuth',
           params:{
              SessionId:$scope.SessionId,
              DataOwnerName:$scope.UserName,
              DataSets:[$scope.data]
              }
     }).then(function(response){
             location.href="#data-power";
     },function(response){
         //失败时执行 
         console.log("response");
     });}else{
           $scope.checkInput = !$scope.checkInput;
         }
    };

    $scope.cancelAssets = function(){
       $http({
           method:'GET', 
           url:urlPrefix+'api/databank/setDataSetsStatusAsNotAuth',
           params:{
              SessionId:$scope.SessionId,
              DataOwnerName:$scope.UserName,
              DataSets:[$scope.data]
              }
     }).then(function(response){
            location.href="#data-power";
     },function(response){
         //失败时执行 
         console.log("response");
     });
    };

}]);

//数据订单管理页面
siteCtrs.controller('dataOrder',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.sessionId = bfd.getCookie('SessionId');
    $scope.SubscriberName = bfd.getCookie('UserName');
    $scope.data = '';

   $http({
        method:'post', 
        url:urlPrefix+'api/databank/getSubscriptionRecords',
        params:{
           SessionId:$scope.sessionId,
           SubscriberName:$scope.SubscriberName
       }
    }).then(function(response){
        $scope.data = response.data.data.SubscriptionRecord;
        if($scope.data.length==0){
          $("#dataM").html("暂无商品信息!");
        };
      if($scope.data.length<1){
              $scope.pageShow=false;
          }else{
              $scope.pageShow=true;
          };
          $scope.pageSize = 1;
          $scope.pages = Math.ceil($scope.data.length / $scope.pageSize); //分页数
          $scope.newPages = $scope.pages > 5 ? 5 : $scope.pages;
          $scope.pageList = [];
          $scope.selPage = 1;
          //设置表格数据源(分页)
          $scope.setData = function () {
          $scope.items = $scope.data.slice(($scope.pageSize * ($scope.selPage - 1)), ($scope.selPage * $scope.pageSize));//通过当前页数筛选出表格当前显示数据
          }
          $scope.items = $scope.data.slice(0, $scope.pageSize);
          //分页要repeat的数组
          for (var i = 0; i < $scope.newPages; i++) {
          $scope.pageList.push(i + 1);
          }
          //打印当前选中页索引
          $scope.selectPage = function (page) {
          //不能小于1大于最大
          if (page < 1 || page > $scope.pages) return;
          //最多显示分页数5
          if (page > 2) {
          //因为只显示5个页数，大于2页开始分页转换
          var newpageList = [];
          for (var i = (page - 3) ; i < ((page + 2) > $scope.pages ? $scope.pages : (page + 2)) ; i++) {
          newpageList.push(i + 1);
          }
          $scope.pageList = newpageList;
          }
          $scope.selPage = page;
          $scope.setData();
          $scope.isActivePage(page);
          };
          //设置当前选中页样式
          $scope.isActivePage = function (page) {
          return $scope.selPage == page;
          };
          //上一页
          $scope.Previous = function () {
          $scope.selectPage($scope.selPage - 1);
          }
          //下一页
          $scope.Next = function () {
          $scope.selectPage($scope.selPage + 1);
          };
        
    },function(response){
        console.log("response");
      });

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

    //获取详情
    $scope.viewDetails = function(Status,DataSetName,DataBankName){
        $scope.Status = Status;
        switch($scope.Status){
         case "Normal": 
              bfd.addCookie('DataSetName1',DataSetName,10);
              bfd.addCookie('DataBankName1',DataBankName,10);
              location.href = "#order";
            break;
         case "Stopped": 
              bfd.addCookie('DataSetName1',DataSetName,10);
              bfd.addCookie('DataBankName1',DataBankName,10);
              location.href = "#order-past";
            break;
         case "Expired":
              bfd.addCookie('DataSetName1',DataSetName,10);
              bfd.addCookie('DataBankName1',DataBankName,10);
              location.href = "#order-past";
            break;
         case "Abnormal": 
              bfd.addCookie('DataSetName1',DataSetName,10);
              bfd.addCookie('DataBankName1',DataBankName,10);
              location.href = "#order-past";
            break; 
         case "Unpaid": 
           bfd.addCookie('DataSetName1',DataSetName,10);
           bfd.addCookie('DataBankName1',DataBankName,10);
           location.href = "#order-paid";
         break; 
         case "Pending": 
           bfd.addCookie('DataSetName',DataSetName,10);
           bfd.addCookie('DataBankName',DataBankName,10);
           location.href = "#order-count";
         break; 
        };
    };
}]);


//first-steps
siteCtrs.controller('firstCon',['$scope','$http','$routeParams','FileUploader',function($scope,$http,$routeParams,FileUploader){
  $scope.g=[
        {text:"政务数据",nat:[
            {text:"工商信息"},
            {text:"住房公积金"},
            {text:"经济指数"},
            {text:"城市数据"}
        ]},
        {text:"金融数据",nat:[
            {text:"个人征信"},
            {text:"企业征信"},
            {text:"身份核验"},
            {text:"黑名单"},
            {text:"银行数据"}
        ]},
        {text:"医疗卫生",nat:[
            {text:"药品数据"},
            {text:"医院医生"},
            {text:"病例数据"},
            {text:"体检数据"}
        ]},
        {text:"人工智能",nat:[
            {text:"语音语料"},
            {text:"人脸采集"},
            {text:"OCR"},
            {text:"文本资料"}
        ]},
        {text:"电商营销",nat:[
            {text:"用户画像"},
            {text:"精准营销"},
            {text:"行业数据"},
            {text:"消费数据"},
            {text:"商品数据"}
        ]},
        {text:"交通数据",nat:[
            {text:"道路"},
            {text:"交通设施"},
            {text:"路况"},
            {text:"车辆数据"},
            {text:"违章信息"},
            {text:"车辆GPS"}
        ]},
        {text:"应用开发",nat:[
            {text:"社交数据"},
            {text:"气象环境"},
            {text:"位置信息"},
            {text:"黑名单"},
            {text:"通讯数据"}
        ]},
        
    ];

    // $rootScope.userName=$scope.userName=bfd.getCookie('userName');
    $scope.SessionId=bfd.getCookie('administratorsSessionId');
    $scope.DataBankName=bfd.getCookie('administratorsUserName');
    $scope.imgUp=false;
    $scope.uploader = new FileUploader({
      url: urlPrefix+'api/file/fileUpload?SessionId='+$scope.SessionId,
    });
    $scope.uploader = new FileUploader();
    $scope.saveUrl=urlPrefix+'api/file/fileUpload?SessionId='+$scope.SessionId;
    var fd = new FormData();
    
    $scope.nextStep=function(){
      var file= document.querySelector('input[type=file]').files[0];
      fd.append('file',file);
      if (file==undefined) {
        $scope.imgUp=true;
      }else{
      $scope.LogoFigType=file.type;
      $scope.LogoFigSize=file.size;
      if ($scope.LogoFigSize<512000 && ($scope.LogoFigType=='image/jpeg'||$scope.LogoFigType=='image/png')) {
        $http({
        method:'POST',
        url:$scope.saveUrl,
        data:fd,
        headers:{'Content-Type':undefined},
        transformRequest:angular.identity
      }).success(function(msg){
        $scope.uploaderSuc=msg.code;
        $scope.imgUp=false;
        $scope.file=file.name;
        if ($scope.dataSize=='B') {
        $scope.SdataSize=$scope.Size;
      }else if ($scope.dataSize=='KB') {
        $scope.SdataSize=$scope.Size*1024;
      }else if ($scope.dataSize=='MB') {
        $scope.SdataSize=$scope.Size*1024*1024;
      }else if ($scope.dataSize=='GB') {
        $scope.SdataSize=$scope.Size*1024*1024*1024;
      }else if ($scope.dataSize=='TB') {
        $scope.SdataSize=$scope.Size*1024*1024*1024*1024;
      }else{
        $scope.SdataSize=$scope.Size;
      };
      if ($scope.uploaderSuc==undefined&&$scope.uploaderSuc!=10000) {
        $scope.imgUp=true;
      }else{
        $scope.LogoFigPath=$scope.file;
      console.log($scope.SdataSize);
      $http({
          method:'GET',
          url:urlPrefix+'api/databank/saveDataSetBasicInfo',
          params:{
            SessionId:$scope.SessionId,
            DataBankName:$scope.DataBankName,
            DataSetName:$scope.DataSetName,
            TopApplicationType:$scope.ihg.text,
            ApplicationType:$scope.nat.text,
            Size:$scope.SdataSize,
            LogoFigPath:$scope.LogoFigPath,
            AbstractInfo:$scope.AbstractInfo
           }
        }).success(function(msg){
                bfd.addCookie('DataSetName',$scope.DataSetName,10);
                location.href="#second-steps";
                // $scope.data=msg.data.DataSets;
                // console.log($scope.data);
                
        });  
      };
        event.target.value='';
      }).error(function(msg){
        alert('上传失败');
      });
      }else{
        alert('图片大小不能超过500kb并格式必须是jpg或png');
      };
      };
      
    };
    //用户名失去焦点时进行验证
    $("#selectUserName").html("仅支持数字,字母,下划线").show();
    $scope.selectDataName = function(DataSetName){
      $scope.DataSetName = DataSetName;
      var reg = /^[a-zA-Z0-9_|.|-]{3,64}$/;
      var flag = reg.test($scope.DataSetName);
      if(flag){
          $("#selectUserName").hide();
          $http({
             method:'GET',
             url:urlPrefix+'api/databank/isUniqueDataSetName',
             params:{
               SessionId:$scope.SessionId,
               DataSetName:$scope.DataSetName,
               DataBankName:$scope.DataBankName
             }
           }).success(function(res){
              $scope.data=res.data;
              if ($scope.data.DataSetNameIsValid == false) {
                    $("#selectUserName").html("此用户名被占用!").css("color","red").show();
                    $scope.DataSetName = '';
              }else{
                   $("#selectUserName").hide();
                 };
                
          })}else{
              $("#selectUserName").html("仅支持数字,字母,下划线").css("color","red").show();
              $scope.DataSetName = '';
         }
      
      };
    // 用户名获得焦点
     $scope.hideSpan=function(){
        $("#selectUserName").html("仅支持数字,字母,下划线").css("color","#ccc").show();
        $scope.DataSetName='';
    };

}]);

//second-steps
siteCtrs.controller('secondCon',['$scope','$http','$routeParams','FileUploader',function($scope,$http,$routeParams,FileUploader){
    $scope.SessionId=bfd.getCookie('administratorsSessionId');
    $scope.DataBankName=bfd.getCookie('administratorsUserName');
    $scope.DataSetName=bfd.getCookie('DataSetName');
    $scope.uploader = new FileUploader();
    $scope.saveUrl=urlPrefix+'api/file/fileUpload?SessionId='+$scope.SessionId;
    $scope.PathS=false;
    $scope.PathHeader='file';
    $scope.mydata=[];
    $scope.sld = [];
    $scope.Sname=[];
    $scope.Sms=[];
    $scope.IDcare=[];
    var i=1;
    $scope.addSh=function(){
          $scope.mydata.push(i);
            i++;
    };
    Array.prototype.indexOf = function (val) {
      for (var i = 0; i < this.length; i++) {
         if (this[i] == val) return i;
       }
       return -1;
     };

    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    $scope.delSh=function(Same,sd,Ss,Icare){
        $scope.sld.remove(sd);
        $scope.Sname.remove(Same);
        $scope.Sms.remove(Ss);
        $scope.IDcare.remove(Icare);
        if(i==1){

      }else{
        $scope.mydata.pop();
        i--;
      }
    };
    // $scope.Path = function() {
    //   if($scope.PathHeader=='jdbc'){
    //     $scope.PHeader=$scope.PathHeader+':';
    //     if($scope.PathInBank == undefined || $scope.PathInBank.length < 5){
    //       $scope.PathS = true;
    //     }else{
    //       $scope.PBank = $scope.PathInBank.substring(0, 5);
    //     }
    //     if($scope.PBank != $scope.PHeader){
    //       $scope.PathS = true;
    //       $scope.PathInBank = '';
    //     }
    //   }else{
    //     $scope.PHeader = $scope.PathHeader + ':///';
    //     if ($scope.PathInBank == undefined || $scope.PathInBank.length < 8) {
    //       $scope.PathS = true;
    //     } else {
    //       $scope.PBank = $scope.PathInBank.substring(0, 8);
    //     };

    //     if ($scope.PBank != $scope.PHeader) {
    //       $scope.PathS = true;
    //       $scope.PathInBank = '';
    //     };
    //   }
    // };
    $scope.Path=function(){
      $scope.PHeader=$scope.PathHeader+':///';
      if($scope.PathInBank==undefined || $scope.PathInBank.length<8){
        $scope.PathS=true;
      }else{
        $scope.PBank=$scope.PathInBank.substring(0,8);
      };
      
      if ($scope.PBank!=$scope.PHeader) {
        $scope.PathS=true;
        $scope.PathInBank='';
      };
    };
    $scope.Hpath=function(){
      $scope.PathS=false;
    };
     $scope.SName=[];
     $scope.sLd=[];
     $scope.SMs=[];
     $scope.IDCare=[];
     $scope.Fieldname='';
     $scope.Fieldtype='';
     $scope.IsidentifyFieldID='';
     $scope.Fielddescription='';
     //保存第一个数据描述
       $scope.Savedata = function(){
           if($scope.SName = []){
              $scope.SName.push($scope.FieldName);}
          }
       $scope.Savedat = function(){
          if($scope.sLd = []){
             $scope.sLd.push($scope.FieldType);}
          }
       $scope.Saveda = function(){
         if($scope.SMs = []){
             $scope.SMs.push($scope.FieldDescription);}
          }
       $scope.Saved = function(){
        if($scope.IDCare = []){
           $scope.IDCare.push($scope.IsIdentifyFieldID);}
         }
         //点击下一步
      $scope.nextStep=function(){
      $scope.file= document.querySelector('input[type=file]').files[0];
      $scope.fd = new FormData();
      $scope.fd.append('file',$scope.file);
      if($scope.file==undefined){
        alert("请选择文件");
      }else{
      $scope.LogoFigType=$scope.file.type;
      $scope.LogoFigSize=$scope.file.size;
      if ($scope.LogoFigSize<512000 && $scope.LogoFigType=='text/plain') {
          $http({
            method:'POST',
            url:$scope.saveUrl,
            data:$scope.fd,
            headers:{'Content-Type':undefined},
            transformRequest:angular.identity
          }).success(function(msg){
            //按顺序存储schema
             $scope.Fieldname=$scope.SName.concat($scope.Sname);
             $scope.Fieldtype=$scope.sLd.concat($scope.sld);
             $scope.Fielddescription=$scope.SMs.concat($scope.Sms);
             $scope.IsidentifyFieldID=$scope.IDCare.concat($scope.IDcare);
             $scope.IdentifyFilePath=$scope.file.name;
             console.log($scope.FieldNamedata);
             $http({
                 method:'GET',
                 url:urlPrefix+'api/databank/saveDataSetSchema',  
                 params:{
                   SessionId:$scope.SessionId,
                   DataBankName:$scope.DataBankName,
                   DataSetName:$scope.DataSetName,
                   PathInBank:$scope.PathInBank,
                   IdentifyFilePath:$scope.IdentifyFilePath,
                   Schema:[{
                     FieldNames:$scope.Fieldname,
                     FieldTypes: $scope.Fieldtype,
                     FieldDescriptions:$scope.Fielddescription,
                     IsIdentifyFieldIDs:$scope.IsidentifyFieldID
                     }]
                  }
                 }).success(function(msg){
                     if (msg.code==10000) {
                           location.href="#third-steps";
                       }else{
                        alert('请检查数据路径或schema是否正确');
                        FieldNames='';
                        $scope.Fieldtype='';
                        $scope.Fielddescription='';
                        $scope.IsidentifyFieldID='';
                        console.log(FieldNames);
                      };
                    
               });
          }).error(function(msg){
            alert('上传失败');
          });
     }else{
      alert('文件大小不能超过500kb并格式必须是CSV或TXT');
     };
   };
    };
    $scope.haha=function(){
      $scope.Sname.push($scope.FieldName);
    };
      

}]);


siteCtrs.controller('thirdCon',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.SessionId=bfd.getCookie('administratorsSessionId');
    $scope.DataBankName=bfd.getCookie('administratorsUserName');
    $scope.DataSetName=bfd.getCookie('DataSetName');
    $scope.nextStep=function(){
      $scope.Description=editor.getValue();
      $scope.description = $scope.Description.replace(/<[^>]+>/g, "");
       $http({
           method:'GET',
           url:urlPrefix+'api/databank/saveDataSetDescp',
           params:{
             SessionId:$scope.SessionId,
             DataBankName:$scope.DataBankName,
             DataSetName:$scope.DataSetName,
             Description:$scope.description
            }
         }).success(function(msg){
           if (msg.code==10000) {
                  location.href="#fourth-steps";
                 // $scope.data=msg.data.DataSets;
                 // console.log($scope.data);
                }else{
                 alert(msg.message);
                }
         });
    };

}]);


//fourth-steps
siteCtrs.controller('fourthCon',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    // userName=$scope.userName=bfd.getCookie('userName');
    $scope.SessionId=bfd.getCookie('administratorsSessionId');
    $scope.DataBankName=bfd.getCookie('administratorsUserName');
    $scope.DataSetName=bfd.getCookie('DataSetName');
    $scope.mydata=[];
    var i=1;
    $scope.addData=function(){
        if(i==3){
            
        }else{
          $scope.mydata.push(i);
            i++;
        }

    };
    Array.prototype.indexOf = function (val) {
      for (var i = 0; i < this.length; i++) {
         if (this[i] == val) return i;
       }
       return -1;
     };

    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    $scope.delData=function(price,unit){
      $scope.price.remove(price);
      $scope.unit.remove(unit);
      if (i==1) {}else{
        $scope.mydata.pop();
        i--;
      }
    };
    $scope.price=[];
    $scope.unit=[];
    $scope.nextStep=function(){
      $scope.price.unshift($scope.Price);
      $scope.unit.unshift($scope.Unit);
      $http({
          method:'GET',
          url:urlPrefix+'api/databank/saveDataSetPrice',
          params:{
            SessionId:$scope.SessionId,
            DataBankName:$scope.DataBankName,
            DataSetName:$scope.DataSetName,
            Prices:{
              Values:$scope.price,
              Units:$scope.unit
                 }         
             }
        }).success(function(msg){
          if (msg.code==10000) {
                location.href="#data-manage";
                // $scope.data=msg.data.DataSets;
                // console.log($scope.data);
            }else{
              alert(msg.message);
              $scope.Pricedata.shift();
              $scope.Unitdata.shift();
            };
        });
    };

}]);


//data-bank
siteCtrs.controller('dataBankCon',['$scope','$http','$routeParams','FileUploader',function($scope,$http,$routeParams,FileUploader){
     $scope.SessionId=bfd.getCookie('administratorsSessionId');
     $scope.DataBankName = bfd.getCookie('administratorsUserName');
     $scope.DataSetName = bfd.getCookie('DataSetName');
     $scope.uploader = new FileUploader();
    $scope.saveUrl=urlPrefix+'api/file/fileUpload?SessionId='+$scope.SessionId;
    $scope.basicInformation=true;
    $scope.dataDescribe=false;
    $scope.priceInstall=false;
    $scope.basicIn=function(){
      $scope.basicInformation=true;
      $scope.dataDescribe=false;
      $scope.priceInstall=false;
    };
    $scope.dataDes=function(){
      $scope.basicInformation=false;
      $scope.dataDescribe=true;
      $scope.priceInstall=false;
       $http({
          method:'GET',
          url:urlPrefix+'api/databank/getDataSetDescp',
          params:{
            SessionId:$scope.SessionId,
            DataBankName:$scope.DataBankName,
            DataSetName:$scope.DataSetName,
           }
        }).success(function(msg){
          $scope.Descri=msg.data;  
        });
    };

  $scope.g=[
        {text:"政务数据",nat:[
            {text:"工商信息"},
            {text:"住房公积金"},
            {text:"经济指数"},
            {text:"城市数据"}
        ]},
        {text:"金融数据",nat:[
            {text:"个人征信"},
            {text:"企业征信"},
            {text:"身份核验"},
            {text:"黑名单"},
            {text:"银行数据"}
        ]},
        {text:"医疗卫生",nat:[
            {text:"药品数据"},
            {text:"医院医生"},
            {text:"病例数据"},
            {text:"体检数据"}
        ]},
        {text:"人工智能",nat:[
            {text:"语音语料"},
            {text:"人脸采集"},
            {text:"OCR"},
            {text:"文本资料"}
        ]},
        {text:"电商营销",nat:[
            {text:"用户画像"},
            {text:"精准营销"},
            {text:"行业数据"},
            {text:"消费数据"},
            {text:"商品数据"}
        ]},
        {text:"交通数据",nat:[
            {text:"道路"},
            {text:"交通设施"},
            {text:"路况"},
            {text:"车辆数据"},
            {text:"违章信息"},
            {text:"车辆GPS"}
        ]},
        {text:"应用开发",nat:[
            {text:"社交数据"},
            {text:"气象环境"},
            {text:"位置信息"},
            {text:"黑名单"},
            {text:"通讯数据"}
        ]},
        
    ];
    $scope.priceIn=function(){
      $scope.basicInformation=false;
      $scope.dataDescribe=false;
      $scope.priceInstall=true;
      $http({
          method:'GET',
          url:urlPrefix+'api/databank/getDataSetPrice',
          params:{
            SessionId:$scope.SessionId,
            DataBankName:$scope.DataBankName,
            DataSetName:$scope.DataSetName,
           }
        }).success(function(msg){
          $scope.PriceIn=msg.data.prices;  
          console.log($scope.PriceIn);
          $scope.Price=$scope.PriceIn[0].price;
          $scope.Unit=$scope.PriceIn[0].unit;
        });

    }; 
    $scope.dunit=function(dataUnit){
        if (dataUnit=="week") {
          return $scope.dataUnit='周';
        }else if(Unit=='month'){
          return $scope.dataUnit='月';
        }else if (Unit=='year') {
          return $scope.dataUnit='年';
        }
    };
    $scope.LOST= function(){
      console.log($scope.ihg.text);
    };
   //获取信息
     $http({
          method:'GET',
           url:urlPrefix+'api/databank/getDataSetBasicInfo',
           params:{
             SessionId:$scope.SessionId,
             DataBankName:$scope.DataBankName,
             DataSetName:$scope.DataSetName
            }
         }).then(function(response){
             //成功时执行
             $scope.data = response.data;
             $scope.imgSrc=urlPrefix+'api/file/getImage?fileName='+$scope.data.data.LogoFigFile+'&filePath='+$scope.data.data.LogoFigPath+'&SessionId='+$scope.SessionId; 
            var reg=/(?=(?!\b)(\d{3})+$)/g;  
            $scope.datasize=String($scope.data.data.Size).replace(reg, ',');
            console.log($scope.data);
            $scope.nat=$scope.data.data.ApplicationType;
            $scope.ihg=$scope.data.data.TopApplicationType;
         },function(response){
             //失败时执行 
             console.log("response");
             
         });

    //第一页保存信息
    $scope.nextStepB=function(){
        $scope.datasize=$scope.datasize.replace(',','');
        if($scope.nat.text == undefined){
            $scope.nat=$scope.data.data.ApplicationType;
            $scope.ihg=$scope.data.data.TopApplicationType;
        }else{
            $scope.nat=$scope.nat.text;
            $scope.ihg=$scope.ihg.text;
        }


        //保存图片更改
        var fd1 = new FormData();
        var file= document.querySelector('input[type=file]').files[0];
        fd1.append('file',file);
        console.log(file);
        if(file==undefined){
            $scope.LogoFigPath=$scope.data.data.LogoFigFile;
            $http({
              method:'GET',
              url:urlPrefix+'api/databank/saveDataSetBasicInfo',
              params:{
                  SessionId:$scope.SessionId,
                  DataBankName:$scope.DataBankName,
                  DataSetName:$scope.DataSetName,
                  TopApplicationType:$scope.ihg,
                  ApplicationType:$scope.nat,
                  Size:$scope.datasize,
                  LogoFigPath:$scope.LogoFigPath,
                  AbstractInfo:$scope.data.data.AbstractInfo
                 }
              }).success(function(msg){
                  $scope.basicInformation=false;
                  $scope.dataDescribe=true;
                  $scope.priceInstall=false;  
                  $http({
                    method:'GET',
                    url:urlPrefix+'api/databank/getDataSetDescp',
                    params:{
                      SessionId:$scope.SessionId,
                      DataBankName:$scope.DataBankName,
                      DataSetName:$scope.DataSetName,
                     }
        }).success(function(msg){
          $scope.Descri=msg.data;  
        });
              });
        }else{
          $scope.LogoFigPath=file;
          $scope.LogoFigType=file.type;
          $scope.LogoFigSize=file.size;   
          if ($scope.LogoFigSize<512000 && ($scope.LogoFigType=='image/jpeg'||$scope.LogoFigType=='image/png')) {
              $http({
              method:'POST',
              url:$scope.saveUrl,
              data:fd1,
              headers:{'Content-Type':undefined},
              transformRequest:angular.identity
            }).success(function(msg){
              $scope.uploaderSuc=msg.code;
              $scope.imgUp=false;
              $scope.file=file.name;
              event.target.value='';
           //保存更改
              $http({
                  method:'GET',
                  url:urlPrefix+'api/databank/saveDataSetBasicInfo',
                  params:{
                    SessionId:$scope.SessionId,
                    DataBankName:$scope.DataBankName,
                    DataSetName:$scope.DataSetName,
                    TopApplicationType:$scope.ihg.text,
                    ApplicationType:$scope.nat.text,
                    Size:$scope.datasize,
                    LogoFigPath:$scope.file,
                    AbstractInfo:$scope.data.data.AbstractInfo
                   }
                }).success(function(msg){
                    $scope.basicInformation=false;
                    $scope.dataDescribe=true;
                    $scope.priceInstall=false;  
                }); 
            }).error(function(msg){
              alert('上传失败');
            });
            }else{
              alert('图片大小不能超过500kb并格式必须是JPG或png');
            };

         };
   };
 //第二页保存信息
    $scope.nextStepD=function(){
      $scope.Description=editor1.getValue();
      $scope.description= $scope.Description.replace(/<[^>]+>/g, "");
      $http({
          method:'GET',
          url:urlPrefix+'api/databank/saveDataSetDescp',
          params:{
            SessionId:$scope.SessionId,
            DataBankName:$scope.DataBankName,
            DataSetName:$scope.DataSetName,
            Description:$scope.description
           }
        }).success(function(msg){
            $scope.basicInformation=false;
            $scope.dataDescribe=false;
            $scope.priceInstall=true;
                  $http({
          method:'GET',
          url:urlPrefix+'api/databank/getDataSetPrice',
          params:{
            SessionId:$scope.SessionId,
            DataBankName:$scope.DataBankName,
            DataSetName:$scope.DataSetName,
           }
        }).success(function(msg){
          $scope.PriceIn=msg.data.prices;  
          console.log($scope.PriceIn);
          $scope.Price=$scope.PriceIn[0].price;
          $scope.Unit=$scope.PriceIn[0].unit;
        });
                
        });
    };

  //第三页保存信息
    $scope.mydata=[];
    var i=1;
    $scope.addData=function(){
        if(i==3){
            
        }else{
          $scope.mydata.push(i);
            i++;
        }
    };
    Array.prototype.indexOf = function (val) {
      for (var i = 0; i < this.length; i++) {
         if (this[i] == val) return i;
       }
       return -1;
     };

    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    $scope.change=function(unit){
      console.log(unit.unit);
    };
    $scope.delData=function(price,unit){
      $scope.Pricedata.remove(price);
      $scope.Unitdata.remove(unit);
      if (i==1) {}else{
        $scope.mydata.pop();
        i--;
      }
    };
    $scope.Pricedata=[];
    $scope.Unitdata=[];
    $scope.nextStepP=function(){
       $scope.Pricedata.unshift($scope.Price);
       $scope.Unitdata.unshift($scope.Unit);
      // if ($scope.Price2==undefined) {
      //   $scope.Pricedata=[$scope.Price];
      //   $scope.Unitdata=[$scope.Unit];
      // }else{
      //   $scope.Pricedata=[$scope.Price,$scope.Price2];
      //   $scope.Unitdata=[$scope.Unit,$scope.Unit2];
      // };
       $http({
          method:'GET',
          url:urlPrefix+'api/databank/saveDataSetPrice',
          params:{
            SessionId:$scope.SessionId,
           DataBankName:$scope.DataBankName,
           DataSetName:$scope.DataSetName,
            Prices:{
             Values:$scope.Pricedata,
              Units:$scope.Unitdata
                }         
            }
      }).success(function(msg){
          if (msg.code==10000) {
            location.href="#data-manage";
          }else{
            $scope.Pricedata.shift();
            $scope.Unitdata.shift();
          }
            // location.href="#data-manage";
            $scope.data=msg.data.DataSets;
                
      });
    };
}]);


//data-manage
siteCtrs.controller('dataManageCon',['$scope','$http','$routeParams',function($scope,$http,$routeParams){

    $scope.SessionId=bfd.getCookie('administratorsSessionId');
    $scope.DataBankName = bfd.getCookie('administratorsUserName');
    $http({
          method:'GET',
          url:urlPrefix+'api/databank/getDataSetForDataBank',
          params:{
            SessionId:$scope.SessionId,
            DataBankName:$scope.DataBankName
           }
        }).success(function(msg){
             $scope.data=msg.data.DataSets;
             if($scope.data.length==0){
                   $scope.pageshow=false;
                   $("#noMessage").html("暂无商品数据!");
             }else{
              $scope.pageshow=true;
              bfd.addCookie('DataBankName',msg.data.DataSets[0].DataSetName,10);
             };
             if($scope.data.length<4){
              $scope.pageShow=false;
             }else{
              $scope.pageShow=true;
             }
            $scope.pageSize = 4;
            $scope.pages = Math.ceil($scope.data.length / $scope.pageSize); //分页数
            $scope.newPages = $scope.pages > 5 ? 5 : $scope.pages;
            $scope.pageList = [];
            $scope.selPage = 1;
            //设置表格数据源(分页)
            $scope.setData = function () {
            $scope.items = $scope.data.slice(($scope.pageSize * ($scope.selPage - 1)), ($scope.selPage * $scope.pageSize));//通过当前页数筛选出表格当前显示数据
            }
            $scope.items = $scope.data.slice(0, $scope.pageSize);
            //分页要repeat的数组
            for (var i = 0; i < $scope.newPages; i++) {
            $scope.pageList.push(i + 1);
            }
            //打印当前选中页索引
            $scope.selectPage = function (page) {
            //不能小于1大于最大
            if (page < 1 || page > $scope.pages) return;
            //最多显示分页数5
            if (page > 2) {
            //因为只显示5个页数，大于2页开始分页转换
            var newpageList = [];
            for (var i = (page - 3) ; i < ((page + 2) > $scope.pages ? $scope.pages : (page + 2)) ; i++) {
            newpageList.push(i + 1);
            }
            $scope.pageList = newpageList;
            }
            $scope.selPage = page;
            $scope.setData();
            $scope.isActivePage(page);
            };
            //设置当前选中页样式
            $scope.isActivePage = function (page) {
            return $scope.selPage == page;
            };
            //上一页
            $scope.Previous = function () {
            $scope.selectPage($scope.selPage - 1);
            }
            //下一页
            $scope.Next = function () {
            $scope.selectPage($scope.selPage + 1);
            };
                
        });
 
    $scope.del = function(index,DataSetName){
      bfd.addCookie("DataSetName",DataSetName,10);
      location.href="#data-bank";
 
   }; 
   $scope.dunit=function(unit){
    if (unit=="week") {
      return $scope.unit='周';
    }else if(unit=='month'){
      return $scope.unit='月';
    }else if (unit=='year') {
      return $scope.unit='年';
    }
   };

      $scope.m = [];
      $scope.checked = [];
      $scope.selectAll = function () {
          if($scope.select_all) {
              $scope.checked = [];
              angular.forEach($scope.data, function (i) {
                  i.checked = true;
                  $scope.checked.push(i);
              })
          }else {
              angular.forEach($scope.data, function (i) {
                  i.checked = false;
                  $scope.checked = [];
              })
          }
      };
    $scope.selectOne = function () {

        angular.forEach($scope.data , function (i) {
            var index = $scope.checked.indexOf(i);
            if(i.checked && index === -1) {
                $scope.checked.push(i);
            } else if (!i.checked && index !== -1){
                $scope.checked.splice(index, 1);
            };
        })

        if ($scope.data.length === $scope.checked.length) {
            $scope.select_all = true;
        } else {
            $scope.select_all = false;
        }
     };

  $scope.Dsize=function(orderSize){
      return $scope.orderSize=parseFloat(orderSize).toLocaleString();
     };
}]);


//company-inif-manage
siteCtrs.controller('companyCon',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    // $scope.userName=bfd.getCookie('userName');
    $scope.SessionId = bfd.getCookie('administratorsSessionId');
    $scope.DataBankName = bfd.getCookie('administratorsUserName');
        $http({
          method:'GET',
          url:urlPrefix+'api/databank/getDataBankInfo',
          params:{
            SessionId:$scope.SessionId,
            DataBankName:$scope.DataBankName
           }
        }).success(function(msg){
                // console.log(msg);
                $scope.data=msg.data;
                
        });
}]);


//订阅中页面
siteCtrs.controller('order',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.sessionId = bfd.getCookie('SessionId');
    $scope.SubscriberName = bfd.getCookie('UserName');
    $scope.DataBankName = bfd.getCookie('DataBankName1');
    $scope.DataSetName = bfd.getCookie('DataSetName1');

    $scope.orderShow = false;
    $scope.orderHide = true;
   $http({
        method:'GET', 
        url:urlPrefix+'api/databank/getSpecificSubsRec',
        params:{
           SessionId:$scope.sessionId,
           SubscriberName:$scope.SubscriberName,
           DataSetName:$scope.DataSetName,
           DataBankName:$scope.DataBankName
       }
    }).then(function(response){
        $scope.data = response.data.data;
        console.log($scope.data);
        if($scope.data.BillAddress=="null"){
          $scope.gg=true;
        }else{
           $scope.gg=false;
        }
         $scope.CertificationFile=$scope.data.CertificationFile;
         $scope.CertificationPath=$scope.data.CertificationPath;
        $scope.imgSrc=urlPrefix+'api/file/getImage?fileName='+$scope.data.LogoFigFile+'&filePath='+$scope.data.LogoFigPath+'&SessionId='+$scope.sessionId;
    },function(response){
        console.log("response");
    });
    $scope.ifOrder=function(OStatus){
       if (OStatus=="Pending") {
          return $scope.OStatus='待确认';
        }else if(OStatus=='Normal'){
          return $scope.OStatus='正常';
        }else if (OStatus=='Abnormal') {
          return $scope.OStatus='异常';
        }else if(OStatus=='Expired'){
          return $scope.OStatus='已过期';
        }else if(OStatus=='Stopped'){
          return $scope.OStatus='被终止';
        }else if(OStatus=="Unpaid"){
          return $scope.OStatus="未支付";
        }
    };
    $scope.uporderS=false;
   //证书下载
   //点击刷新获取
   $scope.toggle=function(){
    $scope.orderShow = true;
       $scope.orderHide = false;
    $http({
      method:'GET',
      url:urlPrefix+'api/databank/reGetOrderInfo',
      params:{
        SessionId:$scope.SessionId,
        SubscriberName:$scope.SubscriberName,
        DataSetName:$scope.DataSetName,
        DataBankName:$scope.DataBankName
      }
    }).success(function(msg){
      $scope.CertificationFile=msg.data.CertificationFile;
      $scope.CertificationPath=msg.data.CertificationPath;
      $scope.orderHide=true;
      $scope.orderShow = false;
    });
   };
  $scope.orderLoad = function(CertificationFile,CertificationPath){
   $http({
      method:'GET',
      url:urlPrefix+'api/file/download',
      params:{
        SessionId:$scope.SessionId,
        fileName:$scope.CertificationFile,
        filePath:$scope.CertificationPath
      }
    }).success(function(msg){
      if (msg.code!=30000 && msg.code!=70002 && msg.code!=70003) {
          location.href = urlPrefix+'api/file/download?SessionId='+$scope.sessionId+'&fileName='+$scope.CertificationFile+'&filePath='+$scope.CertificationPath; 
          $scope.orderShow=false;
        }else{
          $scope.orderShow=true;
          $scope.uporderS=true;
          $scope.orderHide=false;
        };
    }).error(function(){
      alert('请重新获取');
      $scope.updataS=true;
    });
  };
     $scope.dunit=function(unit){
    if (unit=="week") {
      return $scope.unit='周';
    }else if(unit=='month'){
      return $scope.unit='月';
    }else if (unit=='year') {
      return $scope.unit='年';
    }
   };
 
}]);


//已过期页面
siteCtrs.controller('orderPast',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.sessionId = bfd.getCookie('SessionId');
    $scope.SubscriberName = bfd.getCookie('UserName');
    $scope.DataBankName = bfd.getCookie('DataBankName1');
    $scope.DataSetName = bfd.getCookie('DataSetName1');

   $http({
        method:'GET', 
        url:urlPrefix+'api/databank/getSpecificSubsRec',
        params:{
           SessionId:$scope.sessionId,
           SubscriberName:$scope.SubscriberName,
           DataSetName:$scope.DataSetName,
           DataBankName:$scope.DataBankName
       }
    }).then(function(response){
        $scope.data = response.data.data;
    if($scope.data.BillAddress=="null"){
          $scope.gg=true;
        }else{
           $scope.gg=false;
        }
        $scope.imgSrc=urlPrefix+'api/file/getImage?fileName='+$scope.data.LogoFigFile+'&filePath='+$scope.data.LogoFigPath+'&SessionId='+$scope.sessionId;
    },function(response){
        console.log("response");
    });
    $scope.ifOrder=function(OStatus){
           if (OStatus=="Pending") {
              return $scope.OStatus='待确认';
            }else if(OStatus=='Normal'){
              return $scope.OStatus='正常';
            }else if (OStatus=='Abnormal') {
              return $scope.OStatus='异常';
            }else if(OStatus=='Expired'){
              return $scope.OStatus='已过期';
            }else if(OStatus=='Stopped'){
              return $scope.OStatus='被终止';
            }else if(OStatus=="Unpaid"){
              return $scope.OStatus="未支付";
            }
        };
       $scope.dunit=function(unit){
    if (unit=="week") {
      return $scope.unit='周';
    }else if(unit=='month'){
      return $scope.unit='月';
    }else if (unit=='year') {
      return $scope.unit='年';
    }
   };
}]);


//已过期页面
siteCtrs.controller('orderPaid',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.sessionId = bfd.getCookie('SessionId');
    $scope.SubscriberName = bfd.getCookie('UserName');
    $scope.DataBankName = bfd.getCookie('DataBankName1');
    $scope.DataSetName = bfd.getCookie('DataSetName1');
    $scope.TotalPrice = '';
    $scope.Unit = '';
    $scope.Number = '';

   $http({
        method:'GET', 
        url:urlPrefix+'api/databank/getSpecificSubsRec',
        params:{
           SessionId:$scope.sessionId,
           SubscriberName:$scope.SubscriberName,
           DataSetName:$scope.DataSetName,
           DataBankName:$scope.DataBankName
       }
    }).then(function(response){
        bfd.addCookie('DataSetName',$scope.DataSetName,10)
        bfd.addCookie('DataBankName',$scope.DataBankName,10)
        $scope.data = response.data.data;
        console.log($scope.data);
        if($scope.data.BillAddress=="null"){
              $scope.gg=true;
        }else{
              $scope.gg=false;
        }
        $scope.TotalPrice = $scope.data.TotalPrice;
        $scope.Unit = $scope.data.Unit;
        $scope.Number = $scope.data.Number;
        $scope.imgSrc=urlPrefix+'api/file/getImage?fileName='+$scope.data.LogoFigFile+'&filePath='+$scope.data.LogoFigPath+'&SessionId='+$scope.sessionId;
    },function(response){
        console.log("response");
    });
    $scope.ifOrder=function(OStatus){
           if (OStatus=="Pending") {
              return $scope.OStatus='待确认';
            }else if(OStatus=='Normal'){
              return $scope.OStatus='正常';
            }else if (OStatus=='Abnormal') {
              return $scope.OStatus='异常';
            }else if(OStatus=='Expired'){
              return $scope.OStatus='已过期';
            }else if(OStatus=='Stopped'){
              return $scope.OStatus='被终止';
            }else if(OStatus=="unpaied"){
              return $scope.OStatus="未支付";
            }
        };
   $scope.dunit=function(unit){
    if (unit=="week") {
      return $scope.unit='周';
    }else if(unit=='month'){
      return $scope.unit='月';
    }else if (unit=='year') {
      return $scope.unit='年';
    }
   };

    $scope.Payment = function(){
     $http({
        method:'GET',
        url:urlPrefix+'api/databank/submitPendingOrder',
        params:{
          SessionId:$scope.SessionId,
          DataSetName:$scope.DataSetName,
          DataBankName:$scope.DataBankName,
          SubscriberName:$scope.SubscriberName,
          SubscriptionNumber:$scope.Number,
          SubscriptionPrice:$scope.TotalPrice,
          SubscriptionUnit:$scope.Unit
        }
      }).success(function(msg){
        // if(msg.code != 1000){
        //     alert("您已经购买过此数据!");
        //     location.href="#dataItem-classify";
        // }else{

        location.href="#submit-order";
        // }
       }).error(function(){

      });
    };
    
}]);


//解混淆页面
siteCtrs.controller('resolve',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.sessionId = bfd.getCookie('SessionId');
    $scope.SubscriberName = bfd.getCookie('UserName');
    let today = new Date();   
    let date = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    $scope.startDate = `${year}/${month}/${date}`;
    let RecoverBeginTime = (new Date($scope.startDate)).getTime();
    $scope.RecoverLength = '';
    $scope.ddate = '';


    $scope.confusion = true;
    if(window.localStorage.getItem('RecoverBeginTime1') == RecoverBeginTime){
        $scope.confusion = !$scope.confusion;
              //页面加载
        $scope.RecoverEndTime = window.localStorage.getItem('RecoverLength1');
        $scope.RecoverBeginTime = window.localStorage.getItem('RecoverBeginTime1');
        $scope.RecoverLength = $scope.RecoverEndTime - $scope.RecoverBeginTime;
         $http({
         method:'GET', 
         url:urlPrefix+'api/databank/applyConfusionMsg',
        params:{
            SessionId:$scope.sessionId,
            SubscriberName:$scope.SubscriberName,
            RecoverLength:$scope.RecoverLength,
            RecoverBeginTime:$scope.RecoverBeginTime
        }
         }).then(function(response){
             $scope.data = response.data.data;
             $scope.CertificationFile=$scope.data.CertificationFile;
             $scope.CertificationPath=$scope.data.CertificationPath;
         },function(response){
             console.log("response");
         });

     };
    
       //获取插件中选中的时间
    
    $('input').on('input propertychange',function(){
       $scope.RecoverLength = $(this).val();
         $scope.ddate = new Date(($scope.RecoverLength.valueOf()).replace(new RegExp("-","gm"),"/")).getTime();
         window.localStorage.setItem('RecoverLength1',$scope.ddate);
         window.localStorage.setItem('RecoverBeginTime1',RecoverBeginTime);
     });      
     
    //点击存入cookie中
    $scope.ApplyResolve = function(){

      if($scope.ddate <= RecoverBeginTime){
        alert("请选择正确订购截止日期!");
      }else{

        $scope.confusion = !$scope.confusion;
        $scope.RecoverEndTime = window.localStorage.getItem('RecoverLength1');
        $scope.RecoverBeginTime = window.localStorage.getItem('RecoverBeginTime1');
        $scope.RecoverLength = $scope.RecoverEndTime - $scope.RecoverBeginTime;
         $http({
         method:'GET', 
         url:urlPrefix+'api/databank/applyConfusionMsg',
        params:{
            SessionId:$scope.sessionId,
            SubscriberName:$scope.SubscriberName,
            RecoverLength:$scope.RecoverLength,
            RecoverBeginTime:$scope.RecoverBeginTime
        }
         }).then(function(response){
             $scope.data = response.data.data;

         },function(response){
             console.log("response");
         });
      }

 };


    //证书下载
    $scope.uporderS=false;
    $scope.toggle=function(){
    $http({
      method:'GET',
      url:urlPrefix+'api/databank/reGetOrderInfo',
      params:{
        SessionId:$scope.SessionId,
        SubscriberName:$scope.SubscriberName,
        DataSetName:$scope.DataSetName,
        DataBankName:$scope.DataBankName
      }
    }).success(function(msg){
      $scope.CertificationFile=msg.data.CertificationFile;
      $scope.CertificationPath=msg.data.CertificationPath;
    });
   };
  $scope.downLoad = function(CertificationFile,CertificationPath){
      $scope.CertificationFile = CertificationFile;
      $scope.CertificationPath = CertificationPath;
    $http({
      method:'GET',
      url:urlPrefix+'api/file/download',
      params:{
        SessionId:$scope.SessionId,
        fileName:$scope.CertificationFile,
        filePath:$scope.CertificationPath
      }
    }).success(function(msg){
      if (msg.code!=30000 && msg.code!=70002 && msg.code!=70003) {
          location.href = urlPrefix+'api/file/download?SessionId='+$scope.sessionId+'&fileName='+$scope.CertificationFile+'&filePath='+$scope.CertificationPath; 
        }else{
          $scope.uporderS=true;
        };
    }).error(function(){
      alert('请重新获取');
      $scope.updataS=true;
    });
       };

}]);


siteCtrs.controller('registerCon',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.mobileRegx = "^1(3[0-9]|4[57]|5[0-35-9]|7[01678]|8[0-9])\\d{8}$";
    $scope.display=false;
    var userIP=returnCitySN["cip"];
    var userCity=returnCitySN["cname"];
    var aks='yLGwLxGiQcNvDW4Vju98G1vXuYV7VCd2';
    console.log(userIP+","+userCity);
        $.ajax({
            url:'http://api.map.baidu.com/location/ip',
            type : 'get',
            data:{
                ip:userIP,
                ak:aks,
                coor:'bd09ll'
            },
            dataType: 'jsonp',
            success:function(msg){
                $scope.Latitude=msg.content.point.x;
                $scope.Longitude=msg.content.point.y;
            }
        });
        //用户名验证
        $scope.UserNameR = function(){
          //限制用户名
          var reg = /^[a-zA-Z0-9_|.|-]{3,64}$/;
          var flag = reg.test($scope.UserName);
             if(flag){
                $scope.Standard=false;
             }else{
                $scope.Standard=true;
                $scope.UserName='';
             };
          $scope.Standard=false;
          $scope.showT=false;
          if ($scope.UserName==undefined || $scope.UserName=='') {
          $scope.Standard=true;
          $scope.showT=false;
        }else if($scope.UserName.length<2){
          $scope.Standard=true;
          $scope.showT=false;
        }else if($scope.UserName==''){
          $scope.Standard=false;
          $scope.showT=false;
        }else{
          $scope.Standard=false;
          $http({
            method:'GET',
            url:urlPrefix+'/api/user/checkUserExistence',
            params:{
              UserName:$scope.UserName
            }
          }).success(function(res){
            // console.log(res);
            $scope.data=res.data;
            if ($scope.data.Existence==false) {
              $scope.showT=$scope.data.Existence;
            }else{
              $scope.showT=$scope.data.Existence;
              // alert("用户名被占用,请重新输入");
              $scope.UserName='';
            };
          });
        };
          
        };
        $scope.TelPhoneb=function(){
          if ($scope.TelNumber==undefined||$scope.TelNumber.toString().length!=11) {
            $scope.TelNum1=true;
            $scope.TelNum2=false;
          }else{
            $scope.TelNum1=false;
            $scope.TelNum2=false;
            $http({
              method:'GET',
              url:urlPrefix+'/api/user/checkTelNumberExistence',
              params:{
                TelNumber:$scope.TelNumber
              }
            }).success(function(msg){
              if (msg.data.Existence) {
                $scope.TelNum2=true;
                $scope.TelNumber="";
              }
            });
          };
        };
        $scope.TelPhonef=function(){
          $scope.TelNum1=false;
          $scope.TelNum2=false;
        };
        $scope.Standard=false;
        $scope.UserNameH=function(){
                $scope.Standard=false;
                $scope.showT=false;
              };
        $scope.repeatPWD = function(){
            if($scope.PassWord != $scope.repeatPassWord){
                $scope.PassWord="";
                $scope.repeatPassWord="";
            }
        };
    $scope.register = function () {
       if($scope.checkedText == true){
            // $http({
            //   method:'GET',
            //   url:'data/checkCode.php',
            //   params:{
            //     code:$scope.IdentifyCode
            //   }
            // }).success(function(msg){
            //   if (msg==0) {
            //     $http({
            //     method:"GET",
            //     url:urlPrefix+'api/user/register',
            //     params:{
            //         UserName:$scope.UserName,
            //         PassWord:$scope.PassWord,
            //         IdentifyCode:$scope.IdentifyCode,
            //         TelNumber:$scope.TelNumber,
            //         Email:$scope.email,
            //         Latitude:$scope.Latitude,
            //         Longitude:$scope.Longitude
            //     }
            // }).then(function successCallback(response) {
            //   TelNumber=$scope.TelNumber;
            //      $('#myModal').modal('show');
            // }, function errorCallback(response) {
            //     // 请求失败执行代码
            //     location.href="#register";
            // }); 
            //   }else{
            //     alert("验证码不正确");
            //     $scope.IdentifyCode='';
            //   };
            // });


                $http({
                method:"GET",
                url:urlPrefix+'api/user/register',
                params:{
                    UserName:$scope.UserName,
                    PassWord:$scope.PassWord,
                    IdentifyCode:$scope.IdentifyCode,
                    TelNumber:$scope.TelNumber,
                    Email:$scope.email,
                    Latitude:$scope.Latitude,
                    Longitude:$scope.Longitude
                }
            }).then(function successCallback(response) {
              TelNumber=$scope.TelNumber;
                 $('#myModal').modal('show');
            }, function errorCallback(response) {
                // 请求失败执行代码
                location.href="#register";
            }); 
        }else{
         alert("请勾选条款!");
        }
    };
    $scope.confirm=function(){
      $scope.regin=setInterval(function(){
        location.href="#register-success";
      },1000);
      $scope.qingchu=setInterval(function(){
        clearInterval($scope.regin);
      },1000);
      
    };

}]);


//login  页面
siteCtrs.controller('loginCon',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
  $scope.index=false;
   // $scope.entry = function () {
   //      $http({
   //        method:'GET',
   //        url:'data/checkCode.php',
   //        params:{
   //          code:$scope.IdentifyCode
   //        }
   //      }).success(function(msg){
   //        if (msg==0) {
   //          $http({
   //            method:'post',
   //            url:urlPrefix+'api/login/login',
   //            params:{
   //              UserName:$scope.UserName,
   //              PassWord:$scope.PassWord,
   //              IdentifyCode:$scope.IdentifyCode
   //             }
   //         }).success(function(msg){
   //          if(msg.code==10000){
   //                  bfd.addCookie('SessionId',msg.data.SessionId,10);
   //                  bfd.addCookie('UserName',$scope.UserName,10);
   //                  window.localStorage.setItem('SessionId',msg.data.SessionId);
   //                  SessionId=msg.data.SessionId;
   //                 UserName=$scope.UserName;
   //                  location.href="#main";
   //          }else{
   //            alert('用户名或密码不正确');
   //          };
   //      });
   //       }else{
   //        alert("验证码不正确");
   //       };
          
   //      });
        
   //      } 
        $scope.entry = function () {
            $http({
              method:'post',
              url:urlPrefix+'api/login/login',
              params:{
                UserName:$scope.UserName,
                PassWord:$scope.PassWord,
                IdentifyCode:$scope.IdentifyCode
               }
           }).success(function(msg){
            if(msg.code==10000){
                    bfd.addCookie('SessionId',msg.data.SessionId,10);
                    bfd.addCookie('UserName',$scope.UserName,10);
                    window.localStorage.setItem('SessionId',msg.data.SessionId);
                    SessionId=msg.data.SessionId;
                   UserName=$scope.UserName;
                    location.href="#main";
            }else{
              alert('用户名或密码不正确');
            };
        });       
        } 
    
}]);


//administrators  页面
siteCtrs.controller('administratorsCon',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
  $scope.index=false;
   // $scope.entry = function () {
   //      $http({
   //        method:'GET',
   //        url:'data/checkCode.php',
   //        params:{
   //          code:$scope.IdentifyCode
   //        }
   //      }).success(function(msg){
   //        if (msg==0) {
   //          $http({
   //            method:'post',
   //            url:urlPrefix+'api/login/loginForDataBank',
   //            params:{
   //              UserName:$scope.UserName,
   //              PassWord:$scope.PassWord,
   //              IdentifyCode:$scope.IdentifyCode
   //             }
   //         }).success(function(msg){
   //          if (msg.code==10000) {
   //              bfd.addCookie('administratorsSessionId',msg.data.SessionId,10);
   //              bfd.addCookie('administratorsUserName',$scope.UserName,10);
   //              location.href="#company";
   //            }else{
   //              alert("账号或密码不正确");
   //            };
   //      });
   //        }else{
   //          alert("验证码不正确");
   //        }
   //      });
        
   //      }

        $scope.entry = function () {
            $http({
              method:'post',
              url:urlPrefix+'api/login/loginForDataBank',
              params:{
                UserName:$scope.UserName,
                PassWord:$scope.PassWord,
                IdentifyCode:$scope.IdentifyCode
               }
           }).success(function(msg){
            if (msg.code==10000) {
                bfd.addCookie('administratorsSessionId',msg.data.SessionId,10);
                bfd.addCookie('administratorsUserName',$scope.UserName,10);
                location.href="#company";
              }else{
                alert("账号或密码不正确");
              };
        });       
        }  
    
}]);


siteCtrs.controller('registerSuccessCon',['$scope','$http','$routeParams',function($scope,$http,$routeParams){

   clearInterval($scope.regin);
   $scope.res=setInterval(function(){
      location.href="#login";
    },3000);
    $scope.qingchu=setInterval(function(){
        clearInterval($scope.res);
      },3000);

}]);


siteCtrs.controller('main',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.UserName=bfd.getCookie('UserName');
    $scope.finance=function(){
      bfd.addCookie('TopApplicationType',"金融数据",10);
      location.href='#dataItem-classify';
    };
    $scope.traffic=function(){
      bfd.addCookie('TopApplicationType',"交通数据",10);
      location.href='#dataItem-classify';
    };
    $scope.government=function(){
      bfd.addCookie('TopApplicationType',"政务数据",10);
      location.href='#dataItem-classify';
    };
    $scope.medicalCare=function(){
      bfd.addCookie('TopApplicationType',"医疗卫生",10);
      location.href='#dataItem-classify';
    };
    $scope.artificial=function(){
      bfd.addCookie('TopApplicationType',"人工智能",10);
      location.href='#dataItem-classify';
    };
    $scope.marketing=function(){
      bfd.addCookie('TopApplicationType',"电商营销",10);
      location.href='#dataItem-classify';
    };
    $scope.applicationD=function(){
      bfd.addCookie('TopApplicationType',"应用开发",10);
      location.href='#dataItem-classify';
    };
}]);

//dataItem-classify
siteCtrs.controller('dataItem-classify',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
  $scope.SessionId=bfd.getCookie('SessionId');
  $scope.UserName=bfd.getCookie('UserName');
  $scope.TopApplicationType=bfd.getCookie('TopApplicationType');
  $scope.data = "";
  $scope.punit=function(unit){
    if (unit=='week') {
      return $scope.unit='周';
    }else if(unit=='month'){
      return $scope.unit='月';
    }else if (unit=='year') {
      return $scope.unit='年';
    }
  };
  $http({
    url:urlPrefix+'api/databank/getDataSetByAppType',
    method:"GET",
    params:{
      SessionId:$scope.SessionId,
      TopApplicationType:$scope.TopApplicationType
    }
  }).success(function(msg){
    $scope.imgSrc=urlPrefix+'api/file/getImage';
    $scope.data=msg.data.DataSets;
    if($scope.data != ""){
         $scope.pageShow=true;
    }else{
         $("#noMessage").html("暂无数据!");
         $scope.pageShow=false;
    };
    $scope.pic=$scope.data[0].logoFigPath;
    $scope.pageSize = 8;
    $scope.pages = Math.ceil($scope.data.length / $scope.pageSize); //分页数
    $scope.newPages = $scope.pages > 5 ? 5 : $scope.pages;
    $scope.pageList = [];
    $scope.selPage = 1;
    //设置表格数据源(分页)
    $scope.setData = function () {
    $scope.items = $scope.data.slice(($scope.pageSize * ($scope.selPage - 1)), ($scope.selPage * $scope.pageSize));//通过当前页数筛选出表格当前显示数据
    }
    $scope.items = $scope.data.slice(0, $scope.pageSize);
    //分页要repeat的数组
    for (var i = 0; i < $scope.newPages; i++) {
    $scope.pageList.push(i + 1);
    }
    //打印当前选中页索引
    $scope.selectPage = function (page) {
    //不能小于1大于最大
    if (page < 1 || page > $scope.pages) return;
    //最多显示分页数5
    if (page > 2) {
    //因为只显示5个页数，大于2页开始分页转换
    var newpageList = [];
    for (var i = (page - 3) ; i < ((page + 2) > $scope.pages ? $scope.pages : (page + 2)) ; i++) {
    newpageList.push(i + 1);
    }
    $scope.pageList = newpageList;
    }
    $scope.selPage = page;
    $scope.setData();
    $scope.isActivePage(page);
    };
    //设置当前选中页样式
    $scope.isActivePage = function (page) {
    return $scope.selPage == page;
    };
    //上一页
    $scope.Previous = function () {
    $scope.selectPage($scope.selPage - 1);
    }
    //下一页
    $scope.Next = function () {
    $scope.selectPage($scope.selPage + 1);
    };

  });
  $scope.query=function(index,dataSetName,dataBankName){
    bfd.addCookie('DataSetName',dataSetName,10);
    bfd.addCookie('DataBankName',dataBankName,10);
    $scope.DataBankName = dataBankName;
    $scope.DataSetName = dataSetName;
    location.href="#dataItem-detail";
  };
       
}]);


//dataItem-detail
siteCtrs.controller('dataItem-detail',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
  $scope.SessionId=bfd.getCookie('SessionId');
  $scope.DataBankName=bfd.getCookie('DataBankName');
  $scope.DataSetName=bfd.getCookie('DataSetName');
  $scope.UserName=bfd.getCookie('UserName');
  $scope.TopApplicationType=bfd.getCookie('TopApplicationType');
  $http({
    method:"GET",
    url:urlPrefix+"api/databank/getDataSetForSubs",
    params:{
      SessionId:$scope.SessionId,
      DataSetName:$scope.DataSetName,
      DataBankName:$scope.DataBankName
    }
  }).success(function(msg){
    $scope.data=msg.data;
    console.log($scope.data);
    $scope.datasize=$scope.data.Size;
    var regs=/(?=(?!\b)(\d{3})+$)/g;  
    $scope.datasize=String($scope.data.Size).replace(regs, ',');
    $scope.price=$scope.data.Price[0].Price;
    if($scope.data.Price[0].Unit=="week"){
      $scope.unit='周';
      $scope.zweek=true;
    }else if($scope.data.Price[0].Unit=='month'){
      $scope.unit='月';
      $scope.ymonth=true;
    }else if($scope.data.Price[0].Unit=='year'){
      $scope.unit='年';
      $scope.nyear=true;
    };
    $scope.imgSrc=urlPrefix+'api/file/getImage?fileName='+$scope.data.LogoFigFile+'&filePath='+$scope.data.LogoFigPath+'&SessionId='+$scope.SessionId;
    // bfd.addCookie('fileName',$scope.data.fileName,10);
    // bfd.addCookie('filePath',$scope.data.filePath,10);
    $scope.SampleFile=$scope.data.SampleFile;
    $scope.SamplePath=$scope.data.SamplePath;
    $scope.Eunit=$scope.data.Price[0].Unit;
  }).error(function(){
  });
  $scope.detail=true;
  $scope.introduce=false;
  $scope.help=false;
  $scope.detailX=function(){
    $scope.detail=true;
    $scope.introduce=false;
    $scope.help=false;
  };
  $scope.intro=function(){
    $scope.detail=false;
    $scope.introduce=true;
    $scope.help=false;
  };
  $scope.helpY=function(){
    $scope.detail=false;
    $scope.introduce=false;
    $scope.help=true;
  };
  $scope.number=1;
  $scope.plus=function(){
    if($scope.number>=99){
      $scope.number=99;
    }else{
    $scope.number=$scope.number+1;
    };
  };
  $scope.reduce=function(){
    if ($scope.number<=1) {
      $scope.number=1;
    }else{
    $scope.number=$scope.number-1;
    };
  };
  $scope.week=function(){
    $scope.zweek=true;
    $scope.ymonth=false;
    $scope.nyear=false;
    if($scope.data.Price[0].Unit=="week"){
          $scope.price=$scope.data.Price[0].Price;
          $scope.unit='周';
          $scope.Eunit=$scope.data.Price[0].Unit;
     }else if($scope.data.Price[0].Unit=="month"){
          $scope.price= Math.ceil($scope.data.Price[0].Price/4);
          $scope.unit='周';
          $scope.Eunit=$scope.data.Price[0].Unit;
     }else if($scope.data.Price[0].Unit=="year"){
          $scope.price= Math.ceil($scope.data.Price[0].Price/48);
          $scope.unit='周';
          $scope.Eunit=$scope.data.Price[0].Unit;
     };
  
  };
  $scope.month=function(){
    $scope.zweek=false;
    $scope.ymonth=true;
    $scope.nyear=false;
    if($scope.data.Price[0].Unit=="week"){
      $scope.price=$scope.data.Price[0].Price*4;
      $scope.unit='月';
      $scope.Eunit='month';
    }else if($scope.data.Price[0].Unit=="month"){
        $scope.price=$scope.data.Price[0].Price;
        $scope.unit='月';
        $scope.Eunit=$scope.data.Price[0].Unit;
    }else if($scope.data.Price[0].Unit=="year"){
        $scope.price= Math.ceil($scope.data.Price[0].Price/12);
        $scope.unit='月';
        $scope.Eunit='month';
    };
  };
  $scope.year=function(){
    $scope.zweek=false;
    $scope.ymonth=false;
    $scope.nyear=true;
    if($scope.data.Price[0].Unit=="week"){
      $scope.price=$scope.data.Price[0].Price*48;
      $scope.unit='年';
      $scope.Eunit='year';
    }else if($scope.data.Price[0].Unit=="month"){
        $scope.price=$scope.data.Price[0].Price*12;
        $scope.unit='年';
        $scope.Eunit='year';
    }else if($scope.data.Price[0].Unit=="year"){
        $scope.price= $scope.data.Price[0].Price;
        $scope.unit='年';
        $scope.Eunit=$scope.data.Price[0].Unit;
    };
  };
  //样本下载
  $scope.updataS=false;
  $scope.updata=function(){
    $http({
      method:'GET',
      url:urlPrefix+'api/databank/reapplySample',
      params:{
        SessionId:$scope.SessionId,
        DataSetName:$scope.DataSetName,
        DataBankName:$scope.DataBankName
      }
    }).success(function(res){
      $scope.SampleFile=res.data.SampleFile;
      $scope.SamplePath=res.data.SamplePath;
    });
  };
  $scope.upDown = function(SampleFile,SamplePath){
    $http({
      method:'GET',
      url:urlPrefix+'api/file/download',
      params:{
        SessionId:$scope.SessionId,
        fileName:$scope.SampleFile,
        filePath:$scope.SamplePath
      }
    }).success(function(msg){
        if (msg.code!=30000 && msg.code!=70002 && msg.code!=70003) {
          location.href = urlPrefix+"api/file/download?SessionId="+$scope.SessionId+"&fileName="+$scope.SampleFile+"&filePath="+$scope.SamplePath;  
        }else{
          $scope.updataS=true;
        };
    }).error(function(){
      alert('请重新获取');
      $scope.updataS=true;
    });
      

     };
     //点击立即购买
  $scope.purchase = function(index,SubscriptionPrice,SubscriptionUnit){
       $http({
        method:'GET', 
        url:urlPrefix+'api/databank/querydataorderstatus',
        params:{
           SessionId:$scope.SessionId,
           SubscriberName:$scope.UserName,
           DataSetName:$scope.DataSetName,
           DataBankName:$scope.DataBankName
       }
    }).then(function(response){
      console.log(response.data.data.OrderStatus);
        $scope.Status = response.data.data.OrderStatus;
         if($scope.Status != "Normal"){
              $http({
                  method:'GET',
                  url:urlPrefix+'api/databank/submitPendingOrder',
                  params:{
                    SessionId:$scope.SessionId,
                    DataSetName:$scope.DataSetName,
                    DataBankName:$scope.DataBankName,
                    SubscriberName:$scope.UserName,
                    SubscriptionNumber:$scope.number,
                    SubscriptionPrice:$scope.price,
                    SubscriptionUnit:$scope.Eunit
                  }
                }).success(function(msg){
                  location.href="#submit-order";
                 }).error(function(){

                });
         }else{
           
            alert("您已经购买过此数据!");
         }
    },function(response){
        console.log("response");
    });

  };
       
}]);


//submit-order
siteCtrs.controller('submit-order',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
  $scope.SessionId=bfd.getCookie('SessionId');
  $scope.DataBankName=bfd.getCookie('DataBankName');
  $scope.DataSetName=bfd.getCookie('DataSetName');
  $scope.UserName=bfd.getCookie('UserName');
  $scope.timestamp=new Date().getTime();//获得当前时间
  $scope.data = '';

   $scope._data = [];
   $scope._dataIndex = [];

  $http({
    url:urlPrefix+'api/databank/queryPendingOrder',
    method:"GET",
    params:{
      SessionId:$scope.SessionId,
      DataBankName:$scope.DataBankName,
      SubscriberName:$scope.UserName,
      DataSetName:$scope.DataSetName
    }
  }).success(function(msg){
    $scope.data=msg.data;
    console.log($scope.data);
    $scope.imgSrc=urlPrefix+'api/file/getImage?fileName='+$scope.data.LogoFigFile+'&filePath='+$scope.data.LogoFigPath+'&SessionId='+$scope.SessionId;

    bfd.addCookie('SubscriptionLength',$scope.data.SubscriptionLength,10);
    bfd.addCookie('Amount',$scope.data.Amount,10);
    bfd.addCookie('SubscriptionPrice',$scope.data.PriceValue,10);
    bfd.addCookie('SubscriptionUnit',$scope.data.PriceUnit,10);
    bfd.addCookie('SubscriptionUnit',$scope.data.PriceUnit,10);
    bfd.addCookie('ApplicationType',$scope.data.ApplicationType,10);
  });

     //全选  全不选
      $scope.m = [];
      $scope.checked = [];
      $scope.selectAll = function () {
          if($scope.select_all) {
              $scope.checked = [];
              angular.forEach($scope.data.Schema, function (i) {
                  i.checked = true;
                  $scope.checked.push(i);
              })
          }else {
              angular.forEach($scope.data.Schema, function (i) {
                  i.checked = false;
                  $scope.checked = [];
              })
          }
      };
    $scope.selectOne = function () {
        angular.forEach($scope.data.Schema, function (i) {
            var index = $scope.checked.indexOf(i);
            if(i.checked && index === -1) {
                $scope.checked.push(i);
            } else if (!i.checked && index !== -1){
                $scope.checked.splice(index, 1);
            };
        })

        if ($scope.data.Schema.length === $scope.checked.length) {
            $scope.select_all = true;
        } else {
            $scope.select_all = false;
        }
     };
  $scope.NeedBill=0;
  $scope.fapiao=function($event){
    var action = event.target;
    if(action.checked){
      $scope.NeedBill=1;
     }else{
      $scope.NeedBill=0;
     };
    };
  //提交事件
   $scope.handleSubmit = function () {
    $scope.SubscriptionLength=bfd.getCookie('SubscriptionLength');
    $scope.SubscriptionPrice=bfd.getCookie('SubscriptionPrice');
    $scope.SubscriptionUnit=bfd.getCookie('SubscriptionUnit');
    $scope.Amount=bfd.getCookie('Amount');
    $scope.ApplicationType=bfd.getCookie('ApplicationType');
       if ($scope.checked.length === 0) {
           alert("请选择属性");
          }else{
             
        
      $http({
         method:'GET', 
         url:urlPrefix+'api/databank/generateSubscription',
         params:{
            SessionId:$scope.SessionId,
            SubscriberName:$scope.UserName,
            SubscriptionBeginTime:$scope.timestamp,
            SubscriptionLength:$scope.SubscriptionLength,
            DataBankName:$scope.DataBankName,
            DataSetName:$scope.DataSetName,
            SubscriptionSchema:[$scope.checked],
            SubscriptionNumber:$scope.Amount,
            SubscriptionPrice:$scope.SubscriptionPrice,
            SubscriptionUnit:$scope.SubscriptionUnit,
            NeedBill:$scope.NeedBill,
            BillInfo:{
              CompanyName:$scope.CompanyName,
              TaxpayerId:$scope.TaxpayerId,
              Account:$scope.Account,
              AccountBankName:$scope.AccountBankName,
              CompanyAddress:$scope.CompanyAddress,
              CompanyTelNumber:$scope.CompanyTelNumber,
              BillAddress:$scope.BillAddress,
              BillContact:$scope.BillContact,
              BillTelNumber:$scope.BillTelNumber
            },
            ApplicationType:$scope.ApplicationType
        }
     }).then(function(response){
         location.href="#order-count";
     },function(response){
         //失败时执行 
         console.log("response");
     });  
      };
  };
 $scope.punit=function(priceUnit){
    if (priceUnit=='week') {
      return $scope.priceUnit='周';
    }else if(priceUnit=='month'){
      return $scope.priceUnit='月';
    }else if (priceUnit=='year') {
      return $scope.priceUnit='年';
    }
  };
}]);

siteCtrs.controller('order-pay',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.SessionId=bfd.getCookie('SessionId');
    $scope.DataBankName=bfd.getCookie('DataBankName');
    $scope.DataSetName=bfd.getCookie('DataSetName');
    $scope.UserName=bfd.getCookie('UserName');
    $http({
      method:'GET',
      url:urlPrefix+'api/databank/payForSubscription',
      params:{
        DataBankName:$scope.DataBankName,
        DataSetName:$scope.DataSetName,
        SessionId:$scope.SessionId,
        SubscriberName:$scope.UserName
      }
    }).success(function(msg){
      $scope.res=setInterval(function(){
      location.href="#data-order";
    },2000);
    $scope.qingchu=setInterval(function(){
        clearInterval($scope.res);
      },2000);
    });
}]);


//order-count
siteCtrs.controller('order-count',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.SessionId=bfd.getCookie('SessionId');
    $scope.DataBankName=bfd.getCookie('DataBankName');
    $scope.DataSetName=bfd.getCookie('DataSetName');
    $scope.UserName=bfd.getCookie('UserName');
    $http({
      method:'GET',
      url:urlPrefix+'api/databank/queryPayInfo',
      params:{
        DataBankName:$scope.DataBankName,
        DataSetName:$scope.DataSetName,
        SessionId:$scope.SessionId,
        SubscriberName:$scope.UserName
      }
    }).success(function(msg){
      $scope.data=msg.data;
      $scope.imgSrc=urlPrefix+'api/file/getImage?fileName='+$scope.data.LogoFigFile+'&filePath='+$scope.data.LogoFigPath+'&SessionId='+$scope.SessionId;
    });
}]);


siteCtrs.controller('third3Con',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.SessionId=bfd.getCookie('administratorsSessionId');
    $scope.DataBankName=bfd.getCookie('administratorsUserName');
    $scope.DataSetName=bfd.getCookie('DataSetName');
    // $http({
    //   method:'GET',
    //   url:urlPrefix+'api/databank/getDataSetDescp',
    //   params:{
    //     SessionId:$scope.SessionId,
    //     DataBankName:$scope.DataBankName,
    //     DataSetName:$scope.DataSetName
    //   }
    // }).success(function(msg){
    //   console.log(msg);
    // });
    $scope.nextStep=function(){
      $scope.Description=editor.getValue();
      alert($scope.Description);
      $http({
          method:'GET',
          url:urlPrefix+'api/databank/saveDataSetDescp',
          params:{
            SessionId:$scope.SessionId,
            DataBankName:$scope.DataBankName,
            DataSetName:$scope.DataSetName,
            Description:$scope.Description
           }
        }).success(function(msg){
                 location.href="#fourth4-steps";
                
        });
    };

}]);


//fourth4-steps
siteCtrs.controller('fourth4Con',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    // userName=$scope.userName=bfd.getCookie('userName');
    $scope.SessionId=bfd.getCookie('administratorsSessionId');
    $scope.DataBankName=bfd.getCookie('administratorsUserName');
    $scope.DataSetName=bfd.getCookie('DataSetName');
    $http({
      method:'GET',
      url:urlPrefix+'api/databank/getDataSetPrice',
      params:{
        SessionId:$scope.SessionId,
        DataBankName:$scope.DataBankName,
        DataSetName:$scope.DataSetName
      }
    }).success(function(msg){
      $scope.data=msg.data.prices;
    });
    $scope.myDom=[];
    var i=1;
    $scope.addData=function(){
        if(i==2){
            
        }else{
          $scope.myDom.push(i);
            i++;
        }
    };
    $scope.change=function(unit){
      console.log(unit.unit);
    };
    $scope.delData=function(){
      if (i==0) {}else{
        $scope.myDom.pop();
        i--;
      }
    };
    $scope.nextStep=function(){
      $scope.price1=$('.Price0').val();
      $scope.price2=$('#selectH1').val();
      if ($scope.Price2==undefined) {
        $scope.Pricedata=[$scope.Price];
        $scope.Unitdata=[$scope.Unit];
      }else{
        $scope.Pricedata=[$scope.Price,$scope.Price2];
        $scope.Unitdata=[$scope.Unit,$scope.Unit2];
      };
       $http({
          method:'GET',
          url:urlPrefix+'api/databank/saveDataSetPrice',
          params:{
            SessionId:$scope.SessionId,
           DataBankName:$scope.DataBankName,
           DataSetName:$scope.DataSetName,
            Prices:{
             Values:$scope.Pricedata,
              Units:$scope.Unitdata
                }         
            }
      }).success(function(msg){
            location.href="#data-manage";
            $scope.data=msg.data.DataSets;
                
      });
    };

}]);