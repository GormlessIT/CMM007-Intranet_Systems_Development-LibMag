//Function to add a book
function addBook()
{
    //Get input values
    let title = document.getElementById("title").value.trim(); //.trim removes whitespace
    let author = document.getElementById("author").value.trim();
    let isbn = document.getElementById("isbn").value.trim();
    let genre = document.getElementById("genre").value.trim();
    let quantity = document.getElementById("quantity").value.trim();

    //Validate fields - They cannot be empty
    //The OR operator is ||
    if (title === "" || author === "" || isbn === "" || genre === "" || quantity === "")
    {
        alert("Please fill in all fields.");
        return;
    }

    //Validate that the ISBN is exactly 13 digits
    // \d is equivalent to [0-9]
    // {13} specifies 13 occurrences of the preceding character type (i.e. digits since it's 0-9)
    if (!/^\d{13}$/.test(isbn))
    {
        alert("ISBN must be exactly 13 digits.");
        return;
    }

    //Validate that Quantity is a positive number
    // parseInt(quantity) converts what is typed in the quantity field into an integer
    // so if it is less than 1, the alert appears
    if (!/^\d+$/.test(quantity) || parseInt(quantity) < 1)
    {
        alert("Quantity must be a positive number.");
        return;
    }

    //Create a new row instance in the book display table
    let table = document.getElementById("bookList").getElementsByTagName("tbody")[0];
    let newRow = table.insertRow();

    //Inserts the table cells with values entered in the form
    newRow.insertCell(0).textContent = title;
    newRow.insertCell(1).textContent = author;
    newRow.insertCell(2).textContent = isbn;
    newRow.insertCell(3).textContent = genre;
    newRow.insertCell(4).textContent = quantity;

    //Creates a remove button
    let removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.type = "button";
    removeButton.onclick = function(event)
    {
        removeBook(removeButton, event); //Call removeBook() when on click
    }

    //Creates an edit button
    let editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.type = "button";
    editButton.onclick = function()
    {
        populateFormForEdit(newRow);
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
function removeBook(button, event)
{
    event.preventDefault();
    console.log("Remove book button clicked");

    const confirmation = confirm("Are you sure you want to delete this book?");
    console.log("Confirmation result: ", confirmation);
    if(confirmation)
    {
        let row = button.closest("tr");
        if (row)
        {
            row.parentNode.removeChild(row);
        }
        else
        {
            console.log("Deletion cancelled");
        }
    }
}

//Function to populate the form with data for editing
function populateFormForEdit(row)
{
    let cells = row.getElementsByTagName("td");

    //Populate the form with the existing book details
    document.getElementById("title").value = cells[0].textContent;
    document.getElementById("author").value = cells[1].textContent;
    document.getElementById("isbn").value = cells[2].textContent;
    document.getElementById("genre").value = cells[3].textContent;
    document.getElementById("quantity").value = cells[4].textContent;

    //Change the button text to "Save Changes"
    let saveButton = document.getElementById("addBook");
    saveButton.textContent = "Save Changes";
    saveButton.onclick = function()
    {
        saveChanges(row);
    };
}

//Function to save changes to a book
function saveChanges(row)
{
    //Get input values from the form
    let title = document.getElementById("title").value.trim();
    let author = document.getElementById("author").value.trim();
    let isbn = document.getElementById("isbn").value.trim();
    let genre = document.getElementById("genre").value.trim();
    let quantity = document.getElementById("quantity").value.trim();

    // Validate fields again before saving
    if (title === "" || author === "" || isbn === "" || genre === "" || quantity === "")
    {
        alert("Please fill in all fields.");
        return;
    }

    // Validate ISBN format
    if (!/^\d{13}$/.test(isbn))
    {
        alert("ISBN must be exactly 13 digits.");
        return;
    }

    // Validate Quantity format
    if (!/^\d+$/.test(quantity) || parseInt(quantity) < 1)
    {
        alert("Quantity must be a positive number.");
        return;
    }

    //Update the book row with the new values
    row.cells[0].textContent = title;
    row.cells[1].textContent = author;
    row.cells[2].textContent = isbn;
    row.cells[3].textContent = genre;
    row.cells[4].textContent = quantity;

    //Reset the form and change the button text back to "Add Book"
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("quantity").value = "";

    let addButton = document.getElementById("addBook");
    addButton.textContent = "Add Book";
    addButton.onclick = function()
    {
        addBook();
    };
}

document.addEventListener("DOMContentLoaded", function() {
    // Now the DOM is fully loaded, add the event listener
    const addButton = document.getElementById("addBook");
    if (addButton) {
        addButton.addEventListener("click", addBook);
    } else {
        console.log("Add Book button not found!");
    }
});