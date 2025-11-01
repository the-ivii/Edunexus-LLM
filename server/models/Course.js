const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true,
        trim : true
    },
    description : {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    thumbnail:{
        type: String,
        default: ''
    },
    category : {
        type: String,
        default: 'General'
    },
    enrolledStudents:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Course', courseSchema)