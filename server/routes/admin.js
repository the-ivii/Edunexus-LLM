const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllContent,
  deleteContent,
  getStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.get('/users', protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);
router.get('/content', protect, authorize('admin'), getAllContent);
router.delete('/content/:type/:id', protect, authorize('admin'), deleteContent);
router.get('/stats', protect, authorize('admin'), getStats);

module.exports = router;