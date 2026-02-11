# YourSpace - MySpace-Inspired Social Platform

O platformă social media modernă inspirată de MySpace, unde utilizatorii își pot personaliza complet profilurile cu HTML/CSS custom.

## Tehnologii

### Backend
- **Framework**: .NET 8 + Aspire
- **Limbaj**: C#
- **Features**: 
  - API REST pentru profiluri utilizatori
  - Sistem de autentificare (JWT, BCrypt, pagini frontend, context global, UserMenu, Navbar, redirect dacă ești logat)
  - Endpoint-uri protejate cu JWT (ex: /api/users)
  - Chat real-time (SignalR)
  - Feed social

### Frontend
- **Framework**: Next.js 14
- **Limbaj**: TypeScript
- **Features**:
  - Profiluri customizabile (HTML/CSS editor)
  - Feed social interactiv
  - Chat în timp real
  - Design responsive


## Standarde de Inginerie

- Toate funcționalitățile și modificările de cod trebuie să includă teste unitare (xUnit pentru backend, Jest/React Testing Library pentru frontend).
- Arhitectura codului este proiectată pentru testabilitate: se folosesc dependențe injectabile, interfețe și mock-uri pentru toate dependențele externe.

## Structură Proiect

```
YourSpace/
├── backend/           # .NET Aspire solution
│   ├── YourSpace.AppHost/      # Orchestration
│   ├── YourSpace.ApiService/   # REST API
│   └── YourSpace.Data/         # Database & models
└── frontend/          # Next.js application
```

## Cum să rulezi proiectul

### Prerequisites
- .NET 8 SDK
- Node.js 18+
- Docker (pentru .NET Aspire)

### Backend
```bash
cd backend
dotnet run --project YourSpace.AppHost
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Roadmap

- [x] Setup inițial proiect
  - [x] Autentificare utilizatori (backend + frontend complet: JWT, BCrypt, endpoints REST, pagini login/register, context global, UserMenu, Navbar, redirect dacă ești logat)
    - POST /api/auth/register
    - POST /api/auth/login
    - Token JWT returnat la succes, folosit pentru autentificare stateless
    - Endpoint-urile /api/users sunt protejate cu JWT (trebuie header Authorization: Bearer <token>)
    - Parolele sunt hash-uite cu BCrypt
    - Redirect automat dacă ești logat
    - Exemple request/response:
      - Register:
        ```json
        {
          "username": "ana",
          "email": "ana@email.com",
          "password": "parola123"
        }
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
