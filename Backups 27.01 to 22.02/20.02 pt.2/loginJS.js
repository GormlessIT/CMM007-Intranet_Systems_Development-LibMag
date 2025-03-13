document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");

    console.log("login.js loaded"); // Confirm script load

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const userRole = document.getElementById("userRole").value;

        console.log("Form Data:", { username, password, userRole }); // Debug form data

        if (username === "" || password === "" || userRole === "") {
            alert("All fields are required.");
            return;
        }

        const data = {
            username: username,
            password: password,
            userRole: userRole
        };

        console.log("Data to be sent:", data); // Debug data

        fetch('login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                console.log("Response status:", response.status); // Debug response status
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => {
                console.log("Result:", result); // Debug result
                if (result.success) {
                    alert(result.message);
                    if (result.userRole === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'user.html';
                    }
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

    showHidePasswordButton.addEventListener("click", function() {
        if (passwordField.type === "password") {
            passwordField.type = "text";
            showHidePasswordButton.textContent = "Hide";
        } else {
            passwordField.type = "password";
            showHidePasswordButton.textContent = "Show";
        }
    });
});