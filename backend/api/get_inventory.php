<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/../config/database.php';

try {
    // ensure inventory table exists
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS inventory (
            product_id INT PRIMARY KEY,
            quantity INT NOT NULL DEFAULT 0,
            low_stock_threshold INT NOT NULL DEFAULT 10
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;"
    );

    // join products and inventory when possible
    $stmt = $pdo->query(
        "SELECT p.id as product_id, p.name as product_name, p.price as price, p.image as image,
                i.quantity as quantity, i.low_stock_threshold as low_stock_threshold
         FROM inventory i
         LEFT JOIN products p ON p.id = i.product_id"
    );

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "items" => $rows]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "DB error", "error" => $e->getMessage()]);
}

?>
