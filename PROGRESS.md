# YourSpace - Implementation Progress

## ✅ Completed Features

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

### 3. Real-Time Messaging System ⭐
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

### 4. AI Profile Assistant ✨ **NEW**
- **Backend (OpenAI Integration)**
  - `AiAssistantService` for HTML/CSS code generation
  - OpenAI API integration (Azure.AI.OpenAI)
  - Smart prompting for MySpace-style profiles
  - HTML/CSS sanitization for security
  - POST /api/ai/generate-profile-code (JWT protected)
  - Support for "html", "css", or "both" generation
  
- **Frontend**
  - `AiCodeGenerator` component with intuitive UI
  - Integrated in Edit Profile page
  - Real-time code preview
  - One-click apply for generated code
  - Gradient purple/pink design with emoji ✨
  
- **Features**
  - Natural language prompts ("create retro pink profile with sparkles")
  - Instant code generation with OpenAI GPT-4o-mini
  - Safe code - removes scripts, dangerous CSS, malicious patterns
  - Apply directly to profile or edit manually
  - Error handling for API failures

### 5. Database & ORM
- **PostgreSQL** with Entity Framework Core
- **Models**:
  - User (Id, Username, Email, PasswordHash)
  - UserProfile (DisplayName, Bio, CustomHtml/Css)
  - Post (Content, UserId, LikesCount)
  - Message (SenderId, ReceiverId, Content, SentAt, IsRead)
- **Migrations** fully configured
- Connection string in appsettings.Development.json

### 5. Architecture & Best Practices
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

## 🛠️ Current Tech Stack

### Backend
- .NET 10 + ASP.NET Core
- Entity Framework Core 10
- PostgreSQL (Npgsql provider)
- SignalR for real-time
- **Azure.AI.OpenAI** for AI code generation
- xUnit + Moq for testing

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- SignalR Client (@microsoft/signalr)
- localStorage for token persistence

## 📝 Current Configuration

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

### OpenAI Configuration
```json
{
  "OpenAI": {
    "ApiKey": "your-openai-api-key-here"
  }
}
```
**⚠️ Important**: Replace `your-openai-api-key-here` with your actual OpenAI API key from https://platform.openai.com/api-keys

## 🚀 How to Run the Project

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

## 🎯 Feature Highlights

### AI Profile Assistant (OpenAI)
- **Natural language input** - "Create a dark gothic profile with purple accents"
- **Instant generation** - GPT-4o-mini produces clean HTML/CSS in seconds
- **Security first** - All code sanitized, scripts removed, safe tags only
- **MySpace-style** - Optimized prompts for retro profile aesthetics
- **One-click apply** - Generated code applied directly to profile
- **Developer friendly** - View/edit generated code before applying

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

## 📊 Project Statistics

- **Backend Tests**: 81/81 passing ✅ (AI tests pending OpenAI key)
- **API Endpoints**: 15+ endpoints (auth, users, profiles, messages, AI)
- **Frontend Pages**: 8 pages (home, auth, profiles, messages, etc.)
- **Real-time Features**: SignalR messaging + typing indicators
- **AI Features**: OpenAI GPT-4o-mini integration for code generation
- **Database Tables**: 4 (Users, UserProfiles, Posts, Messages)

## 🔄 Possible Next Steps

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

## 📚 Documentation Links

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

## How to Contribute to the Project

1. Start backend: `cd backend && dotnet run --project YourSpace.ApiService`
2. Start frontend: `cd frontend && npm run dev`
3. Access http://localhost:3000
4. Test health check: http://localhost:5000/api/health

Each feature will be developed gradually with explanations and comments to learn along the way!
