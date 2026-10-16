using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CampusOS.Data;
using CampusOS.Models;

var builder = WebApplication.CreateBuilder(args);


// ==========================
// DATABASE - SQL SERVER
// ==========================

builder.Services.AddDbContext<CampusOSDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);


// ==========================
// SWAGGER
// ==========================

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// ==========================
// JWT AUTHENTICATION
// ==========================

var jwtKey = builder.Configuration["Jwt:Key"];

if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new Exception(
        "JWT anahtarı bulunamadı."
    );
}

builder.Services
    .AddAuthentication(
        JwtBearerDefaults.AuthenticationScheme
    )
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)
                    ),

                ValidateIssuer = false,
                ValidateAudience = false,

                ValidateLifetime = true,

                ClockSkew = TimeSpan.Zero
            };
    });


// ==========================
// AUTHORIZATION
// ==========================

builder.Services.AddAuthorization();


// ==========================
// CORS - REACT FRONTEND
// ==========================

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "Frontend",
        policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:5173"
                )
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    );
});


// ==========================
// DEPENDENCY INJECTION
// ==========================

builder.Services.AddScoped<OgrenciService>();
builder.Services.AddScoped<DersService>();
builder.Services.AddScoped<KayitService>();
builder.Services.AddScoped<AuthService>();


var app = builder.Build();


// ==========================
// SWAGGER
// ==========================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// ==========================
// CORS
// ==========================

app.UseCors("Frontend");


// ==========================
// AUTHENTICATION
// AUTHORIZATION
// ==========================

app.UseAuthentication();
app.UseAuthorization();


// ======================================================
// AUTH ENDPOINTLERİ
// ======================================================


// ==========================
// REGISTER
// HERKESE AÇIK
// ==========================

app.MapPost("/auth/register", (
    RegisterRequest request,
    AuthService authService) =>
{
    if (string.IsNullOrWhiteSpace(request.Ad))
    {
        return Results.BadRequest(
            "Ad boş olamaz."
        );
    }

    if (string.IsNullOrWhiteSpace(request.Soyad))
    {
        return Results.BadRequest(
            "Soyad boş olamaz."
        );
    }

    if (string.IsNullOrWhiteSpace(request.Email))
    {
        return Results.BadRequest(
            "Email boş olamaz."
        );
    }

    if (string.IsNullOrWhiteSpace(request.Sifre))
    {
        return Results.BadRequest(
            "Şifre boş olamaz."
        );
    }

    if (request.Sifre.Length < 6)
    {
        return Results.BadRequest(
            "Şifre en az 6 karakter olmalıdır."
        );
    }

    var kullanici =
        authService.Register(request);

    if (kullanici == null)
    {
        return Results.BadRequest(
            "Bu email adresi zaten kullanılıyor."
        );
    }

    return Results.Ok(new
    {
        kullanici.Id,
        kullanici.Ad,
        kullanici.Soyad,
        kullanici.Email,
        kullanici.Rol
    });
});


// ==========================
// LOGIN
// HERKESE AÇIK
// ==========================

app.MapPost("/auth/login", (
    LoginRequest request,
    AuthService authService) =>
{
    if (string.IsNullOrWhiteSpace(request.Email))
    {
        return Results.BadRequest(
            "Email boş olamaz."
        );
    }

    if (string.IsNullOrWhiteSpace(request.Sifre))
    {
        return Results.BadRequest(
            "Şifre boş olamaz."
        );
    }

    var kullanici =
        authService.Login(request);

    if (kullanici == null)
    {
        return Results.Unauthorized();
    }

    var token =
        authService.TokenOlustur(kullanici);

    return Results.Ok(new
    {
        token,

        kullanici = new
        {
            kullanici.Id,
            kullanici.Ad,
            kullanici.Soyad,
            kullanici.Email,
            kullanici.Rol
        }
    });
});


// ======================================================
// ÖĞRENCİ ENDPOINTLERİ
// ======================================================


// ==========================
// GET - ID 1 ÖĞRENCİ
// GİRİŞ ZORUNLU
// ==========================

app.MapGet("/ogrenci", (
    OgrenciService service) =>
{
    var ogrenci =
        service.GetById(1);

    if (ogrenci == null)
    {
        return Results.NotFound(
            "Öğrenci bulunamadı."
        );
    }

    return Results.Ok(ogrenci);
})
.RequireAuthorization();


// ==========================
// GET - TÜM ÖĞRENCİLER
// GİRİŞ ZORUNLU
// ==========================

app.MapGet("/ogrenciler", (
    OgrenciService service) =>
{
    return Results.Ok(
        service.GetAll()
    );
})
.RequireAuthorization();


