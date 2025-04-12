// BOOK MANAGEMENT

// Utility function to create a button
function createButton(text, id, type, onClick) {
    const button = document.createElement("button");
    button.textContent = text;
    button.id = id;
    button.type = type;
    button.onclick = onClick;
    return button;
}

// Centralized fetch error handler
function handleFetchError(response) {
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return response.json();
}

// Updated fetchBooks function
function fetchBooks() {
    fetch("API/bookCRUD.php", { method: "GET", headers: { 'Content-Type': 'application/json' } })
        .then(handleFetchError)
        .then(data => {
            if (data.success) {
                document.querySelectorAll(".bookList").forEach(table => {
                    const tableBody = table.getElementsByTagName("tbody")[0];
                    tableBody.innerHTML = ""; // Clears table body

                    data.books.forEach(book => {
                        const newRow = tableBody.insertRow(0);
                        newRow.dataset.originalIsbn = book.isbn;
                        newRow.insertCell(0).textContent = book.title;
                        newRow.insertCell(1).textContent = book.author;
                        newRow.insertCell(2).textContent = book.isbn;
                        newRow.insertCell(3).textContent = book.genre;
                        newRow.insertCell(4).textContent = book.quantity;

                        const actionCell = newRow.insertCell(5);
                        actionCell.appendChild(createButton("Remove", "removeBook", "button", event => removeBook(event.target, event)));
                        actionCell.appendChild(createButton("Edit", "editBook", "button", () => editBook(event.target)));
                    });

                    document.getElementById("genreFilterAdmin")?.dispatchEvent(new Event("change"));
                });
            } else {
                console.error("Error fetching books: " + data.message);
            }
        })
        .catch(error => console.error("Error fetching books: ", error));
}

//Function to add a book
function addBook() {
    //Get input values
    let title = document.getElementById("title").value.trim(); //.trim removes whitespace
    let author = document.getElementById("author").value.trim();
    let isbn = document.getElementById("isbn").value.trim();
    let genre = document.getElementById("genre").value.trim();
    let quantity = document.getElementById("quantity").value.trim();

    //Validate fields - They cannot be empty
    //The OR operator is ||
    if (title === "" || author === "" || isbn === "" || genre === "" || quantity === "") {
        alert("Please fill in all fields.");
        return;
    }

    //Validate that the ISBN is exactly 13 digits
    // \d is equivalent to [0-9]
    // {13} specifies 13 occurrences of the preceding character type (i.e. digits since it's 0-9)
    if (!/^\d{13}$/.test(isbn)) {
        alert("ISBN must be exactly 13 digits.");
        return;
    }

    //Validate that Quantity is a positive number
    // parseInt(quantity) converts what is typed in the quantity field into an integer
    // so if it is less than 1, the alert appears
    if (!/^\d+$/.test(quantity) || parseInt(quantity) < 1) {
        alert("Quantity must be more than 0.");
        return;
    }

    //Prepare data to send to PHP
    const bookData = {
        title: title,
        author: author,
        isbn: isbn,
        genre: genre,
        quantity: quantity,
    };

    console.log("Sending data:", JSON.stringify(bookData));

    //Send data to books.php
    fetch("API/bookCRUD.php", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
    })
        .then(response => {
            // Check if the response status is ok (200-299)
            if (!response.ok) {
                throw new Error('Invalid JSON response from server');
            }
            return response.json(); // Only parse JSON if the response is OK
        })
        .then(result => {
            console.log("Response from PHP:", result);
            if (result.success) {
                alert(result.message);
            } else {
                alert("Error: " + result.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error adding book.");
            return;
        });

    //Create a new row instance in the book display table
    let table = document.querySelector(".bookList").getElementsByTagName("tbody")[0];
    let newRow = table.insertRow(0);

    //Inserts the table cells with values entered in the form
    newRow.insertCell(0).textContent = title;
    newRow.insertCell(1).textContent = author;
    newRow.insertCell(2).textContent = isbn;
    newRow.insertCell(3).textContent = genre;
    newRow.insertCell(4).textContent = quantity;

    //Creates a remove button
    let removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.id = "removeBook";
    removeButton.type = "button";
    removeButton.onclick = function (event) {
        removeBook(removeButton, event); //Call removeBook() when on click
    }

    //Creates an edit button
    let editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.id = "editBook";
    editButton.type = "button";
    editButton.onclick = function () {
        editBook(editButton);
    }

    //Add the buttons to the last cell in the table row
    let actionCell = newRow.insertCell(5);
    actionCell.appendChild(removeButton);
    actionCell.appendChild(editButton);

    //Clears form input fields after adding a book
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("quantity").value = "";
}

//Function to remove a book
function removeBook(button, event) {
    event.preventDefault();
    console.log("Remove book button clicked");

    const confirmation = confirm("Are you sure you want to delete this book?");
    console.log("Confirmation result: ", confirmation);
    if (confirmation) {
        let row = button.closest("tr");
        //Retrieve original ISBN stored in row's data attribute
        let isbn = row.dataset.originalIsbn;

        //Send DELETE request to books.php using ISBN
        fetch("API/bookCRUD.php",
            {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isbn: isbn })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok.");
                }
                return response.json();
            })
            .then(result => {
                console.log("DELETE response: ", result);
                if (result.success) {
                    //Remove row from table
                    row.parentNode.removeChild(row);
                    alert("Book deleted successfully.");
                }
                else {
                    alert("Error deleting book: " + result.message);
                }
            })
            .catch(error => {
                console.error("Error in DELETE request: ", error);
                alert("Error deleting book.");
            });
    }
}

