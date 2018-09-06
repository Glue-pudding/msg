/**
 * Created by syy on 2017/9/28.
 */
//接口url-heade
var urlPrefix="http://10.8.45.11:8086/ownership_webtransfer/";
var SessionId="";
var UserName="";
// var TelNumber="";
//事件容器
var siteCtrs=angular.module('siteCtrs',[]);

//首页
siteCtrs.controller('indexCtr',['$scope','$http','$rootScope',function($scope,$http,$rootScope){
    $scope.allFun={};
    $scope.allData={};

    $rootScope.userName=$scope.allData.userName=bfd.getCookie('userName');

    $scope.allFun.loginClick=function(){
        window.location.href='index.html';
    };

    $scope.allFun.loginOut=function(){
        var myUrl=urlPrefix+"api/login/logout";
        $http.jsonp(myUrl).success(function(data){
            bfd.isLogin(data.retrun_code);
            window.location.href='login.html';
            bfd.removeCookie('userName');
            bfd.removeCookie('userPass');
        });
    }

}]);

//未授权数据
siteCtrs.controller('dataUnpower',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.SessionId = bfd.getCookie('SessionId');
    $scope.UserName = bfd.getCookie('UserName');
    $scope.DataOwnerUniqueID = 'unique1';
    $scope.data = [];
   
    //点击展开 点击隐藏
    $scope.orderShow = false;
    $scope.getMore = function () {
        $scope.orderShow = !$scope.orderShow;
      };
    

    //同意数据授权
   $scope._data = [];

    //请求数据
    $http({
    method:'GET', 
    url:'http://10.8.45.11:8086/ownership_webtransfer/api/databank/getAllUnGrantedDataByOwner',
    params:{
       SessionId:$scope.SessionId,
       DataOwnerName:$scope.UserName,
       DataOwnerUniqueID:$scope.DataOwnerUniqueID
       }
    }).then(function(response){
    //成功时执行
        console.log(response.data.data.DataSets);
        $scope.data = response.data.data.DataSets;
        
        
    },function(response){
    //失败时执行 
         console.log("response");
   });
     
      console.log($scope.selectionData);
      $scope._data = {
           selectionData:[]
        };
         //全选  全不选
    $scope.selectAll=false;  
    $scope.sAll= function (m) {  
        for(var i=0;i<$scope.data.length;i++){  
          if(m===true){  
              $scope.data[i].state=true;
                $scope._data =  $scope.data;
          }else {  
              $scope.data[i].state=false;  
               $scope._data = '';
          }  
        }  
    };  

   $scope.toggleDataSelection = function(index,DataSetName,DataBankName,AbstractInfo){
         alert(index);
          var selec = {"DataSetName":DataSetName,"DataBankName":DataBankName,'AbstractInfo':AbstractInfo}; 
          var indexData = $scope._data.selectionData.indexOf(index);
          if(indexData === -1){
              $scope._data.selectionData.push(index);
              console.log($scope._data.selectionData);
         }else{
              $scope._data.selectionData.splice(indexData,1);
              console.log($scope._data.selectionData);
          }
    };
          
       $scope.handleSubmit = function () {
          
        $http({
            method:'GET', 
            url:'http://10.8.45.11:8086/ownership_webtransfer/api/databank/getAllGrantedDataByOwner',
            params:   $scope._data 
        }).then(function(response){

        },function(response){
            //失败时执行 
            console.log("response");
        }); 

        alert($scope._data.selectionData)
           // if ($scope._data.selectionData == []) {
           //   return false;
           //   alert("请选择你要授权的数据");
           //  }else{
               location.href="#assets-management";
           //  }
              };

      $scope.pickUp = function () {
        $scope.orderShow = !$scope.orderShow;
      };
    
}]);


