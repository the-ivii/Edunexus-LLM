const express = require('express');
const router = express.Router();
const {
  createLecture,
  getCourseLectures,
  getLecture,
  updateLecture,
  deleteLecture
} = require('../controllers/lectureController');
const { protect, authorize } = require('../middleware/auth');

router.post('/:courseId', protect, authorize('instructor','admin'), createLecture);
router.get('/course/:courseId', protect, getCourseLectures);
router.get('/:id', protect, getLecture);
router.put('/:id', protect, authorize('instructor'), updateLecture);
router.delete('/:id', protect, authorize('instructor'), deleteLecture);

module.exports = router;