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
	<link rel="icon" type="image/x-icon" href="logo.ico">
	<!--Relevant scripts-->
	<script>window.userRole = 'user';</script>
	<script src="books.js"></script>
</head>

<body>
	<?php include('navbar.php'); ?>

	<header>
		<h1>User Page</h1>
	</header>
	
	<main>
		<h2>Available Books</h2>
		<table id="bookList">
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
	</main>
	<script>
    document.addEventListener("DOMContentLoaded", function() {
      fetchBooks();
    });
  </script>
</body>

<footer>
	<p>Created by Oliwer Szmytkowski 2025</p>
</footer>

</html>