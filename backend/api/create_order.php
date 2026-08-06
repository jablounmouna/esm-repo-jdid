<?php

// ✅ CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// ✅ حل preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ تأكد POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => false,
        "message" => "Only POST allowed"
    ]);
    exit();
}

// ✅ READ JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "No JSON received"
    ]);
    exit();
}

// ✅ VARIABLES
$email   = $data["email"] ?? "";
$total   = $data["total"] ?? 0;
$address = $data["address"] ?? "";
$phone   = $data["phone"] ?? "";
$products = $data["products"] ?? [];

// ✅ VALIDATION
if (empty($email) || empty($total) || empty($address) || empty($phone)) {
    echo json_encode([
        "success" => false,
        "message" => "Missing data"
    ]);
    exit();
}

if (empty($products)) {
    echo json_encode([
        "success" => false,
        "message" => "No products received"
    ]);
    exit();
}

// ✅ DATABASE
$conn = new mysqli(
    "localhost",
    "mona",
    "1234",
    "handmade_shop"
);

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database error"
    ]);
    exit();
}

$conn->begin_transaction();

try {

    // ✅ GET USER
    $user = $conn->prepare(
        "SELECT id FROM users WHERE email=?"
    );

    $user->bind_param("s", $email);
    $user->execute();

    $result = $user->get_result();

    if ($result->num_rows == 0) {
        throw new Exception("User not found");
    }

    $userData = $result->fetch_assoc();
    $user_id = $userData["id"];

    // ✅ INSERT ORDER
    $status = "Pending";

    $stmt = $conn->prepare(
        "INSERT INTO orders 
        (user_id,total,address,phone,status)
        VALUES (?,?,?,?,?)"
    );

    $stmt->bind_param(
        "idsss",
        $user_id,
        $total,
        $address,
        $phone,
        $status
    );

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    $order_id = $conn->insert_id;

    // ✅ INSERT PRODUCTS (FIX هنا 🔥)
    $count = 0;

    foreach ($products as $product) {

        $product_id = (int) ($product["id"] ?? 0);
        $price = (float) ($product["price"] ?? 0);
        $quantity = (int) ($product["quantity"] ?? 1);

        if (!$product_id) {
            throw new Exception("Product ID missing");
        }

        $checkProduct = $conn->prepare("SELECT id FROM products WHERE id = ?");
        $checkProduct->bind_param("i", $product_id);
        $checkProduct->execute();
        $productResult = $checkProduct->get_result();

        if ($productResult->num_rows === 0) {
            $name = $product["name"] ?? "Unknown Product";
            if (is_array($name)) {
                $name = $name["en"] ?? $name["fr"] ?? $name["ar"] ?? "Unknown Product";
            }
            $name = (string) $name;
            $image = $product["image"] ?? null;

            $insertProduct = $conn->prepare(
                "INSERT INTO products (id, name, price, image) VALUES (?, ?, ?, ?)"
            );
            $insertProduct->bind_param("isds", $product_id, $name, $price, $image);

            if (!$insertProduct->execute()) {
                throw new Exception($insertProduct->error);
            }
        }

        $item = $conn->prepare(
            "INSERT INTO order_items
            (order_id, product_id, quantity, price)
            VALUES (?,?,?,?)"
        );

        $item->bind_param(
            "iiid",
            $order_id,
            $product_id,
            $quantity,
            $price
        );

        if (!$item->execute()) {
            throw new Exception($item->error);
        }

        $count++;
    }

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Order created",
        "order_id" => $order_id,
        "products_saved" => $count
    ]);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$conn->close();

?>