<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// DB connection
$conn = new mysqli("localhost", "mona", "1234", "handmade_shop");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit();
}

// Get JSON
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "No JSON received"
    ]);
    exit();
}

// 🆕 fields
$name = trim($data['name'] ?? "");
$email = trim($data['email'] ?? "");
$phone = trim($data['phone'] ?? "");
$password = trim($data['password'] ?? "");

// ✅ Validation
if (!$name || !$password || (!$email && !$phone)) {
    echo json_encode([
        "success" => false,
        "message" => "Name, password and (email or phone) required"
    ]);
    exit();
}

// 🔥 Phone format (اختياري)
if ($phone && !preg_match('/^[0-9]{8,15}$/', $phone)) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid phone"
    ]);
    exit();
}

// 🔍 Check duplicate (email OR phone)
$check = $conn->prepare("SELECT id FROM users WHERE email = ? OR phone = ?");
$check->bind_param("ss", $email, $phone);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Email or phone already exists"
    ]);
    exit();
}

// 🔐 Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// 🆕 Insert
$sql = "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $name, $email, $phone, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "User created"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Insert failed",
        "error" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>