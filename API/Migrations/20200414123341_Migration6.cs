using Microsoft.EntityFrameworkCore.Migrations;

namespace CarPoolAPI.Migrations
{
    public partial class Migration6 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRideStarted",
                table: "Offerrings",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRideStarted",
                table: "Offerrings");
        }
    }
}
