/*Restricts access
Both admins and users access login.html
Admins can only access admin.html
Users can only access user.html*/

document.addEventListener("DOMContentLoaded", function () {
    // Retrieve user information from sessionStorage
    const userRole = sessionStorage.getItem('userRole');
    const username = sessionStorage.getItem('username');

    if (!userRole || !username) {
        // If no userRole or username in sessionStorage, redirect to login page
        window.location.href = 'login.html';
        return;
    }

    // Restrict access for users
    if (userRole === 'user') {
        if (window.location.pathname !== '/user.html') {
            // Users should only be able to access user.html
            window.location.href = 'user.html';
        }
    }

    // Restrict access for admins
    if (userRole === 'admin') {
        if (window.location.pathname !== '/admin.html') {
            // Admins should only be able to access admin.html
            window.location.href = 'admin.html';
        }
    }
});