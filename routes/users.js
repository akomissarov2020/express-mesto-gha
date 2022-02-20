const router = require('express').Router();

const {
  getUsers,
  getUser,
  addUser,
  createFirstUser,
} = require('../controllers/users');

router.get('/users', getUsers);

router.post('/users', addUser);

router.get('/users/:id', getUser);

router.get('/init', createFirstUser);

module.exports = router;
