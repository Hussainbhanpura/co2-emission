const express = require('express');
const router = express.Router();
const { 
  addComment, 
  getComments, 
  updateComment, 
  deleteComment,
  likeComment,
  unlikeComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

// Base route: /api/comments

// Public routes
router.get('/:postId', getComments);

// Protected routes
router.post('/:postId', protect, addComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);
router.put('/like/:id', protect, likeComment);
router.put('/unlike/:id', protect, unlikeComment);

module.exports = router;
