const express = require('express');
const { body, validationResult } = require('express-validator');
const { registerUser, authUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  registerUser
);

router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  authUser
);

module.exports = router;
