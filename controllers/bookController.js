// //1min
const Book = require('../models/Book');
const { Op } = require('sequelize');

exports.issueBook = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Book name is required!' });

  try {
    const newBook = await Book.create({
      name,
      issuedAt: new Date(),
      finePaid: 0, 
    });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: 'Error issuing the book' });
  }
};

exports.getIssuedBooks = async (req, res) => {
  try {
    const books = await Book.findAll({ where: { returnedAt: null } });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching issued books' });
  }
};

exports.returnBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    const returnTime = new Date();
    const issuedTime = new Date(book.issuedAt);
    const timeDiff = (returnTime - issuedTime) / (1000 * 60);
    let fine = 0;

    if (timeDiff > 1) fine = Math.floor(timeDiff / 1) * 10;

    if (fine > 0) {
      book.fine = fine;
      await book.save();
      res.json(book); 
    } else {
      book.returnedAt = returnTime;
      book.finePaid = 0;
      await book.save();
      res.json(book); 
    }
  } catch (error) {
    res.status(500).json({ error: 'Error returning the book' });
  }
};

exports.payFine = async (req, res) => {
  const { id } = req.params;
  const { finePaid } = req.body;

  try {
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    if (finePaid >= book.fine) {
      book.finePaid = finePaid;
      book.returnedAt = new Date();
      await book.save();
      res.json(book);
    } else {
      res.status(400).json({ error: 'Insufficient payment for the fine' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error processing fine payment' });
  }
};

exports.getReturnedBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      where: { returnedAt: { [Op.not]: null } },
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching returned books' });
  }
};

exports.completeReturn = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (!book.returnedAt) {
      return res.status(400).json({ error: 'Book return is not yet initiated' });
    }

    if (book.fine > 0 && book.finePaid < book.fine) {
      return res.status(400).json({ error: 'Fine must be fully paid before completing the return' });
    }

    res.json({ message: 'Book return completed successfully', book });
  } catch (error) {
    res.status(500).json({ error: 'Error completing return' });
  }
};

