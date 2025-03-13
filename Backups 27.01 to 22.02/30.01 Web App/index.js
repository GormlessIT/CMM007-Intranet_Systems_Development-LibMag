document.getElementById("showHidePassword").addEventListener("click", function()
{
    //Declares passwordField variable as connecting to the "password" ID
    let passwordField = document.getElementById("password");

    //Changes passwordField type between text(text shown)/password(text hidden)
    passwordField.type = passwordField.type === "password" ? "text" : "password";
    //Changes Show/Hide button text
    this.textContent = passwordField.type === "password" ? "Show" : "Hide";
}
);

function redirectToPage()
{
    let role = document.getElementById("userRole").value;

    if (role === "user")
    {
        <!--Shows message in console, useful for debugging-->
        console.log("Redirecting to user.html");
        <!--window.location.href = "..." was used initially, but this is compatible with more browsers-->
        window.location.assign("user.html");
    }
    else if (role === "admin")
    {
        console.log("Redirecting to admin.html");
        window.location.assign("admin.html");
    }
    else
    {
        console.log("Displaying alert");
        alert("Please select a user role");
    }
}