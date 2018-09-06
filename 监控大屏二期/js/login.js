/*** Created by syy on 2017/8/25.*/
$(document).ready(function(){
    var urlPrefix="https://auth.zjdex.com/monitor_test/";
	//var urlPrefix="https://183.131.202.165:8080/ownership_webtransfer/";
    var valid_code;

    //登录动画背景图
    window.requestAnimFrame = (function(){   return  window.requestAnimationFrame})();
    var canvas = document.getElementById("space");
    var c = canvas.getContext("2d");
    var numStars = 1900;
    var radius = '0.'+Math.floor(Math.random() * 9) + 1  ;
    var focalLength = canvas.width *2;
    var warp = 0;
    var centerX, centerY;
    var stars = [], star;
    var i;
    var animate = true;
    initializeStars();
    function executeFrame(){
        if(animate)
            requestAnimFrame(executeFrame);
        moveStars();
        drawStars();
    }
    function initializeStars(){
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;

        stars = [];
        for(i = 0; i < numStars; i++){
            star = {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                z: Math.random() * canvas.width,
                o: '0.'+Math.floor(Math.random() * 99) + 1
            };
            stars.push(star);
        }
    }
    function moveStars(){
        for(i = 0; i < numStars; i++){
            star = stars[i];
            star.z--;

            if(star.z <= 0){
                star.z = canvas.width;
            }
        }
    }
    function drawStars(){
        var pixelX, pixelY, pixelRadius;
        // Resize to the screen
        if(canvas.width != window.innerWidth || canvas.width != window.innerWidth){
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initializeStars();
        }
        if(warp==0)
        {c.fillStyle = "rgba(0,10,20,1)";
            c.fillRect(0,0, canvas.width, canvas.height);}
        c.fillStyle = "rgba(209, 255, 255, "+radius+")";
        for(i = 0; i < numStars; i++){
            star = stars[i];

            pixelX = (star.x - centerX) * (focalLength / star.z);
            pixelX += centerX;
            pixelY = (star.y - centerY) * (focalLength / star.z);
            pixelY += centerY;
            pixelRadius = 1 * (focalLength / star.z);

            c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
            c.fillStyle = "rgba(209, 255, 255, "+star.o+")";
            //c.fill();
        }
    }
    document.getElementById('warp').addEventListener("click",function(e){
        window.c.beginPath();
        window.c.clearRect(0, 0, window.canvas.width, window.canvas.height);
        window.warp = warp ? 0 : 1;
        executeFrame();
    });
    executeFrame();

    //切换登录面板
    $('.tabCut').click(function(){
        var changeTab=$('.tabCut').html();
        var t1="切换到运营中心";
        var t2="切换到监控中心";
        var t3="切换到查询中心";
        if(changeTab==t2){
            $('.title').text("系统监控中心").attr('data-text',"系统监控中心");
            $('.tabCut').text(t1);

        }if(changeTab==t1){
            $('.title').text("系统运营中心").attr('data-text',"系统运营中心");
            $('.tabCut').text(t3);
        }if(changeTab==t3){
            $('.title').text("系统查询中心").attr('data-text',"系统查询中心");
            $('.tabCut').text(t2);
        }
        $('#getcode_gg').attr("src", 'php/code_gg.php?' + Math.random());
    });

    // 验证码生成
    $("#getcode_gg").click(function() {
        $(this).attr("src", 'php/code_gg.php?' + Math.random());
    });
    //验证码失去焦点
    // $('#checkCode').blur(function(){
    //     var checkCode=$(this).val().toLowerCase();
    //     if(checkCode==""){
    //         $('.valid-tips').html("验证码不能为空");
    //     }else{
    //         $.ajax({
    //             type:'post',
    //             url:'php/checkCode.php?act=num',
    //             data:{code:checkCode},
    //             success:function(msg){
    //                 if(msg==='mc1001'){
    //                     valid_code=0;
    //                     $('.valid-tips').html("");

    //                 }else{
    //                     valid_code=1;
    //                     $('.valid-tips').html("验证码错误");
    //                 }
    //             }
    //         });
    //     }
    // });
    //用户名验证
    $('#uName').blur(function(){
        if($(this).val()==""){
            $('.user-tips').html("用户名不能为空");
        }else{
            $('.user-tips').html("");
        }
    });
    //密码验证
    $('#pwd').blur(function(){
        if($(this).val()==""){
            $('.pwd-tips').html("密码不能为空");
        }else{
            $('.pwd-tips').html("");
        }
    });

    //登录逻辑
    $('.loginBtn').click(function(e){
        e.preventDefault();
        var theme=$('.title').html();
        var userName=$('#uName').val();
        var passWord=$('#pwd').val();
        var identifyCode=$('#checkCode').val();
        if(theme==="系统监控中心"){
            $.ajax({
                type:'post',
                url: urlPrefix+'api/login/loginForManager',
                data:{
                    'UserName':userName,
                    'PassWord':passWord,
                    'IdentifyCode':identifyCode
                },
                success:function(data){
                    if(userName=="") {
                        $('.user-tips').html("请输入用户名");
                    }
                    if(passWord==""){
                        $('.pwd-tips').html("请输入密码");
                    }
                    if(identifyCode==""){
                        $('.valid-tips').html('请输入验证码');
                    }
                    if(data.code=="10000" ||  $('.login-tips').val()=="" && valid_code==0){
                        localStorage['sessionId']=data.data.SessionId;
                        location.href="MonitoringCenter/";
                    }else if(data.code=='30008' && data.message=="NoSuchUser"){
                        $('.user-tips').html('用户名错误');
                    }else if(data.code=='30008' && data.message=="PasswordError"){
                        $('.pwd-tips').html('用户密码错误');
                    }else if(userName!==""  && data.code!=="30008"){
                        $('.user-tips').html("");
                    }else if(passWord!==""&& data.code!=="30008"){
                        $('.pwd-tips').html("");
                    }
                    $('#getcode_gg').attr("src", 'php/code_gg.php?' + Math.random());
                }
            });
        }else if(theme==="系统运营中心"){
            $.ajax({
                type:'post',
                url: urlPrefix+'api/login/loginForManager',
                data:{
                    'UserName':userName,
                    'PassWord':passWord,
                    'IdentifyCode':identifyCode
                },
                success:function(data){
                    if(userName=="") {
                        $('.user-tips').html("请输入用户名");
                    }
                    if(passWord==""){
                        $('.pwd-tips').html("请输入密码");
                    }
                    if(identifyCode==""){
                        $('.valid-tips').html('请输入验证码');
                    }
                    if(data.code=="10000" ||  $('.login-tips').val()=="" && valid_code==0){
                        localStorage['sessionId']=data.data.SessionId;
                        location.href="operatingCenter/";
                    }else if(data.code=='30008' && data.message=="NoSuchUser"){
                        $('.user-tips').html('用户名错误');
                    }else if(data.code=='30008' && data.message=="PasswordError"){
                        $('.pwd-tips').html('用户密码错误');
                    }else if(userName!==""  && data.code!=="30008"){
                        $('.user-tips').html("");
                    }else if(passWord!==""&& data.code!=="30008"){
                        $('.pwd-tips').html("");
                    }
                }
            });
        }else if(theme==="系统查询中心"){
            $.ajax({
                type:'post',
                url: urlPrefix+'api/login/loginForManager',
                data:{
                    'UserName':userName,
                    'PassWord':passWord,
                    'IdentifyCode':identifyCode
                },
                success:function(data){
                    if(userName=="") {
                        $('.user-tips').html("请输入用户名");
                    }
                    if(passWord==""){
                        $('.pwd-tips').html("请输入密码");
                    }
                    if(identifyCode==""){
                        $('.valid-tips').html('请输入验证码');
                    }
                    if(data.code=="10000" ||  $('.login-tips').val()=="" && valid_code==0){
                        localStorage['sessionId']=data.data.SessionId;
                        location.href="QueryCenter/";
                    }else if(data.code=='30008' && data.message=="NoSuchUser"){
                        $('.user-tips').html('用户名错误');
                    }else if(data.code=='30008' && data.message=="PasswordError"){
                        $('.pwd-tips').html('用户密码错误');
                    }else if(userName!==""  && data.code!=="30008"){
                        $('.user-tips').html("");
                    }else if(passWord!==""&& data.code!=="30008"){
                        $('.pwd-tips').html("");
                    }
                }
            });
        }
    });
    // $(window).resize(function(){
    //     window.location.reload();
    // });
});


