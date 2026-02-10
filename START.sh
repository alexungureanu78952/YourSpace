#!/bin/bash

# YourSpace - Script de pornire pentru Linux/Mac

echo "=== YourSpace Development Environment ==="
echo ""

echo "Pasul 1: Asigură-te că PostgreSQL rulează"
echo "  - Dacă ai Docker: 'docker-compose up -d' în directorul rădăcină"
echo "  - Sau pornește PostgreSQL local pe portul 5432"
echo ""

echo "Pasul 2: Porniți Backend-ul (.NET)"
echo "  În terminal: cd backend && dotnet run --project YourSpace.ApiService"
echo "  API va fi disponibil pe: http://localhost:5000"
echo "  Testare health check: curl http://localhost:5000/api/health"
echo ""

echo "Pasul 3: Porniți Frontend-ul (Next.js)"
echo "  În alt terminal: cd frontend && npm run dev"
echo "  Frontend va fi disponibil pe: http://localhost:3000"
echo ""

echo "=== Comenzi Utile ==="
echo "Backend Build:        dotnet build (din backend/)"
echo "Frontend Build:       npm run build (din frontend/)"
echo "Create DB Migration:  dotnet ef migrations add MigrationName --project YourSpace.Data"
echo "Apply DB Migration:   dotnet ef database update --project YourSpace.Data"
echo ""

echo "Bun venit la YourSpace! 🚀"
