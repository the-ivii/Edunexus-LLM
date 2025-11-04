import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import './Dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'stats') {
        const response = await adminAPI.getStats();
        setStats(response.data);
      } else if (activeTab === 'users') {
        const response = await adminAPI.getUsers();
        setUsers(response.data);
      } else if (activeTab === 'content') {
        const response = await adminAPI.getContent();
        setContent(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleUpdateRole = async (id, newRole) => {
    try {
      await adminAPI.updateUserRole(id, newRole);
      fetchData();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteContent = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        await adminAPI.deleteContent(type, id);
        fetchData();
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
          <button
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`tab ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            Content
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'stats' && stats && (
              <div className="stats-grid">
                <div className="stat-card card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>{stats.totalUsers}</h3>
                    <p>Total Users</p>
                  </div>
                </div>
                <div className="stat-card card">
                  <div className="stat-icon">📚</div>
                  <div className="stat-info">
                    <h3>{stats.totalCourses}</h3>
                    <p>Total Courses</p>
                  </div>
                </div>
                <div className="stat-card card">
                  <div className="stat-icon">🎥</div>
                  <div className="stat-info">
                    <h3>{stats.totalLectures}</h3>
                    <p>Total Lectures</p>
                  </div>
                </div>
                <div className="stat-card card">
                  <div className="stat-icon">📝</div>
                  <div className="stat-info">
                    <h3>{stats.totalAssignments}</h3>
                    <p>Total Assignments</p>
                  </div>
                </div>
                <div className="stat-card card">
                  <div className="stat-icon">🎓</div>
                  <div className="stat-info">
                    <h3>{stats.usersByRole?.students || 0}</h3>
                    <p>Students</p>
                  </div>
                </div>
                <div className="stat-card card">
                  <div className="stat-icon">👨‍🏫</div>
                  <div className="stat-info">
                    <h3>{stats.usersByRole?.instructors || 0}</h3>
                    <p>Instructors</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="table-container card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                            className="role-select"
                          >
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="btn btn-danger btn-small"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'content' && content && (
              <div className="content-sections">
                <div className="content-section">
                  <h2>Courses ({content.courses.length})</h2>
                  <div className="table-container card">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Instructor</th>
                          <th>Students</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {content.courses.map((course) => (
                          <tr key={course._id}>
                            <td>{course.title}</td>
                            <td>{course.instructor?.name}</td>
                            <td>{course.enrolledStudents?.length || 0}</td>
                            <td>
                              <button
                                onClick={() => handleDeleteContent('course', course._id)}
                                className="btn btn-danger btn-small"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="content-section">
                  <h2>Lectures ({content.lectures.length})</h2>
                  <div className="table-container card">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Course</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {content.lectures.map((lecture) => (
                          <tr key={lecture._id}>
                            <td>{lecture.title}</td>
                            <td>{lecture.course?.title}</td>
                            <td>
                              <button
                                onClick={() => handleDeleteContent('lecture', lecture._id)}
                                className="btn btn-danger btn-small"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="content-section">
                  <h2>Assignments ({content.assignments.length})</h2>
                  <div className="table-container card">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Course</th>
                          <th>Due Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {content.assignments.map((assignment) => (
                          <tr key={assignment._id}>
                            <td>{assignment.title}</td>
                            <td>{assignment.course?.title}</td>
                            <td>{new Date(assignment.dueDate).toLocaleDateString()}</td>
                            <td>
                              <button
                                onClick={() => handleDeleteContent('assignment', assignment._id)}
                                className="btn btn-danger btn-small"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;