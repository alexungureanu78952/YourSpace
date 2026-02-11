# YourSpace - Progres Implementare

## Pas 1: ✅ Structura Inițială Proiect
- Creat folderul `backend/` pentru .NET
- Creat folderul `frontend/` pentru Next.js
- Creat `README.md` și `.gitignore`

## Pas 2: ✅ Backend .NET Aspire
### Ce am creat:

#### Solution și Proiecte
- `.NET solution` (YourSpace.sln)
- `YourSpace.ApiService` - REST API main
- `YourSpace.Data` - Models și DbContext

#### Modele de Date (ORM)
**User** - Utilizatorul platformei
- Id, Username (unic), Email (unic), PasswordHash
- CreatedAt, Profile (one-to-one), Posts (one-to-many)

**UserProfile** - Profilul personalizabil (MySpace-style blog)
- DisplayName, Bio, AvatarUrl
- `CustomHtml` - HTML custom pentru profil (max 50KB)
- `CustomCss` - CSS custom pentru design (max 20KB)
- UpdatedAt, relație cu User

**Post** - Postări în feed social
- Content, UserId, CreatedAt, LikesCount
- Relație cu User

#### Bază de Date
- **Framework**: Entity Framework Core 10
- **Provider**: PostgreSQL (Npgsql)
- **Configurare**: DbContext cu relații configurate, cascade delete

#### API Controllers
- `UsersController.cs`:
   - `GET /api/users` - Lista toți utilizatorii (**PROTEJAT JWT**)
   - `GET /api/users/{id}` - Detalii utilizator cu profil și postări (**PROTEJAT JWT**)

#### Configurare API
- CORS activat pentru frontend (localhost:3000)
- Connection string în `appsettings.json`
- Middleware-uri: logging, HTTPS, routing

### Cum să testezi Backend-ul:
```bash
cd backend

# După ce PostgreSQL rulează:
dotnet ef database update --project YourSpace.Data

# Pornire API
dotnet run --project YourSpace.ApiService

# Testare health check
curl http://localhost:5000/api/health

# Testare endpoint protejat JWT (după login/register):
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/users
```

## Pas 3: ✅ Frontend Next.js
### Ce am creat:

#### Configurare
- **Framework**: Next.js 15.1 cu App Router (structura modernă)
- **Limbaj**: TypeScript
- **Styling**: Tailwind CSS
- **Linter**: ESLint

#### Pagini
- `app/page.tsx` - Landing page cu prezentare proiect

#### Config API
- `config/api.ts` - URL-uri endpoints și configurare

#### Design
- Landing page cu gradient background
- Informații despre stack tehnologic
- Link-uri și explicații pentru utilizatori

### Cum să testezi Frontend-ul:
```bash
cd frontend

# Instalare dependențe (deja făcut)
npm install

# Pornire dev server (va fi pe http://localhost:3000)
npm run dev
```

## Pas 4: 🚀 Următorii Pași


### Imediat (Prioritate Alta):
1. **Autentificare Utilizatori** ✅ (complet)
   - Register/Login endpoints (`POST /api/auth/register`, `POST /api/auth/login`)
   - JWT tokens (stateless authentication, token returnat la login/register)
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
