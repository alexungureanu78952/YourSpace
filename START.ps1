#!/bin/bash

# YourSpace - Script de pornire pentru Windows (PowerShell)

Write-Host "=== YourSpace Development Environment ===" -ForegroundColor Cyan
Write-Host ""

# Verifică dacă PostgreSQL rulează (opțional - pentru dezvoltare locală)
Write-Host "Pasul 1: Asigură-te că PostgreSQL rulează" -ForegroundColor Yellow
Write-Host "  - Dacă ai Docker: 'docker-compose up -d' în directorul rădăcină" -ForegroundColor Gray
Write-Host "  - Sau pornește PostgreSQL local pe portul 5432" -ForegroundColor Gray
Write-Host ""

# Pornire Backend
Write-Host "Pasul 2: Porniți Backend-ul (.NET)" -ForegroundColor Yellow
Write-Host "  În terminal: cd backend && dotnet run --project YourSpace.ApiService" -ForegroundColor Gray
Write-Host "  API va fi disponibil pe: http://localhost:5000" -ForegroundColor Green
Write-Host "  Testare health check: curl http://localhost:5000/api/health" -ForegroundColor Gray
Write-Host ""

# Pornire Frontend
Write-Host "Pasul 3: Porniți Frontend-ul (Next.js)" -ForegroundColor Yellow
Write-Host "  În alt terminal: cd frontend && npm run dev" -ForegroundColor Gray
Write-Host "  Frontend va fi disponibil pe: http://localhost:3000" -ForegroundColor Green
Write-Host ""

Write-Host "=== Comenzi Utile ===" -ForegroundColor Cyan
Write-Host "Backend Build:        dotnet build (din backend/)" -ForegroundColor Gray
Write-Host "Frontend Build:       npm run build (din frontend/)" -ForegroundColor Gray
Write-Host "Create DB Migration:  dotnet ef migrations add MigrationName --project YourSpace.Data" -ForegroundColor Gray
Write-Host "Apply DB Migration:   dotnet ef database update --project YourSpace.Data" -ForegroundColor Gray
Write-Host ""

Write-Host "Bun venit la YourSpace! 🚀" -ForegroundColor Green
