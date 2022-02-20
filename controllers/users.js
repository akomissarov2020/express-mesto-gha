const User = require('../models/users');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` }));
};

module.exports.addUser = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: 'Неправильные параметры' });
    return;
  }
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    res.status(400).send({ message: 'Неправильные параметры' });
    return;
  }
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Неправильные параметры' });
        return;
      }
      res.status(500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
    });
};

module.exports.getUser = (req, res) => {
  if (!req.params.id) {
    res.status(500).send({ message: 'Неправильные параметры' });
    return;
  }
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Неправильные параметры' });
        return;
      }
      res.status(500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
    });
};

module.exports.createFirstUser = (req, res) => {
  User.count({}, (err, count) => {
    if (err) {
      res.status(500).send({ message: `Произошла ошибка в createFirstUser: ${err.name} ${err.message}` });
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
      .then((user) => res.send(user))
      .catch((e) => {
        if (e.name === 'ValidationError') {
          res.status(400).send({ message: 'Неправильные параметры' });
        }
        res.status(500).send({ message: `Произошла ошибка: ${e.name} ${e.message}` });
      });
  });
};

module.exports.updateUser = (req, res) => {
  const { _id } = req.user;
  if (!req.body) {
    res.status(400).send({ message: 'Неправильные параметры' });
    return;
  }
  const { name, about } = req.body;
  if (!name || !about) {
    res.status(400).send({ message: 'Неправильные параметры' });
    return;
  }
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Неправильные параметры' });
        return;
      }
      res.status(500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { _id } = req.user;
  if (!req.body) {
    res.status(400).send({ message: 'Неправильные параметры' });
    return;
  }
  const { avatar } = req.body;
  if (!avatar) {
    res.status(400).send({ message: 'Неправильные параметры' });
    return;
  }
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Неправильные параметры' });
        return;
      }
      res.status(500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
    });
};
