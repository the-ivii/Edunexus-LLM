const LiveClass = require('../models/LiveClass');
const Course = require('../models/Course');

exports.createLiveClass = async (req, res) => {
  try {
    const { title, meetingLink, scheduledAt, duration, description } = req.body;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const liveClass = await LiveClass.create({
      title,
      course: courseId,
      meetingLink,
      scheduledAt,
      duration,
      description
    });

    res.status(201).json(liveClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourseLiveClasses = async (req, res) => {
  try {
    const liveClasses = await LiveClass.find({ course: req.params.courseId })
      .sort({ scheduledAt: 1 });
    res.json(liveClasses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id).populate('course');
    if (!liveClass) {
      return res.status(404).json({ message: 'Live class not found' });
    }
    res.json(liveClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id).populate('course');

    if (!liveClass) {
      return res.status(404).json({ message: 'Live class not found' });
    }

    if (liveClass.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedLiveClass = await LiveClass.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedLiveClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id).populate('course');

    if (!liveClass) {
      return res.status(404).json({ message: 'Live class not found' });
    }

    if (liveClass.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await LiveClass.findByIdAndDelete(req.params.id);
    res.json({ message: 'Live class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};