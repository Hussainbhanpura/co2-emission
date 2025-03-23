import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCommunity } from '../../contexts/CommunityContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import AskShareModal from './AskShareModal';
import ChatBot from '../../components/ChatBot';
import { toast } from 'react-toastify';

const CommunityPage = () => {
  const { user } = useAuth();
  const { posts, loading, fetchPosts, likePost, unlikePost, deletePost, fetchComments, addComment, deleteComment } = useCommunity();
  const [showAskShareModal, setShowAskShareModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [postComments, setPostComments] = useState({});
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loadedPages, setLoadedPages] = useState({});
  const isMounted = useRef(false);
  const lastFetchTime = useRef(0);

  useEffect(() => {
    const loadPosts = async () => {
      if (loadedPages[currentPage]) return;
      
      const result = await fetchPosts(currentPage);
      if (result) {
        setTotalPages(Math.ceil(result.pagination.count / 10));
        setLoadedPages(prev => ({ ...prev, [currentPage]: true }));
        
        // Fetch comments for each post
        result.data.forEach(async (post) => {
          const comments = await fetchComments(post._id);
          if (comments) {
            setPostComments(prev => ({
              ...prev,
              [post._id]: comments
            }));
          }
        });
      }
    };
    
    loadPosts();
  }, [currentPage, fetchPosts, loadedPages]);

  const handleLike = async (postId) => {
    const post = posts.find(p => p._id === postId);
    if (!post) return;

    const isLiked = post.likes.includes(user._id);
    if (isLiked) {
      await unlikePost(postId);
    } else {
      await likePost(postId);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDeleteClick = (postId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (postToDelete) {
      const success = await deletePost(postToDelete);
      if (success) {
        toast.success("Post deleted successfully");
      }
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const [commentText, setCommentText] = useState({});
  
  const handleCommentChange = (postId, text) => {
    setCommentText({
      ...commentText,
      [postId]: text
    });
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!commentText[postId] || !commentText[postId].trim()) return;
    
    try {
      const newComment = await addComment(postId, commentText[postId]);
      
      if (newComment) {
        setCommentText({
          ...commentText,
          [postId]: ''
        });
        
        const comments = await fetchComments(postId);
        if (comments) {
          setPostComments(prev => ({
            ...prev,
            [postId]: comments
          }));
        }
        
        toast.success("Comment added successfully");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      // Use the destructured deleteComment function directly
      const success = await deleteComment(commentId, postId);
      
      if (success) {
        toast.success("Comment deleted successfully");
        
        // Update the comments list by removing the deleted comment
        setPostComments(prev => ({
          ...prev,
          [postId]: prev[postId].filter(comment => comment._id !== commentId)
        }));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Community</h1>
          <div 
            className="w-full bg-green-50 rounded-lg p-2 cursor-pointer hover:bg-green-100 transition-colors"
            onClick={() => setShowAskShareModal(true)}
          >
            <Input
              className="w-full bg-white border-0 shadow-sm focus:ring-2 focus:ring-green-500 placeholder-gray-500"
              placeholder="What do you want to ask or share?"
              readOnly
              onClick={(e) => {
                e.stopPropagation();
                setShowAskShareModal(true);
              }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Recent Activities</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            {posts.length === 0 ? (
              <div className="text-center py-10">
                <h2 className="text-xl text-gray-600">No posts yet. Be the first to share!</h2>
              </div>
            ) : (
              <div className="flex flex-col space-y-6">
                {posts.map((post) => (
                  <Card key={post._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      {/* Left side - Post details */}
                      <div className="w-full md:w-1/2 p-4">
                        <div className="flex items-center mb-2">
                          <div>
                            <p className="font-medium">{post.user.name}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                          <p className="text-gray-700 mb-3">{post.content}</p>
                          {post.image && (
                            <img 
                              src={post.image} 
                              alt={post.title}
                              className="w-full h-48 object-cover mb-3 rounded"
                            />
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleLike(post._id);
                              }}
                              className="flex items-center text-gray-600 hover:text-blue-600"
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-5 w-5 mr-1 ${post.likes.includes(user._id) ? 'text-blue-600 fill-blue-600' : ''}`}
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
                              <span>{post.likes.length} Upvote{post.likes.length !== 1 && 's'}</span>
                            </button>
                            <div className="flex items-center text-gray-600">
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
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                                />
                              </svg>
                              <span>{post.commentsCount} Comment{post.commentsCount !== 1 && 's'}</span>
                            </div>
                          </div>
                          {user && post.user && user._id === post.user._id && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => handleDeleteClick(post._id, e)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 flex items-center"
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-4 w-4 mr-1" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                                />
                              </svg>
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Right side - Comments */}
                      <div className="w-full md:w-1/2 bg-gray-50 p-4 border-l">
                        <h4 className="font-medium mb-3">Comments</h4>
                        
                        {/* Comment input at the top */}
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddComment(e, post._id);
                          }} 
                          className="flex gap-2 mb-4"
                        >
                          <Input
                            value={commentText[post._id] || ''}
                            onChange={(e) => handleCommentChange(post._id, e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-grow text-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Button 
                            type="submit" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            Post
                          </Button>
                        </form>
                        
                        <div className="max-h-48 overflow-y-auto">
                          {postComments[post._id] && postComments[post._id].length > 0 ? (
                            <div className="space-y-2">
                              {postComments[post._id].slice(0, 3).map((comment) => (
                                <div key={comment._id} className="bg-white p-2 rounded shadow-sm">
                                  <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium">{comment.user?.name}</p>
                                    {user && comment.user && user._id === comment.user._id && (
                                      <button 
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleDeleteComment(post._id, comment._id);
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <svg 
                                          xmlns="http://www.w3.org/2000/svg" 
                                          className="h-4 w-4" 
                                          fill="none" 
                                          viewBox="0 0 24 24" 
                                          stroke="currentColor"
                                        >
                                          <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                                          />
                                        </svg>
                                      </button>
                                    )}
                                  </div>
                                  <p className="text-sm mt-1">{comment.content}</p>
                                </div>
                              ))}
                              {postComments[post._id].length > 3 && (
                                <div className="text-sm text-blue-600 hover:underline block text-center">
                                  View all {postComments[post._id].length} comments
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 text-center">No comments yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
        
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <AskShareModal isOpen={showAskShareModal} onClose={() => setShowAskShareModal(false)} />
      
      <div className="fixed bottom-4 right-4">
        <ChatBot />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
