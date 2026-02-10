# YourSpace - MySpace-Inspired Social Platform

O platformă social media modernă inspirată de MySpace, unde utilizatorii își pot personaliza complet profilurile cu HTML/CSS custom.

## Tehnologii

### Backend
- **Framework**: .NET 8 + Aspire
- **Limbaj**: C#
- **Features**: 
  - API REST pentru profiluri utilizatori
  - Sistem de autentificare
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
- [ ] Autentificare utilizatori
- [ ] Profiluri customizabile
- [ ] Feed social
- [ ] Chat real-time
- [ ] AI Assistant pentru generare cod
