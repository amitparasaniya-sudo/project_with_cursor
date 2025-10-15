const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updatePassword,
  logoutUser,
  forgotPassword
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);

// Protected routes
router.use(protect); // All routes below this middleware are protected

router.get('/me', getMe);
router.put('/updatepassword', updatePassword);
router.get('/logout', logoutUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);

// Admin routes
router.route('/')
  .get(authorize('admin', 'moderator'), getUsers);

router.route('/:id')
  .delete(authorize('admin'), deleteUser);

module.exports = router;
