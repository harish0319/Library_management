document.addEventListener('DOMContentLoaded', () => {
    const issueBookForm = document.getElementById('issueBookForm');
    const issuedBooksContainer = document.getElementById('issuedBooksContainer'); // For issued book cards
    const returnedBooksContainer = document.getElementById('returnedBooksContainer'); // For returned book cards
    const payFineModal = document.getElementById('payFineModal');
    const fineAmountDisplay = document.getElementById('fineAmount');
    let currentFine = 0;
    let bookIdToReturn = null;

    // Fetch and display all issued books
    const fetchIssuedBooks = async () => {
        const res = await fetch('/api/books/issued');
        const books = await res.json();
        issuedBooksContainer.innerHTML = ''; // Clear existing cards
        books.forEach((book) => {
            const fine = calculateFine(book.issuedAt);
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <h3>Book Name:${book.name}</h3>
                <p><strong>Book taken on:</strong> ${new Date(book.issuedAt).toLocaleString()}</p>
                <p><strong>Book return date:</strong> ${new Date(new Date(book.issuedAt).getTime() + 60000).toLocaleString()}</p>
                <p><strong>Current fine:</strong> ${fine > 0 ? fine + ' INR' : 'No fine'}</p>
                <button class="return-button">Return Book</button>
            `;

            // Add event listener for the return button
            card.querySelector('.return-button').addEventListener('click', () => returnBook(book.id));
            issuedBooksContainer.appendChild(card); // Append the card to the container
        });
    };

    // Handle book issue form submission
    issueBookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const bookName = document.getElementById('bookName').value;

        const res = await fetch('/api/books/issue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: bookName }),
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
        if (timeDiff > 1) {
            fine = Math.floor(timeDiff) * 10; // Fine calculation for every minute
        }
        return fine;
    };

    // Handle book return
    const returnBook = async (id) => {
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

    // Complete the return process after fine payment or if no fine is due
    const completeReturn = async (id) => {
        await fetch(`/api/books/complete-return/${id}`, { method: 'PUT' });
    };

    // Fetch and display all returned books
    const fetchReturnedBooks = async () => {
        const res = await fetch('/api/books/returned');
        const books = await res.json();
        returnedBooksContainer.innerHTML = ''; // Clear existing cards
        books.forEach((book) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <h3>Book Name:${book.name}</h3>
                <p><strong>Book Returned on:</strong> ${new Date(book.returnedAt).toLocaleString()}</p>
                <p><strong>Fine Paid:</strong> ${book.finePaid} INR</p>
            `;
            returnedBooksContainer.appendChild(card); // Append the card to the container
        });
    };

    // Handle fine payment
    document.getElementById('payFineButton').addEventListener('click', async () => {
        if (bookIdToReturn !== null) {
            await fetch(`/api/books/pay-fine/${bookIdToReturn}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ finePaid: currentFine }),
            });

            await completeReturn(bookIdToReturn);

            // Hide the modal and reset state
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

    // Polling to refresh issued books every minute
    setInterval(fetchIssuedBooks, 60000);
});

