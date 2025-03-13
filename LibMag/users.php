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
if ($conn->connect_error) 
{
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Determines request type
$method = $_SERVER['REQUEST_METHOD'];

# GET Request: Retrieve users from database
if ($method === 'GET')
{
    $query = "SELECT userId, username, email, role FROM users";
    $result = $conn->query($query);

    if(!$result)
    {
        echo json_encode(["success" => false, "message" => "Query failed: " . $conn->error]);
        $conn->close();
        exit;
    }

    $users = [];
    while ($row = $result->fetch_assoc())
    {
        $users[] = $row;
    }

    echo json_encode(["success" => true, "users" => $users]);
}

$conn->close();
?>