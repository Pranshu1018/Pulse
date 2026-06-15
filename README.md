# 🚀 Socially - Mini Social Post Application

A production-ready, modern social media application inspired by TaskPlanet's social feed. Built for the 3W Full Stack Internship Assignment with enterprise-level code quality and architecture.

![Tech Stack](https://img.shields.io/badge/React-18.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Material UI](https://img.shields.io/badge/UI-Material%20UI-007FFF)

---

## ✨ Features

### 🔐 Authentication System
- Secure JWT-based authentication
- Password hashing with bcryptjs (salt rounds: 12)
- Protected routes with middleware
- Automatic token refresh
- Session persistence

### 👤 User Management
- User registration with validation
- Unique username system
- Email verification
- Profile management
- Avatar support

### 📝 Post Creation
- Text-only posts
- Image-only posts
- Combined text + image posts
- Image upload via Cloudinary
- Image preview before posting
- Real-time post updates

### 🌐 Social Feed
- Infinite scroll pagination
- Optimized loading with skeleton screens
- Real-time like/unlike
- Comment system
- Post deletion (owner only)
- Search functionality
- Feed filters (All Posts, For You, Most Liked, Most Commented)

### ❤️ Like System
- Instant UI feedback (optimistic updates)
- Prevent duplicate likes
- Track users who liked
- Real-time like count

### 💬 Comment System
- Bottom sheet modal UI
- Add comments
- View all comments
- Comment count tracking
- Real-time updates

### 📱 Responsive Design
- Mobile-first approach
- Tablet optimized
- Desktop optimized
- TaskPlanet-inspired UI
- Smooth animations

---

## 🏗️ Architecture

### Frontend Structure

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── api/                  # API integration layer
│   │   ├── axios.js          # Axios instance with interceptors
│   │   ├── auth.api.js       # Auth API calls
│   │   └── post.api.js       # Post API calls
│   ├── assets/               # Images, icons
│   ├── components/           # Reusable components
│   │   ├── CreatePost/       # Post creation card
│   │   ├── PostCard/         # Post display card
│   │   ├── CommentModal/     # Comment bottom sheet
│   │   ├── PostSkeleton/     # Loading skeleton
│   │   ├── EmptyFeed/        # Empty state
│   │   └── FullScreenLoader/ # Global loader
│   ├── context/              # React Context
│   │   └── AuthContext.jsx   # Authentication state
│   ├── hooks/                # Custom hooks
│   │   └── usePosts.js       # Post management logic
│   ├── layouts/              # Layout components
│   │   └── MainLayout.jsx    # Main app layout
│   ├── pages/                # Page components
│   │   ├── FeedPage/         # Main feed
│   │   ├── LoginPage/        # Login
│   │   └── SignupPage/       # Registration
│   ├── theme/                # MUI theme
│   │   └── theme.js          # Custom theme config
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
└── package.json
```

### Backend Structure

```
backend/
├── config/
│   └── cloudinary.js         # Cloudinary configuration
├── controllers/
│   ├── auth.controller.js    # Auth logic
│   ├── post.controller.js    # Post logic
│   └── user.controller.js    # User logic
├── middleware/
│   ├── auth.middleware.js    # JWT verification
│   ├── error.middleware.js   # Global error handler
│   └── validate.middleware.js # Request validation
├── models/
│   ├── user.model.js         # User schema
│   └── post.model.js         # Post schema
├── routes/
│   ├── auth.routes.js        # Auth endpoints
│   ├── post.routes.js        # Post endpoints
│   └── user.routes.js        # User endpoints
├── utils/
│   ├── apiResponse.js        # Standard responses
│   └── jwt.utils.js          # JWT utilities
├── validators/
│   ├── auth.validators.js    # Auth validation rules
│   └── post.validators.js    # Post validation rules
├── server.js                 # Entry point
└── package.json
```

---

## 🗄️ Database Design

### Users Collection

```javascript
{
  name: String,              // Full name (2-50 chars)
  username: String,          // Unique username (3-30 chars, lowercase)
  email: String,             // Unique email
  password: String,          // Bcrypt hashed password
  avatar: String,            // Cloudinary URL (optional)
  bio: String,               // User bio (optional, max 200 chars)
  createdAt: Date,           // Auto-generated
  updatedAt: Date            // Auto-generated
}
```

**Indexes:**
- `username`: Unique
- `email`: Unique

### Posts Collection

```javascript
{
  author: ObjectId,          // Ref to User
  authorName: String,        // Denormalized for performance
  authorUsername: String,    // Denormalized for performance
  authorAvatar: String,      // Denormalized for performance
  content: String,           // Post text (max 2000 chars)
  image: String,             // Cloudinary URL (optional)
  likes: [ObjectId],         // Array of user IDs who liked
  likeCount: Number,         // Cached count for performance
  comments: [{               // Embedded comments
    user: ObjectId,          // Ref to User
    username: String,        // Denormalized
    avatar: String,          // Denormalized
    text: String,            // Comment text (max 500 chars)
    createdAt: Date
  }],
  commentCount: Number,      // Cached count for performance
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `author`: For user's posts
- `createdAt`: For chronological sorting
- `likeCount`: For "Most Liked" filter
- `commentCount`: For "Most Commented" filter

**Why this design?**
- **Denormalization**: Faster reads, fewer database joins
- **Embedded comments**: Atomic updates, better performance
- **Cached counts**: Avoid expensive array length calculations
- **Indexes**: Optimized query performance

---

## 🔌 API Endpoints

### Authentication

#### POST `/api/auth/signup`
Register a new user

**Request:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "_id": "...", "name": "John Doe", "username": "johndoe", "email": "john@example.com" },
    "token": "jwt.token.here"
  }
}
```

#### POST `/api/auth/login`
Login user

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "_id": "...", "name": "John Doe", "username": "johndoe" },
    "token": "jwt.token.here"
  }
}
```

