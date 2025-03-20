<?php
// Ensures all PHP errors display
error_reporting(E_ALL);     
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

header("Content-Type: application/json"); // Ensure response is always JSON

// Connecting to database
$host = "localhost";
$user = "root";
$password = "";
$database = "LibMag";

$conn = new mysqli($host, $user, $password, $database);
//Double checks connection
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed!"]);
    exit;
}

// Read raw JSON input
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    echo json_encode(["success" => false, "message" => "Invalid JSON input"]);
    exit;
}

//Validate all required fields present
if (!isset($input['username'], $input['email'], $input['password'], $input['confirmPassword'], $input['role'])) 
{
    echo json_encode(['success'=> false, 'message'=> "All fields are required."]);
    exit;
}

$username = $conn->real_escape_string($input['username']);
$email = $conn->real_escape_string($input['email']);
$passwordInput = $input['password'];  // Do not escape before hashing
$confirmPassword = $input['confirmPassword'];
$role = $conn->real_escape_string($input['role']);

//Ensure password and confirm password match
if ($passwordInput !== $confirmPassword){
    echo json_encode(['success'=> false,'message'=> "Passwords do not match."]);
    exit;
}

//Hash password
$hashedPassword = password_hash($passwordInput, PASSWORD_DEFAULT);

//Check if email already registered
$emailCheck = "SELECT email FROM users WHERE email = ?";
$stmtCheck = $conn->prepare($emailCheck);
$stmtCheck->bind_param("s", $email);
$stmtCheck->execute();
$stmtCheck->store_result();
if($stmtCheck->num_rows > 0) {
    echo json_encode(["success"=> true,"message"=> "This email is already registered."]);
    $stmtCheck->close();
    $conn->close();
    exit;
}
$stmtCheck->close();

//INSERT new user
$sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
if(!$stmt) {
    echo json_encode(["success"=> false,"message"=> "SQL prepare failed: " . $conn->error]);
    exit;
}
$stmt->bind_param("ssss", $username, $email, $hashedPassword, $role);

if($stmt->execute()) {
    echo json_encode(["success"=> true,"message"=> "User registered successfully."]);
} else {
    echo json_encode(["success"=> false, "message"=> "Failed to register user. Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>