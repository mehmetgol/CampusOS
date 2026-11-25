using Microsoft.EntityFrameworkCore;
using CampusOS.Models;

namespace CampusOS.Data;

public class CampusOSDbContext : DbContext
{
    public CampusOSDbContext(DbContextOptions<CampusOSDbContext> options)
        : base(options)
    {
    }

    public DbSet<Ogrenci> Ogrenciler { get; set; }

    public DbSet<Ders> Dersler { get; set; }

    public DbSet<Kayit> Kayitlar { get; set; }

    public DbSet<Kullanici> Kullanicilar { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ==========================================
        // DERS
        // ==========================================

        modelBuilder.Entity<Ders>()
            .Property(d => d.DersKodu)
            .HasMaxLength(50);

        modelBuilder.Entity<Ders>()
            .HasIndex(d => d.DersKodu)
            .IsUnique();

        // ==========================================
        // KAYIT
        // ==========================================

        modelBuilder.Entity<Kayit>()
            .HasIndex(k => new
            {
                k.OgrenciId,
                k.DersId
            })
            .IsUnique();

        modelBuilder.Entity<Kayit>()
            .Property(k => k.HarfNotu)
            .HasMaxLength(2);

        // ==========================================
        // KULLANICI
        // ==========================================

        modelBuilder.Entity<Kullanici>()
            .Property(k => k.Email)
            .HasMaxLength(150);

        modelBuilder.Entity<Kullanici>()
            .HasIndex(k => k.Email)
            .IsUnique();

        modelBuilder.Entity<Kullanici>()
            .Property(k => k.Rol)
            .HasMaxLength(30);

        // Kullanıcı hesabı -> öğrenci profili (opsiyonel).
        // Öğrenci silinirse bağlantı NULL olur, hesap kalır.
        modelBuilder.Entity<Kullanici>()
            .HasOne<Ogrenci>()
            .WithMany()
            .HasForeignKey(k => k.OgrenciId)
            .OnDelete(DeleteBehavior.SetNull);

        // Bir öğrenci profili en fazla bir hesaba bağlanabilir.
        modelBuilder.Entity<Kullanici>()
            .HasIndex(k => k.OgrenciId)
            .IsUnique();
    }
}