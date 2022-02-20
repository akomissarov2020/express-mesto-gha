const Card = require('../models/cards');

module.exports.getCards = (req, res) => {
  const owner = req.user._id;
  Card.find({ owner })
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err.name}` }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  if (!req.body) {
    res.status(400).send({ message: 'Неправильные параметры' });
    return;
  }
  const { name, link } = req.body;
  if (!name || !link || !owner) {
    res.status(400).send({ message: 'Неправильные параметры' });
  }
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Неправильные параметры' });
        return;
      }
      res.status(500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .populate('owner')
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Неправильные параметры' });
        return;
      }
      res.status(500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .populate('owner')
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Неправильные параметры' });
        return;
      }
      res.status(500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Неправильные параметры' });
        return;
      }
      res.status(500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Неправильные параметры' });
        return;
      }
      res.status(500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
    });
};