//Function to edit book
function editBook(button) {
    //Get table row containing book details to edit
    let row = button.closest("tr");

    //Store original table cell values (except last one with buttons)
    //Allows for cancelling 
    let originalValues = [];
    for (let i = 0; i < row.cells.length - 1; i++) {
        originalValues.push(row.cells[i].textContent);
    }

    //Save original values
    row.dataset.originalValues = JSON.stringify(originalValues);

    //Loop through each table cell (except last one with buttons)
    for (let i = 0; i < row.cells.length - 1; i++) {
        let cell = row.cells[i];

        //Convert cell content into correct input fields
        let input;

        //If the column is "Genre", create a dropdown list
        if (i === 3) {
            input = document.createElement("select");

            //Populate dropdown list with same genre options as in original form
            let genres = ["Action", "Adventure", "Comedy", "Drama", "Horror", "Mystery", "Sci-Fi", "Thriller"];
            genres.forEach((genre) => {
                let option = document.createElement("option");
                option.value = genre;
                option.textContent = genre;
                if (genre === cell.textContent.trim()) {
                    option.selected = true; //Preselect the genre that was already in the cell
                }
                input.appendChild(option);
            });
        }
        //If the column is "Quantity", create a number input field
        else if (i === 4) {
            input = document.createElement("input");
            input.type = "number";
            input.value = cell.textContent.trim();
            input.min = "1"; //Ensure numbers more than 0
        }
        //If the column is "ISBN", create a text input field with maxlength
        else if (i === 2) {
            input = document.createElement("input");
            input.type = "text";
            input.value = cell.textContent.trim();
            input.maxLength = 13; //Ensure exactly 13 digits
        }
        //All other columns are text input fields
        else {
            input = document.createElement("input");
            input.type = "text";
            input.value = cell.textContent.trim();
        }
        //Clear the cell and insert input
        input.style.width = "90%";
        cell.textContent = "";
        cell.appendChild(input);
    }

    //Change edit button text to "Save Changes"
    button.textContent = "Save Changes";
    button.onclick = function () {
        saveChanges(row, button);
    };

    //Create a cancel button and append it to last table cell
    let actionCell = row.cells[row.cells.length - 1];
    let cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.type = "button";
    cancelButton.onclick = function () {
        cancelEdit(row, button, cancelButton);
    };
    actionCell.appendChild(cancelButton);
    row.cancelButton = cancelButton;
}

//Function to cancel edited changes
function cancelEdit(row, saveButton, cancelButton) {
    //Retrieve original values from data attribute
    let originalValues = JSON.parse(row.dataset.originalValues);

    //Restores each cell's contents (except last cell)
    for (let i = 0; i < row.cells.length - 1; i++) {
        row.cells[i].textContent = originalValues[i];
    }

    //Remove cancel button
    cancelButton.remove();
    delete row.cancelButton;

    //Resets "Save Changes" button back to "Edit"
    saveButton.textContent = "Edit";
    saveButton.onclick = function () {
        editBook(saveButton);
    };

    //Remove stored original values
    delete row.dataset.originalValues;
}

