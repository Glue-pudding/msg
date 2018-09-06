/**
 * Created by syy on 2017/9/28.
 */
var siteDirectives=angular.module('siteDirectives',[]);

//下拉菜单
siteDirectives.directive('dropDown',[function(){
    return {
        restrict : 'EA',
        replace : true,         //不显示自定义的标签，显示包裹的内容
        transclude : true,      //默认false，表示提取包含指令元素的内容，再讲他放在指令模板特定位置。true值是这么应该在什么地方放置该内容。
        scope : {               //布尔值或对象；这里是对象，表示创建一个全新的隔离作用域；布尔值默认值false，表示继承父作用域；true表示继承父作用域，且创建自己的作用域。
            selecttitle : '=', // 默认选中值；双向绑定
            lidata:'=lidata',  // 数据集如['张三','李四','王五']
            clickChange:'&',   // 选项变化时事件；用于调用父作用域函数
            disabled:'@'    // 是否显示，支持表达式
        },
        template:function(elem, attr){
            if(attr.lidata=="currentEnttiy.dataType"){
                return '<div class="dataClassify" ng-show="disabled">'
                    +'<div class="dataClassify-title" ng-click="toggle()">' +
                    '<span ng-bind="selecttitle"></span><i class="dataClassify-i"></i>' +
                    '</div>'
                    +'<ul ng-show="showMe">'
                    +' <li ng-repeat="data in lidata" ng-click="clickLi(data)" ng-bind="data"></li>'
                    +'</ul>'
                    +'</div>';
            }else if(attr.lidata=="currentEnttiy.runStatus"){
                return '<div class="runClassify" ng-show="disabled">'
                    +'<div class="runClassify-title" ng-click="toggle()">' +
                    '<span ng-bind="selecttitle"></span><i class="runClassify-i"></i>' +
                    '</div>'
                    +'<ul ng-show="showMe">'
                    +'<li ng-repeat="data in lidata" ng-click="clickLi(data)" ng-bind="data"></li>'
                    +'</ul>'
                    +'</div>';
            }

        },
        link: function ($scope, $element, $attrs) {
            $scope.showMe = false;
            $scope.disabled = true;


            $scope.toggle = function toggle() {
                $scope.showMe = !$scope.showMe;
            };

            $scope.clickLi=function clickLi(data_){
                $scope.selecttitle=data_;
                $scope.showMe = !$scope.showMe;
            };


            //监听选中的值
            $scope.$watch('selecttitle', function(value) {
                $scope.clickChange();
            });
        }
    };
}]);
