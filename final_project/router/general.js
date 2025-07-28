const express = require('express');
const books = require("./booksdb.js");
let public_users = express.Router();

public_users.get('/', (req, res) => {
  res.send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  book ? res.send(book) : res.status(404).send({ message: "Book not found" });
});

public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const result = [];

  Object.entries(books).forEach(([isbn, book]) => {
    if (book.author === author) result.push(book);
  });

  res.send(result);
});

public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const result = [];

  Object.entries(books).forEach(([isbn, book]) => {
    if (book.title === title) result.push(book);
  });

  res.send(result);
});

public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  book ? res.send(book.reviews) : res.status(404).send({ message: "Book not found" });
});

module.exports.general = public_users;