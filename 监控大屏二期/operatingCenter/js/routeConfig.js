/**
 * Created by syy on 2017/9/28.
 */
//运营中心路由配置
var siteModule=angular.module('app',['ngRoute','siteCtrs','siteDirectives']);
siteModule.config(['$routeProvider',function($routeProvider){
    $routeProvider.
        when('/nodeManageList',{templateUrl: 'views/nodeManageList.html'}).
        // when('/nodeManageDetail',{templateUrl:  'views/nodeManageDetail.html'}).
        // when('/nodeManage',{templateUrl:  'views/nodeManage.html'}).
        when('/nodeManageDetail/:SubscriberName/:DataBankName/:DataSetName/:appid',{templateUrl:  'views/nodeManageDetail.html'}).
        when('/nodeManage/:SubscriberName/:DataBankName/:DataSetName',{templateUrl:  'views/nodeManage.html'}).
    otherwise({redirectTo:'/nodeManageList'})
}]);