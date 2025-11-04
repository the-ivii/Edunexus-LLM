import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../utils/api';
import './Dashboard.css';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getInstructor();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await courseAPI.create(newCourse);
      setShowModal(false);
      setNewCourse({ title: '', description: '', category: '' });
      fetchCourses();
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseAPI.delete(id);
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Instructor Dashboard</h1>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            Create New Course
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="empty-state card">
            <h2>No courses yet</h2>
            <p>Create your first course to get started</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course._id} className="course-card card">
                <h3>{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <span className="course-category">{course.category || 'General'}</span>
                  <span className="course-students">
                    {course.enrolledStudents?.length || 0} students
                  </span>
                </div>
                <div className="course-actions">
                  <Link to={`/courses/${course._id}`} className="btn btn-secondary">
                    View Details
                  </Link>
                  <Link to={`/instructor/courses/${course._id}/manage`} className="btn btn-primary">
                    Manage
                  </Link>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
              <h2>Create New Course</h2>
              <form onSubmit={handleCreateCourse}>
                <div className="input-group">
                  <label>Course Title</label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    required
                    placeholder="Enter course title"
                  />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    required
                    placeholder="Enter course description"
                    rows="4"
                  />
                </div>
                <div className="input-group">
                  <label>Category</label>
                  <input
                    type="text"
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    placeholder="e.g., Programming, Design, Business"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;