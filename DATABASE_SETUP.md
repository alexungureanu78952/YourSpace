## Cum să pornești baza de date PostgreSQL

Ai trei opțiuni:

### Opțiunea 1: Docker Compose (Recomandată)
Dacă ai Docker instalat, rulează în directorul rădăcină al proiectului:

```bash
docker-compose up -d
```

Aceasta va porni PostgreSQL pe `localhost:5432` cu credențialele:
- **Database**: yourspace
- **Username**: postgres
- **Password**: postgres

Pentru a opri:
```bash
docker-compose down
```

### Opțiunea 2: PostgreSQL Local
Dacă ai PostgreSQL instalat pe mașina ta:

1. Creează o bază de date numită `yourspace`:
```sql
CREATE DATABASE yourspace;
```

2. Asigură-te că ai un utilizator `postgres` cu parola `postgres` sau actualizează connection string-ul din `appsettings.json`

### Opțiunea 3: Connection String Custom
Dacă ai PostgreSQL pe alt server, actualizează file-ul `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=YOUR_HOST;Database=YOUR_DB;Username=YOUR_USER;Password=YOUR_PASSWORD"
  }
}
```

## Aplicarea Migrărilor

După ce PostgreSQL rulează, aplicați migrările din folderul `backend`:

```bash
cd backend/YourSpace.ApiService
dotnet ef database update --project ../YourSpace.Data
```

Aceasta va crea automat tabelele necesare în baza de date.

## Pornirea Backend-ului

```bash
cd backend
dotnet run --project YourSpace.ApiService
```

API-ul va fi disponibil pe: `http://localhost:5000`

Testează health check-ul: `http://localhost:5000/api/health`
