const Card = require('../models/cards');

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  if (!name || !link || !owner) {
    res.status(500).send({ message: 'Неправильные параметры' });
  }
  User.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка в createCard: ${err.name}` }));
};

module.exports.deleteCard = (req, res) => {
  if (!req.params.id) {
    res.status(500).send({ message: 'Неправильные параметры' });
    return;
  }
  Card.findByIdAndRemove(req.params.id)
    .populate("owner")
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка в deleteCard: ${err.name}` }));
};

module.exports.getCards = (req, res) => {
  const owner = req.user._id;
  Card.find({owner})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка в getCards: ${err.name}` }));
};