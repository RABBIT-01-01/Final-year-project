const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', [
    body('fullname').isLength({min:3}).withMessage('Full name is required'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('phone')
    .matches(/^9[87]\d{8}$/)
    .withMessage('Phone number must start with 98 or 97 and be 10 digits long'),
    body('logUser').isIn(['user', 'admin']).withMessage('User type must be either user or admin'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
], userController.registerUser);
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
], userController.loginUser);
router.get('/profile',authMiddleware.authUser, userController.getUserProfile);
router.get('/logout', authMiddleware.authUser, userController.logoutUser);
module.exports = router;
