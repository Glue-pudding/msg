/**
 * Created by syy on 2017/9/28.
 */
//首页
var siteModule=angular.module('app',['ngRoute','siteCtrs','angularFileUpload']);
siteModule.config(['$routeProvider',function($routeProvider){
    $routeProvider.
        when('/main',{templateUrl: 'views/main.html'}).
        when('/dataItem-classify',{templateUrl:  'views/dataItem-classify.html'}).
        when('/dataItem-detail',{templateUrl:  'views/dataItem-detail.html'}).
        when('/submit-order',{templateUrl:  'views/submit-order.html'}).
        when('/order-count',{templateUrl:  'views/order-count.html'}).
        when('/pay',{templateUrl:  'views/pay.html'}).
        when('/first-steps',{templateUrl:  'views/first-steps.html'}).
        when('/data-manage',{templateUrl:  'views/data-manage.html'}).
        when('/data-bank',{templateUrl:  'views/data-bank.html'}).
        when('/company',{templateUrl:  'views/company-info-manage.html'}).
        when('/user-center',{templateUrl:  'views/user-center.html'}).
        when('/user-message',{templateUrl:  'views/user-message.html'}).
        when('/resolve',{templateUrl:  'views/resolve.html'}).
        when('/order',{templateUrl:  'views/order.html'}).
        when('/order-paid',{templateUrl:  'views/order-paid.html'}).
        when('/order-past',{templateUrl:  'views/order-past.html'}).
        when('/data-power',{templateUrl:  'views/data-power.html'}).
        when('/data-order',{templateUrl:  'views/data-order.html'}).
        when('/assets-management',{templateUrl:  'views/assets-management.html'}).
        when('/second-steps',{templateUrl:  'views/second-steps.html'}).
        when('/fourth-steps',{templateUrl:  'views/fourth-steps.html'}).
        when('/third-steps',{templateUrl:  'views/third-steps.html'}).
        when('/data-unpower',{templateUrl:  'views/data-unpower.html'}).
        when('/login',{templateUrl:  'views/login.html'}).
        when('/administrators',{templateUrl:  'views/administrators.html'}).
        when('/register',{templateUrl:  'views/register.html'}).
        when('/companyEdit',{templateUrl:  'views/company-info-Edit.html'}).
        when('/register-success',{templateUrl:  'views/register-success.html'}).
        when('/third3-steps',{templateUrl:  'views/third3-steps.html'}).
        when('/fourth4-steps',{templateUrl:  'views/fourth4-steps.html'}).
   otherwise({redirectTo:'/login'})
}]);