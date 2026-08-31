using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodDeliveryApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAppUserFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "fullName",
                table: "AspNetUsers",
                newName: "FullName");

            migrationBuilder.RenameColumn(
                name: "createdAt",
                table: "AspNetUsers",
                newName: "CreatedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FullName",
                table: "AspNetUsers",
                newName: "fullName");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "AspNetUsers",
                newName: "createdAt");
        }
    }
}
