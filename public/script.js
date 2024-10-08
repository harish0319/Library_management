// document.addEventListener('DOMContentLoaded', () => {
//     const issueBookForm = document.getElementById('issueBookForm');
//     const issuedBooksTable = document.getElementById('issuedBooksTable').querySelector('tbody');
//     const returnedBooksTable = document.getElementById('returnedBooksTable').querySelector('tbody');
//     const payFineModal = document.getElementById('payFineModal');
//     const fineAmountDisplay = document.getElementById('fineAmount');
//     let currentFine = 0;
//     let bookIdToReturn = null;

//     // Fetch and display all issued books
//     const fetchIssuedBooks = async () => {
//         const res = await fetch('api/books/issued');
//         const books = await res.json();
//         issuedBooksTable.innerHTML = '';
//         books.forEach(book => {
//             const fine = calculateFine(book.issuedAt);
//             const tr = document.createElement('tr');
//             tr.innerHTML = `
//                 <td>${book.name}</td>
//                 <td>${new Date(book.issuedAt).toLocaleString()}</td>
//                 <td>${new Date(new Date(book.issuedAt).getTime() + 60 * 60000).toLocaleString()}</td>
//                 <td>${fine > 0 ? fine + ' INR' : 'No fine'}</td>
//                 <td><button class="return-button" onclick="returnBook(${book.id})">Return</button></td>
//             `;
//             issuedBooksTable.appendChild(tr);
//         });
//     };

//     // Handle books issue form
//     issueBookForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const bookName = document.getElementById('bookName').value;

//         const res = await fetch('/api/books/issue', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ name: bookName })
//         });

//         if (res.ok) {
//             issueBookForm.reset();
//             fetchIssuedBooks();
//         } else {
//             alert('Error issuing book');
//         }
//     });

//     // Helper function to calculate fine
//     const calculateFine = (issuedAt) => {
//         const currentTime = new Date();
//         const issuedTime = new Date(issuedAt);
//         const timeDiff = (currentTime - issuedTime) / (1000 * 60);
        
//         let fine = 0;
//         if (timeDiff > 60) {
//             fine = Math.floor((timeDiff) / 60) * 10;
//         }
//         return fine;
//     };

//     // Handle book return
//     window.returnBook = async (id) => {
//         const res = await fetch(`/api/books/return/${id}`, { method: 'PUT' });
//         const book = await res.json();

//         const fine = calculateFine(book.issuedAt);
//         if (fine > 0 && book.finePaid === 0) {
//             // Show modal if fine is unpaid
//             fineAmountDisplay.textContent = `Fine amount: ${fine} INR`;
//             payFineModal.style.display = 'block';
//             currentFine = fine;
//             bookIdToReturn = id;
//         } else {
//             // Proceed if no fine or already paid
//             await completeReturn(id);
//             fetchIssuedBooks();
//             fetchReturnedBooks();
//         }
//     };

//     // Complete the return process only after fine payment or no fine amount
//     const completeReturn = async (id) => {
//         await fetch(`/api/books/complete-return/${id}`, { method: 'PUT' });
//     };

//     // Fetch and display all returned books
//     const fetchReturnedBooks = async () => {
//         const res = await fetch('/api/books/returned');
//         const books = await res.json();
//         returnedBooksTable.innerHTML = '';
//         books.forEach(book => {
//             const tr = document.createElement('tr');
//             tr.innerHTML = `
//                 <td>${book.name}</td>
//                 <td>${new Date(book.issuedAt).toLocaleString()}</td>
//                 <td>${new Date(book.returnedAt).toLocaleString()}</td>
//                 <td>${book.finePaid} INR</td>
//             `;
//             returnedBooksTable.appendChild(tr);
//         });
//     };

//     // Handle fine payment
//     document.getElementById('payFineButton').addEventListener('click', async () => {
//         if (bookIdToReturn !== null) {
//             await fetch(`/api/books/pay-fine/${bookIdToReturn}`, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ finePaid: currentFine })
//             });

//             await completeReturn(bookIdToReturn);

//             // Hide the modal and reset the state
//             payFineModal.style.display = 'none';
//             bookIdToReturn = null;
//             currentFine = 0;

//             // Refresh the books list
//             fetchIssuedBooks();
//             fetchReturnedBooks();
//         }
//     });

//     // Close the fine payment modal
//     document.querySelector('.close').addEventListener('click', () => {
//         payFineModal.style.display = 'none';
//     });

//     // Initial fetch for issued and returned books
//     fetchIssuedBooks();
//     fetchReturnedBooks();

//     // Polling to refresh issued books table every minute
//     setInterval(fetchIssuedBooks, 60000);
// });



