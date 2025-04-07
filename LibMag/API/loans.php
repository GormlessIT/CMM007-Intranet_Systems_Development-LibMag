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

// Determines request method
$method = $_SERVER['REQUEST_METHOD'];

// POST: Create a new loan
if ($method == 'POST') {
    // Read raw JSON input
    $jsonInput = file_get_contents("php://input");
    if (!$jsonInput) {
        die(json_encode(["success" => false, "message" => "No JSON received."]));
    }
    $input = json_decode($jsonInput, true);
    if (!$input) {
        die(json_encode(["success" => false, "message" => "Invalid JSON input."]));
    }

    // Required fields
    if (!isset($input['userId'], $input['bookId'], $input['loanDate'], $input['returnDate'])) {
        echo json_encode(["success" => false, "message" => "All fields are required."]);
        exit;
    }

    // Clean input
    $userId = intval($input['userId']);
    $bookId = intval($input['bookId']);
    $loanDate = date('Y-m-d H:i:s', strtotime($input['loanDate']));
    $returnDate = date('Y-m-d H:i:s', strtotime($input['returnDate']));

    // Validate dates: ensure loanDate < returnDate, min duration 7 days, max duration 90 days
    $start = strtotime($loanDate);
    $end = strtotime($returnDate);
    if ($end <= $start) {
        echo json_encode(["success" => false, "message" => "Return date must be after loan date."]);
        exit;
    }
    $diffDays = ($end - $start) / (60 * 60 * 24);
    if ($diffDays < 7) {
        echo json_encode(["success" => false, "message" => "Minimum loan duration is 1 week."]);
        exit;
    }
    if ($diffDays > 90) {
        echo json_encode(["success" => false, "message" => "Maximum loan duration is 3 months."]);
        exit;
    }

    // Check if book is available (quantity > 0)
    $query = "SELECT quantity FROM books WHERE bookId = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $bookId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Book not found."]);
        exit;
    }
    $book = $result->fetch_assoc();
    if ($book['quantity'] < 1) {
        echo json_encode(["success" => false, "message" => "Book is not currently available."]);
        exit;
    }
    $stmt->close();

    // Check if user has already borrowed the book
    $query = "SELECT * FROM loans WHERE userId = ? AND bookId = ? AND returnDate > NOW()";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $userId, $bookId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "You have already borrowed this book."]);
        exit;
    }
    $stmt->close();

    // Check if user already has 3 active loans
    $query = "SELECT COUNT(*) as loanCount FROM loans WHERE userId = ? AND returnDate > NOW()";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    if ($row['loanCount'] >= 3) {
        echo json_encode(["success" => false, "message" => "You cannot borrow more than 3 books at a time."]);
        exit;
    }
    $stmt->close();

    // All checks passed, insert loan record
    $query = "INSERT INTO loans (userId, bookId, loanDate, returnDate) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "SQL prepare failed: " . $conn->error]);
        exit;
    }
    $stmt->bind_param("iiss", $userId, $bookId, $loanDate, $returnDate);
    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => "SQL execute failed: " . $stmt->error]);
        exit;
    }
    $stmt->close();

    // Update book quantity
    $query = "UPDATE books SET quantity = quantity - 1 WHERE bookId = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $bookId);
    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => "Failed to update book quantity: " . $stmt->error]);
        exit;
    }
    $stmt->close();

    echo json_encode(["success" => true, "message" => "Book loaned successfully."]);
    $conn->close();
    exit;
}

// GET: Retrieve all loans for a user
else if ($method == 'GET') {
    // Check if userId is provided
    if (!isset($_GET['userId'])) {
        echo json_encode(["success" => false, "message" => "User ID is required."]);
        exit;
    }
    $userId = intval($_GET['userId']);

    // Fetch loans for the user
    $query = "SELECT l.*, b.title, b.author, b.isbn, b.genre
    FROM loans l
    JOIN books b ON l.bookId = b.bookId
    WHERE l.userId = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    // Fetch all loans into an array
    $loans = [];
    while ($row = $result->fetch_assoc()) {
        $loans[] = $row;
    }
    
    echo json_encode(["success" => true, "loans" => $loans]);
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}



$conn->close();
?>