//Function to save changes to a book
function saveChanges(row, button) {
    let cells = row.cells;
    let updatedData = {};
    //Retrirve original ISBN from row's data attribute
    updatedData.oldIsbn = row.dataset.originalIsbn;

    //Validates and saves input values back into table cells
    for (let i = 0; i < row.cells.length - 1; i++) {
        let cell = cells[i];
        let input = cell.querySelector("input, select");

        //Ensuring input exists and validating it
        if (input) {
            let value = input.value.trim();

            //Validation
            if (i === 0 && value === "" || i === 1 && value === "") //Title and Author
            {
                alert("Title and author cannot be empty.");
                return;
            }

            else if (i === 2 && !/^\d{13}$/.test(value)) //ISBN
            {
                alert("ISBN must be exactly 13 digits.");
                return;
            }

            else if (i === 3 && value === "") //Genre
            {
                alert("Please select a genre.");
                return;
            }

            else if (i === 4 && (!/^\d+$/.test(value) || parseInt(value) < 1)) //Quantity
            {
                alert("Quantity must be a number more than 0.");
                return;
            }

            //Maps cell index to field name
            if (i === 0) updatedData.title = value;
            else if (i === 1) updatedData.author = value;
            else if (i === 2) updatedData.isbn = value;
            else if (i === 3) updatedData.genre = value;
            else if (i === 4) updatedData.quantity = value;
        }
    }

    //Send PUT request to update book on server
    fetch("API/bookCRUD.php",
        {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        }
    )
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            return response.json();
        })
        .then(result => {
            console.log("PUT response: ", result);
            if (result.success) {
                // Update the row cells with new values
                for (let i = 0; i < cells.length - 1; i++) {
                    let cell = cells[i];
                    let value;
                    if (i === 0) value = updatedData.title;
                    else if (i === 1) value = updatedData.author;
                    else if (i === 2) value = updatedData.isbn;
                    else if (i === 3) value = updatedData.genre;
                    else if (i === 4) value = updatedData.quantity;
                    cell.textContent = value;
                }
                //Update stored original ISBN to new one
                row.dataset.originalIsbn = updatedData.isbn;

                //Remove cancel button if it exists
                if (row.cancelButton) {
                    row.cancelButton.remove();
                    delete row.cancelButton;
                }

                //Changing "Save Changes" button back to "Edit"
                button.textContent = "Edit";
                button.onclick = function () {
                    editBook(button);
                };
                alert("Book updated successfully.");
            } else {
                alert("Error updating book: " + result.message);
            }
        })
        .catch(error => {
            console.error("Error in PUT request: ", error);
            alert("Error updating book.");
        });
}

// USER MANAGEMENT
function fetchUsers() {
    fetch("API/userCRUD.php", {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                let table = document.getElementById("userList").getElementsByTagName("tbody")[0];
                table.innerHTML = ""; //Clear existing rows
                data.users.forEach(user => {
                    let newRow = table.insertRow(0);
                    //Store oriignal email for correct reference to user
                    newRow.dataset.originalEmail = user.email;
                    newRow.insertCell(0).textContent = user.username;
                    newRow.insertCell(1).textContent = user.email;
                    newRow.insertCell(2).textContent = "**********";    //Hide password
                    newRow.insertCell(3).textContent = user.role;

                    let actionCell = newRow.insertCell(4);
                    let removeButton = document.createElement("button");
                    removeButton.textContent = "Remove";
                    removeButton.type = "button";
                    removeButton.onclick = function (event) {
                        removeUser(removeButton, event);
                    };
                    let editButton = document.createElement("button");
                    editButton.textContent = "Edit";
                    editButton.type = "button";
                    editButton.onclick = function () {
                        editUser(editButton);
                    };
                    actionCell.appendChild(removeButton);
                    actionCell.appendChild(editButton);
                });
            } else {
                console.error("Error fetching users: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error fetching users: ", error);
        });
}

function registerUser() {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const role = document.getElementById("role").value.trim();

    //Validate no fields empty
    if (!username || !email || !password || !confirmPassword || !role) {
        alert("Please fill in all fields.");
        return;
    }

    //Validate password and confirm password match
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    const data = { username, email, password, confirmPassword, role };
    console.log("Registering user with data: ", data);

    fetch("API/register.php",
        {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            return response.json();
        })
        .then(result => {
            console.log("Registration response: ", result);
            if (result.success) {
                alert(result.message);
                fetchUsers();
                document.getElementById("username").value = "";
                document.getElementById("email").value = "";
                document.getElementById("password").value = "";
                document.getElementById("confirmPassword").value = "";
                document.getElementById("role").value = "";
            } else {
                alert("Registration failed: " + result.message);
            }
        })
        .catch(error => {
            console.error("Error during registration: ", error);
            alert("Error reigstering user.");
        });
}

