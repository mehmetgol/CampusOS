using CampusOS.Data;
using CampusOS.Models;

public class OgrenciService
{
    private readonly CampusOSDbContext _context;

    // DbContext'i Dependency Injection ile alıyoruz
    public OgrenciService(CampusOSDbContext context)
    {
        _context = context;
    }

    // Tüm öğrencileri getir
    public List<Ogrenci> GetAll()
    {
        return _context.Ogrenciler.ToList();
    }

    // ID'ye göre öğrenci getir
    public Ogrenci? GetById(int id)
    {
        return _context.Ogrenciler.FirstOrDefault(x => x.Id == id);
    }

    // Yeni öğrenci ekle
    public Ogrenci Add(Ogrenci yeniOgrenci)
    {
        _context.Ogrenciler.Add(yeniOgrenci);

        _context.SaveChanges();

        return yeniOgrenci;
    }

    // Öğrenci güncelle
    public Ogrenci? Update(int id, Ogrenci guncelOgrenci)
    {
        var ogrenci = _context.Ogrenciler.FirstOrDefault(x => x.Id == id);

        if (ogrenci == null)
        {
            return null;
        }

        ogrenci.Ad = guncelOgrenci.Ad;
        ogrenci.Soyad = guncelOgrenci.Soyad;
        ogrenci.Bolum = guncelOgrenci.Bolum;
        ogrenci.Yas = guncelOgrenci.Yas;

        _context.SaveChanges();

        return ogrenci;
    }

    // Öğrenci sil
    public bool Delete(int id)
    {
        var ogrenci = _context.Ogrenciler.FirstOrDefault(x => x.Id == id);

        if (ogrenci == null)
        {
            return false;
        }

        _context.Ogrenciler.Remove(ogrenci);

        _context.SaveChanges();

        return true;
    }
}