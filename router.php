<?php
// router.php — routes /api/* to ./api/* and adds CORS headers for development
// Allow CORS for development only
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Route /api/* -> ./api/*
if (strpos($uri, '/api/') === 0) {
    $localPath = __DIR__ . '/api' . substr($uri, strlen('/api'));

    if (is_file($localPath)) {
        // Let PHP handle .php files by including them
        if (substr($localPath, -4) === '.php') {
            include $localPath;
            return true;
        }

        // For static files, return false so the built-in server serves them
        return false;
    }

    http_response_code(404);
    echo "Not Found";
    return true;
}

// For everything else, let the built-in server handle it
return false;