#### GET `/api/auth/me`
Get current user (Protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "John Doe", "username": "johndoe", "email": "john@example.com" }
  }
}
```

### Posts

#### GET `/api/posts`
Get all posts with pagination

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search query (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

#### POST `/api/posts`
Create a new post (Protected)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `content`: Post text (optional)
- `image`: Image file (optional)

**Note:** At least one field required

**Response:**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "post": { "_id": "...", "content": "Hello!", "image": "https://...", "likeCount": 0, "commentCount": 0 }
  }
}
```

#### GET `/api/posts/:id`
Get single post with full comments

**Response:**
```json
{
  "success": true,
  "data": {
    "post": {
      "_id": "...",
      "content": "Hello!",
      "comments": [{ "username": "jane", "text": "Nice post!", "createdAt": "..." }],
      "likeCount": 5,
      "commentCount": 3
    }
  }
}
```

#### POST `/api/posts/:id/like`
Toggle like on post (Protected)

**Response:**
```json
{
  "success": true,
  "message": "Post liked" | "Post unliked",
  "data": {
    "isLiked": true,
    "likeCount": 6
  }
}
```

#### POST `/api/posts/:id/comments`
Add comment to post (Protected)

**Request:**
```json
{
  "text": "Great post!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Comment added",
  "data": {
    "comment": {
      "_id": "...",
      "user": "...",
      "username": "johndoe",
      "text": "Great post!",
      "createdAt": "..."
    }
  }
}
```

#### DELETE `/api/posts/:id`
Delete post (Protected - Owner only)

**Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

## 🔒 Security Features

### Backend Security

1. **Helmet.js** - Security headers
   - XSS Protection
   - Content Security Policy
   - Frame Options
   - HSTS

2. **Rate Limiting**
   - Max 100 requests per 15 minutes per IP
   - Prevents brute force attacks
   - DDoS protection

3. **Input Validation**
   - express-validator
   - Sanitization
   - Type checking
   - Length limits

4. **MongoDB Injection Protection**
   - express-mongo-sanitize
   - Removes `$` and `.` from inputs

5. **XSS Protection**
   - xss-clean middleware
   - Sanitizes user inputs

6. **JWT Security**
   - Short expiration (7 days)
   - Secure secret keys
   - Token verification on every protected route

7. **Password Security**
   - Bcrypt hashing (12 rounds)
   - Never stored in plain text
   - Password never returned in responses

8. **CORS Configuration**
   - Whitelist allowed origins
   - Credentials support

### Frontend Security

1. **Token Management**
   - Stored in localStorage
   - Attached to every request
   - Auto-removed on 401

2. **Protected Routes**
   - Route guards
   - Redirect unauthorized users

3. **Input Validation**
   - Client-side validation
   - Maximum length limits
   - Type checking

---

## ⚡ Optimizations

### Frontend Optimizations

1. **Code Splitting**
   - Lazy-loaded pages
   - Route-based splitting
   - Reduced initial bundle size

2. **React Optimization**
   - `React.memo()` on PostCard
   - `useCallback` for functions
   - `useMemo` where needed

3. **Image Optimization**
   - Lazy loading
   - Preview before upload
   - Size limits (5MB)

4. **Infinite Scroll**
   - Intersection Observer API
   - Pagination
   - Smooth loading

