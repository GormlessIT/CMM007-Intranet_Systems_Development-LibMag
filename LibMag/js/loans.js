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
                    newRow.insertCell(6).textContent = loan.returnedOn || ""; // Returned on date can be empty

                    const actionCell = newRow.insertCell(7);
                    actionCell.appendChild(createButton("Return Book", null, "button", event => returnBook(event.target, event, loan)));
                });
            } else {
                console.error("Error fetching loans: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error fetching loans: ", error);
        });
}

function returnBook(button, event, book) {
    //TODO: Book return logic
}