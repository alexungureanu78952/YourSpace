using Microsoft.EntityFrameworkCore;
using YourSpace.Data.Models;

namespace YourSpace.Data;

/// <summary>
/// Context-ul bazei de date pentru YourSpace
/// DbContext este clasa principală din Entity Framework Core care gestionează conexiunea cu baza de date
/// </summary>
public class YourSpaceDbContext : DbContext
{
    public YourSpaceDbContext(DbContextOptions<YourSpaceDbContext> options)
        : base(options)
    {
    }

    /// <summary>
    /// Tabel pentru utilizatori
    /// </summary>
    public DbSet<User> Users { get; set; }

    /// <summary>
    /// Tabel pentru profiluri
    /// </summary>
    public DbSet<UserProfile> UserProfiles { get; set; }

    /// <summary>
    /// Tabel pentru postări
    /// </summary>
    public DbSet<Post> Posts { get; set; }

    /// <summary>
    /// Configurează relațiile între entități și alte setări
    /// </summary>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurare User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Username).IsUnique(); // Username trebuie să fie unic
            entity.HasIndex(e => e.Email).IsUnique(); // Email trebuie să fie unic

            entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.PasswordHash).IsRequired();

            // Un utilizator are un singur profil
            entity.HasOne(e => e.Profile)
                  .WithOne(e => e.User)
                  .HasForeignKey<UserProfile>(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade); // Când ștergem un user, se șterge și profilul
        });

        // Configurare UserProfile
        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.DisplayName).HasMaxLength(100);
            entity.Property(e => e.Bio).HasMaxLength(500);
            entity.Property(e => e.CustomHtml).HasMaxLength(50000); // Limită pentru HTML custom
            entity.Property(e => e.CustomCss).HasMaxLength(20000); // Limită pentru CSS custom
        });

        // Configurare Post
        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Content).IsRequired().HasMaxLength(5000);

            // Un utilizator poate avea multe postări
            entity.HasOne(e => e.User)
                  .WithMany(e => e.Posts)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Index pentru a sorta rapid postările după dată
            entity.HasIndex(e => e.CreatedAt);
        });
    }
}
