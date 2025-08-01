const express = require('express');
const books = require("./booksdb.js");
let public_users = express.Router();
const axios = require("axios");

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

public_users.get('/books-async', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3000/');
    res.status(200).json({
      message: "Fetched books using async/await + Axios",
      data: response.data
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch books using Axios",
      error: error.message
    });
  }
});

public_users.get('/bookdetails-async/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
      const response = await axios.get(`http://localhost:3000/isbn/${isbn}`);
      res.status(200).json({
        message: `Book details for ISBN ${isbn} fetched using async/await`,
        data: response.data
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch book details",
        error: error.message
      });
    }
  });

  public_users.get('/author-async/:author', async (req, res) => {
    const author = req.params.author;
    try {
      const response = await axios.get(`http://localhost:3000/author/${author}`);
      res.status(200).json({
        message: `Books by '${author}' fetched using async/await`,
        books: response.data
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch books by author",
        error: error.message
      });
    }
  });

  public_users.get('/title-async/:title', async (req, res) => {
    const title = req.params.title;
    try {
      const response = await axios.get(`http://localhost:3000/title/${encodeURIComponent(title)}`);
      res.status(200).json({
        message: `Books with title '${title}' fetched using async/await`,
        books: response.data
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch books by title",
        error: error.message
      });
    }
  });
  

module.exports.general = public_users;

