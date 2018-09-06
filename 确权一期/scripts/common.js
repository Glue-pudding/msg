/**
 *sunyangyang
 * 20171031
 * */

var bfd={};

bfd.url2json=function(str){
    var arr=str.split('&');
    var json={};
    for(var i=0;i<arr.length;i++){
        var arr2=arr[i].split('=');
        json[arr2[0]]=arr2[i]
    }
    return json;
};

//添加cookie
bfd.addCookie=function(name,value,iDay){
    if(iDay){
        var oDate=new Date();
        oDate.setDate(oDate.getDate()+iDay);
        document.cookie=name+'='+value+";PATH=/;EXPIRES="+oDate.toGMTString();
    }else{
        document.cookie=name+'='+value+";PATH=/";
    }
};


//获得cookie
bfd.getCookie=function(name){
    var arr=document.cookie.split('; ');
    for(var i=0;i<arr.length;i++){
        var arr2=arr[i].split('=');
        if(arr2[0] === name){
            return arr2[1];
        }
    }
};


//删除cookie
bfd.removeCookie=function(name){
    bfd.addCookie(name,1,-1);
};

//数组去重
bfd.arrSingle=function(arr){
    var json={};
    var arr2=[];
    for(var i=0;i<arr.length;i++){
        json[arr[i]]=1;
    }
    for(name in json){
        arr.push(name);
    }
    return arr2;
};

//登录状态判断
bfd.isLogin=function(num){
    if(num ===-10860024 || !bfd.getCookie('userName')){
        window.location.href='login.html';
    }
};


/******登录和注册*****************************************************************************************/

//登录



//验证码
// $("#getcode_gg").click(function() {
//     $(this).attr("src", 'data/code_gg.php?' + Math.random());
// });

$("#getcode_gg").click(function() {
    $(this).attr("src", '../data/code_gg.php?' + Math.random());
});
// $("#chk_gg").click(function() {
//     var code_gg = $("#code_gg").val();
//     $.post("chk_code.php?act=gg", {
//             code: code_gg
//         },
//         function(msg) {
//             if (msg == 1) {
//                 alert("验证码正确！");
//             } else {
//                 alert("验证码错误！");
//             }
//         });
// });


$(document).ready(function(){
    $('#index-banner').carousel({interval:5000});//每隔5秒自动轮播
});