//2 min fine model
// document.addEventListener('DOMContentLoaded', () => {
//     const issueBookForm = document.getElementById('issueBookForm');
//     const issuedBooksTable = document.getElementById('issuedBooksTable').querySelector('tbody');
//     const returnedBooksTable = document.getElementById('returnedBooksTable').querySelector('tbody');
//     const payFineModal = document.getElementById('payFineModal');
//     const fineAmountDisplay = document.getElementById('fineAmount');
//     let currentFine = 0;
//     let bookIdToReturn = null;

//     // Fetch and display all issued books
//     const fetchIssuedBooks = async () => {
//         const res = await fetch('api/books/issued');
//         const books = await res.json();
//         issuedBooksTable.innerHTML = '';
//         books.forEach(book => {
//             const fine = calculateFine(book.issuedAt);
//             const tr = document.createElement('tr');
//             tr.innerHTML = `
//                 <td>${book.name}</td>
//                 <td>${new Date(book.issuedAt).toLocaleString()}</td>
//                 <td>${new Date(new Date(book.issuedAt).getTime() + 2 * 60000).toLocaleString()}</td>
//                 <td>${fine > 0 ? fine + ' INR' : 'No fine'}</td>
//                 <td><button class="return-button" onclick="returnBook(${book.id})">Return</button></td>
//             `;
//             issuedBooksTable.appendChild(tr);
//         });
//     };

//     // Handle books issue form
//     issueBookForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const bookName = document.getElementById('bookName').value;

//         const res = await fetch('/api/books/issue', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ name: bookName })
//         });

//         if (res.ok) {
//             issueBookForm.reset();
//             fetchIssuedBooks();
//         } else {
//             alert('Error issuing book');
//         }
//     });

//     // Helper function to calculate fine
//     const calculateFine = (issuedAt) => {
//         const currentTime = new Date();
//         const issuedTime = new Date(issuedAt);
//         const timeDiff = (currentTime - issuedTime) / (1000 * 60);

//         let fine = 0;
//         if (timeDiff > 2) {
//             fine = Math.floor((timeDiff) / 2) * 10;
//         }
//         return fine;
//     };

//     // Handle book return
//     window.returnBook = async (id) => {
//         const res = await fetch(`/api/books/return/${id}`, { method: 'PUT' });
//         const book = await res.json();

//         const fine = calculateFine(book.issuedAt);
//         if (fine > 0 && book.finePaid === 0) {
//             // Show modal if fine is unpaid
//             fineAmountDisplay.textContent = `Fine amount: ${fine} INR`;
//             payFineModal.style.display = 'block';
//             currentFine = fine;
//             bookIdToReturn = id;
//         } else {
//             // Proceed if no fine or already paid
//             await completeReturn(id);
//             fetchIssuedBooks();
//             fetchReturnedBooks();
//         }
//     };

//     // Complete the return process only after fine payment or no fine amount
//     const completeReturn = async (id) => {
//         await fetch(`/api/books/complete-return/${id}`, { method: 'PUT' });
//     };

//     // Fetch and display all returned books
//     const fetchReturnedBooks = async () => {
//         const res = await fetch('/api/books/returned');
//         const books = await res.json();
//         returnedBooksTable.innerHTML = '';
//         books.forEach(book => {
//             const tr = document.createElement('tr');
//             tr.innerHTML = `
//                 <td>${book.name}</td>
//                 <td>${new Date(book.issuedAt).toLocaleString()}</td>
//                 <td>${new Date(book.returnedAt).toLocaleString()}</td>
//                 <td>${book.finePaid} INR</td>
//             `;
//             returnedBooksTable.appendChild(tr);
//         });
//     };

//     // Handle fine payment
//     document.getElementById('payFineButton').addEventListener('click', async () => {
//         if (bookIdToReturn !== null) {
//             await fetch(`/api/books/pay-fine/${bookIdToReturn}`, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ finePaid: currentFine })
//             });

//             await completeReturn(bookIdToReturn);

//             // Hide the modal and reset the state
//             payFineModal.style.display = 'none';
//             bookIdToReturn = null;
//             currentFine = 0;

//             // Refresh the books list
//             fetchIssuedBooks();
//             fetchReturnedBooks();
//         }
//     });

//     // Close the fine payment modal
//     document.querySelector('.close').addEventListener('click', () => {
//         payFineModal.style.display = 'none';
//     });

//     // Initial fetch for issued and returned books
//     fetchIssuedBooks();
//     fetchReturnedBooks();

//     // Polling to refresh issued books table every minute
//     setInterval(fetchIssuedBooks, 60000);
// });


