<?php

function connect(){
    $server = "localhost";
    $user = "giuseppegalvagno";
    $pswd = "";
    $db = "my_giuseppegalvagno";

    $c = new mysqli($server, $user, $pswd, $db);
    if($c->connect_error){
        return null;
        die("Can't connect");
    }
    return $c;
}
function trovaPrenotazione($id){
    $conn = connect();
    $query = "SELECT * FROM Prenotazioni WHERE id=".$id;
    $res = $conn->query($query);
    $row = $res->fetch_assoc();
    $conn->close();
    return $row;
}
function eliminaPrenotazione(){
    $conn = connect();
    $id = $_GET["id"];
    $p = trovaPrenotazione($id);
    if($p === NULL){
        echo "Prenotazione non trovata";
        die("Prenotazione non trovata");
    }
    if($_GET["telefono"] !== $p["telefono"]){
        echo "Controllare i dati inseriti";
        die("Controllare i dati inseriti");
    }
    $query = "DELETE FROM Prenotazioni WHERE id=".$id;
    $res = $conn->query($query);
    if($res !== true){
        echo "Internal error";
    }
    else{
        echo "OK";
    }
    $conn->close();
}
function inserisciPrenotazione(){
    $conn = connect();
    $name = $_GET["nome"];
    $cognome = $_GET["cognome"];
    $telefono = $_GET["telefono"]; $tel_regex = "/^\d{10,13}$/";
    $tipo = $_GET["tipo"];
    $data = $_GET["dataP"]; $data_regex = "/((((19|20)([2468][048]|[13579][26]|0[48])|2000)-02-29|((19|20)[0-9]{2}-(0[469]|11)-(0[1-9]|[12][0-9]|30)|(19|20)[0-9]{2}-(0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(19|20)[0-9]{2}-02-(0[1-9]|1[0-9]|2[0-8])))\s([01][0-9]|2[0-3]):([012345][0-9]))/";
    $info = $_GET["info"];

    if( preg_match($tel_regex, $telefono) !== 1){
        die("Error in telefono");
    }
    if( preg_match($data_regex, $data) !== 1 ){
        die("Error in date");
    }
    if(strlen($info) > 255){die("info troppo lunga!");}
    $qry = "INSERT INTO Prenotazioni (Nome, Cognome, Telefono, Tipo, Data, Info) VALUES ('%s', '%s', '%s', %d, '%s', '%s');";
    $query = sprintf($qry, $name, $cognome, $telefono, $tipo, $data, $info) ;

    $res = $conn->query($query);

    if( $res != TRUE){
        echo "<br/>\nError during insertion<br/>\n";
    }
    else{
        echo "OK";
    }

    $conn->close();
}
function infoPrenotazione(){
    $c = connect();
    $p = trovaPrenotazione($_GET["id"]);
    if($_GET["telefono"] != $p["telefono"]){
        echo "Telefono non corretto";
        die("Telefono non corretto");
    }
    print_r($p);

    $c->close();
}
function modificaPrenotazione(){
    $c = connect();
    $p = trovaPrenotazione($_GET["id"]);
    if($_GET["telefono"] != $p["telefono"]){
        echo "Telefono non corretto";
        die("Telefono non corretto");
    }
    $query = "UPDATE Prenotazioni SET nome='%s', cognome='%s', telefono='%s', data='%s', tipo=%s where id=%s";
    $query = sprintf($query, $_GET["nome"], $_GET["cognome"], $_GET["telefono"], $_GET["dataP"], $_GET["tipo"], $_GET["id"]);

    $res = $c->query($query);
    if($res === false){
        echo "Internal error";
        die();
    }
    echo "OK";
    $c->close();
}
function tuttePrenotazioni(){
    $c = connect();

    $query = "SELECT * FROM Prenotazioni";

    print('[');
    $result = $c->query($query);

    $i = 1; $n = $result->num_rows-1;
    while($i<=$n){
        $row = $result->fetch_assoc();
        print(json_encode($row));
        print(",");
        $i++;
    }
    print(json_encode($result->fetch_assoc()));
    print(']');

    $c->close();
}

if(isset($_GET["elimina"])){
    eliminaPrenotazione();
}
else if(isset($_GET["inserisci"])){
    inserisciPrenotazione();
}
else if(isSet($_GET["connect"])){
    $conn = connect();
    if($conn == false){echo "error";}
}
else if(isset($_GET["getInfo"])){infoPrenotazione();}
else if(isset($_GET["modifica"])){modificaPrenotazione();}
else if(isset($_GET["tuttePrenotazioni"])){tuttePrenotazioni();}
else{
    echo "Operazione inesistente";
    die();
}