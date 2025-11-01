const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const Message = require('./models/Message');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/lectures', require('./routes/lectures'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/liveclasses', require('./routes/liveClasses'));

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-course', async (courseId) => {
    socket.join(courseId);
    console.log(`User joined course: ${courseId}`);

    try {
      const messages = await Message.find({ course: courseId })
        .populate('sender', 'name email role')
        .sort({ createdAt: 1 })
        .limit(50);
      socket.emit('previous-messages', messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  });

  socket.on('send-message', async (data) => {
    try {
      const { courseId, senderId, content } = data;

      const message = await Message.create({
        course: courseId,
        sender: senderId,
        content
      });

      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'name email role');

      io.to(courseId).emit('new-message', populatedMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('leave-course', (courseId) => {
    socket.leave(courseId);
    console.log(`User left course: ${courseId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.get('/api', (req, res) => {
  res.json({ message: 'EduNexus API is running' });
});

const PORT = process.env.PORT || 5002;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});