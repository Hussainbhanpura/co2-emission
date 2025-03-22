# CO2 Emission Community Service

This is a standalone microservice for the CO2 Emission Monitoring application that handles community features such as posts, comments, and likes. It's designed to be scalable and can be developed independently from the main application.

## Features

- User profiles with carbon reduction tracking
- Community posts with carbon reduction achievements
- Comments and nested replies
- Like system for posts and comments
- Badge system for user achievements

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- RESTful API

## API Endpoints

### Posts

- `GET /api/posts` - Get all posts (paginated)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create a new post (auth required)
- `PUT /api/posts/:id` - Update post (auth required)
- `DELETE /api/posts/:id` - Delete post (auth required)
- `PUT /api/posts/like/:id` - Like a post (auth required)
- `PUT /api/posts/unlike/:id` - Unlike a post (auth required)

### Comments

- `GET /api/comments/:postId` - Get all comments for a post
- `POST /api/comments/:postId` - Add comment to post (auth required)
- `PUT /api/comments/:id` - Update comment (auth required)
- `DELETE /api/comments/:id` - Delete comment (auth required)
- `PUT /api/comments/like/:id` - Like a comment (auth required)
- `PUT /api/comments/unlike/:id` - Unlike a comment (auth required)

### Likes

- `GET /api/likes/post/:postId` - Get all users who liked a post
- `GET /api/likes/comment/:commentId` - Get all users who liked a comment

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and update the values
3. Install dependencies: `npm install`
4. Run in development mode: `npm run dev`
5. For production: `npm start`

## Integration with Main Application

This service is designed to be integrated with the main CO2 Emission application using express-http-proxy. This allows for:

- Independent scaling
- Separate development cycles
- Improved maintainability
- Better resource allocation

## Database Schema

The service uses MongoDB with the following main collections:

- Users
- Posts
- Comments

Each model includes features specific to carbon emission tracking and community engagement.
