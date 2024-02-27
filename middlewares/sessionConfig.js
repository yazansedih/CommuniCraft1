// eslint-disable-next-line import/no-extraneous-dependencies
const session = require('express-session');
const crypto = require('crypto');

// Generate a random secret key
const secretKey = crypto.randomBytes(32).toString('hex');

module.exports = session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
});
