namespace CampusOS.Models;

public class NotGuncelleRequest
{
    // null veya boş => notu temizle (ders devam ediyor)
    public string? HarfNotu { get; set; }
}
