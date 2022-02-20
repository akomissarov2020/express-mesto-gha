const User = require('../models/users');

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err.name}` }));
}

function addUser(req, res) {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    res.status(500).send({ message: 'Неправильные параметры' });
  }
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err.name}` }));
}

function getUser(req, res) {
  if (!req.params.id) {
    res.status(500).send({ message: 'Неправильные параметры' });
    return;
  }
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err.name}` }));
}

module.exports = { getUsers, getUser, addUser };