//1min
document.addEventListener('DOMContentLoaded', () => {
    const issueBookForm = document.getElementById('issueBookForm');
    const issuedBooksTable = document.getElementById('issuedBooksTable').querySelector('tbody');
    const returnedBooksTable = document.getElementById('returnedBooksTable').querySelector('tbody');
    const payFineModal = document.getElementById('payFineModal');
    const fineAmountDisplay = document.getElementById('fineAmount');
    let currentFine = 0;
    let bookIdToReturn = null;

    // Fetch and display all issued books
    const fetchIssuedBooks = async () => {
        const res = await fetch('api/books/issued');
        const books = await res.json();
        issuedBooksTable.innerHTML = '';
        books.forEach(book => {
            const fine = calculateFine(book.issuedAt);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${book.name}</td>
                <td>${new Date(book.issuedAt).toLocaleString()}</td>
                <td>${new Date(new Date(book.issuedAt).getTime() + 60000).toLocaleString()}</td>
                <td>${fine > 0 ? fine + ' INR' : 'No fine'}</td>
                <td><button class="return-button" onclick="returnBook(${book.id})">Return</button></td>
            `;
            issuedBooksTable.appendChild(tr);
        });
    };

    // Handle books issue form
    issueBookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const bookName = document.getElementById('bookName').value;

        const res = await fetch('/api/books/issue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: bookName })
        });

        if (res.ok) {
            issueBookForm.reset();
            fetchIssuedBooks();
        } else {
            alert('Error issuing book');
        }
    });

    // Helper function to calculate fine
    const calculateFine = (issuedAt) => {
        const currentTime = new Date();
        const issuedTime = new Date(issuedAt);
        const timeDiff = (currentTime - issuedTime) / (1000 * 60); // Time difference in minutes

        let fine = 0;
        if (timeDiff > 1) { // Check if more than 1 minute has passed
            fine = Math.floor((timeDiff) / 1) * 10; // Fine calculation for every 1 minute
        }
        return fine;
    };

    // Handle book return
    window.returnBook = async (id) => {
        const res = await fetch(`/api/books/return/${id}`, { method: 'PUT' });
        const book = await res.json();

        const fine = calculateFine(book.issuedAt);
        if (fine > 0 && book.finePaid === 0) {
            // Show modal if fine is unpaid
            fineAmountDisplay.textContent = `Fine amount: ${fine} INR`;
            payFineModal.style.display = 'block';
            currentFine = fine;
            bookIdToReturn = id;
        } else {
            // Proceed if no fine or already paid
            await completeReturn(id);
            fetchIssuedBooks();
            fetchReturnedBooks();
        }
    };

    // Complete the return process only after fine payment or no fine amount
    const completeReturn = async (id) => {
        await fetch(`/api/books/complete-return/${id}`, { method: 'PUT' });
    };

    // Fetch and display all returned books
    const fetchReturnedBooks = async () => {
        const res = await fetch('/api/books/returned');
        const books = await res.json();
        returnedBooksTable.innerHTML = '';
        books.forEach(book => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${book.name}</td>
                <td>${new Date(book.issuedAt).toLocaleString()}</td>
                <td>${new Date(book.returnedAt).toLocaleString()}</td>
                <td>${book.finePaid} INR</td>
            `;
            returnedBooksTable.appendChild(tr);
        });
    };

    // Handle fine payment
    document.getElementById('payFineButton').addEventListener('click', async () => {
        if (bookIdToReturn !== null) {
            await fetch(`/api/books/pay-fine/${bookIdToReturn}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ finePaid: currentFine })
            });

            await completeReturn(bookIdToReturn);

            // Hide the modal and reset the state
            payFineModal.style.display = 'none';
            bookIdToReturn = null;
            currentFine = 0;

            // Refresh the books list
            fetchIssuedBooks();
            fetchReturnedBooks();
        }
    });

    // Close the fine payment modal
    document.querySelector('.close').addEventListener('click', () => {
        payFineModal.style.display = 'none';
    });

    // Initial fetch for issued and returned books
    fetchIssuedBooks();
    fetchReturnedBooks();

    // Polling to refresh issued books table every minute
    setInterval(fetchIssuedBooks, 60000);
});

// // Utility functions for Local Storage
// const getLocalStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
// const setLocalStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// // Function to calculate fine based on a 2-minute return window
// const calculateFine = (issuedAt, returnedAt) => {
//     const issuedTime = new Date(issuedAt);
//     const returnedTime = new Date(returnedAt);
//     const timeDiff = (returnedTime - issuedTime) / (1000 * 60); // Difference in minutes
//     if (timeDiff > 2) {
//         return Math.floor((timeDiff - 2) / 2) * 10; // ₹10 for every 2 minutes late
//     }
//     return 0;
// };

// // Function to calculate the return time (2 minutes after issue time)
// const calculateReturnTime = (issuedAt) => {
//     const issuedTime = new Date(issuedAt);
//     issuedTime.setMinutes(issuedTime.getMinutes() + 2); // Add 2 minutes
//     return issuedTime.toLocaleString();
// };

// // Function to issue a new book
// const issueBook = (bookName) => {
//     if (!bookName) return alert("Book name is required!");

//     const issuedAt = new Date().toISOString();
//     const books = getLocalStorage('issuedBooks');
//     books.push({ name: bookName, issuedAt, finePaid: 0 });
//     setLocalStorage('issuedBooks', books);
//     displayIssuedBooks();
// };

// // Function to display all issued books (optimized)
// const displayIssuedBooks = () => {
//     const books = getLocalStorage('issuedBooks');
//     const tbody = document.querySelector('#issuedBooksTable tbody');
//     if (!tbody) return; // Check if tbody exists
//     let rows = ''; // Use a single string to batch DOM updates

//     books.forEach((book, index) => {
//         const returnTime = calculateReturnTime(book.issuedAt);
//         const fine = calculateFine(book.issuedAt, new Date().toISOString());

//         rows += `
//             <tr>
//                 <td>${book.name}</td>
//                 <td>${new Date(book.issuedAt).toLocaleString()}</td>
//                 <td>${returnTime}</td>
//                 <td>₹${fine}</td>
//                 <td><button onclick="returnBook(${index})">Return</button></td>
//             </tr>
//         `;
//     });

//     tbody.innerHTML = rows; // Update the DOM once after the loop
// };

// // Function to display all returned books (optimized)
// const displayReturnedBooks = () => {
//     const books = getLocalStorage('returnedBooks');
//     const tbody = document.querySelector('#returnedBooksTable tbody');
//     if (!tbody) return; // Check if tbody exists
//     let rows = ''; // Use a single string to batch DOM updates

//     books.forEach((book) => {
//         rows += `
//             <tr>
//                 <td>${book.name}</td>
//                 <td>${new Date(book.issuedAt).toLocaleString()}</td>
//                 <td>${new Date(book.returnedAt).toLocaleString()}</td>
//                 <td>₹${book.finePaid}</td>
//             </tr>
//         `;
//     });

//     tbody.innerHTML = rows; // Update the DOM once after the loop
// };

// // Function to return a book
// const returnBook = (index) => {
//     const issuedBooks = getLocalStorage('issuedBooks');
//     const book = issuedBooks[index];
//     const returnedAt = new Date().toISOString();
//     const fine = calculateFine(book.issuedAt, returnedAt);

//     if (fine > 0 && book.finePaid === 0) {
//         // Show the payment modal
//         document.querySelector('#fineAmount').textContent = `Fine amount: ₹${fine}`;
//         document.querySelector('#payFineModal').style.display = 'block';
//         document.querySelector('#payFineButton').onclick = () => payFine(index, fine);
//     } else {
//         completeReturnProcess(index, returnedAt, fine);
//     }
// };

// // Consolidated function to complete the return process
// const completeReturnProcess = (index, returnedAt, fine) => {
//     const issuedBooks = getLocalStorage('issuedBooks');
//     const book = issuedBooks[index];
//     book.returnedAt = returnedAt;
//     book.finePaid = fine; // Set fine amount as paid

//     const returnedBooks = getLocalStorage('returnedBooks');
//     returnedBooks.push(book);
//     setLocalStorage('returnedBooks', returnedBooks);

//     issuedBooks.splice(index, 1); // Remove book from issued list
//     setLocalStorage('issuedBooks', issuedBooks);

//     displayIssuedBooks();
//     displayReturnedBooks();
// };

// // Function to pay the fine
// const payFine = (index, fine) => {
//     const issuedBooks = getLocalStorage('issuedBooks');
//     issuedBooks[index].finePaid = fine; // Set the paid fine amount
//     setLocalStorage('issuedBooks', issuedBooks);

//     // Close the modal and update the returned books list
//     document.querySelector('#payFineModal').style.display = 'none';
//     returnBook(index); // Call returnBook again to update lists
// };

// // Function to close the payment modal
// const closeModal = () => {
//     document.querySelector('#payFineModal').style.display = 'none';
// };

// document.addEventListener('DOMContentLoaded', () => {
//     const closeModalButton = document.querySelector('.close');
//     if (closeModalButton) {
//         closeModalButton.onclick = closeModal;
//     }
    
//     // On page load, display the issued and returned books
//     displayIssuedBooks();
//     displayReturnedBooks();

//     // Event listener for issuing a book
//     document.querySelector('#issueBookForm').addEventListener('submit', (e) => {
//         e.preventDefault();
//         const bookName = document.querySelector('#bookName').value.trim();
//         issueBook(bookName);
//         document.querySelector('#bookName').value = ''; // Clear input field
//     });
// });