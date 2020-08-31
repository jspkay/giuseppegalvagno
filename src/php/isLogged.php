<?php

$session = file_get_contents("session");
if(!$session) echo "NOT FIND FILE";

if(!isset($_POST["session"]) || $session===false){
    echo "FALSE";
    return false;
}
$salt = $_POST["session"];

if($salt == $session){
    echo "TRUE";
    return true;
}else{
    echo "FALSE2";
    return false;
}