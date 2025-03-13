//Function to fetch and display books from database
function fetchBooks() {
    fetch("admin.php",
        {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        }
    )
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                let table = document.getElementById("bookList").getElementsByTagName("tbody")[0];
                table.innerHTML = "";   //Clears table body
                data.books.forEach(book => {
                    let newRow = table.insertRow(0); //0 = always appends to first table row
                    //original ISBN stored in a data attribute (used as unique identifier)
                    newRow.dataset.originalIsbn = book.isbn;
                    newRow.insertCell(0).textContent = book.title;
                    newRow.insertCell(1).textContent = book.author;
                    newRow.insertCell(2).textContent = book.isbn;
                    newRow.insertCell(3).textContent = book.genre;
                    newRow.insertCell(4).textContent = book.quantity;

                    // Create cell with Remove/Edit buttons
                    let actionCell = newRow.insertCell(5);
                    let removeButton = document.createElement("button");
                    removeButton.textContent = "Remove";
                    removeButton.id = "removeBook";
                    removeButton.type = "button";
                    removeButton.onclick = function (event) {
                        removeBook(removeButton, event);
                    };
                    let editButton = document.createElement("button");
                    editButton.textContent = "Edit";
                    editButton.id = "editBook";
                    editButton.type = "button";
                    editButton.onclick = function () {
                        editBook(editButton);
                    };
                    actionCell.appendChild(removeButton);
                    actionCell.appendChild(editButton);
                });
            } else {
                console.error("Error fetching books: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error fetching books: ", error);
        });
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

    //Send data to admin.php
    fetch("admin.php", {
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
    let table = document.getElementById("bookList").getElementsByTagName("tbody")[0];
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

        //Send DELETE request to admin.php using ISBN
        fetch("admin.php", 
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
            if (result.success)
            {
                //Remove row from table
                row.parentNode.removeChild(row);
                alert("Book deleted successfully.");
            } 
            else
            {
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
    for (let i = 0; i < row.cells.length - 1; i++)
    {
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
    cancelButton.onclick = function()
    {
        cancelEdit(row, button, cancelButton);
    };
    actionCell.appendChild(cancelButton);
}

//Function to cancel edited changes
function cancelEdit(row, saveButton, cancelButton)
{
    //Retrieve original values from data attribute
    let originalValues = JSON.parse(row.dataset.originalValues);

    //Restores each cell's contents (except last cell)
    for (let i = 0; i < row.cells.length - 1; i++)
    {
        row.cells[i].textContent = originalValues[i];
    }

    //Remove cancel button
    cancelButton.remove();
    delete row.cancelButton;

    //Resets "Save Changes" button back to "Edit"
    saveButton.textContent = "Edit";
    saveButton.onclick = function()
    {
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
    fetch("admin.php",
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
                if (row.cancelButton)
                {
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

document.addEventListener("DOMContentLoaded", function () {
    // Now the DOM is fully loaded, add the event listener
    const addButton = document.getElementById("addBook");
    if (addButton) {
        addButton.addEventListener("click", addBook);
    } else {
        console.log("Add Book button not found!");
    }
    // Load books from database when page loads
    fetchBooks();
});