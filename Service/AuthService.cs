using CampusOS.Data;
using CampusOS.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class AuthService
{
    private readonly CampusOSDbContext _context;
    private readonly PasswordHasher<Kullanici> _passwordHasher;
    private readonly IConfiguration _configuration;

    public AuthService(
        CampusOSDbContext context,
        IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
        _passwordHasher = new PasswordHasher<Kullanici>();
    }

    // ==========================
    // REGISTER
    // ==========================

    public Kullanici? Register(RegisterRequest request)
    {
        var email = request.Email
            .Trim()
            .ToLower();

        var emailVarMi = _context.Kullanicilar
            .Any(k => k.Email == email);

        if (emailVarMi)
        {
            return null;
        }

        var kullanici = new Kullanici
        {
            Ad = request.Ad.Trim(),
            Soyad = request.Soyad.Trim(),
            Email = email,
            Rol = "Ogrenci"
        };

        kullanici.SifreHash =
            _passwordHasher.HashPassword(
                kullanici,
                request.Sifre
            );

        _context.Kullanicilar.Add(kullanici);
        _context.SaveChanges();

        return kullanici;
    }

    // ==========================
    // LOGIN
    // ==========================

    public Kullanici? Login(LoginRequest request)
    {
        var email = request.Email
            .Trim()
            .ToLower();

        var kullanici = _context.Kullanicilar
            .FirstOrDefault(k => k.Email == email);

        if (kullanici == null)
        {
            return null;
        }

        var sonuc =
            _passwordHasher.VerifyHashedPassword(
                kullanici,
                kullanici.SifreHash,
                request.Sifre
            );

        if (sonuc == PasswordVerificationResult.Failed)
        {
            return null;
        }

        return kullanici;
    }

    // ==========================
    // JWT TOKEN
    // ==========================

    public string TokenOlustur(Kullanici kullanici)
    {
        var jwtKey = _configuration["Jwt:Key"];

        if (string.IsNullOrWhiteSpace(jwtKey))
        {
            throw new Exception(
                "JWT anahtarı bulunamadı."
            );
        }

        var claims = new List<Claim>
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                kullanici.Id.ToString()
            ),

            new Claim(
                ClaimTypes.Name,
                $"{kullanici.Ad} {kullanici.Soyad}"
            ),

            new Claim(
                ClaimTypes.Email,
                kullanici.Email
            ),

            new Claim(
                ClaimTypes.Role,
                kullanici.Rol
            )
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey)
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}