const express = require('express');
const router = express.Router();
const {
    issueBook,
    getIssuedBooks,
    returnBook,
    getReturnedBooks,
    payFine,
    completeReturn,
} = require('../controllers/bookController');

router.post('/issue', issueBook);
router.get('/issued', getIssuedBooks);
router.put('/return/:id', returnBook);
router.put('/pay-fine/:id', payFine);
router.get('/returned', getReturnedBooks);
router.put('/complete-return/:id', completeReturn);

module.exports = router;