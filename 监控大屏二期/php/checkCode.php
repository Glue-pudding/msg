<?php
session_start();

$code=trim($_POST['code']);
if($code==$_SESSION['helloweba_gg']){
    echo 'mc1001';
}
