<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include "../config/database.php";


$data = json_decode(file_get_contents("php://input"));


$login = $data->login ?? "";
$code = $data->code ?? "";
$newPassword = $data->password ?? "";


if(
    empty($login) ||
    empty($code) ||
    empty($newPassword)
){

    echo json_encode([
        "success"=>false,
        "message"=>"All fields required"
    ]);

    exit;
}


try {


    // Find user with code
    $sql = "
    SELECT id 
    FROM users 
    WHERE (email = ? OR phone = ?)
    AND reset_code = ?
    ";


    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $login,
        $login,
        $code
    ]);


    $user = $stmt->fetch(PDO::FETCH_ASSOC);



    if(!$user){

        echo json_encode([
            "success"=>false,
            "message"=>"Invalid code"
        ]);

        exit;
    }



    // Hash new password
    $hashedPassword = password_hash(
        $newPassword,
        PASSWORD_DEFAULT
    );


    // Update password + remove code
    $update = $pdo->prepare(
        "UPDATE users 
         SET password=?, reset_code=NULL 
         WHERE id=?"
    );


    $update->execute([
        $hashedPassword,
        $user["id"]
    ]);



    echo json_encode([
        "success"=>true,
        "message"=>"Password changed successfully"
    ]);



}catch(PDOException $e){

    echo json_encode([
        "success"=>false,
        "message"=>$e->getMessage()
    ]);

}

?>