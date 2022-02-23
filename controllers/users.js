const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Error400 = require('../errors/error400');
const Error401 = require('../errors/error401');
const Error404 = require('../errors/error404');
const Error409 = require('../errors/error409');

require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

function getUserWithoutPassword(user) {
  const { password, ...responseUser } = user._doc;
  return responseUser;
}

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  if (!req.body) {
    return next(new Error400('Неправильные параметры'));
  }

  const {
    email,
    password,
  } = req.body;

  if (!email || !password) {
    return next(new Error400('Неправильные параметры'));
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Error409('Пользователь существует');
      }

      bcrypt.hash(password, 10)
        .then((hash) => User.create({ email, password: hash }))
        .then((usr) => res.status(201).send(getUserWithoutPassword(usr)))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new Error400('Неправильные формат email'));
          }
          if (err.name === 'CastError' || err.name === 'ValidationError') {
            return next(new Error400('Неправильные параметры'));
          }
          return next(err);
        });
    })
    .catch(next);
  return undefined;
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return next(new Error404('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new Error400('Неправильные параметры'));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { _id } = req.user;
  if (!req.body) {
    return next(new Error400('Неправильные параметры'));
  }
  const { name, about } = req.body;
  if (!name || !about) {
    return next(new Error400('Неправильные параметры'));
  }
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new Error404('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new Error400('Неправильные параметры'));
      }
      return next(err);
    });
  return next();
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { _id } = req.user;
  if (!req.body) {
    return next(new Error400('Неправильные параметры'));
  }
  const { avatar } = req.body;
  if (!avatar) {
    return next(new Error400('Неправильные параметры'));
  }
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new Error404('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new Error400('Неправильные параметры'));
      }
      return next(err);
    });
  return next();
};

module.exports.login = (req, res, next) => {
  if (!req.body || !req.body.email || !req.body.password) {
    return next(new Error400('Неправильные параметры'));
  }
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return next(new Error401('Неправильные почта или пароль'));
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      );
      return res.cookie('jwt', token, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      }).send(getUserWithoutPassword(user)).end();
    })
    .catch((err) => next(err));
  return next();
};
