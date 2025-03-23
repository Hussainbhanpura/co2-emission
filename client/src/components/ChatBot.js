import React, { useState, useRef, useEffect } from 'react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your CO2 Emission Assistant. Ask me anything about reducing carbon footprint, pollution, or sustainable practices!', done: true }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentlyTyping, setCurrentlyTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target) && 
          !event.target.classList.contains('chat-toggle-btn')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to simulate typing effect
  const simulateTypingEffect = (content, messageIndex) => {
    setCurrentlyTyping(true);
    let i = 0;
    const fullContent = content;
    const typingSpeed = 15; // milliseconds per character
    
    // Start with empty content
    setMessages(prev => {
      const updated = [...prev];
      updated[messageIndex] = { ...updated[messageIndex], content: '', done: false };
      return updated;
    });
    
    const typingInterval = setInterval(() => {
      if (i < fullContent.length) {
        setMessages(prev => {
          const updated = [...prev];
          updated[messageIndex] = { 
            ...updated[messageIndex], 
            content: fullContent.substring(0, i + 1)
          };
          return updated;
        });
        i++;
      } else {
        clearInterval(typingInterval);
        setMessages(prev => {
          const updated = [...prev];
          updated[messageIndex] = { ...updated[messageIndex], done: true };
          return updated;
        });
        setCurrentlyTyping(false);
      }
    }, typingSpeed);
  };

  // Format the message content with proper line breaks and styling
  const formatMessageContent = (content) => {
    // Replace newlines with <br> tags
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const cleanResponse = (response) => {
    return response
      .replace(/[{}]/g, '')
      .replace(/\/body/g, '')
      .trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || currentlyTyping) return;

    // Add user message to chat
    const userMessage = { role: 'user', content: inputMessage, done: true };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Using the provided API key for OpenRouter
      const OPENROUTER_API_KEY = "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";
      
      const url = "https://openrouter.ai/api/v1/chat/completions";
      const options = {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "google/gemini-2.0-flash-thinking-exp:free",
          "messages": [
            {
              "role": "system",
              "content": "You are a helpful assistant focused on environmental topics. Provide very short answers (1-2 sentences max) about reducing carbon footprint and sustainable practices. Never use curly braces, /body, or other special formatting. Only provide plain text responses."
            },
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            { role: 'user', content: inputMessage }
          ]
        })
      };

      const response = await fetch(url, options);
      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        // Add assistant message with full content
        const assistantMessage = { 
          role: 'assistant', 
          content: cleanResponse(data.choices[0].message.content), 
          done: true 
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching from LLM API:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later.',
        done: true
      }]);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat toggle button */}
      <button 
        className="chat-toggle-btn bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat container */}
      {isOpen && (
        <div 
          ref={chatContainerRef}
          className="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
          style={{ height: '500px', maxHeight: 'calc(100vh - 100px)' }}
        >
          {/* Chat header */}
          <div className="bg-green-600 text-white p-4">
            <h3 className="font-medium">CO2 Emission Assistant</h3>
            <p className="text-xs opacity-75">Ask me about reducing your carbon footprint</p>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-3/4 rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {formatMessageContent(message.content)}
                  {!message.done && message.role === 'assistant' && (
                    <span className="inline-block ml-1 animate-pulse">▌</span>
                  )}
                </div>
              </div>
            ))}
            {isLoading && !currentlyTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-3/4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <form onSubmit={handleSubmit} className="border-t p-4 flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading || currentlyTyping}
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-r-lg hover:bg-green-700 disabled:opacity-50"
              disabled={isLoading || currentlyTyping || !inputMessage.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
