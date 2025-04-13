<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json'); // Ensure response is always JSON

$host = "localhost";
$user = "root";
$password = "";
$database = "LibMag";

$conn = new mysqli($host, $user, $password, $database);
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
$query = "SELECT * FROM users WHERE username = ? AND role = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("ss", $username, $role);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0)
{
    $user = $result->fetch_assoc();
    if ($password === $user['password'])
    {
        echo json_encode(['success' => true, 'message' => 'Logged in successfully', 'role' => $role]);
    }
    else {
        echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    }
}
else
{
    echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
}

error_log("DB role: " . $user['role'] . " | Input role: " . $role);
error_log("DB password: " . $user['password'] . " | Input password: " . $password);

$stmt->close();
$conn->close();
?>