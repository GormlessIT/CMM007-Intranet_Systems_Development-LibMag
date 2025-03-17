<!-- Login Page -->
<?php
session_start();

// Redirect logged-in users to their respective pages
if (isset($_SESSION['userRole'])) {
    if ($_SESSION['userRole'] === 'admin') {
        header("Location: admin.php");
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
	<link rel="icon" type="image/x-icon" href="logo.ico">
	<!--Links to relevant js files-->
	<script src="login.js"></script>
</head>

<body>
<?php include('navbar.php'); ?>

	<header>
		<h1>LibMag - The Library Management System</h1>
	</header>

	<main>
		<!--Login module-->
		<div id="login">
			<form id="loginForm" method="POST" action="login.php">
				<fieldset>
					<!--Form title-->
					<legend>Login</legend>
					<p><span style="color:red;">*</span> indicates mandatory fields</p>
					<p>Username and Password are maximum 15 characters</p>
					<!--Username box-->
					<div id="usernameField">
						<label for="username">Username: <span style="color: red;">*</span></label>
						<input type="text" name="username" id="username" placeholder="Enter Username" required
							maxlength="255" size="25">
					</div>
					<!--Password box-->
					<div id="passField">
						<label for="password">Password: <span style="color: red;">*</span></label>
						<input type="password" name="password" id="password" placeholder="Enter Password" required
							maxlength="255" size="25">
						<button type="button" id="showHidePassword">Show</button>
					</div>

					<!--User Role dropdown-->
					<div id="roleField">
						<label for="role">User Role: <span style="color:red;">*</span></label>
						<select id="role" name="role">
							<option value="">--Select--</option>
							<option value="user">User</option>
							<option value="admin">Admin</option>
						</select>
					</div>
					<!--Login button-->
					<button type="submit" id="loginButton">Login</button>
				</fieldset>
			</form>
		</div>
	</main>
</body>

<footer>
	<p>Created by Oliwer Szmytkowski 2025</p>
</footer>

</html>