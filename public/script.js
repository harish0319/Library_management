// Utility functions for Local Storage
const getLocalStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setLocalStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Function to calculate fine based on a 2-minute return window
const calculateFine = (issuedAt, returnedAt) => {
    const issuedTime = new Date(issuedAt);
    const returnedTime = new Date(returnedAt);
    const timeDiff = (returnedTime - issuedTime) / (1000 * 60); // Difference in minutes
    if (timeDiff > 2) {
        return Math.floor((timeDiff - 2) / 2) * 10; // ₹10 for every 2 minutes late
    }
    return 0;
};

// Function to calculate the return time (2 minutes after issue time)
const calculateReturnTime = (issuedAt) => {
    const issuedTime = new Date(issuedAt);
    issuedTime.setMinutes(issuedTime.getMinutes() + 2); // Add 2 minutes
    return issuedTime.toLocaleString();
};

// Function to issue a new book
const issueBook = (bookName) => {
    if (!bookName) return alert("Book name is required!");

    const issuedAt = new Date().toISOString();
    const books = getLocalStorage('issuedBooks');
    books.push({ name: bookName, issuedAt, finePaid: 0 });
    setLocalStorage('issuedBooks', books);
    displayIssuedBooks();
};

// Function to display all issued books (optimized)
const displayIssuedBooks = () => {
    const books = getLocalStorage('issuedBooks');
    const tbody = document.querySelector('#issuedBooksTable tbody');
    if (!tbody) return; // Check if tbody exists
    let rows = ''; // Use a single string to batch DOM updates

    books.forEach((book, index) => {
        const returnTime = calculateReturnTime(book.issuedAt);
        const fine = calculateFine(book.issuedAt, new Date().toISOString());

        rows += `
            <tr>
                <td>${book.name}</td>
                <td>${new Date(book.issuedAt).toLocaleString()}</td>
                <td>${returnTime}</td>
                <td>₹${fine}</td>
                <td><button onclick="returnBook(${index})">Return</button></td>
            </tr>
        `;
    });

    tbody.innerHTML = rows; // Update the DOM once after the loop
};

// Function to display all returned books (optimized)
const displayReturnedBooks = () => {
    const books = getLocalStorage('returnedBooks');
    const tbody = document.querySelector('#returnedBooksTable tbody');
    if (!tbody) return; // Check if tbody exists
    let rows = ''; // Use a single string to batch DOM updates

    books.forEach((book) => {
        rows += `
            <tr>
                <td>${book.name}</td>
                <td>${new Date(book.issuedAt).toLocaleString()}</td>
                <td>${new Date(book.returnedAt).toLocaleString()}</td>
                <td>₹${book.finePaid}</td>
            </tr>
        `;
    });

    tbody.innerHTML = rows; // Update the DOM once after the loop
};

// Function to return a book
const returnBook = (index) => {
    const issuedBooks = getLocalStorage('issuedBooks');
    const book = issuedBooks[index];
    const returnedAt = new Date().toISOString();
    const fine = calculateFine(book.issuedAt, returnedAt);

    if (fine > 0 && book.finePaid === 0) {
        // Show the payment modal
        document.querySelector('#fineAmount').textContent = `Fine amount: ₹${fine}`;
        document.querySelector('#payFineModal').style.display = 'block';
        document.querySelector('#payFineButton').onclick = () => payFine(index, fine);
    } else {
        completeReturnProcess(index, returnedAt, fine);
    }
};

// Consolidated function to complete the return process
const completeReturnProcess = (index, returnedAt, fine) => {
    const issuedBooks = getLocalStorage('issuedBooks');
    const book = issuedBooks[index];
    book.returnedAt = returnedAt;
    book.finePaid = fine; // Set fine amount as paid

    const returnedBooks = getLocalStorage('returnedBooks');
    returnedBooks.push(book);
    setLocalStorage('returnedBooks', returnedBooks);

    issuedBooks.splice(index, 1); // Remove book from issued list
    setLocalStorage('issuedBooks', issuedBooks);

    displayIssuedBooks();
    displayReturnedBooks();
};

// Function to pay the fine
const payFine = (index, fine) => {
    const issuedBooks = getLocalStorage('issuedBooks');
    issuedBooks[index].finePaid = fine; // Set the paid fine amount
    setLocalStorage('issuedBooks', issuedBooks);

    // Close the modal and update the returned books list
    document.querySelector('#payFineModal').style.display = 'none';
    returnBook(index); // Call returnBook again to update lists
};

// Function to close the payment modal
const closeModal = () => {
    document.querySelector('#payFineModal').style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => {
    const closeModalButton = document.querySelector('.close');
    if (closeModalButton) {
        closeModalButton.onclick = closeModal;
    }
    
    // On page load, display the issued and returned books
    displayIssuedBooks();
    displayReturnedBooks();

    // Event listener for issuing a book
    document.querySelector('#issueBookForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const bookName = document.querySelector('#bookName').value.trim();
        issueBook(bookName);
        document.querySelector('#bookName').value = ''; // Clear input field
    });
});