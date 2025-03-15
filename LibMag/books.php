<?php
# book CRUD

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

# GET Request: Retrieve books from database
if ($method === 'GET')
{
    $query = "SELECT * FROM books";
    $result = $conn->query($query);

    if(!$result)
    {
        echo json_encode(["success" => false, "message" => "Query failed: " . $conn->error]);
        $conn->close();
        exit;
    }

    $books = [];
    while ($row = $result->fetch_assoc())
    {
        $books[] = $row;
    }
    echo json_encode(["success" => true, "books" => $books]);
    $conn->close();
    exit;
}
# POST Request: Add Book Functionality
elseif ($method === 'POST')
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
    if (!isset($input['title'], $input['author'], $input['isbn'], $input['genre'], $input['quantity']))
    {
        echo json_encode(["success" => false, "message" => "All fields are required."]);
        exit;
    }

    // Clean user input (for correct SQL query processing)
    $title = $conn->real_escape_string($input['title']);    //real_escape_string ensures removal of special characters for SQL query to be processed correctly
    $author = $conn->real_escape_string($input['author']); 
    $isbn = $conn->real_escape_string($input['isbn']); 
    $genre = $conn->real_escape_string($input['genre']); 
    $quantity = intval($input['quantity']);          //intval ensures input is an integer

    // Insert user input into database
    $query = "INSERT INTO books (title, author, isbn, genre, quantity) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    if (!$stmt)
    {
        die(json_encode(["success" => false, "message" => "SQL prepare failed: " . $conn->error]));
    }
    $stmt->bind_param("ssssi", $title, $author, $isbn, $genre, $quantity); //ssssi = string x4, integer

    if ($stmt->execute())
    {
        echo json_encode(["success" => true, "message" => "Book added successfully."]);
    } else
    {
        echo json_encode(["success" => false, "message" => "Failed to add book. SQL Execute failed: " . $stmt->error]);
    }
}
# PUT Request: Edit Book Functionality
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
    oldIsbn is the book's currently stored ISBN
    this is used for the database to identify which book we are updating, since user has no access to bookId*/
    if (!isset($input['oldIsbn'], $input['title'], $input['author'], $input['isbn'], $input['genre'], $input['quantity']))
    {
        echo json_encode(["success" => false, "message" => "All fields are required."]);
        exit;
    }

    // Clean user input
    $oldIsbn = $conn->real_escape_string($input['oldIsbn']);
    $title = $conn->real_escape_string($input['title']);    //real_escape_string ensures removal of special characters for SQL query to be processed correctly
    $author = $conn->real_escape_string($input['author']); 
    $isbn = $conn->real_escape_string($input['isbn']); 
    $genre = $conn->real_escape_string($input['genre']); 
    $quantity = intval($input['quantity']);  

    // Update book record in database based on old ISBN
    $query = "UPDATE books SET title = ?, author = ?, isbn = ?, genre = ?, quantity = ? WHERE isbn = ?";
    $stmt = $conn->prepare($query);
    
    if (!$stmt)
    {
        die(json_encode(["success" => false, "message" => "SQL prepare failed: " . $conn->error]));
    }

    $stmt->bind_param("ssssis", $title, $author, $isbn, $genre, $quantity, $oldIsbn);
    if ($stmt->execute())
    {
        echo json_encode(["success" => true, "message" => "Book updated successfully."]);
    }
    else
    {
        echo json_encode(["success" => false, "message" => "Failed to update book. SQL Execute failed: " . $stmt->error]);
    }
}   
# DELETE Request: Delete Book Functionality
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
    if (!isset($input['isbn']))
    {
        echo json_encode(["success" => false, "message" => "ISBN is required for deletion."]);
        exit;
    }

    // Clean input and delete based on ISBN
    $isbn = $conn->real_escape_string($input['isbn']);
    $query = "DELETE FROM books WHERE isbn = ?";
    $stmt = $conn->prepare($query);

    if (!$stmt)
    {
        die(json_encode(["success" => false, "message" => "SQL prepare failed: " . $conn->error]));
    }

    $stmt->bind_param("s", $isbn);

    if ($stmt->execute())
    {
        echo json_encode(["success" => true, "message" => "Book deleted successfully."]);
    }
    else
    {
        echo json_encode(["success" => false, "message" => "Failed to delete book. SQL Execute failed: " . $stmt->error]);
    }
}

$stmt->close();
$conn->close();
?>