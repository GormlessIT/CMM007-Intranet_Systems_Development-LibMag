<!-- User Dashboard-->
<?php
session_start();

// Restrict access to only users
if (!isset($_SESSION['userRole']) || $_SESSION['userRole'] !== 'user') {
	header("Location: loginPage.php");
	exit();
}
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
	<!--Relevant scripts-->
	<script>window.userRole = 'user';</script>
	<script src="js/books.js"></script>
	<script src="js/bookSearch.js"></script>
</head>

<body>
	<?php include('navbar.php'); ?>

	<header>
		<h1>Available Books at the Library</h1>
	</header>
	
	<main>
		<h2>Search and Borrow Books</h2>
		
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
		<fieldset>
			<legend>Borrowed Books:</legend>
			<table class="bookList">
				<thead>
					<tr>
						<th>Title</th>
						<th>Author</th>
						<th>ISBN</th>
						<th>Genre</th>
						<th>Borrowed on</th>
						<th>Due Date</th>
						<th>Returned on</th>
					</tr>
				</thead>
			</table>
		</fieldset>
	</main>
	<script>
		document.addEventListener("DOMContentLoaded", function() {
			initializeSearchBar("bookSearch", "genreFilter", ".bookList");
			fetchBooks(); // Ensure books are fetched on page load
		});
	</script>
</body>

<footer>
	<p>Created by Oliwer Szmytkowski 2025</p>
</footer>

</html>