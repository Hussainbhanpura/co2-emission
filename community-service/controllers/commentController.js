const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Add comment to post
// @route   POST /api/comments/:postId
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    const { content, parentComment } = req.body;
    
    // Create new comment
    const newComment = await Comment.create({
      post: req.params.postId,
      user: req.user.id,
      content,
      parentComment: parentComment || null
    });
    
    // Update post's comment count
    await Post.findByIdAndUpdate(
      req.params.postId,
      { $inc: { commentsCount: 1 } }
    );
    
    // Populate user info
    const comment = await Comment.findById(newComment._id).populate('user', 'name avatar');
    
    res.status(201).json({
      success: true,
      data: comment
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
};

// @desc    Get all comments for a post
// @route   GET /api/comments/:postId
// @access  Public
exports.getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
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
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check if user is comment owner
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }
    
    // Update comment
    comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { 
        content: req.body.content,
        isEdited: true 
      },
      { new: true, runValidators: true }
    ).populate('user', 'name avatar');
    
    res.status(200).json({
      success: true,
      data: comment
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
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check if user is comment owner or admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }
    
    const postId = comment.post;
    
    await comment.deleteOne();
    
    // Update post's comment count
    await Post.findByIdAndUpdate(
      postId,
      { $inc: { commentsCount: -1 } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Comment removed'
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
};

// @desc    Like a comment
// @route   PUT /api/comments/like/:id
// @access  Private
exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check if the comment has already been liked by this user
    if (comment.likes.some(like => like.toString() === req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Comment already liked'
      });
    }
    
    comment.likes.unshift(req.user.id);
    await comment.save();
    
    res.status(200).json({
      success: true,
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
};

// @desc    Unlike a comment
// @route   PUT /api/comments/unlike/:id
// @access  Private
exports.unlikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check if the comment has not been liked by this user
    if (!comment.likes.some(like => like.toString() === req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Comment has not yet been liked'
      });
    }
    
    // Remove the like
    comment.likes = comment.likes.filter(like => like.toString() !== req.user.id);
    await comment.save();
    
    res.status(200).json({
      success: true,
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
};
