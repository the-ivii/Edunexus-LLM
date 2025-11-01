const Lecture = require('../models/Lecture');
const Course = require('../models/Course');

exports.createLecture = async (req, res) => {
  try {
    const { title, description, videoUrl, duration, order } = req.body;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const lecture = await Lecture.create({
      title,
      description,
      videoUrl,
      duration,
      order,
      course: courseId
    });

    res.status(201).json(lecture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourseLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({ course: req.params.courseId })
      .sort({ order: 1, createdAt: 1 });
    res.json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id).populate('course');
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    res.json(lecture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id).populate('course');

    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    if (lecture.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedLecture = await Lecture.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedLecture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id).populate('course');

    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    if (lecture.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Lecture.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lecture deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};