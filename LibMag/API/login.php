<?php
session_start();

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

// Debug: Log received data
error_log("Received data: " . print_r($input, true));

$username = $input['username'] ?? '';
$password = $input['password'] ?? '';
$role = $input['role'] ?? '';

if (empty($username) || empty($password) || empty($role)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

$role = strtolower($input['role']); //Converts user role input to lowercase
$query = "SELECT * FROM users WHERE username = ? AND role = ?"; //Queries database with user input
$stmt = $conn->prepare($query);
$stmt->bind_param("ss", $username, $role);  //ss = string, string
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user["password"])) {
        $_SESSION['userId'] = $user['userId'];
        $_SESSION['username'] = $username;
        $_SESSION['userRole'] = $role;
        echo json_encode(['success' => true, 'message' => 'Logged in successfully', 'role' => $role, 'username' => $username]);
        exit;
    } else if ($password === $user['password']) {
        // User has an old plaintext password; hash it and update DB
        $newHashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $updateStmt = $conn->prepare("UPDATE users SET password = ? WHERE username = ?");
        $updateStmt->bind_param("ss", $newHashedPassword, $username);
        $updateStmt->execute();
        $updateStmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
        exit;
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    exit;
}

if (isset($user)) {
    error_log("DB role: " . $user['role'] . " | Input role: " . $role);
    error_log("DB password: " . $user['password'] . " | Input password: " . $password);
}

$stmt->close();
$conn->close();
?>