function removeUser(button, event) {
    event.preventDefault();
    const confirmation = confirm("Are you sure you want to delete this user?");
    if (confirmation) {
        let row = button.closest("tr");
        let email = row.dataset.originalEmail;

        fetch("API/userCRUD.php",
            {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok.");
                }
                return response.json();
            })
            .then(result => {
                if (result.success) {
                    row.parentNode.removeChild(row);
                    alert("User deleted successfully.");
                } else {
                    alert("Error deleting user: " + result.message);
                }
            })
            .catch(error => {
                console.error("Error in DELETE request: ", error);
                alert("Error deleting user.");
            });
    }
}

function editUser(button) {
    let row = button.closest("tr");

    //Save original cell values for cancel
    let originalValues = [];

    for (let i = 0; i < row.cells.length - 1; i++) {
        originalValues.push(row.cells[i].textContent);
    }
    row.dataset.originalValues = JSON.stringify(originalValues);

    //Convert cells into input fields for edidting
    for (let i = 0; i < row.cells.length - 1; i++) {
        let cell = row.cells[i];

        let input;
        //Username - text input
        if (i === 0) {
            input = document.createElement("input");
            input.type = "text";
            input.value = cell.textContent.trim();
        }
        //Email - email input
        else if (i === 1) {
            input = document.createElement("input");
            input.type = "email";
            input.value = cell.textContent.trim();
        }
        //Password - blank password input
        else if (i === 2) {
            //Container with two fields and show/hide toggles
            let container = document.createElement("div");

            //New Password input
            let pwdInput = document.createElement("input");
            pwdInput.type = "password";
            pwdInput.placeholder = "New password (leave blank if unchanged)";
            pwdInput.style.width = "80%";
            //Show/Hide button
            let pwdToggle = document.createElement("button");
            pwdToggle.type = "button";
            pwdToggle.textContent = "Show";
            pwdToggle.addEventListener("click", function () {
                if (pwdInput.type === "password") {
                    pwdInput.type = "text";
                    pwdToggle.textContent = "Hide";
                } else {
                    pwdInput.type = "password";
                    pwdToggle.textContent = "Show";
                }
            });

            container.appendChild(pwdInput);
            container.appendChild(pwdToggle);

            //"Confirm Password" input (initially hidden)
            let br = document.createElement("br");
            container.appendChild(br);

            let confirmPwdInput = document.createElement("input");
            confirmPwdInput.type = "password";
            confirmPwdInput.placeholder = "Confirm new password";
            confirmPwdInput.style.width = "80%";
            confirmPwdInput.style.display = "none";
            //Show/Hide button
            let confirmToggle = document.createElement("button");
            confirmToggle.type = "button";
            confirmToggle.textContent = "Show";
            confirmToggle.style.display = "none";
            confirmToggle.addEventListener("click", function () {
                if (confirmPwdInput.type === "password") {
                    confirmPwdInput.type = "text";
                    confirmToggle.textContent = "Hide";
                } else {
                    confirmPwdInput.type = "password";
                    confirmToggle.textContent = "Show";
                }
            });

            container.appendChild(confirmPwdInput);
            container.appendChild(confirmToggle);

            //When start typing new password, show confirm field
            pwdInput.addEventListener("input", function () {
                if (pwdInput.value.trim() !== "") {
                    confirmPwdInput.style.display = "inline-block";
                    confirmToggle.style.display = "inline-block";
                } else {
                    confirmPwdInput.style.display = "none";
                    confirmToggle.style.display = "none";
                }
            });

            //Instead of single input field, set cell's content to container
            cell.appendChild(container);
            //References to cell for later retrieval in saveUserChanges
            cell.pwdInput = pwdInput;
            cell.confirmPwdInput = confirmPwdInput;
            continue;   //Skip appending input (already done above)
        }
        //Role - select element
        else if (i === 3) {
            input = document.createElement("select");
            let roles = ["user", "admin"];
            roles.forEach(role => {
                let option = document.createElement("option");
                option.value = role;
                option.textContent = role;
                if (role === cell.textContent.trim()) {
                    option.selected = true;
                }
                input.appendChild(option);
            });
        }
        input.style.width = "90%";
        cell.textContent = "";
        cell.appendChild(input);
    }

    //Change "Edit" button to "Save Changes"
    button.textContent = "Save Changes";
    button.onclick = function () {
        saveUserChanges(row, button);
    }

    //Create cancel button
    let actionCell = row.cells[row.cells.length - 1];
    let cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.type = "button";
    cancelButton.onclick = function () {
        cancelUserEdit(row, button, cancelButton);
    };
    actionCell.appendChild(cancelButton);
    //Store reference to cancel button on the row for later removal
    row.cancelButton = cancelButton;
}

