const jwt = require('jsonwebtoken');
require('dotenv').config();

const WrongCredsError = require('../errors/wrong_creds');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = function authMiddleware(req, res, next) {
  if (!req.cookies || !req.cookies.jwt) {
    next(new WrongCredsError('Необходима авторизация'));
  }
  const token = req.cookies.jwt;
  try {
    const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    req.user = payload;
    next();
  } catch (err) {
    next(new WrongCredsError('Необходима авторизация'));
  }
};
