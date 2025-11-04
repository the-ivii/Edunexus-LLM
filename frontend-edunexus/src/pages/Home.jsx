import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="highlight">EduNexus</span>
            </h1>
            <p className="hero-subtitle">
              Your comprehensive learning management system for online education.
              Create courses, learn new skills, and connect with students worldwide.
            </p>
            <div className="hero-buttons">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary btn-large">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-large">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-large">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Features</h2>
          <div className="features-grid">
            <div className="feature-card card">
              <div className="feature-icon">📚</div>
              <h3>Course Management</h3>
              <p>Create and manage courses with video lectures and assignments</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">🎥</div>
              <h3>Video Lectures</h3>
              <p>Upload and watch high-quality educational video content</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">📝</div>
              <h3>Assignments</h3>
              <p>Submit assignments and receive grades from instructors</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">💬</div>
              <h3>Real-time Chat</h3>
              <p>Connect with students and instructors through live chat</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">🎓</div>
              <h3>Live Classes</h3>
              <p>Schedule and join live online classes</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">⚡</div>
              <h3>Admin Dashboard</h3>
              <p>Comprehensive platform management for administrators</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;