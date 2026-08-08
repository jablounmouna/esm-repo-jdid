<?php

// 🔥 Debug (تنحيها في production)
error_reporting(E_ALL);
ini_set('display_errors', 1);


// ✅ CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");


// ✅ handle OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method"
    ]);
    exit();
}


// ✅ DB connection
require_once __DIR__ . '/../config/database.php';


// ✅ read JSON
$input = file_get_contents("php://input");
$data = json_decode($input);


// ❗ check JSON valid
if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON"
    ]);
    exit;
}


// ✅ validation
if (empty($data->login) || empty($data->password)) {
    echo json_encode([
        "success" => false,
        "message" => "Email/phone and password required"
    ]);
    exit;
}


try {

    // 🔍 search by email OR phone
    $sql = "SELECT id, name, email, phone, password, role 
            FROM users 
            WHERE email = ? OR phone = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $data->login,
        $data->login
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);


    // ❌ user not found
    if (!$user) {
        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);
        exit;
    }


    // 🔐 check password
    if (password_verify($data->password, $user["password"])) {

        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "user" => [
                "id" => $user["id"],
                "name" => $user["name"],
                "email" => $user["email"],
                "phone" => $user["phone"],
                "role" => $user["role"]
            ]
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Wrong password"
        ]);
    }


} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage() // ❗ نحّيها في production
    ]);
}

?>