namespace CampusOS.Models;

public class AgnoDersSatiri
{
    public int DersId { get; set; }

    public string DersAdi { get; set; } = string.Empty;

    public string DersKodu { get; set; } = string.Empty;

    public int Kredi { get; set; }

    public string? HarfNotu { get; set; }

    // Harf notunun 4'lük sistemdeki karşılığı (not yoksa null)
    public double? Katsayi { get; set; }
}

public class AgnoOzeti
{
    public int OgrenciId { get; set; }

    public string OgrenciAdSoyad { get; set; } = string.Empty;

    public string Bolum { get; set; } = string.Empty;

    // Not girilmiş derslerin ağırlıklı ortalaması (2 hane).
    // Hiç notlu ders yoksa null.
    public double? Agno { get; set; }

    // Not girilmiş derslerin toplam kredisi
    public int TamamlananKredi { get; set; }

    // Not girilmemiş (devam eden) derslerin toplam kredisi
    public int DevamEdenKredi { get; set; }

    // Σ (kredi × katsayı) — hedef hesabı için yuvarlanmamış değer
    public double ToplamPuan { get; set; }

    public List<AgnoDersSatiri> Dersler { get; set; } = new();
}
