import React, { useState } from 'react';
import { useCommunity } from '../../contexts/CommunityContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const AskShareModal = ({ isOpen, onClose }) => {
  const { createPost, loading } = useCommunity();
  const [activeTab, setActiveTab] = useState("post");
  
  // Question form state
  const [questionData, setQuestionData] = useState({
    question: ''
  });
  
  // Post form state
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    image: '',
    tags: ''
  });

  const handleQuestionChange = (e) => {
    setQuestionData({
      ...questionData,
      [e.target.name]: e.target.value
    });
  };

  const handlePostChange = (e) => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    
    // Format the question as a post with a special tag
    const formattedPost = {
      title: questionData.question,
      content: questionData.question,
      tags: ['question'],
      isQuestion: true
    };
    
    const success = await createPost(formattedPost);
    if (success) {
      onClose();
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    
    // Format tags as array
    const tagsArray = postData.tags
      ? postData.tags.split(',').map(tag => tag.trim())
      : [];
    
    const formattedPost = {
      ...postData,
      tags: tagsArray
    };
    
    const success = await createPost(formattedPost);
    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>What do you want to ask or share?</CardTitle>
        </CardHeader>
        
        <Tabs defaultValue="post" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="question">Add Question</TabsTrigger>
            <TabsTrigger value="post">Create Post</TabsTrigger>
          </TabsList>
          
          <TabsContent value="question">
            <form onSubmit={handleSubmitQuestion}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="question">What do you want to ask?</Label>
                  <textarea
                    id="question"
                    name="question"
                    value={questionData.question}
                    onChange={handleQuestionChange}
                    placeholder="Type your question here..."
                    className="w-full min-h-[100px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
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
                  className="bg-green-50 hover:bg-green-100 text-green-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Submitting...
                    </>
                  ) : 'Submit Question'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="post">
            <form onSubmit={handleSubmitPost}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={postData.title}
                    onChange={handlePostChange}
                    placeholder="Enter a title for your post"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <textarea
                    id="content"
                    name="content"
                    value={postData.content}
                    onChange={handlePostChange}
                    placeholder="Share your thoughts, ideas, or experiences..."
                    className="w-full min-h-[100px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL (optional)</Label>
                  <Input
                    id="image"
                    name="image"
                    value={postData.image}
                    onChange={handlePostChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={postData.tags}
                    onChange={handlePostChange}
                    placeholder="environment, sustainability, tips"
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
                  className="bg-green-50 hover:bg-green-100 text-green-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Posting...
                    </>
                  ) : 'Submit Post'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AskShareModal;
