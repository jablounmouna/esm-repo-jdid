<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


// Database connection
$conn = new mysqli(
    "localhost",
    "mona",
    "1234",
    "handmade_shop"
);


if ($conn->connect_error) {

    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);

    exit();

}



// get email from URL
$email = $_GET['email'] ?? "";


if (empty($email)) {

    echo json_encode([
        "success" => false,
        "message" => "Email required"
    ]);

    exit();

}



// Get user id
$user = $conn->prepare(
    "SELECT id FROM users WHERE email = ?"
);


$user->bind_param(
    "s",
    $email
);


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

$user_id = $userData["id"];





// Get user's orders
$stmt = $conn->prepare(
    "SELECT 
        id,
        total,
        address,
        phone,
        status,
        created_at
     FROM orders
     WHERE user_id = ?
     ORDER BY created_at DESC"
);



$stmt->bind_param(
    "i",
    $user_id
);



$stmt->execute();



$ordersResult = $stmt->get_result();



$orders = [];



while($row = $ordersResult->fetch_assoc()) {

    $order_id = $row["id"];

    $itemsResult = $conn->query(
        "SELECT
            order_items.quantity,
            order_items.price,
            products.name,
            products.image
        FROM order_items
        LEFT JOIN products ON order_items.product_id = products.id
        WHERE order_items.order_id = $order_id"
    );

    $items = [];

    while ($item = $itemsResult->fetch_assoc()) {
        $items[] = $item;
    }

    $row["products"] = $items;
    $orders[] = $row;
}



echo json_encode([

    "success" => true,

    "orders" => $orders

]);



$conn->close();

?>