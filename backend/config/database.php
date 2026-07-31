<?php

$host = "localhost";
$dbname = "handmade_shop";

$username = "mona";
$password = "1234";
try {

$pdo = new PDO(
"mysql:host=$host;dbname=$dbname;charset=utf8",
$username,
$password
);

$pdo->setAttribute(
PDO::ATTR_ERRMODE,
PDO::ERRMODE_EXCEPTION
);

} catch(PDOException $e){

echo json_encode([
"success"=>false,
"message"=>$e->getMessage()
]);

exit;

}

?>