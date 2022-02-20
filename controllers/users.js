const User = require('../models/users');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка в getUsers: ${err.name}` }));
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    res.status(500).send({ message: 'Неправильные параметры' });
  }
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка в addUser: ${err.name}` }));
};

module.exports.getUser = (req, res) => {
  if (!req.params.id) {
    res.status(500).send({ message: 'Неправильные параметры' });
    return;
  }
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка в getUser: ${err.name}` }));
};

module.exports.createFirstUser = (req, res) => {
  User.count({}, (err, count) => {
    if (err) {
      res.status(500).send({ message: `Произошла ошибка в createFirstUser: ${err.name}, ${err.message}` });
      return;
    }
    if (count > 0) {
      res.send({ message: 'Первый пользователь уже существует.' });
      return;
    }
    const name = 'Default';
    const about = 'Default';
    const avatar = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50';
    User.create({ name, about, avatar })
      .then((user) => res.send({ data: user }))
      .catch((e) => res.status(500).send({ message: `Произошла ошибка в createFirstUser: ${e.name}, ${e.message}` }));
  });
};