function cancelUserEdit(row, saveButton, cancelButton) {
    let originalValues = JSON.parse(row.dataset.originalValues);

    //Restore each cell's contents
    for (let i = 0; i < row.cells.length - 1; i++) {
        if (i === 2) {
            row.cells[i].textContent = "**********";
        } else {
            row.cells[i].textContent = originalValues[i];
        }
    }
    cancelButton.remove();
    saveButton.textContent = "Edit";
    saveButton.onclick = function () {
        editUser(saveButton);
    };
    delete row.dataset.originalValues;
}

function saveUserChanges(row, button) {
    //Confirm before updating
    if (!confirm("Are you sure you want to update the user with new details?")) {
        return;
    }

    let cells = row.cells;
    let updatedData = {};

    //Retrieve original email from row's data attribute
    updatedData.oldEmail = row.dataset.originalEmail;

    for (let i = 0; i < row.cells.length - 1; i++) {
        let cell = cells[i];
        let input = cell.querySelector("input, select");
        if (input) {
            let value = input.value.trim();
            if (i === 0) {
                if (value === "") { alert("Username cannot be empty."); return; }
                updatedData.username = value;
            } else if (i === 1) {
                if (value === "") { alert("Email cannot be empty."); return; }
                updatedData.email = value;
            } else if (i === 2) {
                // Password field is optional – only update if a new password is provided.

                //Retrieve stored password inputs
                let pwdInput = cell.pwdInput;
                let confirmPwdInput = cell.confirmPwdInput;
                let newPassword = pwdInput.value.trim();

                //If new password provided, check it matches confirmation
                if (newPassword !== "") {
                    if (newPassword !== confirmPwdInput.value.trim()) {
                        alert("New password and confirm password fields do not match.");
                        return;
                    }
                    updatedData.password = newPassword;
                }
            } else if (i === 3) {
                if (value === "") { alert("Role cannot be empty."); return; }
                updatedData.role = value;
            }
        }
    }

    //If password field empty, remove from update payload
    if (!updatedData.password) {
        delete updatedData.password;
    }

    fetch("API/userCRUD.php",
        {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            return response.json();
        })
        .then(result => {
            if (result.success) {
                //Update row cells with new values
                for (let i = 0; i < row.cells.length - 1; i++) {
                    let cell = cells[i];
                    let value;
                    if (i === 0) value = updatedData.username;
                    else if (i === 1) value = updatedData.email;
                    else if (i === 2) value = "**********";
                    else if (i === 3) value = updatedData.role;
                    cell.textContent = value;
                }
                //Update stored email
                row.dataset.originalEmail = updatedData.email;

                //Remove cancel button if exists
                if (row.cancelButton) {
                    row.cancelButton.remove();
                    delete row.cancelButton;
                }

                //Change "Save Changes" button to "Edit"
                button.textContent = "Edit";
                button.onclick = function () {
                    editUser(button);
                };
                alert("User updated successfully.");
            } else {
                alert("Error updating user: " + result.message);
            }
        })
        .catch(error => {
            console.error("Error in PUT request: ", error);
            alert("Error updating user.");
        });
}

document.addEventListener("DOMContentLoaded", function () {
    // Cache DOM elements
    const addButton = document.getElementById("addBook");
    const registerForm = document.querySelector("#addUser form");
    
    // Attach add book form submit event
    if (addButton) {
        addButton.addEventListener("click", addBook);
    }

    // Attach register user form submit event
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();
            registerUser();
        });
    }
     // Attach toggle functionality to the existing toggle buttons in the register form
  const toggleButtons = document.querySelectorAll("#passwordContainer .showHidePassword, #confirmPasswordContainer .showHidePassword");
  
  toggleButtons.forEach(button => {
    // Find the input in the same password-wrapper as this button
    const passwordInput = button.parentElement.querySelector("input");
    if (passwordInput) {
      button.addEventListener("click", function () {
        // Toggle the input type and update the button text accordingly
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        button.textContent = isPassword ? "Hide" : "Show";
      });
    }
  });

    // Load books and users from database when page loads
    fetchBooks();
    fetchUsers();
});