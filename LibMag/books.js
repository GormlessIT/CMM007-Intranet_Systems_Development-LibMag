//Function to fetch and display books from database
function fetchBooks() {
    fetch("books.php",
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
                const tableBody = document.getElementById("bookList").getElementsByTagName("tbody")[0];
                tableBody.innerHTML = "";   //Clears table body

                data.books.forEach(book => {
                    const newRow = tableBody.insertRow(0); //0 = always appends to first table row
                    //original ISBN stored in a data attribute (used as unique identifier)
                    newRow.dataset.originalIsbn = book.isbn;
                    newRow.insertCell(0).textContent = book.title;
                    newRow.insertCell(1).textContent = book.author;
                    newRow.insertCell(2).textContent = book.isbn;
                    newRow.insertCell(3).textContent = book.genre;
                    newRow.insertCell(4).textContent = book.quantity;

                    // Create cell with action buttons
                    const actionCell = newRow.insertCell(5);

                    if (window.userRole === 'admin') {
                        // Create remove button
                        const removeButton = document.createElement("button");
                        removeButton.textContent = "Remove";
                        removeButton.id = "removeBook";
                        removeButton.type = "button";
                        removeButton.onclick = function (event) {
                            removeBook(removeButton, event);
                        };

                        // Create edit button
                        const editButton = document.createElement("button");
                        editButton.textContent = "Edit";
                        editButton.id = "editBook";
                        editButton.type = "button";
                        editButton.onclick = function () {
                            editBook(editButton);
                        };
                        actionCell.appendChild(removeButton);
                        actionCell.appendChild(editButton);
                    } else if (window.userRole === 'user') {
                        // Create borrow book button
                        const borrowButton = document.createElement("button");
                        borrowButton.textContent = "Borrow Book";
                        borrowButton.type = "button";
                        borrowButton.onclick = function (event) {
                            borrowBook(borrowButton, event);
                        };

                        actionCell.appendChild(borrowButton);
                    }
                });
            } else {
                console.error("Error fetching books: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error fetching books: ", error);
        });

    function borrowBook(button, event) {
        // log ISBN of the book to be borrowed
        const row = button.closest("tr");
        const isbn = row ? row.dataset.originalIsbn : "";
        console.log("Borrowing book with ISBN: ", isbn);
        // TODO: Add AJAX call to process borrowing in the backend
    }
}