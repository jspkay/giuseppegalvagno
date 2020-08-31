<?php

include "getSalt.php";

if( !isset($_COOKIE["logged"]) ){
    echo "FALSE1";
    return false;
}
$hash = file_get_contents("passwordHash.info");
if($hash !== $_COOKIE["logged"]){
    echo "FALSE2";
    return false;
}

echo "TRUE";
$pswd = $_POST["password"];
$salt = getSalt();
$salted = $salt.$pswd.$salt;
$newHash = password_hash($salt);
file_put_contents("passwordHash.info", $newHash);
return true;