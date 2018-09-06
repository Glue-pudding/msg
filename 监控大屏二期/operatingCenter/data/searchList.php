<?php
    header("Content-type:application/json;Access-Control-Allow-Origin:*;charset=utf-8");
    header("Access-Control-Allow-Origin:*");
    @$kw=$_REQUEST['kw'];
    $output=[];

    if(empty($kw)){
           echo '[]';
           return;
    }

    $conn=mysqli_connect("127.0.0.1",'root','123456','operatingcenter');
    $sql='set names utf8';
    mysqli_query($conn,$sql);
    $sql="select id,buyer,itemName,dataBank,dataType,runningStatus,warningCause from testList where buyer like '%$kw%'";
    $rlt=mysqli_query($conn,$sql);

    while(true){
        $row=mysqli_fetch_assoc($rlt);
        if(!$row){
            break;
        }
        $output[]=$row;
    }
    echo json_encode($output);
?>