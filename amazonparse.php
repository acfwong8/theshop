<?php

$url = $_POST['id']; 

$xmlparse = simplexml_load_file($url);

$newarray = (($xmlparse));

echo json_encode($newarray);



?>

