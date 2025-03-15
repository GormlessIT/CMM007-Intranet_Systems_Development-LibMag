<?php
# user CRUD

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
# PUT Request: Edit User Functionality
elseif ($method === 'PUT')
{
    // Read raw JSON input
    $jsonInput = file_get_contents("php://input");
    if (!$jsonInput) 
    {
        die(json_encode(["success" => false, "message" => "No JSON received."]));
    }
    $input = json_decode($jsonInput, true);
    if (!$input) 
    {
        die(json_encode(["success" => false, "message" => "Invalid JSON input", "raw" => $jsonInput]));
    }

    /* Validate input
    oldEmail is the user's currently stored email
    this is used for the database to identify which user we are updating, since user has no access to userId*/
    if (!isset($input['oldEmail'], $input['username'], $input['email'], $input['role']))
    {
        echo json_encode(["success" => false, "message" => "All fields (except password) are required."]);
        exit;
    }

    // Clean user input
    $oldEmail = $conn->real_escape_string($input['oldEmail']);
    $username = $conn->real_escape_string($input['username']); 
    $email = $conn->real_escape_string($input['email']); 
    $role = $conn->real_escape_string($input['role']); 
    
    // Check if password is provided and non empty
    $passwordProvided = false;
    if(isset($input['password']) && trim($input['password']) !== "")
    {
        $passwordProvided = true;
        $password = $conn->real_escape_string($input['password']);
    }

    // Build query based on whether new password is provided or not
    if ($passwordProvided)
    {
        // Update username, email, password and role
        $query = "UPDATE users SET username = ?, email = ?, password = ?, role = ? WHERE email = ?";
        $stmt = $conn->prepare($query);
        if (!$stmt) 
        {
            die(json_encode(["success" => false, "message" => "SQL Prepare failed: " . $conn->error]));
        }
        $stmt->bind_param("sssss", $username, $email, $password, $role, $oldEmail);
    } else {
        // Update username, email and role
        $query = "UPDATE users SET username = ?, email = ?, role = ? WHERE email = ?";
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            die(json_encode(["success" => false, "message" => "SQL prepare failed: " . $conn->error]));
        }
        $stmt->bind_param("ssss", $username, $email, $role, $oldEmail);
    }

    if ($stmt->execute())
    {
        echo json_encode(["success" => true, "message" => "User updated successfully."]);
    }
    else
    {
        echo json_encode(["success" => false, "message" => "Failed to update user. SQL Execute failed: " . $stmt->error]);
    }
}   
# DELETE Request: Delete User Functionality
elseif ($method === 'DELETE')
{
    // Read raw JSON input
    $jsonInput = file_get_contents("php://input");
    if (!$jsonInput) 
    {
        die(json_encode(["success" => false, "message" => "No JSON received."]));
    }
    $input = json_decode($jsonInput, true);
    if (!$input) 
    {
        die(json_encode(["success" => false, "message" => "Invalid JSON input", "raw" => $jsonInput]));
    }

    // Validate input
    if (!isset($input['email']))
    {
        echo json_encode(["success" => false, "message" => "Email is required for deletion."]);
        exit;
    }

    // Clean input and delete based on ISBN
    $email = $conn->real_escape_string($input['email']);
    $query = "DELETE FROM users WHERE email = ?";
    $stmt = $conn->prepare($query);

    if (!$stmt)
    {
        die(json_encode(["success" => false, "message" => "SQL prepare failed: " . $conn->error]));
    }

    $stmt->bind_param("s", $email);

    if ($stmt->execute())
    {
        echo json_encode(["success" => true, "message" => "User deleted successfully."]);
    }
    else
    {
        echo json_encode(["success" => false, "message" => "Failed to delete user. SQL Execute failed: " . $stmt->error]);
    }
}
$conn->close();
?>