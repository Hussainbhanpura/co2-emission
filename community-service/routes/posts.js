const express = require('express');
const router = express.Router();
const { 
  createPost, 
  getPosts, 
  getPost, 
  updatePost, 
  deletePost,
  likePost,
  unlikePost
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

// Base route: /api/posts

// Public routes
router.get('/', getPosts);
router.get('/:id', getPost);

// Protected routes
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.put('/like/:id', protect, likePost);
router.put('/unlike/:id', protect, unlikePost);

module.exports = router;
