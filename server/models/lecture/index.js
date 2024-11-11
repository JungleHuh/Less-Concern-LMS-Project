// server/models/lecture.js
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  videoUrl: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  duration: Number,
  order: {
    type: Number,
    default: 0
  }
});

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  examType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videos: [videoSchema],
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive'],
    default: 'active'
  },
  totalDuration: {
    type: Number,
    default: 0
  },
  videoCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// 저장 전 총 재생 시간과 비디오 수 계산
lectureSchema.pre('save', function(next) {
  if (this.videos) {
    this.videoCount = this.videos.length;
    this.totalDuration = this.videos.reduce((total, video) => total + (video.duration || 0), 0);
  }
  next();
});

module.exports = mongoose.model('Lecture', lectureSchema);