<?php

ini_set('display_errors',1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin:*");
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli(
    "localhost",
    "mona",
    "1234",
    "handmade_shop"
);

// ✅ GET ORDERS
$sql = "
SELECT 
    orders.id,
    orders.total,
    orders.address,
    orders.phone,
    orders.status,
    orders.created_at,
    users.name,
    users.email
FROM orders
JOIN users ON orders.user_id = users.id
ORDER BY orders.id DESC
";

$result = $conn->query($sql);

$orders = [];

while($row = $result->fetch_assoc()){

    $order_id = $row["id"];

    // ✅ FIX هنا
    $items = $conn->query("
        SELECT 
            order_items.id,
            order_items.quantity,
            order_items.price,
            products.name,
            products.image
        FROM order_items
        JOIN products 
        ON order_items.product_id = products.id
        WHERE order_items.order_id = $order_id
    ");

    $products = [];

    while($item = $items->fetch_assoc()){

        // ✅ نصلح image path
        $item["image"] = "http://localhost:8002/uploads/" . $item["image"];

        $products[] = $item;
    }

    $row["products"] = $products;

    $orders[] = $row;
}

echo json_encode([
    "success" => true,
    "orders" => $orders
]);

$conn->close();

?>