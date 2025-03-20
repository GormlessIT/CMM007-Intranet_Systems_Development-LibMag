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
    if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
    return response.json();
}

// Updated fetchBooks function
function fetchBooks() {
    fetch("API/bookCRUD.php", { method: "GET", headers: { 'Content-Type': 'application/json' } })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                document.querySelectorAll(".bookList").forEach(table => {
                    const tableBody = table.querySelector("tbody");
                    tableBody.innerHTML = ""; // Clear table body

                    data.books.forEach(book => {
                        const newRow = tableBody.insertRow();
                        newRow.dataset.originalIsbn = book.isbn;
                        ["title", "author", "isbn", "genre", "quantity"].forEach((key, index) => {
                            newRow.insertCell(index).textContent = book[key];
                        });

                        const actionCell = newRow.insertCell(5);
                        if (window.userRole === 'admin') {
                            actionCell.appendChild(createButton("Remove", "removeBook", "button", event => removeBook(event.target, event)));
                            actionCell.appendChild(createButton("Edit", "editBook", "button", () => editBook(event.target)));
                        } else if (window.userRole === 'user') {
                            actionCell.appendChild(createButton("Borrow Book", null, "button", event => borrowBook(event.target, event)));
                        }
                    });
                });
            } else {
                console.error("Error fetching books: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error fetching books: ", error);
        });
}

function borrowBook(button, event) {
    const row = button.closest("tr");
    const isbn = row ? row.dataset.originalIsbn : "";
    console.log("Borrowing book with ISBN: ", isbn);
    // TODO: Add AJAX call to process borrowing in the backend
}