5. **Optimistic Updates**
   - Instant like feedback
   - Rollback on error

6. **Debounced Search**
   - 400ms delay
   - Reduces API calls

### Backend Optimizations

1. **Database Optimizations**
   - Indexes on frequently queried fields
   - Denormalized data for faster reads
   - Cached counts

2. **Pagination**
   - Limit results per page
   - Skip-based pagination

3. **Lean Queries**
   - MongoDB lean() for read-only data
   - Reduced memory usage

4. **Error Handling**
   - Global error middleware
   - Consistent error responses

---

## 🚀 Deployment Guide

### Prerequisites

- Node.js 16+
- MongoDB Atlas account
- Cloudinary account
- Vercel account (frontend)
- Render account (backend)

### Backend Deployment (Render)

1. **Create MongoDB Atlas Database**
   ```
   1. Go to mongodb.com/atlas
   2. Create a cluster
   3. Create database user
   4. Whitelist IP: 0.0.0.0/0
   5. Copy connection string
   ```

2. **Setup Cloudinary**
   ```
   1. Go to cloudinary.com
   2. Sign up / Login
   3. Copy: Cloud Name, API Key, API Secret
   ```

3. **Deploy to Render**
   ```
   1. Push code to GitHub
   2. Go to render.com
   3. New > Web Service
   4. Connect repository
   5. Name: socially-backend
   6. Environment: Node
   7. Build: npm install
   8. Start: npm start
   9. Add environment variables (see below)
   10. Deploy
   ```

4. **Environment Variables on Render**
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<generate-strong-secret>
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=<your-cloud-name>
   CLOUDINARY_API_KEY=<your-api-key>
   CLOUDINARY_API_SECRET=<your-api-secret>
   FRONTEND_URL=https://your-app.vercel.app
   ```

### Frontend Deployment (Vercel)

1. **Deploy to Vercel**
   ```
   1. Push code to GitHub
   2. Go to vercel.com
   3. New Project
   4. Import repository
   5. Root Directory: frontend
   6. Framework: Vite
   7. Add environment variables
   8. Deploy
   ```

2. **Environment Variables on Vercel**
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```

3. **Update Backend CORS**
   - Add your Vercel URL to CORS whitelist
   - Update FRONTEND_URL in Render environment

---

## 🛠️ Local Development

### 1. Clone Repository

```bash
git clone <repository-url>
cd socially
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials

# Start server
npm run dev
```

**backend/.env**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/socially
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env file
cp .env.example .env

