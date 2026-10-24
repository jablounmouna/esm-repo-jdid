<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Only POST allowed"
    ]);
    exit();
}

require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON"
    ]);
    exit();
}

$product_id = isset($data['product_id'])
    ? (int)$data['product_id']
    : 0;

$quantity = isset($data['quantity'])
    ? max(0, (int)$data['quantity'])
    : 0;

$threshold = isset($data['low_stock_threshold'])
    ? max(0, (int)$data['low_stock_threshold'])
    : 10;

if ($product_id <= 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "product_id required"
    ]);
    exit();
}

try {

    // Create inventory table if it doesn't exist
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS inventory (
            product_id INT PRIMARY KEY,
            quantity INT NOT NULL DEFAULT 0,
            low_stock_threshold INT NOT NULL DEFAULT 10
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");

    // Insert or update inventory
    $stmt = $pdo->prepare("
        INSERT INTO inventory (
            product_id,
            quantity,
            low_stock_threshold
        )
        VALUES (
            :product_id,
            :quantity,
            :threshold
        )
        ON DUPLICATE KEY UPDATE
            quantity = VALUES(quantity),
            low_stock_threshold = VALUES(low_stock_threshold)
    ");

    $stmt->execute([
        ':product_id' => $product_id,
        ':quantity' => $quantity,
        ':threshold' => $threshold
    ]);

    echo json_encode([
        "success" => true,
        "product_id" => $product_id,
        "quantity" => $quantity,
        "low_stock_threshold" => $threshold
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "DB error",
        "error" => $e->getMessage()
    ]);
}
?>