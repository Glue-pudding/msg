<?php
    header("Content-type:application/json;Access-Control-Allow-Origin:*;charset=utf-8");
    header("Access-Control-Allow-Origin:*");

    $id=$_REQUEST['id'];
    $output=[];
    if(empty($id)){
        echo '[]';
    }

    $conn=mysqli_connect('127.0.0.1','root','123456','operatingcenter');

    $sql='SET NAMES UTF8';
    mysqli_query($conn,$sql);

    $sql="select runningStatus from testList  where id=$id";
    $res=mysqli_query($conn,$sql);
    //函数从结果集中取得一行作为关联数组。返回根据从结果集取得的行生成的关联数组，如果没有更多行，则返回 false。
    //mysql_fetch_assoc()
    //mysql_fetch_array() 函数从结果集中取得一行作为关联数组，或数字数组，或二者兼有返回根据从结果集取得的行生成的数组，如果没有更多行则返回 false。
    $row=mysqli_fetch_array($res);
    if(empty($row)){
            echo '[]';
    }else if($row['runningStatus']=='链路中断'){
            $sql="update testList set runningStatus='链路正常' where id=$id";
            mysqli_query($conn,$sql);

            $sql="select * from testList where id=$id";
            $res2=mysqli_query($conn,$sql);

            $row=mysqli_fetch_assoc($res2);

            if(empty($row)){
                echo '[]';
            }else{
                $output[]=$row;
                echo json_encode($output);
            }
    }else if($row['runningStatus']=='链路正常' || $row['runningStatus']=='告警'){
            //print_r($row);
            $sql="update testList set runningStatus='链路中断' where id=$id";
            mysqli_query($conn,$sql);

            $sql="select * from testList where id=$id";
            $res2=mysqli_query($conn,$sql);

            $row=mysqli_fetch_assoc($res2);

            if(empty($row)){
                echo '[]';
            }else{
                $output[]=$row;
                echo json_encode($output);
            }
    }

    else{echo '服务端错误，请联系后台开发人员！';}




?>