// server/routes/community-routes/index.js
const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/auth-middleware');
const {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost
} = require('../../controllers/community-controller');

router.get('/posts', getPosts);
router.get('/posts/:id', getPost);
router.post('/posts', authenticate, createPost);
router.put('/posts/:id', authenticate, updatePost);
router.delete('/posts/:id', authenticate, deletePost);

module.exports = router;