//已授权页面
siteCtrs.controller('dataPower',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.SessionId = bfd.getCookie('SessionId');
    $scope.UserName = bfd.getCookie('UserName');
    $scope.DataOwnerUniqueID = 'unique1';
    $scope.NewStatus = false;
    $scope.data = [];

    $http({
    method:'GET', 
    url:'http://10.8.45.11:8086/ownership_webtransfer/api/databank/getAllGrantedDataByOwner',
    params:{
       SessionId:$scope.SessionId,
       DataOwnerName:$scope.UserName,
       DataOwnerUniqueID:$scope.DataOwnerUniqueID
       }
    }).then(function(response){
        //成功时执行
        console.log(response.data.data.DataSets);
        $scope.data = response.data.data.DataSets;

    },function(response){
        //失败时执行 
        console.log("response");
    });
    console.log($scope.data);

    //取消授权
    $scope.cancelAccredit = function(index,DataSetName,DataBankName,AuthorizationBeginTime){
     $scope.DataSetName = DataSetName;
     $scope.DataBankName = DataBankName;
     $scope.AuthorizationBeginTime = AuthorizationBeginTime;
     $scope.data.splice(index,1); 
     $http({
        method:'GET', 
        url:'http://10.8.45.11:8086/ownership_webtransfer/api/databank/updateDataSetAuthStatus',
        params:{
           SessionId:$scope.SessionId,
           DataSets:[{
                DataOwnerName:$scope.UserName,
                DataOwnerUniqueID:$scope.DataOwnerUniqueID,
                DataSetName:$scope.DataSetName,
                DataBankName:$scope.DataBankName,
                NewStatus:$scope.NewStatus,
                AuthorizationBeginTime:$scope.AuthorizationBeginTime
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
    $scope.getMore = function () {
       $scope.orderShow = !$scope.orderShow;
       };
    $scope.pickUp = function () {
        $scope.orderShow = !$scope.orderShow;
       };
   }]);


//用户信息查询
siteCtrs.controller('userMessage',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.SessionId = bfd.getCookie('SessionId');
    $scope.UserName=bfd.getCookie('UserName');
    // alert($scope.SessionId);
    // console.log(bfd.getCookie('SessionId'));

    //显示隐藏
      $scope.messageShow = false;   
      $scope.handleChange = function(){
         $scope.messageShow = !$scope.messageShow
      }
     //请求用户信息
            $http({
            method:'GET', 
            url:'http://10.8.45.11:8086/ownership_webtransfer/api/user/getUserInfo',
            params:{
               SessionId:$scope.SessionId,
               UserName:$scope.UserName
            }
        }).then(function(response){
            //成功时执行
            console.log(response);
            $scope.data = response.data;
        },function(response){
            //失败时执行 
            console.log("response");
        });

      //修改用户信息
      $scope.confirm = function(){
        $scope.messageShow = !$scope.messageShow
        $http({
            method:'post', 
            url:'http://10.8.45.11:8086/ownership_webtransfer/api/user/saveUserInfo',
            data:{
              SessionId: $scope.sessionId,
              CompanyAddress:"CompanyAddress",
              CompanyContactName:"CompanyContactName",
              CompanyContactTelNumber:"CompanyContactTelNumber"
            }
        }).then(function(response){
            //成功时执行
            console.log(response);
            $scope.data = response.data;
        },function(response){
            //失败时执行 
            console.log("response");
          });
      }

}]);


//拟授权页面
siteCtrs.controller('assetsManagement',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.sessionId = bfd.getCookie('userSessionId');
    $scope.sdata = {
        SessionId: $scope.sessionId,
        DataOwnerName:"",
        DataOwnerUniqueID:""
    };

    //勾选阅读协议才可提交
     $scope.checkInput = false;
     $scope.checkShow = function(){
       if($scope.checkedText == true){
          location.href="#data-power";
        }else{
          $scope.checkInput = !$scope.checkInput;
        }
      };

      $http({
            method:'post', 
            url:'http://localhost:8080/ownership_webtransfer/api/databank/getAllUnGrantedDataByOwner?DataOwnerName=databank0&DataOwnerUniqueID=18767770000&SessionId=016b6a0f1a0844ea8cd952b24b96fc8c',
            data:$scope.sdata
        }).then(function(response){
            //成功时执行
            console.log(response);
            $scope.data = response.data;
        },function(response){
            //失败时执行 
            console.log(response);
        });

}]);

