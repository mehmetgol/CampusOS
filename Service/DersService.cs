using CampusOS.Data;
using CampusOS.Models;

public class DersService
{
    private readonly CampusOSDbContext _context;

    public DersService(CampusOSDbContext context)
    {
        _context = context;
    }

    // Tüm dersleri getir
    public List<Ders> GetAll()
    {
        return _context.Dersler.ToList();
    }

    // ID ile ders getir
    public Ders? GetById(int id)
    {
        return _context.Dersler.FirstOrDefault(x => x.Id == id);
    }

    // Yeni ders ekle
    public Ders Add(Ders yeniDers)
    {
        _context.Dersler.Add(yeniDers);
        _context.SaveChanges();

        return yeniDers;
    }

    // Ders güncelle
    public Ders? Update(int id, Ders guncelDers)
    {
        var ders = _context.Dersler.FirstOrDefault(x => x.Id == id);

        if (ders == null)
        {
            return null;
        }

        ders.DersAdi = guncelDers.DersAdi;
        ders.DersKodu = guncelDers.DersKodu;
        ders.Kredi = guncelDers.Kredi;

        _context.SaveChanges();

        return ders;
    }

    // Ders sil
    public bool Delete(int id)
    {
        var ders = _context.Dersler.FirstOrDefault(x => x.Id == id);

        if (ders == null)
        {
            return false;
        }

        _context.Dersler.Remove(ders);
        _context.SaveChanges();

        return true;
    }
}