// ==========================
// GET - ID İLE ÖĞRENCİ
// GİRİŞ ZORUNLU
// ==========================

app.MapGet("/ogrenciler/{id}", (
    int id,
    OgrenciService service) =>
{
    var ogrenci =
        service.GetById(id);

    if (ogrenci == null)
    {
        return Results.NotFound(
            "Öğrenci bulunamadı."
        );
    }

    return Results.Ok(ogrenci);
})
.RequireAuthorization();


// ==========================
// POST - ÖĞRENCİ EKLE
// SADECE ADMIN
// ==========================

app.MapPost("/ogrenciler", (
    Ogrenci yeniOgrenci,
    OgrenciService service) =>
{
    if (string.IsNullOrWhiteSpace(
        yeniOgrenci.Ad))
    {
        return Results.BadRequest(
            "Öğrenci adı boş olamaz."
        );
    }

    if (string.IsNullOrWhiteSpace(
        yeniOgrenci.Soyad))
    {
        return Results.BadRequest(
            "Öğrenci soyadı boş olamaz."
        );
    }

    if (string.IsNullOrWhiteSpace(
        yeniOgrenci.Bolum))
    {
        return Results.BadRequest(
            "Bölüm boş olamaz."
        );
    }

    if (yeniOgrenci.Yas <= 0)
    {
        return Results.BadRequest(
            "Yaş 0'dan büyük olmalıdır."
        );
    }

    var ogrenci =
        service.Add(yeniOgrenci);

    return Results.Created(
        $"/ogrenciler/{ogrenci.Id}",
        ogrenci
    );
})
.RequireAuthorization(policy =>
    policy.RequireRole("Admin")
);


// ==========================
// PUT - ÖĞRENCİ GÜNCELLE
// SADECE ADMIN
// ==========================

app.MapPut("/ogrenciler/{id}", (
    int id,
    Ogrenci guncelOgrenci,
    OgrenciService service) =>
{
    if (string.IsNullOrWhiteSpace(
        guncelOgrenci.Ad))
    {
        return Results.BadRequest(
            "Öğrenci adı boş olamaz."
        );
    }

    if (string.IsNullOrWhiteSpace(
        guncelOgrenci.Soyad))
    {
        return Results.BadRequest(
            "Öğrenci soyadı boş olamaz."
        );
    }

    if (string.IsNullOrWhiteSpace(
        guncelOgrenci.Bolum))
    {
        return Results.BadRequest(
            "Bölüm boş olamaz."
        );
    }

    if (guncelOgrenci.Yas <= 0)
    {
        return Results.BadRequest(
            "Yaş 0'dan büyük olmalıdır."
        );
    }

    var ogrenci =
        service.Update(
            id,
            guncelOgrenci
        );

    if (ogrenci == null)
    {
        return Results.NotFound(
            "Öğrenci bulunamadı."
        );
    }

    return Results.Ok(ogrenci);
})
.RequireAuthorization(policy =>
    policy.RequireRole("Admin")
);


// ==========================
// DELETE - ÖĞRENCİ SİL
// SADECE ADMIN
// ==========================

app.MapDelete("/ogrenciler/{id}", (
    int id,
    OgrenciService service) =>
{
    var sonuc =
        service.Delete(id);

    if (!sonuc)
    {
        return Results.NotFound(
            "Öğrenci bulunamadı."
        );
    }

    return Results.Ok(
        "Öğrenci silindi."
    );
})
.RequireAuthorization(policy =>
    policy.RequireRole("Admin")
);


// ======================================================
// DERS ENDPOINTLERİ
// ======================================================


// ==========================
// GET - TÜM DERSLER
// GİRİŞ ZORUNLU
// ==========================

app.MapGet("/dersler", (
    DersService service) =>
{
    return Results.Ok(
        service.GetAll()
    );
})
.RequireAuthorization();


// ==========================
// GET - ID İLE DERS
// GİRİŞ ZORUNLU
// ==========================

app.MapGet("/dersler/{id}", (
    int id,
    DersService service) =>
{
    var ders =
        service.GetById(id);

    if (ders == null)
    {
        return Results.NotFound(
            "Ders bulunamadı."
        );
    }

    return Results.Ok(ders);
})
.RequireAuthorization();


// ==========================
// POST - DERS EKLE
// SADECE ADMIN
// ==========================

app.MapPost("/dersler", (
    Ders yeniDers,
    DersService service) =>
{
    if (string.IsNullOrWhiteSpace(
        yeniDers.DersAdi))
    {
        return Results.BadRequest(
            "Ders adı boş olamaz."
        );
    }

    if (string.IsNullOrWhiteSpace(
        yeniDers.DersKodu))
    {
        return Results.BadRequest(
            "Ders kodu boş olamaz."
        );
    }

    if (yeniDers.Kredi <= 0)
    {
        return Results.BadRequest(
            "Ders kredisi 0'dan büyük olmalıdır."
        );
    }

    var ders =
        service.Add(yeniDers);

    return Results.Created(
        $"/dersler/{ders.Id}",
        ders
    );
})
.RequireAuthorization(policy =>
    policy.RequireRole("Admin")
);


