# YourSpace - Progres Implementare

## ✅ Funcționalități Complete

### 1. Autentificare & Securitate
- **Backend JWT Authentication**
  - Token generation cu JwtTokenService (120 min expiry)
  - ClaimTypes mapping fix (NameIdentifier pentru user ID)
  - Cookie + Authorization header support
  - ValidateLifetime disabled în development pentru debugging
- **Frontend Auth System**
  - AuthContext cu localStorage persistence
  - Login/Register pages complete
  - Protected routes cu redirect
  - UserMenu component cu logout

### 2. User Management
- **User Discovery System**
  - `/profiles` - Search page cu listă utilizatori
  - `/profile/[username]` - Public profile viewing
  - GET /api/users endpoint (cu protecție JWT)
  - GET /api/users/{id} endpoint pentru detalii

### 3. Real-Time Messaging System ⭐ **NOU**
- **Backend (SignalR)**
  - `ChatHub` pentru conexiuni WebSocket
  - Real-time message delivery (instant, nu polling)
  - User groups pentru notificări directe (`user_{id}`)
  - Typing indicators support
  - Automatic reconnection handling
  
- **Frontend**
  - SignalR client integration (@microsoft/signalr)
  - Custom hook `useChatHub` pentru conexiuni
  - Real-time message updates (elimină polling la 5 secunde)
  - Connection status tracking
  - Automatic token injection în WebSocket

- **Endpoints & Features**
  - POST /api/messages - Send message (notifică prin SignalR)
  - GET /api/messages/conversations - Lista conversații
  - GET /api/messages/{otherUserId} - Mesaje cu un user
  - `/messages` - Conversations list page
  - `/messages/[userId]` - Individual chat page
  - Clickable username în chat → profile link
  - Message grouping by date
  - Scroll to bottom on new messages

### 4. Database & ORM
- **PostgreSQL** cu Entity Framework Core
- **Modele**:
  - User (Id, Username, Email, PasswordHash)
  - UserProfile (DisplayName, Bio, CustomHtml/Css)
  - Post (Content, UserId, LikesCount)
  - Message (SenderId, ReceiverId, Content, SentAt, IsRead)
- **Migrations** complet configurate
- Connection string în appsettings.Development.json

### 5. Architecture & Best Practices
- **Clean Architecture**
  - Controllers → Services → Repositories
  - Dependency Injection
  - DTOs pentru API responses
- **Testing**
  - 81/81 unit tests passing
  - xUnit pentru backend
  - Moq pentru mocking
- **Security**
  - Password hashing cu BCrypt
  - JWT token validation
  - CORS configured pentru localhost:3000→5000
  - [Authorize] attributes pe protected endpoints

## 🛠️ Stack Tehnologic Actual

### Backend
- .NET 10 + ASP.NET Core
- Entity Framework Core 10
- PostgreSQL (Npgsql provider)
- SignalR pentru real-time
- xUnit + Moq pentru testing

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- SignalR Client (@microsoft/signalr)
- localStorage pentru token persistence

## 📝 Configurare Actuală

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

## 🚀 Cum să Rulezi Proiectul

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

### Real-Time Messaging (SignalR)
- **Instant delivery** - mesajele apar imediat fără refresh
- **WebSocket connection** - mai eficient decât polling
- **Auto-reconnect** - conexiunea se restabilește automat
- **Typing indicators** - support pentru "user is typing..."
- **Scalable** - arhitectură pregătită pentru multe conexiuni simultane

### Authentication Flow
1. User se loghează → primește JWT token
2. Token salvat în localStorage + cookie
3. Token trimis în Authorization header la fiecare request
4. Backend validează token și extrage user ID din claims
5. SignalR folosește același token pentru autentificare WebSocket

### Message Flow
1. User A trimite mesaj → POST /api/messages
2. Backend salvează în DB → returnează MessageDto
3. Backend notifică User B prin SignalR → `ReceiveMessage` event
4. Frontend User B primește mesaj instant → adaugă în UI
5. Fără polling, fără delay!

## 📊 Statistici Proiect

- **Backend Tests**: 81/81 passing ✅
- **API Endpoints**: 12+ endpoints
- **Frontend Pages**: 8 pages (home, auth, profiles, messages, etc.)
- **Real-time Features**: SignalR messaging + typing indicators
- **Database Tables**: 4 (Users, UserProfiles, Posts, Messages)

## 🔄 Următorii Pași Posibili

