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

// Fetch books with relevant functionality based on user role
// Admins can remove and edit books
// Users can borrow books
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

                    if (!tableBody) {
                        console.error("Table body not found in the book list table!");
                        return;
                    }

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
                            actionCell.appendChild(createButton("Edit", "editBook", "button", (event) => editBook(event.target)));
                        } else if (window.userRole === 'user') {
                            actionCell.appendChild(createButton("Borrow Book", null, "button", event => borrowBook(event.target, event, book)));
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

// Opens a modal pop-up for book borrowing
function borrowBook(button, event, book) {
    if (!book) {
        console.error("Book data missing for borrowing.");
        return;
    }

    // Ensure book is available (quantity > 0)
    if (parseInt(book.quantity) < 1) {
        alert("This book is not currently available. Please check back later.");
        return;
    }

    openLoanModal(book);
}

// Function to open the loan modal
function openLoanModal(book) {
    // Populate modal with book information
    document.getElementById("modalBookTitle").textContent = "Borrow: " + book.title;
    document.getElementById("modalBookDetails").textContent = "When do you want to borrow \"" + book.title + "\" by " + book.author + "?";

   // Set default dates: today and 7 days from now
   let today = new Date();
   let oneWeekLater = new Date();
   oneWeekLater.setDate(oneWeekLater.getDate() + 7);

   // Format the dates as "YYYY-MM-DD HH:MM:SS"
   let formattedToday = today.toISOString().slice(0, 19).replace("T", " ");
   let formattedOneWeekLater = oneWeekLater.toISOString().slice(0, 19).replace("T", " ");

   document.getElementById("loanDate").value = formattedToday;
   document.getElementById("returnDate").value = formattedOneWeekLater;

    // Store current book in a global variable for later use
    window.currentLoanBook = book;

    // Display the modal
    document.getElementById("loanModal").style.display = "block";
}

// Function to close the loan modal
function closeLoanModal() {
    document.getElementById("loanModal").style.display = "none";
    window.currentLoanBook = null;
}

document.addEventListener("DOMContentLoaded", function () {
    const closeButton = document.getElementById("loanModalClose");
    const loanForm = document.getElementById("loanForm");

    if (closeButton) {
        closeButton.addEventListener("click", closeLoanModal);
    } else {
        console.error("Element #loanModalClose not found in the document!");
    }

    if (loanForm) {
        loanForm.addEventListener("submit", function (e) {

            e.preventDefault();

            let loanDate = document.getElementById("loanDate").value;
            let returnDate = document.getElementById("returnDate").value;

            // Validate dates: at least 7 days, no more than 90 days
            let start = new Date(loanDate);
            let end = new Date(returnDate);
            let diffDays = (end - start) / (1000 * 60 * 60 * 24);
            if (diffDays < 7) {
                alert("Minimum loan duration is 1 week.");
                return;
            }
            if (diffDays > 90) {
                alert("Maximum loan duration is 3 months.");
                return;
            }

            // Prepare loan data payload for submission using global user ID and currently selected book details
            const loanData = {
                userId: window.currentUserId,
                bookId: window.currentLoanBook.bookId,
                loanDate: new Date(document.getElementById("loanDate").value).toISOString().slice(0, 19).replace("T", " "),
                returnDate: new Date(document.getElementById("returnDate").value).toISOString().slice(0, 19).replace("T", " "),
            }

            // AJAX call to loans.php
            fetch("API/loans.php", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loanData),
            })
                .then(response =>
                    handleFetchError(response)
                )
                .then(result => {
                    if (result.success) {
                        alert("Book borrowed successfully!");
                        closeLoanModal();
                        fetchBooks(); // Refresh book list
                        //TODO: Refresh Borrowed books list
                    } else {
                        alert("Error borrowing book: " + result.message);
                    }
                })
                .catch(error => {
                    console.error("Error borrowing book: ", error);
                    alert("Error borrowing book: " + error.message);
                });
        });
    }
});