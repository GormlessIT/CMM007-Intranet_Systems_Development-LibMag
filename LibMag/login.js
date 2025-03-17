document.addEventListener("DOMContentLoaded", function()
{
    console.log("DOM fully loaded and parsed");
    const loginForm = document.getElementById("loginForm");
    if (!loginForm){
        console.error("Element #loginForm not found in the document!");
        return;
    }

    console.log("login.js loaded"); // Confirm script load

    // Ensure the 'role' element is found
    const roleField = document.getElementById("role");
    if (roleField) {
        const role = roleField.value.trim();  // Only access value if roleField exists
        console.log("Role value: ", role);
    } else {
        console.error("Role field not found at this point.");
    }

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const role = document.getElementById("role").value.trim();

        console.log("Form Data:", { username, password, role }); // Debug form data

        if (username === "" || password === "" || role === "") {
            alert("All fields are required.");
            return;
        }

        const data =
            {
            username: username,
            password: password,
            role: role
            };

        console.log("Data to be sent:", data); // Debug data

        fetch('login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(response => response.text()) // Read response as text first
            .then(text => {
                console.log("Raw Response:", text); // Debug: Show raw response
                return JSON.parse(text); // Try to parse JSON
            })
            .then(result => {
                console.log("Parsed JSON:", result);
                if (result.success) {
                    showMessage(result.message, true);

                    //Redirect to page based on role
                    setTimeout(() => {
                        if (result.role === 'admin') {
                            window.location.href = 'admin.php';
                        } else {
                            window.location.href = 'userPage.php';
                        }
                    }, 3000); // Redirect after 3 seconds
                } else {
                    alert(result.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to login. Please ensure you are using the correct username, password and role combination. Otherwise, you may need to try again later.');
            });
    });

    // Function to show custom message
    function showMessage(message, isSuccess) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.textContent = message;

    // Append the message to the body
    document.body.appendChild(messageDiv);

    // Remove the message after 3 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

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