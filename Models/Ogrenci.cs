namespace CampusOS.Models;

public class Ogrenci
{
    public int Id { get; set; }

    public string Ad { get; set; } = string.Empty;

    public string Soyad { get; set; } = string.Empty;

    public string Bolum { get; set; } = string.Empty;

    public int Yas { get; set; }
}