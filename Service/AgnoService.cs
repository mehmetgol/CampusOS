using CampusOS.Data;
using CampusOS.Models;
using Microsoft.EntityFrameworkCore;

public class AgnoService
{
    // ==========================================
    // HARF NOTU SKALASI (4'LÜK SİSTEM)
    // Frontend'deki frontend/src/utils/agno.js ile
    // AYNI tutulmalıdır.
    // ==========================================

    public static readonly IReadOnlyDictionary<string, double> NotKatsayilari =
        new Dictionary<string, double>
        {
            ["AA"] = 4.0,
            ["BA"] = 3.5,
            ["BB"] = 3.0,
            ["CB"] = 2.5,
            ["CC"] = 2.0,
            ["DC"] = 1.5,
            ["DD"] = 1.0,
            ["FD"] = 0.5,
            ["FF"] = 0.0
        };

    public static bool GecerliNotMu(string harfNotu)
    {
        return NotKatsayilari.ContainsKey(harfNotu);
    }

    private readonly CampusOSDbContext _context;

    public AgnoService(CampusOSDbContext context)
    {
        _context = context;
    }


    // ==========================
    // ÖĞRENCİNİN AGNO ÖZETİ
    // ==========================

    public AgnoOzeti? Hesapla(int ogrenciId)
    {
        var ogrenci = _context.Ogrenciler
            .FirstOrDefault(o => o.Id == ogrenciId);

        if (ogrenci == null)
        {
            return null;
        }

        var kayitlar = _context.Kayitlar
            .Where(k => k.OgrenciId == ogrenciId)
            .Include(k => k.Ders)
            .ToList();

        var ozet = new AgnoOzeti
        {
            OgrenciId = ogrenci.Id,
            OgrenciAdSoyad = $"{ogrenci.Ad} {ogrenci.Soyad}",
            Bolum = ogrenci.Bolum
        };

        foreach (var kayit in kayitlar)
        {
            double? katsayi = null;

            if (kayit.HarfNotu != null &&
                NotKatsayilari.TryGetValue(
                    kayit.HarfNotu,
                    out var deger))
            {
                katsayi = deger;
            }

            ozet.Dersler.Add(new AgnoDersSatiri
            {
                DersId = kayit.DersId,
                DersAdi = kayit.Ders.DersAdi,
                DersKodu = kayit.Ders.DersKodu,
                Kredi = kayit.Ders.Kredi,
                HarfNotu = kayit.HarfNotu,
                Katsayi = katsayi
            });

            if (katsayi.HasValue)
            {
                ozet.TamamlananKredi += kayit.Ders.Kredi;
                ozet.ToplamPuan += kayit.Ders.Kredi * katsayi.Value;
            }
            else
            {
                ozet.DevamEdenKredi += kayit.Ders.Kredi;
            }
        }

        if (ozet.TamamlananKredi > 0)
        {
            ozet.Agno = Math.Round(
                ozet.ToplamPuan / ozet.TamamlananKredi,
                2,
                MidpointRounding.AwayFromZero
            );
        }

        return ozet;
    }


    // ==========================
    // KULLANICININ BAĞLI ÖĞRENCİSİ
    // ==========================

    public int? BagliOgrenciId(int kullaniciId)
    {
        return _context.Kullanicilar
            .Where(k => k.Id == kullaniciId)
            .Select(k => k.OgrenciId)
            .FirstOrDefault();
    }
}