//数据订单管理页面
siteCtrs.controller('dataOrder',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.sessionId = bfd.getCookie('SessionId');
    $scope.SubscriberName = bfd.getCookie('UserName');

   $http({
        method:'post', 
        url:'http://10.8.45.11:8086/ownership_webtransfer/api/databank/getSubscriptionRecords',
        params:{
           SessionId:$scope.sessionId,
           SubscriberName:$scope.SubscriberName
       }
    }).then(function(response){
        console.log(response.data.data.SubscriptionRecord);
        $scope.data = response.data.data.SubscriptionRecord;
    },function(response){
        console.log("response");
    });

    //获取详情
    $scope.viewDetails = function(Status){
        $scope.Status = Status;
        console.log($scope.Status);
        switch($scope.Status){
         case "Normal": location.href = "#order";
            break;
         case "Stopped": location.href = "#order";
            break;
         case "Expired": location.href = "#order-past";
            break;
         case "Abnormal": location.href = "#order-paid";
            break;   
        };
    };

}]);


//解混淆页面
siteCtrs.controller('resolve',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.sessionId = bfd.getCookie('userSessionId');
    $scope.sdata = {
        SessionId: $scope.sessionId,
           SubscriberName:"SubscriberName",
           RecoverBeginTime:"RecoverBeginTime",
           RecoverLength:"RecoverLength"
         
        };
      // $scope.ApplyResolve = function(){

      // }
       $http({
            method:'post', 
            url:'http://localhost:8080/ownership_webtransfer/api/databank/getSubscriptionRecords?SubscriberName=xiaoming&SessionId=330c3d40316a4130a5c4d213226d6c18',
            data:$scope.sdata
        }).then(function(response){
            //成功时执行
            console.log(response);
            $scope.data = response.data;
        },function(response){
            //失败时执行 
            console.log(response);
        });

}]);


//first-steps
siteCtrs.controller('firstCon',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
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
    $scope.nextStep=function(){
      console.log($scope.ihg.text);
      console.log($scope.nat.text);
      $http({
          method:'GET',
          url:urlPrefix+'api/databank/saveDataSetBasicInfo',
          params:{
            SessionId:$scope.SessionId,
            DataBankName:$scope.DataBankName,
            DataSetName:$scope.DataSetName,
            TopApplicationType:$scope.ihg.text,
            ApplicationType:$scope.nat.text,
            Size:$scope.Size,
            LogoFigPath:'.jpg',
            AbstractInfo:$scope.AbstractInfo
           }
        }).success(function(msg){
                console.log(msg);
                bfd.addCookie('DataSetName',$scope.DataSetName,10);
                location.href="#second-steps";
                // $scope.data=msg.data.DataSets;
                // console.log($scope.data);
                
        });  
    };
    $scope.loginOut=function(){
        var myUrl=urlPrefix+"/ownership_webtransfer/api/login/login?UserName=xiaoming&PassWord=123456&IdentifyCode=2313";
        $http.jsonp(myUrl).success(function(data){
            bfd.isLogin(data.retrun_code);
            window.location.href='login.html';
            bfd.removeCookie('userName');
            bfd.removeCookie('userPass');
        });
    }

}]);

//second-steps
siteCtrs.controller('secondCon',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.SessionId=bfd.getCookie('administratorsSessionId');
    $scope.DataBankName=bfd.getCookie('administratorsUserName');
    $scope.DataSetName=bfd.getCookie('DataSetName');
    $scope.nextStep=function(){
      if($scope.IsIdentifyFieldID=="false"){
        $scope.IsIdentifyFieldID=false;
      }else{
        $scope.IsIdentifyFieldID=true;
      };
      $http({
          method:'GET',
          url:urlPrefix+'api/databank/saveDataSetSchema',
          params:{
            SessionId:$scope.SessionId,
            DataBankName:$scope.DataBankName,
            DataSetName:$scope.DataSetName,
            PathInBank:$scope.PathInBank,
            Schema:[{
              FieldNames:$scope.FieldName,
              FieldTypes:$scope.FieldType,
              FieldDescriptions:$scope.FieldDescription,
              IsIdentifyFieldIDs:$scope.IsIdentifyFieldID
              }]
           }
        }).success(function(msg){
                console.log(msg);
                if(msg.code==10000){
                location.href="#third-steps";}
                // $scope.data=msg.data.DataSets;
                // console.log($scope.data);
                
        });
    };
      

}]);


