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
  imageUrl: String,           
  extractedText: String,      
  analysis: {                // 추가: AI 분석 결과
    omniparserResult: String,  // OmniParser 분석 결과
    openaiAnalysis: {          // OpenAI 분석 결과
      coreConcepts: String,      // 핵심 개념
      solution: String,          // 해결 방법
      relatedConcepts: String,   // 관련 개념
      learningPoints: String     // 학습 포인트
    },
    timestamp: {              // 분석 시간
      type: Date,
      default: Date.now
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  examType: {                
    type: String,
    required: true
  },
  subject: String,           
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