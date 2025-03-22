import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCommunity } from '../../contexts/CommunityContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'react-toastify';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { post, loading, fetchPost, updatePost } = useCommunity();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    tags: '',
    carbonReduction: 0
  });

  useEffect(() => {
    const loadPost = async () => {
      const postData = await fetchPost(id);
      if (postData) {
        setFormData({
          title: postData.title || '',
          content: postData.content || '',
          image: postData.image || '',
          tags: postData.tags ? postData.tags.join(', ') : '',
          carbonReduction: postData.carbonReduction || 0
        });
      }
    };
    loadPost();
  }, [fetchPost, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format tags as array
    const tagsArray = formData.tags
      ? formData.tags.split(',').map(tag => tag.trim())
      : [];
    
    // Convert carbonReduction to number
    const carbonReduction = parseFloat(formData.carbonReduction) || 0;
    
    const postData = {
      ...formData,
      tags: tagsArray,
      carbonReduction
    };
    
    const success = await updatePost(id, postData);
    if (success) {
      navigate(`/community/post/${id}`);
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to={`/community/post/${id}`} className="text-blue-600 hover:underline flex items-center">
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
            Back to Post
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Post</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="What's your achievement?"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Share your experience..."
                  className="w-full min-h-[150px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="recycling, solar, transportation"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="carbonReduction">Carbon Reduction (kg)</Label>
                <Input
                  id="carbonReduction"
                  name="carbonReduction"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.carbonReduction}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/community/post/${id}`)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Updating...
                  </>
                ) : 'Update Post'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditPost;
