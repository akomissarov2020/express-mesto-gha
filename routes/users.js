const router = require('express').Router();
const { getUsers, getUser, addUser } = require('../controllers/users');

router.get('/users', getUsers);

router.post('/users', addUser);

router.get('/users/:id', getUser);

module.exports = router;
