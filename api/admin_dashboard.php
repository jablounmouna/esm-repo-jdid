<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config/database.php";

try {

    /*
    ==========================================
    1. TOTAL ORDERS
    ==========================================
    */

    $stmt = $pdo->query("
        SELECT COUNT(*) AS total_orders
        FROM orders
    ");

    $totalOrders = (int) $stmt->fetch(PDO::FETCH_ASSOC)['total_orders'];


    /*
    ==========================================
    2. REVENUE
    ==========================================
    */

    $stmt = $pdo->query("
        SELECT COALESCE(SUM(total), 0) AS revenue
        FROM orders
        WHERE status != 'Cancelled'
    ");

    $revenue = (float) $stmt->fetch(PDO::FETCH_ASSOC)['revenue'];


    /*
    ==========================================
    3. TOTAL USERS
    ==========================================
    */

    $stmt = $pdo->query("
        SELECT COUNT(*) AS total_users
        FROM users
    ");

    $totalUsers = (int) $stmt->fetch(PDO::FETCH_ASSOC)['total_users'];


    /*
    ==========================================
    4. TOTAL PRODUCTS
    ==========================================
    */

    $stmt = $pdo->query("
        SELECT COUNT(*) AS total_products
        FROM products
    ");

    $totalProducts = (int) $stmt->fetch(PDO::FETCH_ASSOC)['total_products'];


    /*
    ==========================================
    5. TOTAL SALES
    ==========================================
    
    Nombre total d'unités vendues.
    
    order_items.quantity contient la quantité
    de chaque produit dans chaque commande.
    */

    $stmt = $pdo->query("
        SELECT COALESCE(SUM(oi.quantity), 0) AS total_sales
        FROM order_items oi
        INNER JOIN orders o
            ON o.id = oi.order_id
        WHERE o.status != 'Cancelled'
    ");

    $totalSales = (int) $stmt->fetch(PDO::FETCH_ASSOC)['total_sales'];


    /*
    ==========================================
    6. LOW STOCK
    ==========================================
    
    On vérifie si quantity <= low_stock_threshold.
    */

    $lowStock = 0;

    try {

        $stmt = $pdo->query("
            SELECT COUNT(*) AS low_stock
            FROM inventory
            WHERE quantity <= low_stock_threshold
        ");

        $lowStock = (int) $stmt->fetch(PDO::FETCH_ASSOC)['low_stock'];

    } catch (PDOException $e) {

        // Si la table inventory n'existe pas encore
        $lowStock = 0;
    }


    /*
    ==========================================
    7. RECENT ORDERS
    ==========================================
    */

    $stmt = $pdo->query("
        SELECT
            o.id,
            o.total,
            o.address,
            o.status,
            o.created_at,
            u.name AS user_name,
            u.email AS user_email
        FROM orders o
        LEFT JOIN users u
            ON u.id = o.user_id
        ORDER BY o.created_at DESC
        LIMIT 5
    ");

    $recentOrders = $stmt->fetchAll(PDO::FETCH_ASSOC);


    /*
    ==========================================
    8. SALES BY DAY
    ==========================================
    */

    $stmt = $pdo->query("
        SELECT
            DATE(o.created_at) AS date,
            COALESCE(SUM(oi.quantity), 0) AS sales,
            COALESCE(SUM(oi.quantity * oi.price), 0) AS revenue
        FROM orders o
        INNER JOIN order_items oi
            ON oi.order_id = o.id
        WHERE o.status != 'Cancelled'
        GROUP BY DATE(o.created_at)
        ORDER BY date ASC
        LIMIT 30
    ");

    $salesChart = $stmt->fetchAll(PDO::FETCH_ASSOC);


    /*
    ==========================================
    RESPONSE
    ==========================================
    */

    echo json_encode([
        "success" => true,

        "stats" => [
            "total_sales" => $totalSales,
            "revenue" => $revenue,
            "total_orders" => $totalOrders,
            "total_users" => $totalUsers,
            "total_products" => $totalProducts,
            "low_stock" => $lowStock
        ],

        "sales_chart" => $salesChart,

        "recent_orders" => $recentOrders
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
}