// server/config/exam.js
const EXAM_TYPES = {
    cpa: '공인회계사',
    law: '변호사',
    tax: '세무사',
    labor: '공인노무사',
    patent: '변리사'
  };
  
  module.exports = {
    EXAM_TYPES,
    EXAM_TYPE_LIST: Object.keys(EXAM_TYPES)
  };