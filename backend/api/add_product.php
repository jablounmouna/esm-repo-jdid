<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data["name"] ?? "");
$price = $data["price"] ?? 0;
$category = trim($data["category"] ?? "");
$description = trim($data["description"] ?? "");
$stock = $data["stock"] ?? 0;
$image = trim($data["image"] ?? "");

if ($name === "" || $price === "" || $category === "") {
    echo json_encode([
        "success" => false,
        "message" => "Name, price and category are required"
    ]);
    exit;
}

try {

    $sql = "INSERT INTO products
            (name, price, category, description, stock, image)
            VALUES
            (:name, :price, :category, :description, :stock, :image)";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":name" => $name,
        ":price" => $price,
        ":category" => $category,
        ":description" => $description,
        ":stock" => $stock,
        ":image" => $image
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Product added successfully",
        "id" => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

