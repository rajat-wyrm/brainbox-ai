const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../validators/authValidator');
const {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updateProfileValidator,
  changePasswordValidator
} = require('../validators/authValidator');

// Public routes
router.post('/signup', validate(signupValidator), authController.signup);
router.post('/login', validate(loginValidator), authController.login);
router.post('/forgot-password', validate(forgotPasswordValidator), authController.forgotPassword);
router.patch('/reset-password/:token', validate(resetPasswordValidator), authController.resetPassword);

// Protected routes (require authentication)
router.use(protect);
router.get('/me', authController.getMe);
router.post('/logout', authController.logout);
router.patch('/update-profile', validate(updateProfileValidator), authController.updateProfile);
router.patch('/update-password', validate(changePasswordValidator), authController.updatePassword);
router.delete('/delete-account', authController.deleteAccount);

module.exports = router;
