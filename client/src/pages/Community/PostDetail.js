import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCommunity } from '../../contexts/CommunityContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { toast } from 'react-toastify';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    post, 
    comments, 
    loading, 
    fetchPost, 
    fetchComments, 
    likePost, 
    unlikePost,
    addComment,
    updateComment,
    deleteComment,
    deletePost
  } = useCommunity();
  const [commentText, setCommentText] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const postData = await fetchPost(id);
      if (postData) {
        await fetchComments(id);
      }
    };
    loadData();
  }, [fetchPost, fetchComments, id]);

  const handleLike = async () => {
    if (!post) return;
    
    const isLiked = post.likes.includes(user._id);
    if (isLiked) {
      await unlikePost(post._id);
    } else {
      await likePost(post._id);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    await addComment(post._id, commentText);
    setCommentText('');
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditCommentText(comment.content);
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    if (!editCommentText.trim()) return;
    
    await updateComment(editingComment, editCommentText);
    setEditingComment(null);
    setEditCommentText('');
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(commentId, post._id);
    }
  };

  const handleDeletePost = async () => {
    const success = await deletePost(post._id);
    if (success) {
      navigate('/community');
    }
  };

  if (loading && !post) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-10">
            <h2 className="text-2xl text-gray-600">Post not found</h2>
            <Link to="/community" className="text-blue-600 hover:underline mt-4 inline-block">
              Back to Community
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/community" className="text-blue-600 hover:underline flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back to Community
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Post Details */}
          <div className="w-full lg:w-1/2">
            <Card className="mb-4 lg:mb-0">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center mb-2">
                    <img 
                      src={post.user?.avatar || 'https://via.placeholder.com/40'} 
                      alt={post.user?.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium">{post.user?.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {user && post.user && user._id === post.user._id && (
                    <div className="flex space-x-2">
                      <Link to={`/community/edit/${post._id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-bold mt-2">{post.title}</h1>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line mb-4">{post.content}</p>
                
                {post.image && (
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full object-contain my-4 rounded"
                  />
                )}
                
                {post.carbonReduction > 0 && (
                  <div className="my-4 bg-green-50 p-3 rounded-md">
                    <p className="text-green-700 font-medium flex items-center">
                      <span className="text-2xl mr-2">🌱</span>
                      Reduced {post.carbonReduction} kg of CO2
                    </p>
                  </div>
                )}
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="border-t pt-4">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={handleLike}
                    className="flex items-center text-gray-600 hover:text-blue-600"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-6 w-6 mr-1 ${post.likes.includes(user._id) ? 'text-blue-600 fill-blue-600' : ''}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" 
                      />
                    </svg>
                    {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
                  </button>
                  
                  <div className="flex items-center text-gray-600">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 mr-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                      />
                    </svg>
                    {post.commentsCount} {post.commentsCount === 1 ? 'Comment' : 'Comments'}
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Right Side - Comments */}
          <div className="w-full lg:w-1/2">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <h2 className="text-xl font-bold">Comments ({comments.length})</h2>
              </CardHeader>
              
              <CardContent className="flex-grow overflow-y-auto max-h-[calc(100vh-300px)]">
                {loading && comments.length === 0 ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <Card key={comment._id} className={comment.parentComment ? 'ml-12' : ''}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start">
                              <img 
                                src={comment.user?.avatar || 'https://via.placeholder.com/32'} 
                                alt={comment.user?.name}
                                className="w-8 h-8 rounded-full mr-2"
                              />
                              <div>
                                <div className="flex items-center">
                                  <p className="font-medium text-sm">{comment.user?.name}</p>
                                  <p className="text-xs text-gray-500 ml-2">
                                    {new Date(comment.createdAt).toLocaleString()}
                                  </p>
                                  {comment.isEdited && (
                                    <p className="text-xs text-gray-500 ml-2">(edited)</p>
                                  )}
                                </div>
                                
                                {editingComment === comment._id ? (
                                  <form onSubmit={handleUpdateComment} className="mt-2 flex gap-2">
                                    <Input
                                      value={editCommentText}
                                      onChange={(e) => setEditCommentText(e.target.value)}
                                      className="flex-grow"
                                      required
                                    />
                                    <Button type="submit" size="sm">Save</Button>
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setEditingComment(null)}
                                    >
                                      Cancel
                                    </Button>
                                  </form>
                                ) : (
                                  <p className="text-gray-700 mt-1">{comment.content}</p>
                                )}
                              </div>
                            </div>
                            
                            {user && comment.user && user._id === comment.user._id && !editingComment && (
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEditComment(comment)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDeleteComment(comment._id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="border-t pt-4">
                <form onSubmit={handleAddComment} className="w-full">
                  <div className="flex gap-2">
                    <Input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-grow"
                      required
                    />
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </form>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeletePost}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
