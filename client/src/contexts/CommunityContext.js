import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CommunityContext = createContext();

export const useCommunity = () => useContext(CommunityContext);

export const CommunityProvider = ({ children }) => {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configure axios with auth token
  const api = axios.create({
    baseURL: '/api/community',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add auth token to requests if available
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Fetch all posts
  const fetchPosts = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await api.get(`/posts?page=${page}&limit=${limit}`);
      setPosts(res.data.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching posts');
      toast.error(err.response?.data?.message || 'Error fetching posts');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch single post
  const fetchPost = async (id) => {
    setLoading(true);
    try {
      const res = await api.get(`/posts/${id}`);
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
      const res = await api.post('/posts', postData);
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
      const res = await api.put(`/posts/${id}`, postData);
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
      await api.delete(`/posts/${id}`);
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
      const res = await api.put(`/posts/like/${id}`);
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
      const res = await api.put(`/posts/unlike/${id}`);
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
      const res = await api.get(`/comments/${postId}`);
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
      const res = await api.post(`/comments/${postId}`, { content, parentComment });
      setComments([res.data.data, ...comments]);
      // Update comment count in post
      if (post && post._id === postId) {
        setPost({ ...post, commentsCount: post.commentsCount + 1 });
      }
      setPosts(posts.map(p => p._id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p));
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
      const res = await api.put(`/comments/${id}`, { content });
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
      await api.delete(`/comments/${id}`);
      setComments(comments.filter(c => c._id !== id));
      // Update comment count in post
      if (post && post._id === postId) {
        setPost({ ...post, commentsCount: post.commentsCount - 1 });
      }
      setPosts(posts.map(p => p._id === postId ? { ...p, commentsCount: p.commentsCount - 1 } : p));
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
