// server/models/enrollment.js
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture',
    required: true
  },
  enrolledAt: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  progress: {
    completedVideos: [{
      videoId: String,
      progress: Number,
      timestamp: Number,
      completedAt: Date
    }],
    lastWatched: {
      videoId: String,
      timestamp: Number,
      updatedAt: Date
    },
    totalProgress: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// 인덱스 설정
enrollmentSchema.index({ user: 1, lecture: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);