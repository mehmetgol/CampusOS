using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CampusOS.Migrations
{
    /// <inheritdoc />
    public partial class AddNotVeAgno : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OgrenciId",
                table: "Kullanicilar",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HarfNotu",
                table: "Kayitlar",
                type: "nvarchar(2)",
                maxLength: 2,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Kullanicilar_OgrenciId",
                table: "Kullanicilar",
                column: "OgrenciId",
                unique: true,
                filter: "[OgrenciId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Kullanicilar_Ogrenciler_OgrenciId",
                table: "Kullanicilar",
                column: "OgrenciId",
                principalTable: "Ogrenciler",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Kullanicilar_Ogrenciler_OgrenciId",
                table: "Kullanicilar");

            migrationBuilder.DropIndex(
                name: "IX_Kullanicilar_OgrenciId",
                table: "Kullanicilar");

            migrationBuilder.DropColumn(
                name: "OgrenciId",
                table: "Kullanicilar");

            migrationBuilder.DropColumn(
                name: "HarfNotu",
                table: "Kayitlar");
        }
    }
}
