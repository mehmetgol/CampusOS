namespace CampusOS.Models;

public class Kayit
{
    public int Id { get; set; }

    public int OgrenciId { get; set; }

    public int DersId { get; set; }

    // Harf notu (AA, BA, BB, CB, CC, DC, DD, FD, FF).
    // null => ders devam ediyor / henüz not girilmedi.
    public string? HarfNotu { get; set; }

    public Ogrenci Ogrenci { get; set; } = null!;

    public Ders Ders { get; set; } = null!;
}