// ==========================
// PUT - DERS GÜNCELLE
// SADECE ADMIN
// ==========================

app.MapPut("/dersler/{id}", (
    int id,
    Ders guncelDers,
    DersService service) =>
{
    if (string.IsNullOrWhiteSpace(
        guncelDers.DersAdi))
    {
        return Results.BadRequest(
            "Ders adı boş olamaz."
        );
    }

    if (string.IsNullOrWhiteSpace(
        guncelDers.DersKodu))
    {
        return Results.BadRequest(
            "Ders kodu boş olamaz."
        );
    }

    if (guncelDers.Kredi <= 0)
    {
        return Results.BadRequest(
            "Ders kredisi 0'dan büyük olmalıdır."
        );
    }

    var ders =
        service.Update(
            id,
            guncelDers
        );

    if (ders == null)
    {
        return Results.NotFound(
            "Ders bulunamadı."
        );
    }

    return Results.Ok(ders);
})
.RequireAuthorization(policy =>
    policy.RequireRole("Admin")
);


// ==========================
// DELETE - DERS SİL
// SADECE ADMIN
// ==========================

app.MapDelete("/dersler/{id}", (
    int id,
    DersService service) =>
{
    var sonuc =
        service.Delete(id);

    if (!sonuc)
    {
        return Results.NotFound(
            "Ders bulunamadı."
        );
    }

    return Results.Ok(
        "Ders silindi."
    );
})
.RequireAuthorization(policy =>
    policy.RequireRole("Admin")
);


// ======================================================
// KAYIT ENDPOINTLERİ
// ======================================================


// ==========================
// GET - TÜM KAYITLAR
// GİRİŞ ZORUNLU
// ==========================

app.MapGet("/kayitlar", (
    KayitService service) =>
{
    var kayitlar =
        service.GetAll();

    return Results.Ok(kayitlar);
})
.RequireAuthorization();


// ==========================
// POST - ÖĞRENCİYİ DERSE KAYDET
// SADECE ADMIN
// ==========================

app.MapPost("/kayitlar", (
    int ogrenciId,
    int dersId,
    KayitService service) =>
{
    if (!service.OgrenciVarMi(
        ogrenciId))
    {
        return Results.NotFound(
            "Öğrenci bulunamadı."
        );
    }

    if (!service.DersVarMi(
        dersId))
    {
        return Results.NotFound(
            "Ders bulunamadı."
        );
    }

    var kayit =
        service.Add(
            ogrenciId,
            dersId
        );

    if (kayit == null)
    {
        return Results.BadRequest(
            "Öğrenci bu derse zaten kayıtlı."
        );
    }

    return Results.Created(
        $"/kayitlar/{kayit.Id}",
        kayit
    );
})
.RequireAuthorization(policy =>
    policy.RequireRole("Admin")
);


// ==========================
// GET - ÖĞRENCİNİN DERSLERİ
// GİRİŞ ZORUNLU
// ==========================

app.MapGet("/ogrenciler/{id}/dersler", (
    int id,
    KayitService service) =>
{
    var dersler =
        service.GetDerslerByOgrenciId(id);

    return Results.Ok(dersler);
})
.RequireAuthorization();


// ==========================
// GET - DERSTEKİ ÖĞRENCİLER
// GİRİŞ ZORUNLU
// ==========================

app.MapGet("/dersler/{id}/ogrenciler", (
    int id,
    KayitService service) =>
{
    var ogrenciler =
        service.GetOgrencilerByDersId(id);

    return Results.Ok(ogrenciler);
})
.RequireAuthorization();


// ==========================
// DELETE - ÖĞRENCİYİ DERSTEN ÇIKAR
// SADECE ADMIN
// ==========================

app.MapDelete("/kayitlar", (
    int ogrenciId,
    int dersId,
    KayitService service) =>
{
    var sonuc =
        service.Delete(
            ogrenciId,
            dersId
        );

    if (!sonuc)
    {
        return Results.NotFound(
            "Öğrencinin bu derse ait kaydı bulunamadı."
        );
    }

    return Results.Ok(
        "Öğrenci dersten çıkarıldı."
    );
})
.RequireAuthorization(policy =>
    policy.RequireRole("Admin")
);


// ==========================
// UYGULAMAYI BAŞLAT
// ==========================

app.Run();