siteCtrs.controller('thirdCon',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.SessionId=bfd.getCookie('administratorsSessionId');
    $scope.DataBankName=bfd.getCookie('administratorsUserName');
    $scope.DataSetName=bfd.getCookie('DataSetName');
    $scope.nextStep=function(){
      console.log(editor.getValue());
      $scope.Description=editor.getValue();
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
                console.log(msg);
                location.href="#fourth-steps";
                // $scope.data=msg.data.DataSets;
                // console.log($scope.data);
                
        });
    };

}]);


//fourth-steps
siteCtrs.controller('fourthCon',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    // userName=$scope.userName=bfd.getCookie('userName');
    $scope.myDom=[];
    var i=1;
    $scope.nextStep=function(){
        
    };
    $scope.addData=function(){
        if(i==1){
            $scope.myDom.push(i);
            i++;
        }

    };
    $scope.delData=function(){
        $scope.myDom.pop();
    };
    $scope.nextStep=function(){
      $http({
          method:'GET',
          url:urlPrefix+'api/databank/saveDataSetPrice',
          params:{
            SessionId:$scope.SessionId,
            DataBankName:$scope.DataBankName,
            DataSetName:$scope.DataSetName,
            Prices:[{
              Price:$scope.Price,
              Unit:$scope.Unit
              }]
           }
        }).success(function(msg){
                console.log(msg);
                location.href="#data-manage";
                // $scope.data=msg.data.DataSets;
                // console.log($scope.data);
                
        });
    };

}]);


//data-bank
siteCtrs.controller('dataBankCon',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
     $scope.SessionId=bfd.getCookie('administratorsSessionId');
     $scope.DataBankName = bfd.getCookie('administratorsUserName');
     $scope.DataSetName = bfd.getCookie('DataBankName');
     console.log($scope.DataSetName);
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
            console.log(response);
            $scope.data = response.data;
         },function(response){
             //失败时执行 
             console.log("response");
         });
 

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
                console.log(msg.data.DataSets[0].DataSetName);
                $scope.data=msg.data.DataSets;
                console.log($scope.data);
                bfd.addCookie('DataBankName',msg.data.DataSets[0].DataSetName,10);
                
        });
 
    $scope.del = function(msg){
     location.href="#data-bank";
 
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
                console.log(msg);
                $scope.data=msg.data;
                console.log($scope.data);
                
        });
}]);


//订阅中页面
siteCtrs.controller('order',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.sessionId = bfd.getCookie('userSessionId');
    $scope.sdata = {
        SessionId: $scope.sessionId,
         SubscriberName:"SubscriberName",
         DataBankName:"DataBankName",
         DataSetName:"DataSetName"
        
          };

       $http({
            method:'post', 
            url:'http://localhost:8080/ownership_webtransfer/api/databank/getSubscriptionRecords?SubscriberName=xiaoming&SessionId=330c3d40316a4130a5c4d213226d6c18',
            data:$scope.sdata
        }).then(function(response){
            //成功时执行
            console.log(response);
            $scope.data = response.data;
        },function(response){
            //失败时执行 
            console.log(response);
        });

}]);


//已支付页面
siteCtrs.controller('orderPast',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.sessionId = bfd.getCookie('userSessionId');
    $scope.sdata = {
        SessionId: $scope.sessionId,
         SubscriberName:"SubscriberName",
         DataBankName:"DataBankName",
         DataSetName:"DataSetName"

          };
      
      $http({
            method:'post', 
            url:'http://localhost:8080/ownership_webtransfer/api/databank/getSpecificSubsRec?SubscriberName=xiaoming&DataBankName=databank0&DataSetName=databank0&SessionId=330c3d40316a4130a5c4d213226d6c18',
            data:$scope.sdata
        }).then(function(response){
            //成功时执行
            console.log(response);
            $scope.data = response.data;
        },function(response){
            //失败时执行 
            console.log(response);
        });
    
}]);


