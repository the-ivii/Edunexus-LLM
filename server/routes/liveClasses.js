const express = require('express');
const router = express.Router();
const {
  createLiveClass,
  getCourseLiveClasses,
  getLiveClass,
  updateLiveClass,
  deleteLiveClass
} = require('../controllers/liveClassController');
const { protect, authorize } = require('../middleware/auth');

router.post('/:courseId', protect, authorize('instructor'), createLiveClass);
router.get('/course/:courseId', protect, getCourseLiveClasses);
router.get('/:id', protect, getLiveClass);
router.put('/:id', protect, authorize('instructor'), updateLiveClass);
router.delete('/:id', protect, authorize('instructor'), deleteLiveClass);

module.exports = router;