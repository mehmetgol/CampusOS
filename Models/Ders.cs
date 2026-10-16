namespace CampusOS.Models;

public class Ders
{
    public int Id { get; set; }

    public string DersAdi { get; set; } = string.Empty;

    public string DersKodu { get; set; } = string.Empty;

    public int Kredi { get; set; }
}