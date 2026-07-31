<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");


$conn = new mysqli("localhost", "mona", "1234", "handmade_shop");

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database error"
    ]);
    exit();
}


// get email
$email = $_GET['email'] ?? "";

if (!$email) {
    echo json_encode([
        "success" => false,
        "message" => "Email required"
    ]);
    exit();
}


// find user id
$user = $conn->prepare("SELECT id FROM users WHERE email = ?");
$user->bind_param("s", $email);
$user->execute();

$result = $user->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "User not found"
    ]);
    exit();
}


$userData = $result->fetch_assoc();
$user_id = $userData['id'];


// get orders
$stmt = $conn->prepare("SELECT * FROM orders WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();


$result = $stmt->get_result();

$orders = [];

while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}


echo json_encode([
    "success" => true,
    "orders" => $orders
]);


$conn->close();