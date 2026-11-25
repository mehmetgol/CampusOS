using CampusOS.Data;
using CampusOS.Models;
using Microsoft.EntityFrameworkCore;

public class KayitService
{
    private readonly CampusOSDbContext _context;

    public KayitService(CampusOSDbContext context)
    {
        _context = context;
    }


    // ==========================
    // TÜM KAYITLARI GETİR
    // ==========================

    public List<Kayit> GetAll()
    {
        return _context.Kayitlar
            .Include(k => k.Ogrenci)
            .Include(k => k.Ders)
            .ToList();
    }


    // ==========================
    // DERSTEKİ ÖĞRENCİLERİ GETİR
    // ==========================

    public List<Ogrenci> GetOgrencilerByDersId(int dersId)
    {
        return _context.Kayitlar
            .Where(k => k.DersId == dersId)
            .Include(k => k.Ogrenci)
            .Select(k => k.Ogrenci)
            .ToList();
    }


    // ==========================
    // YENİ DERS KAYDI OLUŞTUR
    // ==========================

public bool OgrenciVarMi(int ogrenciId)
{
    return _context.Ogrenciler.Any(o => o.Id == ogrenciId);
}

public bool DersVarMi(int dersId)
{
    return _context.Dersler.Any(d => d.Id == dersId);
}
   public Kayit? Add(int ogrenciId, int dersId)
{
    // Öğrenci gerçekten var mı?
    var ogrenciVarMi = _context.Ogrenciler
        .Any(o => o.Id == ogrenciId);

    if (!ogrenciVarMi)
    {
        return null;
    }

    // Ders gerçekten var mı?
    var dersVarMi = _context.Dersler
        .Any(d => d.Id == dersId);

    if (!dersVarMi)
    {
        return null;
    }

    // Öğrenci bu derse zaten kayıtlı mı?
    var mevcutKayit = _context.Kayitlar
        .FirstOrDefault(k =>
            k.OgrenciId == ogrenciId &&
            k.DersId == dersId);

    if (mevcutKayit != null)
    {
        return null;
    }

    // Yeni kayıt oluştur
    var kayit = new Kayit
    {
        OgrenciId = ogrenciId,
        DersId = dersId
    };

    _context.Kayitlar.Add(kayit);
    _context.SaveChanges();

    return kayit;
}

    // ==========================
    // ÖĞRENCİNİN DERSLERİNİ GETİR
    // ==========================

    public List<Ders> GetDerslerByOgrenciId(int ogrenciId)
    {
        return _context.Kayitlar
            .Where(k => k.OgrenciId == ogrenciId)
            .Include(k => k.Ders)
            .Select(k => k.Ders)
            .ToList();
    }


    // ==========================
    // HARF NOTU GÜNCELLE
    // harfNotu null => notu temizle
    // ==========================

    public Kayit? NotGuncelle(
        int ogrenciId,
        int dersId,
        string? harfNotu)
    {
        var kayit = _context.Kayitlar
            .FirstOrDefault(k =>
                k.OgrenciId == ogrenciId &&
                k.DersId == dersId);

        if (kayit == null)
        {
            return null;
        }

        kayit.HarfNotu = harfNotu;
        _context.SaveChanges();

        return kayit;
    }


    // ==========================
    // ÖĞRENCİYİ DERSTEN ÇIKAR
    // ==========================

    public bool Delete(int ogrenciId, int dersId)
    {
        var kayit = _context.Kayitlar
            .FirstOrDefault(k =>
                k.OgrenciId == ogrenciId &&
                k.DersId == dersId);

        if (kayit == null)
        {
            return false;
        }

        _context.Kayitlar.Remove(kayit);
        _context.SaveChanges();

        return true;
    }
}