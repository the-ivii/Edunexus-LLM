# EduNexus - Mini Learning Management System

A full-stack MERN Learning Management System with real-time chat, video lectures, assignments, and live class scheduling.

## Features

### Core Features
- **Authentication & Authorization** - JWT-based login/signup with role-based access (Admin, Instructor, Student)
- **Course Management** - Create, update, delete, and enroll in courses
- **Video Lectures** - Upload and view lecture videos with support for external video URLs
- **Assignments** - Create assignments, submit work, and receive grades
- **Real-time Chat** - Socket.io-powered discussion boards for each course
- **Live Class Scheduling** - Schedule and join live sessions with meeting links

### User Roles

#### Student
- Register and login
- Browse and enroll in available courses
- Access lectures and course materials
- Submit assignments
- Participate in course discussions
- Join live classes

#### Instructor
- Create and manage courses
- Upload video lectures
- Create and grade assignments
- Schedule live classes
- Monitor course enrollment
- Engage with students via chat

#### Admin
- Manage all users (CRUD operations)
- Oversee all courses and content
- View platform statistics
- Remove inappropriate content
- Update user roles

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- Socket.io Client
- CSS3 with custom pastel theme

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io
- JWT Authentication
- Bcrypt.js
- Multer (file uploads)

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB account (Atlas or local)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd edunexus
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory with:
```
MONGO_URI=mongodb+srv://aryansingh:aryanmongodb@cluster0.7shqalg.mongodb.net/edunexus
JWT_SECRET=edunexus_secret_key_2024
PORT=5000
```

### 4. Run the Application

#### Start Backend Server
```bash
npm run server
```
Server will run on `http://localhost:5000`

#### Start Frontend Development Server
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

## Demo Credentials

### Admin Account
- Email: admin@edunexus.com
- Password: admin123

### Instructor Account
- Email: instructor@edunexus.com
- Password: instructor123

### Student Account
- Email: student@edunexus.com
- Password: student123

*Note: Create these accounts by registering through the app*

## Project Structure

```
edunexus/
├── src/                      # Frontend source
│   ├── components/           # Reusable React components
│   │   ├── Navbar.jsx
│   │   ├── Chat.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/               # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── InstructorDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── CourseDetail.jsx
│   │   └── ManageCourse.jsx
│   ├── context/             # React Context
│   │   └── AuthContext.jsx
│   ├── utils/               # Utility functions
│   │   └── api.js
│   └── App.jsx              # Main App component
├── server/                   # Backend source
│   ├── models/              # MongoDB models
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Lecture.js
│   │   ├── Assignment.js
│   │   ├── Submission.js
│   │   ├── Message.js
│   │   └── LiveClass.js
│   ├── controllers/         # Route controllers
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── lectureController.js
│   │   ├── assignmentController.js
│   │   ├── adminController.js
│   │   └── liveClassController.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── lectures.js
│   │   ├── assignments.js
│   │   ├── admin.js
│   │   └── liveClasses.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js
│   │   └── upload.js
│   ├── config/              # Configuration
│   │   └── db.js
│   └── server.js            # Express server
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (Instructor)
- `PUT /api/courses/:id` - Update course (Instructor)
- `DELETE /api/courses/:id` - Delete course (Instructor)
- `POST /api/courses/:id/enroll` - Enroll in course (Student)

### Lectures
- `GET /api/lectures/course/:courseId` - Get course lectures
- `POST /api/lectures/:courseId` - Create lecture (Instructor)
- `PUT /api/lectures/:id` - Update lecture (Instructor)
- `DELETE /api/lectures/:id` - Delete lecture (Instructor)

### Assignments
- `GET /api/assignments/course/:courseId` - Get course assignments
- `POST /api/assignments/:courseId` - Create assignment (Instructor)
- `POST /api/assignments/:assignmentId/submit` - Submit assignment (Student)
- `GET /api/assignments/:assignmentId/submissions` - View submissions (Instructor)
- `PUT /api/assignments/submissions/:submissionId/grade` - Grade submission (Instructor)

### Live Classes
- `GET /api/liveclasses/course/:courseId` - Get course live classes
- `POST /api/liveclasses/:courseId` - Schedule live class (Instructor)
- `PUT /api/liveclasses/:id` - Update live class (Instructor)
- `DELETE /api/liveclasses/:id` - Delete live class (Instructor)

### Admin
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/content` - Get all content
- `DELETE /api/admin/content/:type/:id` - Delete content
- `GET /api/admin/stats` - Get platform statistics

## Development

### Build for Production
```bash
npm run build
```

### Lint Code
```bash
npm run lint
```