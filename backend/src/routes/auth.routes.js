const express = require('express');
const { validate } = require('../middlewares/validate.middleware');
const authController = require('../controllers/auth.controller');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', validate({ body: registerSchema }), authController.register);
router.post('/login', validate({ body: loginSchema }), authController.login);

module.exports = router;
