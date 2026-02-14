# YourSpace - Implementation Progress

## Completed Features

### 1. Authentication & Security
- **Backend JWT Authentication**
  - Token generation with JwtTokenService (120 min expiry)
  - ClaimTypes mapping fix (NameIdentifier for user ID)  
  - Cookie + Authorization header support
  - ValidateLifetime disabled in development for debugging
- **Frontend Auth System**
  - AuthContext with localStorage persistence
  - Login/Register pages complete
  - Protected routes with redirect
  - UserMenu component with logout

### 2. User Management
- **User Discovery System**
  - `/profiles` - Search page with user list
  - `/profile/[username]` - Public profile viewing
  - GET /api/users endpoint (with JWT protection)
  - GET /api/users/{id} endpoint for details

### 3. Real-Time Messaging System
- **Backend (SignalR)**
  - `ChatHub` for WebSocket connections
  - Real-time message delivery (instant, no polling)
  - User groups for direct notifications (`user_{id}`)
  - Typing indicators support
  - Automatic reconnection handling
  
- **Frontend**
  - SignalR client integration (@microsoft/signalr)
  - Custom hook `useChatHub` for connections
  - Real-time message updates (eliminates 5-second polling)
  - Connection status tracking
  - Automatic token injection in WebSocket

- **Endpoints & Features**
  - POST /api/messages - Send message (notifies via SignalR)
  - GET /api/messages/conversations - Conversations list
  - GET /api/messages/{otherUserId} - Messages with a user
  - `/messages` - Conversations list page
  - `/messages/[userId]` - Individual chat page
  - Clickable username in chat → profile link
  - Message grouping by date
  - Scroll to bottom on new messages

### 4. AI Profile Assistant (COMPLETED)
- **Backend (Ollama Integration)**
  - `OllamaAiAssistantService` for HTML/CSS code generation
  - Local AI with Ollama (smollm2 360M model)
  - Smart prompting for MySpace-style profiles
  - HTML/CSS sanitization for security
  - POST /api/ai/generate-profile-code (JWT protected)
  - GET /api/ai/status - Health check endpoint
  - Support for "html", "css", or "both" generation
  
- **Frontend**
  - `AiCodeGenerator` component with intuitive UI
  - Integrated in Edit Profile page
  - Real-time code preview
  - One-click apply for generated code
  - Gradient purple/pink design
  
- **Features**
  - Natural language prompts ("create retro pink profile with sparkles")
  - Instant code generation with local Ollama AI
  - Privacy-first - no data sent to external APIs
  - Free - no API keys or costs
  - Safe code - removes scripts, dangerous CSS, malicious patterns
  - Apply directly to profile or edit manually
  - Error handling with connection status

### 5. Follow/Unfollow System (NEW)
- **Backend**
  - `Follow` entity with EF Core configuration
  - `FollowService` with full CRUD operations
  - `FollowsController` with RESTful endpoints
  - Result pattern for error handling
  - 100% test coverage with TDD approach
  - Endpoints:
    - POST /api/follows/{userId} - Follow a user
    - DELETE /api/follows/{userId} - Unfollow a user
    - GET /api/follows/is-following - Check follow status
    - GET /api/follows/stats/{userId} - Get follower/following counts

- **Frontend**
  - `FollowButton` component with dynamic state
  - Integrated into user profile pages
  - Real-time follow/unfollow functionality
  - Loading states and error handling
  - Positioned next to "Send Message" button
  - 100% test coverage with Jest + React Testing Library

- **Database**
  - Follows table with foreign keys to Users
  - Unique constraint on (FollowerId, FollowedId)
  - Indexes for optimal query performance
  - Cascade delete when user is removed
  - Migration: `20260214110112_AddFollowsTable`

- **Follow Stats & Lists**
  - `FollowStats` component showing follower/following counts
  - Links to follower and following list pages
  - Backend endpoints:
    - GET /api/follows/followers/{userId} - Get user's followers
    - GET /api/follows/following/{userId} - Get users being followed
  - Frontend pages:
    - `/profile/[userId]/followers` - Follower list with avatars
    - `/profile/[userId]/following` - Following list with avatars
  - Integrated into profile pages and user cards

### 6. Posts & Feed System (NEW)
- **Backend**
  - `Post` entity with MediaUrl support (external links)
  - `PostService` with comprehensive business logic
  - `PostsController` with RESTful endpoints
  - TDD approach with 14 PostService tests + 15 Controller tests
  - Feed algorithm: Followed users' posts appear first, then others
  - Result pattern for error handling
  - Endpoints:
    - POST /api/posts - Create new post (authenticated)
    - GET /api/posts/feed - Get personalized feed with following indicator
    - GET /api/posts/{id} - Get specific post
    - GET /api/posts/user/{userId} - Get user's posts
    - DELETE /api/posts/{id} - Delete post (owner only)
  - Pagination support (skip/take parameters)

