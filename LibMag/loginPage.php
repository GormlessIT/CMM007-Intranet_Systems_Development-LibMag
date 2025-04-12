<!-- Login Page -->
<?php
session_start();

// Redirect logged-in users to their respective pages
if (isset($_SESSION['userRole'])) {
	if ($_SESSION['userRole'] === 'admin') {
		header("Location: adminPage.php");
		exit();
	} elseif ($_SESSION['userRole'] === 'user') {
		header("Location: userPage.php");
		exit();
	}
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>LibMag Login</title>
	<!--Website icon-->
	<link rel="icon" type="image/x-icon" href="/custom-icons/logo.ico">
	<!--Relevant styles-->
	<link rel="stylesheet" href="css/main-style.css">
	<!--Relevant scripts-->
	<script src="js/login.js"></script>
</head>

<body>
	<?php include('navbar.php'); ?>

	<header>
		<h1>LibMag - The Library Management System</h1>
	</header>

	<main>
		<div id="loginMessage"></div>
		<!--Login module-->
		<div id="login">
			<form id="loginForm" method="POST" action="login.php">
				<fieldset>
					<!--Form title-->
					<legend>Please login below</legend>
					<p><span style="color:red;">*</span> Indicates mandatory fields</p>
					<!--Username box-->
					<div id="usernameField">
						<label for="username">Username <span style="color: red;">*</span></label>
						<input type="text" name="username" id="username" placeholder="Enter Username" required>
					</div>
					<!--Password box-->
					<div id="passField">
						<label for="password">Password <span style="color: red;">*</span></label>
						<div class="password-wrapper">
							<input type="password" name="password" id="password" placeholder="Enter Password" required>
							<button type="button" class="showHidePassword">Show</button>
						</div>
					</div>

					<!--User Role dropdown-->
					<div id="roleField">
						<label for="role">User Role <span style="color:red;">*</span></label>
						<select id="role" name="role">
							<option value="">--Select--</option>
							<option value="user">User</option>
							<option value="admin">Admin</option>
						</select>
					</div>
					<!--Login button-->
					<button type="submit" id="loginButton">Login to LibMag!</button>
				</fieldset>
			</form>
		</div>
	</main>
</body>

<footer>
	<p>Created by Oliwer Szmytkowski 2025</p>
</footer>

</html>