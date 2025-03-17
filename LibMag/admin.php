<!-- Admin Dashboard-->
<?php
session_start();

// Restrict access to only admins
if (!isset($_SESSION['userRole']) || $_SESSION['userRole'] !== 'admin') {
    header("Location: loginPage.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>[ADMIN] LibMag</title>
	<!--Website icon-->
	<link rel="icon" type="image/x-icon" href="logo.ico">
	<!--Relevant js files-->
	<script src="admin.js"></script>
</head>

<body>
	<?php include('navbar.php'); ?>

	<header>
		<h1>Admin Page</h1>
	</header>

	<main>
		<!--Book Management Functionality-->
		<div id="bookManagement">
			<h2>Book Management</h2>
			<!--Add Books-->
			<div id="addBookForm">
				<form>
					<fieldset>
						<!--Form title-->
						<legend>Add Books:</legend>
						<!--Book title box-->
						<div id="bookTitle">
							<label for="title">Title:</label>
							<input type="text" name="title" id="title" placeholder="Enter Book Title" required
								maxlength="255">
						</div>
						<!--Book author box-->
						<div id="bookAuthor">
							<label for="author">Author:</label>
							<input type="text" name="author" id="author" placeholder="Enter Author Name" required
								maxlength="255">
						</div>
						<!--ISBN box-->
						<div id="bookISBN">
							<label for="isbn">ISBN:</label>
							<input type="text" name="isbn" id="isbn" placeholder="Enter ISBN" required minlength="13"
								maxlength="13">
							<p>an ISBN number must be 13 digits long</p>
						</div>
						<!--Genre box-->
						<div id="bookGenre">
							<label for="genre">Genre:</label>
							<select id="genre" name="genre">
								<option value="">--Select--</option>
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
						<!--Quantity box-->
						<div id="bookQuantity">
							<label for="quantity">Quantity:</label>
							<input type="number" name="quantity" id="quantity" placeholder="Enter Quantity" required
								size="5" min="1">
						</div>
						<!--Add book button-->
						<button type="button" id="addBook">Add Book</button>
					</fieldset>
				</form>
			</div>
			<!--Update/Delete Books-->
			<div id="editBook">
				<fieldset>
					<!--Displaying existing books-->
					<legend>Edit/Remove Books:</legend>
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
							<!--Books will be added here dynamically using addBookForm-->
						</tbody>
					</table>
				</fieldset>
			</div>
		</div>
		<!--User Management Functionality-->
		<div id="userManagement">
			<h2>User Management</h2>
			<!--Register Users-->
			<div id="addUser">
				<form>
					<fieldset>
						<legend>Register Users:</legend>
						<div id="usernameContainer">
							<label for="username">Username:</label>
							<input type="text" name="username" id="username" placeholder="Enter Username Here" required>
						</div>

						<div id="emailContainer">
							<label for="email">Email:</label>
							<input type="email" name="email" id="email" placeholder="Enter Email Here" required>
						</div>

						<div id="passwordContainer">
							<label for="password">Password:</label>
							<input type="password" name="password" id="password"
								placeholder="Enter Temporary Password Here" required>
						</div>

						<div id="confirmPasswordContainer">
							<label for="confirmPassword">Confirm Password:</label>
							<input type="password" name="confirmPassword" id="confirmPassword"
								placeholder="Confirm Password" required>
						</div>

						<div id="userRole">
							<label for="role">Role:</label>
							<select id="role" name="role">
								<option value="">--Select--</option>
								<option value="user">User</option>
								<option value="admin">Admin</option>
							</select>
						</div>

						<button type="submit" id="registerButton">Register New User</button>

					</fieldset>
				</form>
			</div>
			<!--Update/Delete Users-->
			<div id="editUser">
				<fieldset>
					<legend>Edit/Remove Users:</legend>
					<table id="userList">
						<thead>
							<tr>
								<th>Username</th>
								<th>Email</th>
								<th>Password</th>
								<th>Role</th>
							</tr>
						</thead>
						<tbody>
							<!--Users will be added here dynamically-->
						</tbody>
					</table>
				</fieldset>
			</div>
		</div>
	</main>
</body>

<footer>
	<p>Created by Oliwer Szmytkowski 2025</p>
</footer>

</html>