- **Frontend Components**
  - `CreatePost` - Post creation form with content and media URL
  - `PostCard` - Display post with user info, content, media link
  - Following indicator "(Following)" next to followed users
  - Delete button for own posts with confirmation
  - Avatar display with fallback icon
  - Formatted timestamps (human-readable)
  - Like count display
  - 100% test coverage with Jest + React Testing Library

- **Feed Page** (`/feed`)
  - Personalized feed showing all posts
  - Followed users' posts appear first with "(Following)" label
  - Create new posts at top of feed
  - Infinite scroll with "Load More" pagination
  - Real-time post updates after creation/deletion
  - Empty state with helpful message
  - Loading states and error handling

- **Database**
  - Post entity updated with `MediaUrl` field (max 2000 chars)
  - Migration: `20260215000000_AddMediaUrlToPost`
  - Indexes on CreatedAt and UserId for efficient queries
  - Foreign key to Users with cascade delete

- **Features**
  - Text posts with optional external media URL (YouTube, images, etc.)
  - No cloud storage - MediaUrl is just a link field
  - Feed sorting: Following first, then by date
  - Character limit: 5000 for content
  - Owner-only deletion with authorization checks
  - Click username to view profile

### 7. Database & ORM
- **PostgreSQL** with Entity Framework Core
- **Models**:
  - User (Id, Username, Email, PasswordHash)
  - UserProfile (DisplayName, Bio, CustomHtml/Css)
  - Post (Content, MediaUrl, UserId, LikesCount, CreatedAt) **UPDATED**
  - Message (SenderId, ReceiverId, Content, SentAt, IsRead)
  - Follow (FollowerId, FollowedId, CreatedAt)
- **Migrations** fully configured
- Connection string in appsettings.Development.json

### 8. Architecture & Best Practices
- **Clean Architecture**
  - Controllers → Services → Repositories
  - Dependency Injection
  - DTOs for API responses
- **Testing**
  - 81/81 unit tests passing
  - xUnit for backend
  - Moq for mocking
- **Security**
  - Password hashing with BCrypt
  - JWT token validation
  - CORS configured for localhost:3000→5000
  - [Authorize] attributes on protected endpoints

## Current Tech Stack

### Backend
- .NET 10 + ASP.NET Core
- Entity Framework Core 10
- PostgreSQL (Npgsql provider)
- SignalR for real-time
- **Ollama** for local AI code generation
- xUnit + Moq for testing (80+ backend tests)

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Jest + React Testing Library (30+ frontend tests)
- SignalR Client (@microsoft/signalr)
- localStorage for token persistence

## Current Configuration

### Backend Ports
- API: http://localhost:5000
- SignalR Hub: http://localhost:5000/hubs/chat

### Frontend
- Dev Server: http://localhost:3000

### JWT Configuration
```json
{
  "Jwt": {
    "Secret": "dev_secret_very_long_and_random_change_in_prod",
    "Issuer": "YourSpace",
    "Audience": "YourSpaceAudience",
    "ExpiryMinutes": 120
  }
}
```

### Ollama Configuration
For AI code generation:
```bash
# Install Ollama from https://ollama.ai
ollama pull smollm2

# Start Ollama (run in separate terminal)
ollama serve
```
**Free & Privacy-First**: Run AI locally, no API keys needed!

## How to Run the Project

### Backend
```bash
cd backend/YourSpace.ApiService
dotnet run --urls "http://localhost:5000"
```

### Frontend
```bash
cd frontend
npm run dev
```

### Testing
```bash
cd backend
dotnet test
# Output: 81/81 tests passing
```

## Feature Highlights

### AI Profile Assistant (Ollama)
- **Natural language input** - "Create a dark gothic profile with purple accents"
- **Instant generation** - Local AI produces clean HTML/CSS in seconds
- **Security first** - All code sanitized, scripts removed, safe tags only
- **MySpace-style** - Optimized prompts for retro profile aesthetics
- **One-click apply** - Generated code applied directly to profile
- **Privacy-first** - All processing happens locally, no data sent to cloud
- **Free forever** - No API keys, no costs, no limits

### Real-Time Messaging (SignalR)
- **Instant delivery** - Messages appear immediately without refresh
- **WebSocket connection** - More efficient than polling
- **Auto-reconnect** - Connection automatically reestablishes
- **Typing indicators** - Support for "user is typing..."
- **Scalable** - Architecture ready for many simultaneous connections

### Authentication Flow
1. User logs in → receives JWT token
2. Token saved in localStorage + cookie
3. Token sent in Authorization header with each request
4. Backend validates token and extracts user ID from claims
5. SignalR uses the same token for WebSocket authentication

### Message Flow
1. User A sends message → POST /api/messages
2. Backend saves in DB → returns MessageDto
3. Backend notifies User B via SignalR → `ReceiveMessage` event
4. Frontend User B receives message instantly → adds to UI
5. No polling, no delay!

## Project Statistics

