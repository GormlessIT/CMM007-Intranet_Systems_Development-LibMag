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
        alert("Quantity must be more than 0.");
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
    removeButton.id = "removeBook";
    removeButton.type = "button";
    removeButton.onclick = function(event)
    {
        removeBook(removeButton, event); //Call removeBook() when on click
    }

    //Creates an edit button
    let editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.id = "editBook";
    editButton.type = "button";
    editButton.onclick = function()
    {
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

//Function to edit book
function editBook(button)
{
    //Get table row containing book details to edit
    let row = button.closest("tr");

    //Loop through each table cell (except last one with buttons)
    for (let i = 0; i < row.cells.length - 1; i++)
    {
        let cell = row.cells[i];

        //Convert cell content into correct input fields
        let input;

        //If the column is "Genre", create a dropdown list
        if (i === 3)
        {
            input.document.createElement("select");

            //Populate dropdown list with same genre options as in original form
            let genres = ["--Select--", "Action", "Adventure", "Comedy", "Drama", "Horror", "Mystery", "Sci-Fi", "Thriller"];
            genres.forEach((genre) =>
            {
                let option = document.createElement("option");
                option.value = genre;
                option.textContent = genre;
                if (genre === cell.textContext.trim())
                {
                    option.selected=true; //Preselect the genre that was already in the cell
                }
                input.appendChild(option);
            });
        }
        //If the column is "Quantity", create a number input field
        else if (i === 4)
        {
            input = document.createElement("input");
            input.type = "number";
            input.value = cell.textContent.trim();
            input.min = "1"; //Ensure numbers more than 0
        }
        //All other columns are text input fields
        else
        {
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
    let saveButton = document.getElementById("editBook");
    saveButton.textContent = "Save Changes";
    saveButton.onclick = function()
    {
        saveChanges(row, button);
    };
}

//Function to save changes to a book
function saveChanges(row, button)
{
    //Validates and saves input values back into table cells
    for (let i=0; i < row.cells.length - 1; i++)
    {
        let cell = row.cells[i];
        let input = cell.querySelector("input, select");

        //Ensuring input exists and validating it
        if (input)
        {
            let value = input.value.trim();

            //Validation
            if (i === 2 && !/^\d{13}$/.test(value)) //ISBN
            {
                alert("ISBN must be exactly 13 digits.");
                return;
            }
            else if (i === 4 && (!/^\d+$/.test(value) || parseInt(value) < 1)) //Quantity
            {
                alert("Quantity must be more than 0.");
                return;
            }
            //Genre validation (cannot be empty)
            else if (i === 3 & value === "")
            {
                alert("Please select a genre.");
                return;
            }
            //Replace input with validated value
            cell.textContent = value;
        }
    }

    //Changing "Save Changes" button back to "Edit"
    button.textContent = "Edit";
    button.onclick = function()
    {
        editBook(button);
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