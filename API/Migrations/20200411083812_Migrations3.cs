using Microsoft.EntityFrameworkCore.Migrations;

namespace CarPoolAPI.Migrations
{
    public partial class Migrations3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SeatsAvailable",
                table: "Offerrings",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SeatsAvailable",
                table: "Offerrings");
        }
    }
}
