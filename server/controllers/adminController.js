const User = require('../models/User');
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const Assignment = require('../models/Assignment');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllContent = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email');
    const lectures = await Lecture.find().populate('course', 'title');
    const assignments = await Assignment.find().populate('course', 'title');

    res.json({
      courses,
      lectures,
      assignments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const { type, id } = req.params;

    let result;
    switch (type) {
      case 'course':
        result = await Course.findByIdAndDelete(id);
        break;
      case 'lecture':
        result = await Lecture.findByIdAndDelete(id);
        break;
      case 'assignment':
        result = await Assignment.findByIdAndDelete(id);
        break;
      default:
        return res.status(400).json({ message: 'Invalid content type' });
    }

    if (!result) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: `${type} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalLectures = await Lecture.countDocuments();
    const totalAssignments = await Assignment.countDocuments();

    const studentCount = await User.countDocuments({ role: 'student' });
    const instructorCount = await User.countDocuments({ role: 'instructor' });
    const adminCount = await User.countDocuments({ role: 'admin' });

    res.json({
      totalUsers,
      totalCourses,
      totalLectures,
      totalAssignments,
      usersByRole: {
        students: studentCount,
        instructors: instructorCount,
        admins: adminCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};