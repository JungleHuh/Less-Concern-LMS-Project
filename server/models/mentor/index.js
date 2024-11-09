// server/models/mentor/index.js
const mongoose = require('mongoose');
const { EXAM_TYPE_LIST } = require('../../config/exam');

const mentorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  examType: { 
    type: String, 
    required: true,
    enum: EXAM_TYPE_LIST, // ['cpa', 'law', 'tax', 'labor', 'patent']
    index: true
  },
  experience: { 
    type: String, 
    required: true 
  },
  introduction: { 
    type: String, 
    required: true 
  },
  profileImage: {
    type: String,
    required: false
  },
  mentoringInfo: {
    price: { 
      type: Number, 
      required: true,
      min: 30000
    },
    duration: { 
      type: Number, 
      required: true,
      min: 30,
      max: 120 
    }
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive'],
    default: 'pending',
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

mentorSchema.index({ examType: 1, status: 1 });

module.exports = mongoose.model('Mentor', mentorSchema);