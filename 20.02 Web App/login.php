<?php
// Connecting to database
$host = "localhost";
$user = "root";
$password = "oliSQL112";
$database = "LibMag";

$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error)
{
    die("Connection failed: " . $conn->connect_error);
}

// Handling login
if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
  // Get user details from the login request
  $username = $_POST['username'];
  $password = $_POST['password'];
  $userRole = $_POST['userRole'];

  // Validates input
  if (empty($username) || empty($password) || empty($role))
  {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    die;
  }

  // Prepares query to authenticate user
  $query = "SELECT * FROM users WHERE username = ? AND password = ? AND userRole = ?";
  $stmt = $conn->prepare($query);
  $stmt->bind_param("sss", $username, $password, $userRole);
  $stmt->execute();
  $result = $stmt->get_result();

  // Check if user exists
  if ($result->num_rows > 0)
  {
    // Successful login
    echo json_encode(['success' => true, 'message' => 'Logged in successfully', 'userRole' => $userRole]);
  }
  else
  {
    // Unsuccessful login
    echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
  }

  $stmt->close();
}

$conn->close();
?>