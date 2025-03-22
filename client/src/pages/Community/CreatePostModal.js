import React, { useState } from 'react';
import { useCommunity } from '../../contexts/CommunityContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';

const CreatePostModal = ({ isOpen, onClose }) => {
  const { createPost, loading } = useCommunity();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    tags: '',
    carbonReduction: 0
  });

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
    
    const success = await createPost(postData);
    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Share Your Progress</CardTitle>
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
                className="w-full min-h-[100px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onClick={onClose}
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
                  Posting...
                </>
              ) : 'Post'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreatePostModal;
