const router = require('express').Router();

const {
  getUsers,
  getUser,
  addUser,
  createFirstUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.post('/users', addUser);

router.get('/users/:id', getUser);

router.get('/init', createFirstUser);

router.patch('/users/me', updateUser);

router.patch('/users/avatar', updateUserAvatar);

module.exports = router;
