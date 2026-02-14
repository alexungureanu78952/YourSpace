using System;
using Npgsql;

var connectionString = "Host=localhost;Database=yourspace;Username=postgres;Password=postgres;Port=5433";

try
{
    using var connection = new NpgsqlConnection(connectionString);
    connection.Open();

    Console.WriteLine("Connected to database.");

    // Remove the empty migration from history
    using (var cmd = new NpgsqlCommand("DELETE FROM \"__EFMigrationsHistory\" WHERE \"MigrationId\" = '20260214123749_AddMediaUrlToPost';", connection))
    {
        var deleted = cmd.ExecuteNonQuery();
        Console.WriteLine($"Removed empty migration from history: {deleted} row(s) deleted");
    }

    // Add the MediaUrl column
    using (var cmd = new NpgsqlCommand("ALTER TABLE \"Posts\" ADD COLUMN \"MediaUrl\" character varying(2000);", connection))
    {
        cmd.ExecuteNonQuery();
        Console.WriteLine("Added MediaUrl column to Posts table");
    }

    // Re-insert the migration history entry
    using (var cmd = new NpgsqlCommand("INSERT INTO \"__EFMigrationsHistory\" (\"MigrationId\", \"ProductVersion\") VALUES ('20260214123749_AddMediaUrlToPost', '10.0.0');", connection))
    {
        cmd.ExecuteNonQuery();
        Console.WriteLine("Updated migration history");
    }

    Console.WriteLine("\n✅ Migration applied successfully!");
}
catch (Exception ex)
{
    Console.WriteLine($"❌ Error: {ex.Message}");
    return 1;
}

return 0;
