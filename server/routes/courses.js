const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getInstructorCourses,
  getEnrolledCourses
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.get('/', protect, getAllCourses);
router.get('/instructor', protect, authorize('instructor'), getInstructorCourses);
router.get('/enrolled', protect, authorize('student'), getEnrolledCourses);
router.get('/:id', protect, getCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);
router.post('/:id/enroll', protect, authorize('student'), enrollCourse);

module.exports = router;