const express = require('express');
const router = express.Router();
const {
    issueBook,
    getIssuedBooks,
    returnBook,
    getReturnedBooks,
    payFine,
} = require('../controllers/bookController');

//route to issue book
router.post('/issue', issueBook);

//route to get all issued books
router.get('/issued', getIssuedBooks);

//route to return a book(calculate fine)
router.put('/return/:id', returnBook);

//route to pay fine and complete return
router.put('/pay-fine/:id', payFine);

//route to get all returned books
router.get('/returned', getReturnedBooks);

module.exports = router;