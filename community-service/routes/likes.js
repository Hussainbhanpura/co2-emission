const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Base route: /api/likes

// @desc    Get all users who liked a post
// @route   GET /api/likes/post/:postId
// @access  Public
router.get('/post/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('likes', 'name avatar');
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    res.status(200).json({
      success: true,
      count: post.likes.length,
      data: post.likes
    });
  } catch (error) {
    console.error(error);
    
    // Check if error is due to invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get all users who liked a comment
// @route   GET /api/likes/comment/:commentId
// @access  Public
router.get('/comment/:commentId', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
      .populate('likes', 'name avatar');
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      count: comment.likes.length,
      data: comment.likes
    });
  } catch (error) {
    console.error(error);
    
    // Check if error is due to invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

module.exports = router;
