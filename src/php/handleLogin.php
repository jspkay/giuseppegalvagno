<?php
include "getSalt.php";

$pswd = $_POST["password"];
$hashed = file_get_contents("passwordHash.info");
$res = password_verify($pswd, $hashed);

if($res){
    //$sc = setcookie("logged", $hashed, time()+3600, "/", "localhost:8001");
    $salt = getSalt();
    echo "LOGGED-".$salt;
    file_put_contents("session", $salt);
    echo "-";
    print_r($_SESSION);
    return true;
}else{
    echo "FALSE";
    return false;
}