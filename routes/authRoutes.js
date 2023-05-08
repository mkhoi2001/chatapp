const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.post('/forgotPassword', authController.forgotPassword);

// view Routes
router.get('/register', authController.register);
router.get('/login', authController.login);
router.get('/forgot-password', authController.forgot_password);
router.get('/reset-password', authController.reset_password);
router.get('/', authController.index);



module.exports = router;