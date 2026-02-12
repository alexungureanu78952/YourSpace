# YourSpace - Real-Time Social Platform

O platformă social media modernă inspirată de MySpace, cu **messaging real-time** prin SignalR și profiluri personalizabile.

## ⭐ Features Implementate

### 🔐 Authentication & Security
- JWT authentication cu BCrypt password hashing
- Token-based auth (localStorage + cookie support)
- Protected routes cu automatic redirect
- ClaimTypes mapping pentru .NET compatibility

### 💬 Real-Time Messaging (SignalR)
- **Instant message delivery** - WebSocket în loc de polling
- **SignalR Hub** - conexiuni persistente și scalabile
- **Typing indicators** - support pentru "user is typing..."
- **Auto-reconnect** - conexiune stabilă și resilientă
- Conversații 1-on-1 cu message history
- Message grouping by date
- Clickable username → profile navigation

### 👥 User Discovery
- Search & browse all users (`/profiles`)
- Public profile viewing (`/profile/[username]`)
- User cards cu avatar și display name

### 🏗️ Architecture
- **Clean Architecture** - Controllers → Services → Repositories
- **TDD Approach** - 81/81 unit tests passing
- **Dependency Injection** - toate dependențele injectabile
- **DTOs** pentru separation of concerns

## Tehnologii

### Backend
- **.NET 10** + ASP.NET Core
- **SignalR** pentru real-time WebSocket communication
- **Entity Framework Core 10** cu PostgreSQL
- **JWT Authentication** cu custom claim mapping
- **xUnit + Moq** pentru testing (81/81 tests ✅)

### Frontend
- **Next.js 16** (App Router) + React 19
- **TypeScript** strict mode
- **SignalR Client** (@microsoft/signalr) pentru WebSocket
- **Tailwind CSS** pentru styling
- Custom hooks pentru SignalR management

### Database
- **PostgreSQL** (via Npgsql)
- 4 tabele: Users, UserProfiles, Posts, Messages
- EF Core migrations cu cascade delete

## Structură Proiect

```
YourSpace/
├── backend/
│   ├── YourSpace.ApiService/       # REST API + SignalR Hub
│   │   ├── Controllers/            # UsersController, MessagesController, AuthController
│   │   ├── Services/               # Business logic layer
│   │   ├── Hubs/                   # ChatHub pentru SignalR
│   │   └── DTOs/                   # Data transfer objects
│   ├── YourSpace.Data/             # EF Core + Models
│   │   ├── Models/                 # User, Message, Post, UserProfile
│   │   ├── Repositories/           # Data access layer
│   │   └── Migrations/             # Database migrations
│   └── YourSpace.ApiService.Tests/ # xUnit tests (81 tests)
└── frontend/
    ├── app/                        # Next.js pages
    │   ├── messages/               # Messaging UI
    │   ├── profiles/               # User discovery
    │   └── auth/                   # Login/Register
    ├── components/                 # React components
    ├── hooks/                      # useChatHub (SignalR)
    ├── context/                    # AuthContext
    └── config/                     # API endpoints config
```

## Cum să rulezi proiectul

### Prerequisites
- .NET 10 SDK
- Node.js 18+
- PostgreSQL database
- npm sau yarn

### 1. Database Setup
```bash
# Asigură-te că PostgreSQL rulează
# Connection string în backend/YourSpace.ApiService/appsettings.Development.json

cd backend
dotnet ef database update --project YourSpace.Data
```

### 2. Backend
```bash
cd backend/YourSpace.ApiService
dotnet run --urls "http://localhost:5000"

# API disponibil la: http://localhost:5000
# SignalR Hub la: http://localhost:5000/hubs/chat
# Health check: http://localhost:5000/api/health
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev

# App disponibilă la: http://localhost:3000
```

### 4. Testing
```bash
cd backend
dotnet test

# Output: 81/81 tests passing ✅
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login și primește JWT token

### Users
- `GET /api/users` - Lista utilizatori (protejat JWT)
- `GET /api/users/{id}` - User details cu profil

### Messages
- `POST /api/messages` - Trimite mesaj (notifică prin SignalR)
- `GET /api/messages/conversations` - Lista conversații
- `GET /api/messages/{otherUserId}` - Messages cu un user

### SignalR Hub
- `WS /hubs/chat` - WebSocket pentru real-time messaging
  - `ReceiveMessage` - Event pentru mesaje primite
  - `UserTyping` - Event pentru typing indicator
  - `SendTypingIndicator` - Method pentru notificare typing

## Real-Time Architecture

### Message Flow
```
User A                Backend              User B
  |                      |                    |
  |-- POST /messages --->|                    |
  |                      |-- Save to DB       |
  |<--- 200 OK ----------|                    |
  |                      |                    |
  |                      |-- SignalR -------->|
  |                      |   "ReceiveMessage" |
  |                      |                    |<-- Instant update!
```

### SignalR Benefits vs Polling
- ✅ **Latency**: 0ms vs 5000ms (polling interval)
- ✅ **Bandwidth**: Minimal (only when needed) vs constant requests
- ✅ **Scalability**: Handles thousands of connections efficiently
- ✅ **User Experience**: Instant updates, no delays

## Configuration

### Backend JWT Settings
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

### Frontend SignalR Connection
```typescript
// hooks/useChatHub.ts
const connection = new HubConnectionBuilder()
  .withUrl('http://localhost:5000/hubs/chat', {
    accessTokenFactory: () => localStorage.getItem('token')
  })
  .withAutomaticReconnect()
  .build();
```

## Standarde de Inginerie

### Test-Driven Development (TDD)
- **Mandatory**: Toate feature-urile noi încep cu teste failing
- **Coverage**: 81/81 tests passing în backend
- **Tools**: xUnit pentru backend, Jest pentru frontend (viitor)

### Clean Architecture
- **Domain Layer**: Models fără dependențe
- **Application Layer**: Services cu business logic
- **Infrastructure Layer**: Repositories, EF Core
- **Presentation Layer**: Controllers cu logică minimă

### Code Quality
- TypeScript strict mode în frontend
- C# nullable reference types enabled
- Dependency Injection pentru toate dependențele
- DTOs pentru separation între layers

## Roadmap

### ✅ Implementat
- [x] Authentication system (JWT + BCrypt)
- [x] User management (register, login, profile viewing)
- [x] User discovery (search, browse profiles)
- [x] Real-time messaging (SignalR WebSocket)
- [x] Message history & conversations
- [x] Unit testing suite (81 tests)
- [x] Clean Architecture implementation

### 🎯 Next Steps

#### Messaging Enhancements
- [ ] Message read receipts (IsRead în UI)
- [ ] Typing indicators în UI
- [ ] Unread message badges
- [ ] Message reactions (emoji)
        ```
      - Login:
        ```json
        {
          "usernameOrEmail": "ana",
          "password": "parola123"
        }
        ```
      - Response (ambele):
        ```json
        {
          "success": true,
          "message": "Cont creat cu succes.",
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          "user": {
            "id": 1,
            "username": "ana",
            "email": "ana@email.com",
            "createdAt": "...",
            "displayName": "ana"
          }
        }
        ```
    - Exemplu request protejat JWT:
      ```bash
      curl -H "Authorization: Bearer <token>" http://localhost:5000/api/users
    ```
- [ ] Profiluri customizabile
- [ ] Feed social
- [ ] Chat real-time
- [ ] AI Assistant pentru generare cod
