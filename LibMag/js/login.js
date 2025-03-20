document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return console.error("Element #loginForm not found in the document!");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const role = document.getElementById("role").value.trim();

        if (!username || !password || !role) {
            alert("All fields are required.");
            return;
        }

        fetch('API/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    const messageContainer = document.getElementById("loginMessage");
                    if (messageContainer) {
                        messageContainer.textContent = `Logged in successfully: ${username} (User role: ${role})`;
                        messageContainer.style.color = "green";
                    }
                    setTimeout(() => {
                        window.location.href = result.role === 'admin' ? 'adminPage.php' : 'userPage.php';
                    }, 3000);
                } else {
                    alert(result.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to login. Please try again later.');
            });
    });

    const showHidePasswordButton = document.getElementById("showHidePassword");
    const passwordField = document.getElementById("password");

    showHidePasswordButton.addEventListener("click", function () {
        const isPassword = passwordField.type === "password";
        passwordField.type = isPassword ? "text" : "password";
        showHidePasswordButton.textContent = isPassword ? "Hide" : "Show";
    });
});