### Nivel 1 - Refinement
- [ ] Message read receipts (IsRead flag în UI)
- [ ] Typing indicators UI
- [ ] Notification badges pentru unread messages
- [ ] Message search & filtering

### Nivel 2 - Advanced Features
- [ ] Group chats (multiple users)
- [ ] File/image sharing în messages
- [ ] Message reactions (emoji)
- [ ] Voice/video calls integration
- [ ] Profile customization cu HTML/CSS editor

### Nivel 3 - Scalability
- [ ] Message pagination/infinite scroll
- [ ] Redis caching pentru conversations
- [ ] Azure SignalR Service pentru production
- [ ] Background jobs pentru cleanup
- [ ] Analytics & monitoring

## 📚 Documentation Links

- [SignalR Documentation](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- [JWT Best Practices](https://jwt.io/introduction)
   - Password hashing (BCrypt, parolele nu se stochează niciodată în clar)
   - Validare request și răspuns cu DTO-uri dedicate
   - Endpoint-urile /api/users sunt protejate cu JWT (trebuie header Authorization: Bearer <token>)
   - Exemple request/response și flux complet în README.md
   - Pagini frontend: login/register, context global, UserMenu, Navbar, redirect dacă ești logat

2. **Profiluri Customizabile** (NEXT)
   - Profile page cu editor HTML/CSS custom
   - PUT /api/users/{id}/profile - Actualizare profil custom
   - GET /api/profiles/{username} - Vizualizare profil public

3. **Feed Page**
   - Feed page cu postări

### Mediu Termen:
1. **Chat Real-time**
   - SignalR pentru conexiuni WebSocket
   - Mesaje direct între utilizatori

2. **Feed Social**
   - POST /api/posts - Creare postare
   - GET /api/posts - Citire feed
   - Like/Unlike posts

3. **Validare și Sanitizare**
   - HTML sanitizer pentru CustomHtml (DOMPurify pe frontend, HtmlSanitizer pe backend)
   - Whitelist CSS properties

### Long Term:
1. **AI Assistant**
   - Integrare OpenAI API
   - Generare cod HTML/CSS din descrieri text

2. **Deploy**
   - Docker containerization
   - GitHub Actions CI/CD
   - Hosting (Azure/AWS)

## Structura Proiect Curenti

```
YourSpace/
├── backend/
│   ├── YourSpace.sln
│   ├── YourSpace.ApiService/
│   │   ├── Program.cs (configurare API)
│   │   ├── appsettings.json (connection string)
│   │   └── Controllers/
│   │       └── UsersController.cs
│   └── YourSpace.Data/
│       ├── Models/
│       │   ├── User.cs
│       │   ├── UserProfile.cs
│       │   └── Post.cs
│       ├── YourSpaceDbContext.cs
│       └── [Migrations/ - va fi creat după prima migrare]
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx (home page)
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── [alte pagini vor merge aici]
│   ├── config/
│   │   └── api.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.ts
│
├── docker-compose.yml (pentru PostgreSQL)
├── DATABASE_SETUP.md
└── README.md
```

## Tehnologii Folosite

### Backend
- **.NET 10** - Runtime-ul modern Microsoft
- **ASP.NET Core 10** - Framework web
- **Entity Framework Core 10** - ORM (Object-Relational Mapping)
- **PostgreSQL 16** - Bază de date
- **C# 13** - Limbaj de programare

### Frontend
- **Next.js 15** - React framework cu SSR/SSG
- **React 19** - UI library
- **TypeScript 5** - Tip de date static
- **Tailwind CSS 4** - Utility-first CSS
- **ESLint** - Code quality

## Notes de Dezvoltare

### DTOs (Data Transfer Objects)
Am folosit DTOs în `UsersController.cs` pentru a:
- Expune doar datele necesare prin API (nu stochem PasswordHash!)
- Decupla structura DB de structura API
- Simplifica schimbări viitoare

### Relații Entity Framework
Am configurat relații:
- User ↔ UserProfile (1:1 cu cascade delete)
- User ↔ Posts (1:many cu cascade delete)
- Index pe CreatedAt pentru feed sorting rapid

### Security Considerations
- [x] Enforce unit testing and testable architecture for all new code (see copilot-instructions.md)

## Cum să contribui la Proiect

1. Start backend: `cd backend && dotnet run --project YourSpace.ApiService`
2. Start frontend: `cd frontend && npm run dev`
3. Accesezi http://localhost:3000
4. Testezi health check: http://localhost:5000/api/health

Fiecare feature va fi dezvoltat treptat cu explicații și comentarii pentru a putea învăța pe parcurs!
