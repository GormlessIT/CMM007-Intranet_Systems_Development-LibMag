<!--Navbar-->
<link rel="stylesheet" href="navbar.css">

<div class="navbar">
  <div class="profile-section">
    <img src="profile-icon.ico" alt="Profile Icon" class="profile-icon">
    <span id="user-info">
      <?php
      if (isset($_SESSION["username"]) && ($_SESSION["userRole"])) {
        echo "Logged in as: " . htmlspecialchars($_SESSION["username"]) . " (" . htmlspecialchars($_SESSION['userRole']) . ")";
      } else {
        echo "Not logged in!";
      }
      ?>
    </span>
  </div>
  <!--Show logout button only if user is logged in-->
  <?php if (isset($_SESSION["username"]) && isset($_SESSION["userRole"])): ?>
    <button id="logout-btn">Logout</button>
  <?php endif; ?>
</div>

<!--Set user info and handle logout-->
<script>
  document.addEventListener('DOMContentLoaded', function () {

    // Handle logout
    document.getElementById("logout-btn").addEventListener('click', function () {
      fetch("logout.php", { method: "POST" }) // Call logout script
        .then(() => {
          window.location.href = "loginPage.php"; // Redirect to login page
        });
    });
  });
</script>