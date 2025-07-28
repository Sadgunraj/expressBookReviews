const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const app = express();
const { authenticated } = require("./router/auth_users");
const auth_users = require("./router/auth_users.js");


app.use(express.json());
app.use(session({
  secret: 'mySessionSecret',
  resave: true,
  saveUninitialized: true
}));

const public_routes = require('./router/general.js').general;
const customer_routes = require('./router/auth_users.js').authenticated;

app.use('/customer/auth/*', (req, res, next) => {
  const token = req.session?.authorization?.token;
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, 'mySecretToken', (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
});

app.use('/customer', customer_routes);
app.use('/', public_routes);
app.use('/customer/auth', authenticated);
app.use('/customer', auth_users.authenticated);       // login/register/review PUT
app.use('/customer', auth_users.regd_users);          // review DELETE

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});