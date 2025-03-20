<!--Navbar-->
<link rel="stylesheet" href="css/navbar.css">

<div class="navbar">
  <div class="profile-section">
    <img src="custom-icons/profile-icon.ico" alt="Profile Icon" class="profile-icon">
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
    const logoutButton = document.getElementById("logout-btn");
    if (logoutButton) {
      logoutButton.addEventListener('click', function () {
        fetch("API/logout.php", { method: "POST" }) 
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            if (data.success) {
              window.location.href = "loginPage.php"; 
            } else {
              alert("Failed to log out. Please try again.");
            }
          })
          .catch(error => {
            console.error("Error during logout:", error);
            alert("An error occurred while logging out.");
          });
      });
    }
  });
</script>