<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$message = trim($data["message"] ?? "");

if ($message === "") {
    echo json_encode([
        "success" => false,
        "message" => "Message is required"
    ]);
    exit;
}

/*
 * Temporary chatbot.
 * Later we will replace this with the real AI API.
 */

$messageLower = strtolower($message);

if (str_contains($messageLower, "hello") || str_contains($messageLower, "hi")) {

    $reply = "Hello 👋 Welcome to our Handmade Shop! How can I help you?";

} elseif (str_contains($messageLower, "product")) {

    $reply = "Sure! 🛍️ I can help you find a product.";

} elseif (str_contains($messageLower, "delivery")) {

    $reply = "🚚 We can help you with delivery information.";

} elseif (str_contains($messageLower, "order")) {

    $reply = "📦 I can help you with your order.";

} else {

    $reply = "I'm here to help 😊 You can ask me about products, orders, or delivery.";
}

echo json_encode([
    "success" => true,
    "reply" => $reply
]);