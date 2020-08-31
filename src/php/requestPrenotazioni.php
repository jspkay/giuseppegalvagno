<?php
    $server = "localhost";
    $user = "giuseppeparrucchiere";
    $pswd = "";
    $db = "my_giuseppeparrucchiere";

    $c = new mysqli($server, $user, $pswd, $db);
    if($c->connect_error){
        die("Can't connect");
    }

    $query = "SELECT * FROM Prenotazioni";

    print('[');
    $result = $c->query($query);
    while($row = $result->fetch_assoc()){
        print(json_encode($row));
        print(",");
    }
    print(']');
?>