// server/models/question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  imageUrl: String,           // 원본 이미지 URL
  extractedText: String,      // 추출된 텍스트
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  examType: {                // 시험 유형 (CPA, 세무사 등)
    type: String,
    required: true
  },
  subject: String,           // 과목 (재무회계, 세법 등)
  status: {
    type: String,
    enum: ['pending', 'resolved'],
    default: 'pending'
  },
  answers: [{
    content: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isAccepted: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);