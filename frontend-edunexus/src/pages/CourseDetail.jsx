import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseAPI, lectureAPI, assignmentAPI, liveClassAPI } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import Chat from '../components/Chat';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [activeTab, setActiveTab] = useState('lectures');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, lecturesRes, assignmentsRes, liveClassesRes] = await Promise.all([
        courseAPI.getOne(id),
        lectureAPI.getByCourse(id),
        assignmentAPI.getByCourse(id),
        liveClassAPI.getByCourse(id)
      ]);

      setCourse(courseRes.data);
      setLectures(lecturesRes.data);
      setAssignments(assignmentsRes.data);
      setLiveClasses(liveClassesRes.data);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!course) {
    return <div className="container">Course not found</div>;
  }

  const isInstructor = user.role === 'instructor' && course.instructor._id === user._id;
  const isEnrolled = course.enrolledStudents.some(student => student._id === user._id);

  return (
    <div className="course-detail-page">
      <div className="course-header">
        <div className="container">
          <h1>{course.title}</h1>
          <p className="course-instructor-info">
            Instructor: {course.instructor.name}
          </p>
          <p className="course-detail-description">{course.description}</p>
          <div className="course-header-meta">
            <span className="badge">{course.category || 'General'}</span>
            <span className="badge">{course.enrolledStudents.length} Students Enrolled</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="course-content">
          <div className="course-main">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'lectures' ? 'active' : ''}`}
                onClick={() => setActiveTab('lectures')}
              >
                Lectures ({lectures.length})
              </button>
              <button
                className={`tab ${activeTab === 'assignments' ? 'active' : ''}`}
                onClick={() => setActiveTab('assignments')}
              >
                Assignments ({assignments.length})
              </button>
              <button
                className={`tab ${activeTab === 'live' ? 'active' : ''}`}
                onClick={() => setActiveTab('live')}
              >
                Live Classes ({liveClasses.length})
              </button>
              <button
                className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
                onClick={() => setActiveTab('chat')}
              >
                Discussion
              </button>
            </div>

            {activeTab === 'lectures' && (
              <div className="content-section">
                {lectures.length === 0 ? (
                  <div className="empty-message card">
                    <p>No lectures available yet</p>
                  </div>
                ) : (
                  <div className="lectures-list">
                    {lectures.map((lecture, index) => (
                      <div key={lecture._id} className="lecture-item card">
                        <div className="lecture-number">{index + 1}</div>
                        <div className="lecture-info">
                          <h3>{lecture.title}</h3>
                          <p>{lecture.description}</p>
                          {lecture.duration && <span className="duration">Duration: {lecture.duration}</span>}
                        </div>
                        <div className="lecture-actions">
                          {(isEnrolled || isInstructor) && (
                            <a
                              href={lecture.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary"
                            >
                              Watch Lecture
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="content-section">
                {assignments.length === 0 ? (
                  <div className="empty-message card">
                    <p>No assignments available yet</p>
                  </div>
                ) : (
                  <div className="assignments-list">
                    {assignments.map((assignment) => (
                      <div key={assignment._id} className="assignment-item card">
                        <h3>{assignment.title}</h3>
                        <p>{assignment.description}</p>
                        <div className="assignment-meta">
                          <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          <span>Max Score: {assignment.maxScore}</span>
                        </div>
                        {user.role === 'student' && isEnrolled && (
                          <Link
                            to={`/assignments/${assignment._id}/submit`}
                            className="btn btn-primary"
                          >
                            Submit Assignment
                          </Link>
                        )}
                        {isInstructor && (
                          <Link
                            to={`/assignments/${assignment._id}/submissions`}
                            className="btn btn-secondary"
                          >
                            View Submissions
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'live' && (
              <div className="content-section">
                {liveClasses.length === 0 ? (
                  <div className="empty-message card">
                    <p>No live classes scheduled</p>
                  </div>
                ) : (
                  <div className="live-classes-list">
                    {liveClasses.map((liveClass) => (
                      <div key={liveClass._id} className="live-class-item card">
                        <h3>{liveClass.title}</h3>
                        <p>{liveClass.description}</p>
                        <div className="live-class-meta">
                          <span>📅 {new Date(liveClass.scheduledAt).toLocaleString()}</span>
                          <span>⏱️ {liveClass.duration} minutes</span>
                        </div>
                        {(isEnrolled || isInstructor) && (
                          <a
                            href={liveClass.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                          >
                            Join Meeting
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="content-section">
                {(isEnrolled || isInstructor) ? (
                  <Chat courseId={id} />
                ) : (
                  <div className="empty-message card">
                    <p>Enroll in this course to access the discussion</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;