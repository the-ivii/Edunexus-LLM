import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../utils/api';
import './Dashboard.css';

const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('enrolled');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const [enrolled, all] = await Promise.all([
        courseAPI.getEnrolled(),
        courseAPI.getAll()
      ]);
      setEnrolledCourses(enrolled.data);
      setAllCourses(all.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await courseAPI.enroll(courseId);
      fetchCourses();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll');
    }
  };

  const availableCourses = allCourses.filter(
    (course) => !enrolledCourses.some((enrolled) => enrolled._id === course._id)
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Student Dashboard</h1>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'enrolled' ? 'active' : ''}`}
            onClick={() => setActiveTab('enrolled')}
          >
            My Courses ({enrolledCourses.length})
          </button>
          <button
            className={`tab ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Available Courses ({availableCourses.length})
          </button>
        </div>

        {activeTab === 'enrolled' && (
          <>
            {enrolledCourses.length === 0 ? (
              <div className="empty-state card">
                <h2>No enrolled courses</h2>
                <p>Browse available courses and enroll to start learning</p>
                <button onClick={() => setActiveTab('available')} className="btn btn-primary">
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="courses-grid">
                {enrolledCourses.map((course) => (
                  <div key={course._id} className="course-card card">
                    <h3>{course.title}</h3>
                    <p className="course-description">{course.description}</p>
                    <p className="course-instructor">
                      Instructor: {course.instructor?.name}
                    </p>
                    <div className="course-meta">
                      <span className="course-category">{course.category || 'General'}</span>
                    </div>
                    <div className="course-actions">
                      <Link to={`/courses/${course._id}`} className="btn btn-primary">
                        Go to Course
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'available' && (
          <>
            {availableCourses.length === 0 ? (
              <div className="empty-state card">
                <h2>No available courses</h2>
                <p>You are enrolled in all available courses</p>
              </div>
            ) : (
              <div className="courses-grid">
                {availableCourses.map((course) => (
                  <div key={course._id} className="course-card card">
                    <h3>{course.title}</h3>
                    <p className="course-description">{course.description}</p>
                    <p className="course-instructor">
                      Instructor: {course.instructor?.name}
                    </p>
                    <div className="course-meta">
                      <span className="course-category">{course.category || 'General'}</span>
                      <span className="course-students">
                        {course.enrolledStudents?.length || 0} students
                      </span>
                    </div>
                    <div className="course-actions">
                      <button
                        onClick={() => handleEnroll(course._id)}
                        className="btn btn-primary"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;