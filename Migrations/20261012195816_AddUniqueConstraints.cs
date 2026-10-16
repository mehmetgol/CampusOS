using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CampusOS.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Kayitlar_OgrenciId",
                table: "Kayitlar");

            migrationBuilder.AlterColumn<string>(
                name: "DersKodu",
                table: "Dersler",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Kayitlar_OgrenciId_DersId",
                table: "Kayitlar",
                columns: new[] { "OgrenciId", "DersId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Dersler_DersKodu",
                table: "Dersler",
                column: "DersKodu",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Kayitlar_OgrenciId_DersId",
                table: "Kayitlar");

            migrationBuilder.DropIndex(
                name: "IX_Dersler_DersKodu",
                table: "Dersler");

            migrationBuilder.AlterColumn<string>(
                name: "DersKodu",
                table: "Dersler",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.CreateIndex(
                name: "IX_Kayitlar_OgrenciId",
                table: "Kayitlar",
                column: "OgrenciId");
        }
    }
}
