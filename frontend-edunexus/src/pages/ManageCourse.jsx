import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { courseAPI, lectureAPI, assignmentAPI, liveClassAPI } from '../utils/api';
import './ManageCourse.css';

const ManageCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('lectures');
  const [loading, setLoading] = useState(true);

  const [lectures, setLectures] = useState([]);
  const [showLectureModal, setShowLectureModal] = useState(false);
  const [newLecture, setNewLecture] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    order: 0
  });

  const [assignments, setAssignments] = useState([]);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxScore: 100
  });

  const [liveClasses, setLiveClasses] = useState([]);
  const [showLiveClassModal, setShowLiveClassModal] = useState(false);
  const [newLiveClass, setNewLiveClass] = useState({
    title: '',
    meetingLink: '',
    scheduledAt: '',
    duration: 60,
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
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
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLecture = async (e) => {
    e.preventDefault();
    try {
      await lectureAPI.create(id, newLecture);
      setShowLectureModal(false);
      setNewLecture({ title: '', description: '', videoUrl: '', duration: '', order: 0 });
      fetchData();
    } catch (error) {
      console.error('Error creating lecture:', error);
      alert('Failed to create lecture');
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      try {
        await lectureAPI.delete(lectureId);
        fetchData();
      } catch (error) {
        console.error('Error deleting lecture:', error);
      }
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', newAssignment.title);
      formData.append('description', newAssignment.description);
      formData.append('dueDate', newAssignment.dueDate);
      formData.append('maxScore', newAssignment.maxScore);

      await assignmentAPI.create(id, formData);
      setShowAssignmentModal(false);
      setNewAssignment({ title: '', description: '', dueDate: '', maxScore: 100 });
      fetchData();
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment');
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await assignmentAPI.delete(assignmentId);
        fetchData();
      } catch (error) {
        console.error('Error deleting assignment:', error);
      }
    }
  };

  const handleCreateLiveClass = async (e) => {
    e.preventDefault();
    try {
      await liveClassAPI.create(id, newLiveClass);
      setShowLiveClassModal(false);
      setNewLiveClass({ title: '', meetingLink: '', scheduledAt: '', duration: 60, description: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating live class:', error);
      alert('Failed to create live class');
    }
  };

  const handleDeleteLiveClass = async (liveClassId) => {
    if (window.confirm('Are you sure you want to delete this live class?')) {
      try {
        await liveClassAPI.delete(liveClassId);
        fetchData();
      } catch (error) {
        console.error('Error deleting live class:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!course) {
    return <div className="container">Course not found</div>;
  }

  return (
    <div className="manage-course-page">
      <div className="container">
        <div className="page-header">
          <h1>Manage: {course.title}</h1>
        </div>

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
        </div>

        {activeTab === 'lectures' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Lectures</h2>
              <button onClick={() => setShowLectureModal(true)} className="btn btn-primary">
                Add Lecture
              </button>
            </div>

            {lectures.length === 0 ? (
              <div className="empty-state card">
                <p>No lectures yet. Add your first lecture!</p>
              </div>
            ) : (
              <div className="items-list">
                {lectures.map((lecture) => (
                  <div key={lecture._id} className="item-card card">
                    <h3>{lecture.title}</h3>
                    <p>{lecture.description}</p>
                    <div className="item-meta">
                      <span>Order: {lecture.order}</span>
                      {lecture.duration && <span>Duration: {lecture.duration}</span>}
                    </div>
                    <div className="item-actions">
                      <a href={lecture.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                        View Video
                      </a>
                      <button onClick={() => handleDeleteLecture(lecture._id)} className="btn btn-danger">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Assignments</h2>
              <button onClick={() => setShowAssignmentModal(true)} className="btn btn-primary">
                Add Assignment
              </button>
            </div>

            {assignments.length === 0 ? (
              <div className="empty-state card">
                <p>No assignments yet. Create your first assignment!</p>
              </div>
            ) : (
              <div className="items-list">
                {assignments.map((assignment) => (
                  <div key={assignment._id} className="item-card card">
                    <h3>{assignment.title}</h3>
                    <p>{assignment.description}</p>
                    <div className="item-meta">
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      <span>Max Score: {assignment.maxScore}</span>
                    </div>
                    <div className="item-actions">
                      <button onClick={() => handleDeleteAssignment(assignment._id)} className="btn btn-danger">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'live' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Live Classes</h2>
              <button onClick={() => setShowLiveClassModal(true)} className="btn btn-primary">
                Schedule Live Class
              </button>
            </div>

            {liveClasses.length === 0 ? (
              <div className="empty-state card">
                <p>No live classes scheduled. Create your first live session!</p>
              </div>
            ) : (
              <div className="items-list">
                {liveClasses.map((liveClass) => (
                  <div key={liveClass._id} className="item-card card">
                    <h3>{liveClass.title}</h3>
                    <p>{liveClass.description}</p>
                    <div className="item-meta">
                      <span>📅 {new Date(liveClass.scheduledAt).toLocaleString()}</span>
                      <span>⏱️ {liveClass.duration} minutes</span>
                    </div>
                    <div className="item-actions">
                      <a href={liveClass.meetingLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                        Meeting Link
                      </a>
                      <button onClick={() => handleDeleteLiveClass(liveClass._id)} className="btn btn-danger">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showLectureModal && (
          <div className="modal-overlay" onClick={() => setShowLectureModal(false)}>
            <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
              <h2>Add New Lecture</h2>
              <form onSubmit={handleCreateLecture}>
                <div className="input-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={newLecture.title}
                    onChange={(e) => setNewLecture({ ...newLecture, title: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea
                    value={newLecture.description}
                    onChange={(e) => setNewLecture({ ...newLecture, description: e.target.value })}
                    rows="3"
                  />
                </div>
                <div className="input-group">
                  <label>Video URL (YouTube, Vimeo, etc.)</label>
                  <input
                    type="url"
                    value={newLecture.videoUrl}
                    onChange={(e) => setNewLecture({ ...newLecture, videoUrl: e.target.value })}
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                <div className="input-group">
                  <label>Duration (optional)</label>
                  <input
                    type="text"
                    value={newLecture.duration}
                    onChange={(e) => setNewLecture({ ...newLecture, duration: e.target.value })}
                    placeholder="e.g., 45 minutes"
                  />
                </div>
                <div className="input-group">
                  <label>Order</label>
                  <input
                    type="number"
                    value={newLecture.order}
                    onChange={(e) => setNewLecture({ ...newLecture, order: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowLectureModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Lecture
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAssignmentModal && (
          <div className="modal-overlay" onClick={() => setShowAssignmentModal(false)}>
            <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
              <h2>Create Assignment</h2>
              <form onSubmit={handleCreateAssignment}>
                <div className="input-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    required
                    rows="4"
                  />
                </div>
                <div className="input-group">
                  <label>Due Date</label>
                  <input
                    type="datetime-local"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Max Score</label>
                  <input
                    type="number"
                    value={newAssignment.maxScore}
                    onChange={(e) => setNewAssignment({ ...newAssignment, maxScore: parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowAssignmentModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Assignment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showLiveClassModal && (
          <div className="modal-overlay" onClick={() => setShowLiveClassModal(false)}>
            <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
              <h2>Schedule Live Class</h2>
              <form onSubmit={handleCreateLiveClass}>
                <div className="input-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={newLiveClass.title}
                    onChange={(e) => setNewLiveClass({ ...newLiveClass, title: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea
                    value={newLiveClass.description}
                    onChange={(e) => setNewLiveClass({ ...newLiveClass, description: e.target.value })}
                    rows="3"
                  />
                </div>
                <div className="input-group">
                  <label>Meeting Link (Zoom, Google Meet, etc.)</label>
                  <input
                    type="url"
                    value={newLiveClass.meetingLink}
                    onChange={(e) => setNewLiveClass({ ...newLiveClass, meetingLink: e.target.value })}
                    required
                    placeholder="https://zoom.us/j/..."
                  />
                </div>
                <div className="input-group">
                  <label>Scheduled At</label>
                  <input
                    type="datetime-local"
                    value={newLiveClass.scheduledAt}
                    onChange={(e) => setNewLiveClass({ ...newLiveClass, scheduledAt: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    value={newLiveClass.duration}
                    onChange={(e) => setNewLiveClass({ ...newLiveClass, duration: parseInt(e.target.value) })}
                    min="15"
                    step="15"
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowLiveClassModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Schedule Class
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

export default ManageCourse;