const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

//Imports from the files:
const connectDB = require('./config/db')

dotenv.config();
const app = express();
const server = http.createServer(app)

connectDB();

app.get('/api', (req, res) =>{
    res.json({message: 'Edunexus API is running'});
})

const PORT = process.env.PORT || 5001
server.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})