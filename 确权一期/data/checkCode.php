<?php
session_start();

$code=strtolower($_GET['code']);
if($code==$_SESSION['helloweba_gg']){
    echo 0;
}else{
    echo 1;
}
?>