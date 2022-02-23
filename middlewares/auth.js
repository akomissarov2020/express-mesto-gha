const jwt = require('jsonwebtoken');
require('dotenv').config();

const Error401 = require('../errors/error401');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = function authMiddleware(req, res, next) {
  if (!req.cookies || !req.cookies.jwt) {
    return next(new Error401('Необходима авторизация'));
  }
  const token = req.cookies.jwt;
  try {
    const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    req.user = payload;
    return next();
  } catch (err) {
    return next(new Error401('Необходима авторизация'));
  }
};
