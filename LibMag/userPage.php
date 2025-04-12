<!-- User Dashboard-->
<?php
session_start();

// Restrict access to only users
if (!isset($_SESSION['userRole']) || $_SESSION['userRole'] !== 'user') {
	header("Location: loginPage.php");
	exit();
}

// Set inactivity timeout - inactivity based on lack of requests to the server
$timeoutDuration = 1800; // 30 minutes in seconds
if (isset($_SESSION['lastActivity']) && (time() - $_SESSION['lastActivity'] > $timeoutDuration)) {
	session_unset(); // Unset session variables
	session_destroy(); // Destroy the session i.e. logout
	header("Location: loginPage.php"); // Redirect to login page
	exit();
}
$_SESSION['lastActivity'] = time(); // Update last activity time
?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>LibMag Book Search</title>
	<!--Website icon-->
	<link rel="icon" type="image/x-icon" href="/custom-icons/logo.ico"> <!-- Corrected path -->
	<!--Relevant styles-->
	<link rel="stylesheet" href="css/search-bar.css">
	<link rel="stylesheet" href="css/modal.css">
	<link rel="stylesheet" href="css/main-style.css">
	<!--Embed user ID from the session into a global JS variable-->
	<script>window.currentUserId = <?php echo isset($_SESSION['userId']) ? json_encode($_SESSION['userId']) : 'null' ?>;</script>
	<!--Relevant scripts-->
	<script>window.userRole = 'user';</script>
	<script src="js/books.js"></script>
	<script src="js/search.js"></script>
	<script src="js/loans.js"></script>
</head>

<body>
	<?php include('navbar.php'); ?>

	<header>
		<h1>Available Books at the Library</h1>
	</header>
	
	<main>
		<h2>Search and Loan Books</h2>
		<h3>You may loan up to 3 books at a time</h3>
		<div class="search-bar">
			<label for="bookSearch">Search:</label>
			<input type="text" id="bookSearch" placeholder="Search by Title, Author, or Genre">
			<label for="genreFilter">Filter by Genre:</label>
			<select id="genreFilter">
				<option value="">All Genres</option>
				<option value="Action">Action</option>
				<option value="Adventure">Adventure</option>
				<option value="Comedy">Comedy</option>
				<option value="Drama">Drama</option>
				<option value="Horror">Horror</option>
				<option value="Mystery">Mystery</option>
				<option value="Sci-Fi">Sci-Fi</option>
				<option value="Thriller">Thriller</option>
			</select>
		</div>
		
		<table class="bookList">
			<thead>
				<tr>
					<th>Title</th>
					<th>Author</th>
					<th>ISBN</th>
					<th>Genre</th>
					<th>Quantity</th>
				</tr>
			</thead>
			<tbody>
				<!--Books inserted here by books.js-->
			</tbody>
		</table>

		<h2>Loan Management</h2>
		<div class="search-bar">
			<label for="loanSearch">Search:</label>
			<input type="text" id="loanSearch" placeholder="Search by Title, Author, or Genre">
			<label for="statusFilter">Filter by Status:</label>
			<select id="statusFilter">
				<option value="">No filter</option>
				<option value="Active">Active</option>
				<option value="Returned">Returned</option>
				<option value="Overdue">Overdue</option>
			</select>
		</div>

		<fieldset>
			<legend>Loaned Books:</legend>
			<table id="loanList">
				<thead>
					<tr>
						<th>Title</th>
						<th>Author</th>
						<th>ISBN</th>
						<th>Genre</th>
						<th>Loaned on</th>
						<th>Return Date</th>
						<th>Status</th>
						<th>Returned on</th>
					</tr>
				</thead>
				<tbody>
					<!--Loaned books inserted here by loans.js-->
				</tbody>
			</table>
		</fieldset>

		<!-- Borrow Book Modal -->
		 <div id="loanModal" class="modal">
			<div class="modal-content">
				<span class="close-button" id="loanModalClose">&times;</span>
				<h2 id="modalBookTitle"><!--Filled by books.js--></h2>
				<p id="modalBookDetails"><!--Filled by books.js--></p>
				<p>Minimum book loan time is 1 week</p>
				<p>Maximum book loan time is 3 months</p>
				<form id="loanForm">
					<label for="loanDate">Borrow Date:</label>
					<input type="date" id="loanDate" name="loanDate" required>
					
					<label for="returnDate">Return Date:</label>
					<input type="date" id="returnDate" name="returnDate" required>
					
					<button type="submit">Confirm Borrow</button>
				</form>
			</div>
		</div>
	</main>
	<script>
		document.addEventListener("DOMContentLoaded", function() {
			initializeSearchBar("bookSearch", "genreFilter", ".bookList", 3);	// 3 = index of Genre column
			initializeSearchBar("loanSearch", "statusFilter", "#loanList", 6);	// 6 = index of Status column
			fetchBooks(); // Ensure books are fetched on page load
			fetchLoans(); // Ensure loans are fetched on page load
		});
	</script>
</body>

<footer>
	<p>Created by Oliwer Szmytkowski 2025</p>
</footer>

</html>