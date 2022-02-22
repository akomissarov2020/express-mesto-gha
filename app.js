const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const Error404 = require('./errors/error404');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb')
  .catch((err) => {
    console.log({ message: `Ошибка подключения к базе данных: ${err} ` });
    throw Error(`Ошибка подключения к базе данных: ${err} `);
  });

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(authMiddleware); // auth shield
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (req, res, next) => next(new Error404('Ресурс не найден. Проверьте URL и метод запроса')));

// здесь обрабатываем все ошибки
app.use((err, req, res, next) => {
  const { statusCode = 500, message, name } = err;
  console.log('Finally', err);
  res.status(statusCode).send(
    { message: statusCode === 500 ? 'На сервере произошла ошибка' : message },
  );
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
