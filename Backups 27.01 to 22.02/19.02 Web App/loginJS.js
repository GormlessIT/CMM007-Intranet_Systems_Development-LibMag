//Event listener for the show/hide button
document.getElementById("showHidePassword").addEventListener("click", function() {
    //Declares passwordField variable as connecting to the "password" ID
    let passwordField = document.getElementById("password");

    //Changes passwordField type between text(text shown)/password(text hidden)
    passwordField.type = passwordField.type === "password" ? "text" : "password";
    //Changes Show/Hide button text
    this.textContent = passwordField.type === "password" ? "Show" : "Hide";
}
);

// Send form data via POST request to login.php and handle response
document.getElementById('loginForm').addEventListener('submit', async (e) =>
{
    e.preventDefault(); // Prevent form submission from reloading the page

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const userRole = document.getElementById('userRole').value;

    try
    {
        const response = await fetch('login.php',
            {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
                    body: new URLSearchParams({ username, password, role }),
                });

        const data = await response.json();

        if (data.success)
        {
            alert(data.message);
            if (data.userRole === 'Admin')
            {
                window.location.href = 'admin.html';
            }
            else if (data.userRole === 'User')
            {
                window.location.href = 'user.html';
            }
        }
        else
        {
            alert(data.message);
        }
    }
    catch (error)
    {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

function redirectToPage()
{
    //var used to be used but this is outdated
    let username = document.getElementById("username").value;   //Defines variable 'username' connected to "username" id
    let password = document.getElementById("password").value;   //Define var 'password' id "username"
    let role = document.getElementById("userRole").value;       //Define var 'role' id "userRole"

    //Check if username or password field is empty
    if (!username || !password)
    {
        console.log("Displaying alert: Field are required");
        alert("Username and password are required");
        return; //stops execution (does not check for role)
    }

    //If role is user, redirect to user page
    if (role === "user")
    {
        <!--Shows message in console, useful for debugging-->
        console.log("Redirecting to user.html");
        <!--window.location.href = "..." was used initially, but this is compatible with more browsers-->
        window.location.assign("user.html");
    }
    //If role is admin, redirect to admin page
    else if (role === "admin")
    {
        console.log("Redirecting to admin.html");
        window.location.assign("admin.html");
    }
    //If there is no role, display an alert
    else
    {
        console.log("Displaying alert");
        alert("Please select a user role");
    }
}