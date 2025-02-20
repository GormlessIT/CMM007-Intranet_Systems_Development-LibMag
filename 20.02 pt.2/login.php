<?php
$host = "localhost";
$user = "root";
$password = "oliSQL112";
$database = "LibMag";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    error_log("Input received: " . print_r($input, true)); // Debug input

    $username = $input['username'];
    $password = $input['password'];
    $userRole = $input['userRole'];

    if (empty($username) || empty($password) || empty($userRole)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required.']);
        die;
    }

    $query = "SELECT * FROM users WHERE username = ? AND userRole = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ss", $username, $userRole);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password'])) {
            echo json_encode(['success' => true, 'message' => 'Logged in successfully', 'userRole' => $userRole]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    }

    $stmt->close();
}

$conn->close();
?>