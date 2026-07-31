<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "../config/database.php";

// 🆕 استقبل login بدل email
$data = json_decode(file_get_contents("php://input"));

// ✅ validation
if (
    empty($data->login) ||
    empty($data->password)
) {
    ob_clean();
    echo json_encode([
        "success" => false,
        "message" => "Email or phone and password required"
    ]);
    exit;
}

try {

    // 🔥 query جديدة (email OR phone)
    $sql = "SELECT id, name, email, phone, password, role 
            FROM users 
            WHERE email = ? OR phone = ?";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $data->login,
        $data->login
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);
        exit;
    }

    // 🔐 password check
    if (password_verify($data->password, $user["password"])) {

        ob_clean();

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
        "message" => "Database error"
    ]);

}
?>