# Start dev server
npm run dev
```

**frontend/.env**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Access Application

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 📊 Testing

### Manual Testing Checklist

#### Authentication
- [ ] Sign up with valid credentials
- [ ] Sign up with existing email (should fail)
- [ ] Sign up with invalid email (should fail)
- [ ] Login with correct credentials
- [ ] Login with wrong password (should fail)
- [ ] Auto-redirect when logged in
- [ ] Token persistence after refresh
- [ ] Logout functionality

#### Posts
- [ ] Create text-only post
- [ ] Create image-only post
- [ ] Create post with text + image
- [ ] Try creating empty post (should fail)
- [ ] View posts in feed
- [ ] Infinite scroll loading
- [ ] Delete own post
- [ ] Cannot delete others' posts

#### Likes
- [ ] Like a post
- [ ] Unlike a post
- [ ] Like count updates
- [ ] Optimistic UI update

#### Comments
- [ ] Open comment modal
- [ ] View existing comments
- [ ] Add new comment
- [ ] Comment count updates
- [ ] Empty comment validation

#### Responsive Design
- [ ] Mobile view (< 768px)
- [ ] Tablet view (768px - 1024px)
- [ ] Desktop view (> 1024px)
- [ ] Bottom navigation on mobile
- [ ] Proper layout on all screens

---

## 🎨 UI/UX Features

### Design Philosophy
- **TaskPlanet-inspired**: Modern, clean, professional
- **Mobile-first**: Optimized for small screens
- **Smooth animations**: 60 FPS transitions
- **Intuitive**: Familiar social media patterns

### Color Palette
- **Primary Blue**: #1565C0
- **Secondary Orange**: #F5A623
- **Background**: #F0F2F8
- **Text Dark**: #1A1A2E
- **Text Light**: #64748B
- **Border**: #E2E8F0

### Typography
- **Font**: Inter, Segoe UI, System UI
- **Weights**: 400, 600, 700, 800

### Components
- Rounded corners (12-24px)
- Subtle shadows
- Smooth hover states
- Loading skeletons
- Toast notifications

---

## 🏆 Bonus Features Implemented

### High-Impact Features ✅
1. **Infinite Scroll** - Seamless content loading
2. **Optimistic Updates** - Instant UI feedback
3. **Search Functionality** - Find posts easily
4. **Image Upload** - Cloudinary integration
5. **Responsive Design** - Perfect on all devices

### Medium-Impact Features ✅
1. **Skeleton Loaders** - Better loading UX
2. **Error Handling** - User-friendly messages
3. **Form Validation** - Client + Server side
4. **Protected Routes** - Secure navigation

### Potential Future Features 🚧
1. **Dark Mode** - Theme toggle
2. **User Profiles** - View user posts
3. **Post Editing** - Edit your posts
4. **Real-time Notifications** - Socket.IO
5. **Bookmarking** - Save favorite posts
6. **Image Gallery** - Multiple images per post
7. **Hashtags** - Tag categorization
8. **@Mentions** - User tagging
9. **Follow System** - Follow other users
10. **Private Messages** - Direct messaging

---

## 📈 Performance Metrics

### Lighthouse Scores (Target)
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### Load Times (Target)
- Initial Load: < 3s
- Time to Interactive: < 5s
- First Contentful Paint: < 1.5s

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Solution:** Update FRONTEND_URL in backend .env

### Issue: Images not uploading
**Solution:** Check Cloudinary credentials

### Issue: Token expired
**Solution:** Login again, token is valid for 7 days

### Issue: Posts not loading
**Solution:** Check MongoDB connection string

### Issue: Infinite scroll not working
**Solution:** Ensure page parameter is being sent

---

## 📚 Tech Stack Details

### Frontend
- **React 18.2** - UI library
- **React Router 6** - Client-side routing
- **Material-UI 5** - Component library
- **Axios** - HTTP client
- **date-fns** - Date formatting
- **react-hot-toast** - Toast notifications
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image hosting
- **Multer** - File uploads
- **Helmet** - Security headers
- **Morgan** - Logging

---

## 👨‍💻 Code Quality

### Standards Followed
- ✅ Clean Code principles
- ✅ DRY (Don't Repeat Yourself)
- ✅ SOLID principles
- ✅ Separation of concerns
- ✅ Error handling
- ✅ Input validation
- ✅ Code comments
- ✅ Consistent naming
- ✅ Proper indentation
- ✅ No console errors

### Best Practices
- Environment variables for secrets
- JWT for stateless auth
- Password hashing
- Input sanitization
- Error middleware
- API versioning ready
- CORS configured
- Rate limiting
- Database indexing
- Optimistic updates

---

## 📝 Interview Preparation

### Questions Recruiters Might Ask

**1. Why did you choose this tech stack?**
- React: Component reusability, virtual DOM, large ecosystem
- Material-UI: Production-ready components, accessibility
- Express: Lightweight, flexible, middleware support
- MongoDB: Flexible schema, scalability, JSON-like documents
- JWT: Stateless, scalable authentication

**2. How did you handle authentication?**
- JWT tokens stored in localStorage
- Password hashing with bcrypt (12 rounds)
- Protected routes with middleware
- Token verification on every request
- Auto-logout on token expiry

**3. How did you optimize performance?**
- Code splitting (lazy loading)
- React.memo for expensive components
- Infinite scroll pagination
- Debounced search
- Image lazy loading
- Database indexing
- Optimistic updates

**4. How did you ensure security?**
- Helmet for HTTP headers
- Rate limiting
- Input validation & sanitization
- MongoDB injection protection
- XSS protection
- CORS configuration
- Password never stored in plain text

**5. How would you scale this?**
- Implement Redis caching
- Add CDN for images
- Horizontal scaling with load balancer
- Database sharding
- Microservices architecture
- WebSocket for real-time features

**6. What challenges did you face?**
- Optimistic UI updates with error rollback
- Infinite scroll with intersection observer
- Image upload with Cloudinary
- Real-time like count synchronization
- Responsive design across devices

---

## 🤝 Contributing

This is an internship assignment project. However, suggestions are welcome!

---

## 📄 License

This project is for educational purposes as part of the 3W Full Stack Internship Assignment.

---

## 🙏 Acknowledgments

- TaskPlanet app for design inspiration
- Material-UI team for excellent component library
- 3W for the internship opportunity

---

## 📞 Contact

**Developer:** [Your Name]
**Email:** [Your Email]
**GitHub:** [Your GitHub]
**LinkedIn:** [Your LinkedIn]

---

**⭐ Star this repo if you found it helpful!**

**Built with ❤️ for the 3W Full Stack Internship Assignment**
