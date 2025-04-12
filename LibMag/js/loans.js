function fetchLoans() {
    fetch("API/loans.php?userId=" + window.currentUserId, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const tableBody = document.querySelector("#loanList tbody");
                if (!tableBody) {
                    console.error("Loaned books table body not found!");
                    return;
                }
                tableBody.innerHTML = ""; // Clear table body

                data.loans.forEach(loan => {
                    const newRow = tableBody.insertRow();
                    newRow.insertCell(0).textContent = loan.title;
                    newRow.insertCell(1).textContent = loan.author;
                    newRow.insertCell(2).textContent = loan.isbn;
                    newRow.insertCell(3).textContent = loan.genre;
                    newRow.insertCell(4).textContent = loan.loanDate;
                    newRow.insertCell(5).textContent = loan.returnDate;
                    newRow.insertCell(6).textContent = loan.status;
                    newRow.insertCell(7).textContent = loan.returnedOn || ""; // Returned on date can be empty

                    // Return book button
                    const actionCell = newRow.insertCell(8);
                    // Only show button if loan status is not 'returned' 
                    if (loan.status !== 'returned') {
                        actionCell.appendChild(createButton("Return Book", null, "button", event => returnBook(event.target, event, loan)));
                    } else {
                        actionCell.textContent = ""; // Don't render button
                    }
                });
            } else {
                console.error("Error fetching loans: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error fetching loans: ", error);
        });
}

function returnBook(button, event, loan) {
    event.preventDefault();

    const confirmed = confirm(`Are you sure you want to return "${loan.title}" by ${loan.author}?`);
    if (!confirmed) {
        return; 
    }

    const now = new Date();
    const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "); // Format to YYYY-MM-DD HH:MM:SS
    const returnData = {
        loanId: loan.loanId,
        returnedOn: localTime
    };

    fetch("API/loans.php", {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            if (result.success) {
                alert("Book returned successfully!");
                fetchLoans(); // Refresh the loan list
                fetchBooks(); // Refresh the book list to update available quantity
            } else {
                console.error("Error returning book: " + result.message);
                alert("Error returning book: " + result.message);
            }
        })
        .catch(error => {
            console.error("Error returning book: ", error);
            alert("Error returning book: " + error.message);
        });
}