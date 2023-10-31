const express = require('express');
const { createUser, loginUser } = require('../controllers/users.controllers');



const router = express.Router();

// create user
router.route('/signup').post(createUser);
// login user
router.route('/login').post(loginUser);

module.exports = router;