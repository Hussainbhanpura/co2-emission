import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCommunity } from '../../contexts/CommunityContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import CreatePostModal from './CreatePostModal';
import { toast } from 'react-toastify';

const CommunityPage = () => {
  const { user } = useAuth();
  const { posts, loading, fetchPosts, likePost, unlikePost } = useCommunity();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Track if we've already loaded posts for a specific page
  const loadedPages = useRef({});
  // Prevent multiple fetch calls during component mounting/updating
  const isMounted = useRef(false);
  // Track the last fetch time
  const lastFetchTime = useRef(0);

  // Create a memoized function for loading posts that won't change on re-renders
  const loadPosts = useCallback(async (page) => {
    // Implement strict controls against excessive polling
    const now = Date.now();
    
    // Only fetch if:
    // 1. We haven't loaded this page before OR
    // 2. It's been at least 10 seconds since the last fetch
    if (!loadedPages.current[page] || (now - lastFetchTime.current > 10000)) {
      console.log('Fetching posts for page', page);
      lastFetchTime.current = now;
      
      const result = await fetchPosts(page);
      if (result && result.pagination) {
        setTotalPages(Math.ceil(result.count / 10));
      }
      
      // Mark this page as loaded
      loadedPages.current[page] = true;
    } else {
      console.log('Skipping fetch for page', page);
    }
  }, [fetchPosts]);

  // Use a separate effect for the initial mount to ensure we only fetch once
  useEffect(() => {
    if (!isMounted.current) {
      console.log('Initial page load');
      loadPosts(currentPage);
      isMounted.current = true;
    }
  }, [loadPosts, currentPage]);
  
  // This effect only runs when the page actually changes
  useEffect(() => {
    if (isMounted.current) {
      console.log('Page changed to', currentPage);
      loadPosts(currentPage);
    }
    
    return () => {
      // No cleanup needed
    };
  }, [currentPage, loadPosts]);

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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Community</h1>
          <Button onClick={() => setShowCreateModal(true)}>
            Share Your Progress
          </Button>
        </div>

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Card key={post._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center mb-2">
                        <img 
                          src={post.user.avatar || 'https://via.placeholder.com/40'} 
                          alt={post.user.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium">{post.user.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-gray-700 line-clamp-3">{post.content}</p>
                      {post.image && (
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-48 object-cover mt-3 rounded"
                        />
                      )}
                      {post.carbonReduction > 0 && (
                        <div className="mt-3 bg-green-50 p-2 rounded-md">
                          <p className="text-green-700 text-sm font-medium">
                            🌱 Reduced {post.carbonReduction} kg of CO2
                          </p>
                        </div>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
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
                    <CardFooter className="flex justify-between pt-2">
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => handleLike(post._id)}
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
                          {post.likes.length}
                        </button>
                        <Link 
                          to={`/community/post/${post._id}`}
                          className="flex items-center text-gray-600 hover:text-blue-600"
                        >
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
                          {post.commentsCount}
                        </Link>
                      </div>
                      <Link 
                        to={`/community/post/${post._id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Read more
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
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
                  <div className="flex items-center px-4">
                    Page {currentPage} of {totalPages}
                  </div>
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
          </>
        )}
      </div>

      {showCreateModal && (
        <CreatePostModal 
          isOpen={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
        />
      )}
    </div>
  );
};

export default CommunityPage;
