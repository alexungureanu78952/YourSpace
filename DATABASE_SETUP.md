## How to start the PostgreSQL database

You have three options:

### Option 1: Docker Compose (Recommended)
If you have Docker installed, run in the project root directory:

```bash
docker-compose up -d
```

This will start PostgreSQL on `localhost:5433` with credentials:
- **Database**: yourspace
- **Username**: postgres
- **Password**: postgres

To stop:
```bash
docker-compose down
```

### Option 2: Local PostgreSQL
If you have PostgreSQL installed on your machine:

1. Create a database named `yourspace`:
```sql
CREATE DATABASE yourspace;
```

2. Make sure you have a `postgres` user with password `postgres` or update the connection string in `appsettings.json`

### Option 3: Custom Connection String
If you have PostgreSQL on another server, update the `appsettings.json` file:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=YOUR_HOST;Database=YOUR_DB;Username=YOUR_USER;Password=YOUR_PASSWORD"
  }
}
```

## Applying Migrations

After PostgreSQL is running, apply the migrations from the `backend` folder:

```bash
cd backend/YourSpace.ApiService
dotnet ef database update --project ../YourSpace.Data
```

This will automatically create the necessary tables in the database.

## Starting the Backend

```bash
cd backend
dotnet run --project YourSpace.ApiService
```

The API will be available at: `http://localhost:5000`

Test the health check: `http://localhost:5000/api/health`
