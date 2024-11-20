const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const isValid = require("./router/auth_users.js").isValid;
const genl_routes = require("./router/general.js").general;
const { JWT_SECRET } = require("./config/index.js");

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: JWT_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ message: "User is not authorized!" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (!isValid(payload.username)) {
      return res.status(401).json({ message: "User is not authorized!" });
    }
    req.username = payload.username;
    next();
  } catch (e) {
    return res.status(401).json({ message: "User is not authorized!" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