//已过期页面
siteCtrs.controller('orderPaid',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.sessionId = bfd.getCookie('userSessionId');
    $scope.sdata = {
        SessionId: $scope.sessionId,
         SubscriberName:"SubscriberName",
         DataBankName:"DataBankName",
         DataSetName:"DataSetName"

          };
      
      $http({
            method:'post', 
            url:'http://localhost:8080/ownership_webtransfer/api/databank/getSpecificSubsRec?SubscriberName=xiaoming&DataBankName=databank0&DataSetName=databank0&SessionId=330c3d40316a4130a5c4d213226d6c18',
            data:$scope.sdata
        }).then(function(response){
            //成功时执行
            console.log(response);
            $scope.data = response.data;
        },function(response){
            //失败时执行 
            console.log(response);
        });
    
}]);
//申请解混淆
siteCtrs.controller('resolveConfusion',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    let today = new Date();
    let date = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    $scope.startDate = `${year}/${month}/${date}`;
}]);
siteCtrs.controller('registerCon',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    $scope.UserName='John Doe';
        $scope.mobileRegx = "^1(3[0-9]|4[57]|5[0-35-9]|7[01678]|8[0-9])\\d{8}$";
        $scope.display=false;
        $scope.repeatPWD = function(){
            if($scope.PassWord!=$scope.repeatPassWord){
                $scope.PassWord="";
                $scope.repeatPassWord="";
            }
        };
        $scope.register = function () {
          alert("aaaa");
            $http({
                method:"GET",
                url:urlPrefix+'api/user/register',
                params:{
                    UserName:$scope.UserName,
                    PassWord:$scope.PassWord,
                    IdentifyCode:$scope.IdentifyCode,
                    TelNumber:$scope.TelNumber
                }
            }).
            then(function successCallback(response) {
            console.log(response);
            TelNumber=$scope.TelNumber;
            console.log(TelNumber);
        }, function errorCallback(response) {
            // 请求失败执行代码
            location.href="#register";
    });
        }
    $scope.confirm=function(){
        $scope.tiao=setInterval(function(){
          location.href="#register-success";
        },2000);

    };
}]);


//login  页面
siteCtrs.controller('loginCon',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
   $scope.entry = function () {
    alert($scope.UserName);
        $http({
              method:'post',
              url:urlPrefix+'api/login/login',
              params:{
                UserName:$scope.UserName,
                PassWord:$scope.PassWord,
                IdentifyCode:$scope.IdentifyCode
               }
           }).success(function(msg){
                    console.log(msg);
                    bfd.addCookie('SessionId',msg.data.SessionId,10);
                    bfd.addCookie('UserName',$scope.UserName,10);
                    // SessionId=msg.data.SessionId;
                    // UserName=$scope.UserName;
                    location.href="#main";
        });
        } 
    
}]);


//administrators  页面
siteCtrs.controller('administratorsCon',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
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
                console.log(msg);
                bfd.addCookie('administratorsSessionId',msg.data.SessionId,10);
                bfd.addCookie('administratorsUserName',$scope.UserName,10);
                location.href="#company";
        });
        } 
    
}]);
siteCtrs.controller('registerSuccessCon',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
  clearInterval($scope.tiao);
   $scope.dishi=setInterval(function(){
    location.href="#main";
   },3000);
   clearInterval($scope.dishi);
   
   // clearInterval($scope.dishi,3000);
    
}]);
siteCtrs.controller('main',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
  clearInterval($scope.dishi);
  clearInterval($scope.tiao);
  $scope.search = function () {
    location.href="#dataItem-classify";
  }
  
    
}]);

//dataItem-classify
siteCtrs.controller('dataItem-classify',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
  $scope.SessionId=bfd.getCookie('SessionId');
  $http({
    url:urlPrefix+'api/databank/getDataSetByAppType',
    method:"GET",
    params:{
      SessionId:$scope.SessionId,
      TopApplicationType:"FinanceDataSets"
    }
  }).success(function(msg){
    console.log(msg);
    $scope.data=msg.data.dataSets;
  });
  $scope.query=function(index,dataSetName,dataBankName){
    $http({
      method:"GET",
      url:urlPrefix+"api/databank/getDataSetForSubs",
      params:{
        SessionId:$scope.SessionId,
        DataSetName:dataSetName,
        DataBankName:dataBankName
      }
    }).success(function(msg){
      console.log(msg.data);
    }).error(function(){
      alert("haha");
    })
  }
       
}]);