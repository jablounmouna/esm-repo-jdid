<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include "../config/database.php";
require "../vendor/autoload.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$data = json_decode(file_get_contents("php://input"));


$login = $data->login ?? "";


if(empty($login)){

    echo json_encode([
        "success"=>false,
        "message"=>"Email or phone required"
    ]);

    exit;
}


try {

    // Find user by email or phone
    $sql = "SELECT id, email, phone FROM users WHERE email = ? OR phone = ?";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $login,
        $login
    ]);


    $user = $stmt->fetch(PDO::FETCH_ASSOC);


    if(!$user){

        echo json_encode([
            "success"=>false,
            "message"=>"User not found"
        ]);

        exit;
    }


    // Generate reset code
    $code = rand(100000,999999);


    // Save code temporarily
    $update = $pdo->prepare(
        "UPDATE users SET reset_code=? WHERE id=?"
    );


   
$update->execute([
    $code,
    $user["id"]
]);


// SEND EMAIL HERE
$mail = new PHPMailer(true);

try {

    $mail->isSMTP();

    $mail->Host = "smtp.gmail.com";
    $mail->SMTPAuth = true;


    $mail->Username = "هنا_تحط_email@gmail.com";

    $mail->Password = "هنا_App_Password";


    $mail->SMTPSecure = "tls";
    $mail->Port = 587;


    $mail->setFrom(
        "هنا_تحط_email@gmail.com",
        "Handmade Shop"
    );


    $mail->addAddress($user["email"]);


    $mail->Subject = "Password Reset Code";


    $mail->Body = "
Hello,

Your reset code is:

$code

Handmade Shop
";


    $mail->send();


    echo json_encode([
        "success"=>true,
        "message"=>"Reset code sent to your email"
    ]);


} catch(Exception $e){

    echo json_encode([
        "success"=>false,
        "message"=>"Email error: ".$mail->ErrorInfo
    ]);

}

}catch(PDOException $e){


    echo json_encode([

        "success"=>false,

        "message"=>$e->getMessage()

    ]);

}

?>