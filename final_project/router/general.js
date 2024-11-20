const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(401)
      .json({ message: "Username or Password does not exist!" });
  }

  if (isValid(username)) {
    return res.status(401).json({ message: "User already exists!" });
  }

  const user = { username, password };
  users.push(user);

  return res.status(200).json({ message: "User registered successfully!" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  const _books = await new Promise((res, rej) =>
    setTimeout(() => res(books), 3000)
  );
  return res.status(200).json({ books: _books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const book = await new Promise((res, rej) =>
    setTimeout(() => {
      res(books[isbn]);
    }, 3000)
  );
  return res.status(200).json(book);
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  const _books = await new Promise((res, rej) =>
    setTimeout(() => {
      res(Object.values(books).filter((b) => b.author === author));
    }, 3000)
  );
  return res.status(200).json({ books: _books });
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  const _books = await new Promise((res, rej) =>
    setTimeout(() => {
      res(Object.values(books).filter((b) => b.title === title));
    }, 3000)
  );
  return res.status(200).json({ books: _books });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  return res.status(200).json({ reviews: book.reviews });
});

module.exports.general = public_users;
