namespace CampusOS.Models;

public class Kullanici
{
    public int Id { get; set; }

    public string Ad { get; set; } = string.Empty;

    public string Soyad { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string SifreHash { get; set; } = string.Empty;

    public string Rol { get; set; } = "Ogrenci";

    // Bu hesaba bağlı öğrenci profili (Admin eşleştirir).
    // Öğrenci rolündeki kullanıcı kendi AGNO'sunu buradan görür.
    public int? OgrenciId { get; set; }
}
