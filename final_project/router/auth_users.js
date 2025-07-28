const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');
let authenticated = express.Router();
const regd_users = express.Router();

let users = [];

function isValid(username) {
  return users.some(user => user.username === username);
}

authenticated.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
});

authenticated.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, "mySecretToken", { expiresIn: '1h' });
  req.session.authorization = { token, username };

  res.status(200).json({ message: "Login successful", token });
});
  
authenticated.get('/users', (req, res) => {
    res.json(users);
  });

  authenticated.put('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user?.username;
  
    if (!username) {
      return res.status(401).json({ message: "User not authenticated" });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Review is missing in query" });
    }
  
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Add or update review
    book.reviews[username] = review;
  
    res.status(200).json({
      message: `Review for ISBN ${isbn} by '${username}' has been saved.`,
      updatedReviews: book.reviews
    });
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!books[isbn].reviews[username]) {
      return res.status(400).json({ message: "No review by this user to delete" });
    }
  
    // Delete the user's review
    delete books[isbn].reviews[username];
  
    return res.status(200).json({ message: "Review deleted successfully" });
  });
  

module.exports.authenticated = authenticated;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.regd_users = regd_users;