const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const WrongCredsError = require('../errors/wrong_creds');

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
    validate: /[\wа-яА-ЯЁёё-]+/,
  },
  about: {
    type: String,
    required: false,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
    validate: /[ \wа-яА-ЯЁёё-]+/,
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: /[ \wа-яА-ЯЁёё-]+/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: (props) => `${props.value} некорретный email!`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

usersSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new WrongCredsError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new WrongCredsError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', usersSchema);
