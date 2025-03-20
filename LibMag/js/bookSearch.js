// Function to initialize search and filter functionality
function initializeSearchBar(searchInputId, filterSelectId, tableSelector) {
    const searchInput = document.getElementById(searchInputId);
    const filterSelect = document.getElementById(filterSelectId);
    const table = document.querySelector(tableSelector);

    if (!searchInput || !filterSelect || !table) {
        console.error("Search bar elements not found!");
        return;
    }

    // Search functionality
    searchInput.addEventListener("input", function () {
        const filter = searchInput.value.toLowerCase();
        table.querySelectorAll("tbody tr").forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(filter) ? "" : "none";
        });
    });

    // Filter functionality
    filterSelect.addEventListener("change", function () {
        const selectedValue = filterSelect.value.toLowerCase();
        table.querySelectorAll("tbody tr").forEach(row => {
            const cellValue = row.cells[3]?.textContent.toLowerCase();
            row.style.display = selectedValue === "" || cellValue === selectedValue ? "" : "none";
        });
    });
}
