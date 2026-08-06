<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");


$conn = new mysqli(
    "localhost",
    "mona",
    "1234",
    "handmade_shop"
);


if ($conn->connect_error) {
    echo json_encode([
        "success"=>false,
        "message"=>"Database error"
    ]);
    exit();
}


$data = json_decode(file_get_contents("php://input"), true);


$id = $data["id"] ?? "";
$status = $data["status"] ?? "";


if(!$id || !$status){

    echo json_encode([
        "success"=>false,
        "message"=>"Missing data"
    ]);

    exit();
}



$stmt = $conn->prepare(
    "UPDATE orders SET status=? WHERE id=?"
);


$stmt->bind_param(
    "si",
    $status,
    $id
);



if($stmt->execute()){

    echo json_encode([
        "success"=>true,
        "message"=>"Status updated"
    ]);

}else{

    echo json_encode([
        "success"=>false,
        "message"=>$stmt->error
    ]);

}


$conn->close();

?>