document.addEventListener('DOMContentLoaded', () => {
    const issueBookForm = document.getElementById('issueBookForm');
    const issuedBooksContainer = document.getElementById('issuedBooksContainer');
    const returnedBooksContainer = document.getElementById('returnedBooksContainer');
    const payFineModal = document.getElementById('payFineModal');
    const fineAmountDisplay = document.getElementById('fineAmount');
    let currentFine = 0;
    let bookIdToReturn = null;

    const formatDateTime = (date) => {
        const d = new Date(date).toLocaleString('en-IN', { 
            timeZone: 'Asia/Kolkata', 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit', 
            minute: '2-digit',  
            second: '2-digit', 
            hour12: false
        });
    
        return d.replace(',', '') + ' IST'; 
    };

    const fetchIssuedBooks = () => {
        fetch('/api/books/issued')
            .then(res => res.json())
            .then(books => {
                issuedBooksContainer.innerHTML = '';
                books.forEach((book) => {
                    const issuedTime = new Date(book.issuedAt);
                    const fine = calculateFine(issuedTime);

                    const returnTime = fine > 0 ? new Date() : new Date(issuedTime.getTime() + 1 * 60 * 1000);
    
                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.innerHTML = `
                        <h3>Book Name: ${book.name}</h3>
                        <p><strong>Book taken on:</strong> ${formatDateTime(issuedTime)}</p>
                        <p><strong>Book Returned on:</strong> ${formatDateTime(returnTime)}</p>
                        <p><strong>Current fine:</strong> ${fine > 0 ? fine + ' INR' : 'No fine'}</p>
                        ${!book.returnedAt ? '<button class="return-button">Return Book</button>' : ''}
                    `;
                    if (!book.returnedAt) {
                        card.querySelector('.return-button').addEventListener('click', () => returnBook(book.id));
                    }
                    issuedBooksContainer.appendChild(card);
                });
            })
            .catch(err => console.error('Error fetching issued books:', err));
    };
    

    issueBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const bookName = document.getElementById('bookName').value;

        fetch('/api/books/issue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: bookName })
        })
        .then(res => {
            if (res.ok) {
                issueBookForm.reset();
                fetchIssuedBooks();
            } else {
                alert('Error issuing book');
            }
        })
        .catch(err => console.error('Error issuing book:', err));
    });

    const calculateFine = (issuedAt) => {
        const currentTime = new Date();
        const issuedTime = new Date(issuedAt);
        const timeDiff = (currentTime - issuedTime) / (1000 * 60);
        let fine = 0;
        if (timeDiff > 1) {
            fine = Math.floor(timeDiff) * 10;
        }
        return fine;
    };

    const returnBook = (id) => {
        fetch(`/api/books/return/${id}`, { method: 'PUT' })
            .then(res => res.json())
            .then(book => {
                const fine = calculateFine(book.issuedAt);
                if (fine > 0 && book.finePaid === 0) {
                    fineAmountDisplay.textContent = `Fine amount: ${fine} INR`;
                    payFineModal.style.display = 'block';
                    currentFine = fine;
                    bookIdToReturn = id;
                } else {
                    completeReturn(id, book.returnedAt);
                    fetchIssuedBooks();
                    fetchReturnedBooks();
                }
            })
            .catch(err => console.error('Error returning book:', err));
    };

    const completeReturn = (id, returnedAt = null) => {
        fetch(`/api/books/complete-return/${id}`, { method: 'PUT' })
            .then(() => {
                fetchIssuedBooks();
                fetchReturnedBooks();
            })
            .catch(err => console.error('Error completing return:', err));
    };

    const fetchReturnedBooks = () => {
        fetch('/api/books/returned')
            .then(res => res.json())
            .then(books => {
                returnedBooksContainer.innerHTML = '';
                books.forEach((book) => {
                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.innerHTML = `
                        <h3>Book Name: ${book.name}</h3>
                        <p><strong>Book Returned on:</strong> ${formatDateTime(book.returnedAt)}</p>
                        <p><strong>Fine Paid:</strong> ${book.finePaid} INR</p>
                    `;
                    returnedBooksContainer.appendChild(card);
                });
            })
            .catch(err => console.error('Error fetching returned books:', err));
    };

    document.getElementById('payFineButton').addEventListener('click', () => {
        if (bookIdToReturn !== null) {
            fetch(`/api/books/pay-fine/${bookIdToReturn}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ finePaid: currentFine })
            })
            .then(() => completeReturn(bookIdToReturn))
            .then(() => {
                payFineModal.style.display = 'none';
                bookIdToReturn = null;
                currentFine = 0;
                fetchIssuedBooks();
                fetchReturnedBooks();
            })
            .catch(err => console.error('Error paying fine:', err));
        }
    });

    document.querySelector('.close').addEventListener('click', () => {
        payFineModal.style.display = 'none';
    });

    fetchIssuedBooks();
    fetchReturnedBooks();
    setInterval(fetchIssuedBooks, 60000);
});