- **Backend Tests**: 80+ passing
- **Frontend Tests**: 30+ passing
- **Total Tests**: 110+ passing
- **API Endpoints**: 25+ endpoints (auth, users, profiles, messages, posts, follows, AI)
- **Frontend Pages**: 12+ pages (home, auth, profiles, messages, feed, etc.)
- **Real-time Features**: SignalR messaging + typing indicators
- **AI Features**: Ollama local AI integration for code generation
- **Database Tables**: 5 (Users, UserProfiles, Posts, Messages, Follows)

## Possible Next Steps

### Level 1 - Refinement
- [ ] Message read receipts (IsRead flag in UI)
- [ ] Typing indicators UI
- [ ] Notification badges for unread messages
- [ ] Message search & filtering

### Level 2 - Advanced Features
- [ ] Group chats (multiple users)
- [ ] File/image sharing in messages
- [ ] Message reactions (emoji)
- [ ] Voice/video calls integration
- [ ] Profile customization with HTML/CSS editor

### Level 3 - Scalability
- [ ] Message pagination/infinite scroll
- [ ] Redis caching for conversations
- [ ] Azure SignalR Service for production
- [ ] Background jobs for cleanup
- [ ] Analytics & monitoring

## Documentation Links

- [SignalR Documentation](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- [JWT Best Practices](https://jwt.io/introduction)
   - Password hashing (BCrypt, passwords are never stored in plain text)
   - Request and response validation with dedicated DTOs
   - /api/users endpoints are protected with JWT (requires Authorization: Bearer <token> header)
   - Request/response examples and complete flow in README.md
   - Frontend pages: login/register, global context, UserMenu, Navbar, redirect if logged in

2. **Customizable Profiles** (NEXT)
   - Profile page with custom HTML/CSS editor
   - PUT /api/users/{id}/profile - Update custom profile
   - GET /api/profiles/{username} - View public profile

3. **Feed Page**
   - Feed page with posts

### Medium Term:
1. **Real-time Chat**
   - SignalR for WebSocket connections
   - Direct messages between users

2. **Social Feed**
   - POST /api/posts - Create post
   - GET /api/posts - Read feed
   - Like/Unlike posts

3. **Validation & Sanitization**
   - HTML sanitizer for CustomHtml (DOMPurify on frontend, HtmlSanitizer on backend)
   - Whitelist CSS properties

### Long Term:
1. **AI Assistant**
   - OpenAI API integration
   - Generate HTML/CSS code from text descriptions

2. **Deploy**
   - Docker containerization
   - GitHub Actions CI/CD
   - Hosting (Azure/AWS)

## Current Project Structure

```
YourSpace/
├── backend/
│   ├── YourSpace.sln
│   ├── YourSpace.ApiService/
│   │   ├── Program.cs (API configuration)
│   │   ├── appsettings.json (connection string)
│   │   └── Controllers/
│   │       └── UsersController.cs
│   └── YourSpace.Data/
│       ├── Models/
│       │   ├── User.cs
│       │   ├── UserProfile.cs
│       │   └── Post.cs
│       ├── YourSpaceDbContext.cs
│       └── [Migrations/ - will be created after first migration]
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx (home page)
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── [other pages will go here]
│   ├── config/
│   │   └── api.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.ts
│
├── docker-compose.yml (for PostgreSQL)
├── DATABASE_SETUP.md
└── README.md
```

## Technologies Used

### Backend
- **.NET 10** - Modern Microsoft runtime
- **ASP.NET Core 10** - Web framework
- **Entity Framework Core 10** - ORM (Object-Relational Mapping)
- **PostgreSQL 16** - Database
- **C# 13** - Programming language

### Frontend
- **Next.js 15** - React framework with SSR/SSG
- **React 19** - UI library
- **TypeScript 5** - Static type checking
- **Tailwind CSS 4** - Utility-first CSS
- **ESLint** - Code quality

## Development Notes

### DTOs (Data Transfer Objects)
We used DTOs in `UsersController.cs` to:
- Expose only necessary data through API (we don't expose PasswordHash!)
- Decouple DB structure from API structure
- Simplify future changes

### Entity Framework Relationships
We configured relationships:
- User ↔ UserProfile (1:1 with cascade delete)
- User ↔ Posts (1:many with cascade delete)
- Index on CreatedAt for fast feed sorting

### Security Considerations
- [x] Enforce unit testing and testable architecture for all new code (see copilot-instructions.md)

## Next Steps

### Feed Feature (In Planning)
Based on the follow system, we will implement:
- **Global Feed** - All posts from all users
- **Followed Users Feed** - Posts from followed users appear first
- **Post Creation** - Create new posts with text content
- **Feed Sorting** - Chronological with followed users prioritized
- **Pagination** - Efficient feed loading with infinite scroll
- **Like/Unlike** - Engagement features for posts

The follow system (completed) is the foundation that will enable personalized feed ranking.

## How to Contribute to the Project

1. Start backend: `cd backend && dotnet run --project YourSpace.ApiService`
2. Start frontend: `cd frontend && npm run dev`
3. Access http://localhost:3000
4. Test health check: http://localhost:5000/api/health

Each feature will be developed gradually with explanations and comments to learn along the way!
