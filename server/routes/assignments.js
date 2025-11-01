const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getCourseAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/:courseId', protect, authorize('instructor'), upload.single('file'), createAssignment);
router.get('/course/:courseId', protect, getCourseAssignments);
router.get('/:id', protect, getAssignment);
router.put('/:id', protect, authorize('instructor'), updateAssignment);
router.delete('/:id', protect, authorize('instructor'), deleteAssignment);
router.post('/:assignmentId/submit', protect, authorize('student'), upload.single('file'), submitAssignment);
router.get('/:assignmentId/submissions', protect, authorize('instructor'), getAssignmentSubmissions);
router.put('/submissions/:submissionId/grade', protect, authorize('instructor'), gradeSubmission);

module.exports = router;