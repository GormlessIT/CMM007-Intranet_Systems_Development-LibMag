// Function to initialize search and filter functionality
function initializeSearchBar(searchInputId, filterSelectId, tableSelector, filterColumnIndex) {
    const searchInput = document.getElementById(searchInputId);
    const filterSelect = document.getElementById(filterSelectId);
    const table = document.querySelector(tableSelector);

    if (!searchInput || !filterSelect || !table) {
        console.error("Search bar elements not found!");
        return;
    }

    // Apply filters on search bar based on column index
    function applyFilters() {
        const searchFilter = searchInput.value.toLowerCase();
        const statusFilter = filterSelect.value.toLowerCase();

        table.querySelectorAll("tbody tr").forEach(row => {
            const rowText = row.textContent.toLowerCase();
            const cellValue = row.cells[filterColumnIndex]?.textContent.toLowerCase();

            const matchesSearch = rowText.includes(searchFilter);
            const matchesFilter = statusFilter === "" || cellValue === statusFilter;

            row.style.display = matchesSearch && matchesFilter ? "" : "none";
        });
    }

    searchInput.addEventListener("input", applyFilters);
    filterSelect.addEventListener("change", applyFilters);
}