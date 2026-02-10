using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.Linq;

namespace YourSpace.Data;

public class YourSpaceDbContextFactory : IDesignTimeDbContextFactory<YourSpaceDbContext>
{
    public YourSpaceDbContext CreateDbContext(string[] args)
    {
        var currentDirectory = Directory.GetCurrentDirectory();
        var apiServicePath = Path.Combine(currentDirectory, "YourSpace.ApiService");
        var parentDirectory = Directory.GetParent(currentDirectory)?.FullName;
        var siblingApiServicePath = parentDirectory is null
            ? null
            : Path.Combine(parentDirectory, "YourSpace.ApiService");
        var grandParentDirectory = parentDirectory is null
            ? null
            : Directory.GetParent(parentDirectory)?.FullName;
        var grandParentApiServicePath = grandParentDirectory is null
            ? null
            : Path.Combine(grandParentDirectory, "YourSpace.ApiService");

        var basePath = new[] { apiServicePath, siblingApiServicePath, grandParentApiServicePath }
            .FirstOrDefault(path => !string.IsNullOrWhiteSpace(path) && Directory.Exists(path))
            ?? currentDirectory;

        var configuration = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? "Host=localhost;Database=yourspace;Username=postgres;Password=postgres";

        var optionsBuilder = new DbContextOptionsBuilder<YourSpaceDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new YourSpaceDbContext(optionsBuilder.Options);
    }
}