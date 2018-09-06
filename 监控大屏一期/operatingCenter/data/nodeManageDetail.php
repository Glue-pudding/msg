<?php
    header("Content-type:application/json;Access-Control-Allow-Origin:*;charset=utf-8");
    header("Access-Control-Allow-Origin:*");

    $id=$_REQUEST['id'];
    if(empty($id)){
        echo '[]';
    }

    $conn=mysqli_connect('127.0.0.1','root','123456','operatingcenter');
    $sql='SET NAMES UTF8';
    mysqli_query($conn,$sql);

    $sql="select * from testList where id=$id";
    $res=mysqli_query($conn,$sql);

    $row=mysqli_fetch_assoc($res);
    if(empty($row)){
        echo '[]';
    }else{
        $output[]=$row;
        echo json_encode($output);
    }

?>