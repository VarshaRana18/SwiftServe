using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodDeliveryApi.Migrations
{
    /// <inheritdoc />
    public partial class AddImageUrls : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "isOpen",
                table: "Restaurants",
                newName: "IsOpen");

            migrationBuilder.RenameColumn(
                name: "isActive",
                table: "Restaurants",
                newName: "IsActive");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Restaurants",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Restaurants");

            migrationBuilder.RenameColumn(
                name: "IsOpen",
                table: "Restaurants",
                newName: "isOpen");

            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "Restaurants",
                newName: "isActive");
        }
    }
}
