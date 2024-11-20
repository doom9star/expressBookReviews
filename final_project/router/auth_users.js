const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
const { JWT_SECRET } = require("../config/index.js");

let users = [];

const isValid = (username) => {
  return !!users.find((u) => u.username === username);
};

const authenticatedUser = (username, password) => {
  return !!users.find(
    (u) => u.username === username && u.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(401)
      .json({ message: "Username or Password does not exist!" });
  }

  if (!authenticatedUser(username, password)) {
    return res
      .status(401)
      .json({ message: "User does not exist or invalid credentials!" });
  }

  const token = jwt.sign({ username }, JWT_SECRET);
  req.session.token = token;

  return res.status(200).json({ message: "User logged in successfully!" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.body;

  const isbn = req.params.isbn;

  books[isbn].reviews[req.username] = review;

  return res.status(200).json({ message: "Review added successfully!" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  delete books[isbn].reviews[req.username];

  return res.status(200).json({ message: "Review deleted successfully!" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
