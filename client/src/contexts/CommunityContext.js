import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import { communityApiService } from '../utils/apiClient';

const CommunityContext = createContext();

export const useCommunity = () => useContext(CommunityContext);

export const CommunityProvider = ({ children }) => {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Add a cache to prevent duplicate API calls
  const fetchCache = useRef({});

  // Fetch all posts with rate limiting
  const fetchPosts = useCallback(async (page = 1, limit = 10) => {
    // Generate a cache key for this specific request
    const cacheKey = `posts_${page}_${limit}`;
    
    // If we have recent cached data, return it without making a new request
    if (fetchCache.current[cacheKey]) {
      console.log('Using cached data for page', page);
      return fetchCache.current[cacheKey];
    }
    
    // Check if we have a timestamp for the last fetch for this page
    const lastFetchTime = fetchCache.current[`time_${cacheKey}`] || 0;
    const now = Date.now();
    
    // Implement rate limiting - only allow a fetch once every 5 seconds
    if (now - lastFetchTime < 5000) {
      console.log('Rate limiting fetch for page', page);
      return fetchCache.current[cacheKey] || { data: [], pagination: { count: 0 } };
    }
    
    // Update the timestamp for this request
    fetchCache.current[`time_${cacheKey}`] = now;
    
    setLoading(true);
    try {
      console.log('Actually fetching data for page', page);
      const res = await communityApiService.getPosts(page, limit);
      setPosts(res.data.data);
      
      // Cache the result
      fetchCache.current[cacheKey] = res.data;
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching posts');
      toast.error(err.response?.data?.message || 'Error fetching posts');
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setPosts, setError]);

  // Fetch single post
  const fetchPost = async (id) => {
    setLoading(true);
    try {
      const res = await communityApiService.getPostById(id);
      setPost(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching post');
      toast.error(err.response?.data?.message || 'Error fetching post');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new post
  const createPost = async (postData) => {
    setLoading(true);
    try {
      const res = await communityApiService.createPost(postData);
      setPosts([res.data.data, ...posts]);
      toast.success('Post created successfully');
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating post');
      toast.error(err.response?.data?.message || 'Error creating post');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update a post
  const updatePost = async (id, postData) => {
    setLoading(true);
    try {
      const res = await communityApiService.updatePost(id, postData);
      setPosts(posts.map(p => p._id === id ? res.data.data : p));
      if (post && post._id === id) {
        setPost(res.data.data);
      }
      toast.success('Post updated successfully');
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating post');
      toast.error(err.response?.data?.message || 'Error updating post');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a post
  const deletePost = async (id) => {
    setLoading(true);
    try {
      await communityApiService.deletePost(id);
      setPosts(posts.filter(p => p._id !== id));
      toast.success('Post deleted successfully');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting post');
      toast.error(err.response?.data?.message || 'Error deleting post');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Like a post
  const likePost = async (id) => {
    try {
      const res = await communityApiService.likePost(id);
      setPosts(posts.map(p => p._id === id ? { ...p, likes: res.data.data } : p));
      if (post && post._id === id) {
        setPost({ ...post, likes: res.data.data });
      }
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error liking post');
      return null;
    }
  };

  // Unlike a post
  const unlikePost = async (id) => {
    try {
      const res = await communityApiService.unlikePost(id);
      setPosts(posts.map(p => p._id === id ? { ...p, likes: res.data.data } : p));
      if (post && post._id === id) {
        setPost({ ...post, likes: res.data.data });
      }
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error unliking post');
      return null;
    }
  };

  // Fetch comments for a post
  const fetchComments = async (postId) => {
    setLoading(true);
    try {
      const res = await communityApiService.getComments(postId);
      setComments(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching comments');
      toast.error(err.response?.data?.message || 'Error fetching comments');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add a comment
  const addComment = async (postId, content, parentComment = null) => {
    try {
      const res = await communityApiService.addComment(postId, content, parentComment);
      setComments([res.data.data, ...comments]);
      // Update comment count in post
      if (post && post._id === postId) {
        setPost({ ...post, commentCount: post.commentCount + 1 });
      }
      setPosts(posts.map(p => p._id === postId ? { ...p, commentCount: p.commentCount + 1 } : p));
      toast.success('Comment added successfully');
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding comment');
      return null;
    }
  };

  // Update a comment
  const updateComment = async (id, content) => {
    try {
      const res = await communityApiService.updateComment(id, content);
      setComments(comments.map(c => c._id === id ? res.data.data : c));
      toast.success('Comment updated successfully');
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating comment');
      return null;
    }
  };

  // Delete a comment
  const deleteComment = async (id, postId) => {
    try {
      await communityApiService.deleteComment(id);
      setComments(comments.filter(c => c._id !== id));
      // Update comment count in post
      if (post && post._id === postId) {
        setPost({ ...post, commentCount: post.commentCount - 1 });
      }
      setPosts(posts.map(p => p._id === postId ? { ...p, commentCount: p.commentCount - 1 } : p));
      toast.success('Comment deleted successfully');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting comment');
      return false;
    }
  };

  return (
    <CommunityContext.Provider
      value={{
        posts,
        post,
        comments,
        loading,
        error,
        fetchPosts,
        fetchPost,
        createPost,
        updatePost,
        deletePost,
        likePost,
        unlikePost,
        fetchComments,
        addComment,
        updateComment,
        deleteComment
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export default CommunityContext;
