<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}


$conn = new mysqli("localhost", "mona", "1234", "handmade_shop");


if ($conn->connect_error) {
    echo json_encode([
        "success"=>false,
        "message"=>"Database error"
    ]);
    exit();
}


$data = json_decode(file_get_contents("php://input"), true);


$email = $data["email"] ?? "";
$total = $data["total"] ?? 0;
$address = $data["address"] ?? "";


if (!$email || !$total || !$address) {

    echo json_encode([
        "success"=>false,
        "message"=>"Missing data"
    ]);

    exit();
}


// get user id
$user = $conn->prepare(
    "SELECT id FROM users WHERE email=?"
);

$user->bind_param("s",$email);
$user->execute();

$result = $user->get_result();


if ($result->num_rows == 0){

    echo json_encode([
        "success"=>false,
        "message"=>"User not found"
    ]);

    exit();

}


$row = $result->fetch_assoc();

$user_id = $row["id"];



// insert order

$stmt = $conn->prepare(
"INSERT INTO orders (user_id,total,address,status)
VALUES (?,?,?,'Pending')"
);


$stmt->bind_param(
"ids",
$user_id,
$total,
$address
);



if($stmt->execute()){

    echo json_encode([
        "success"=>true,
        "message"=>"Order created"
    ]);

}else{

    echo json_encode([
        "success"=>false,
        "message"=>$stmt->error
    ]);

}


$conn->close();
