using Microsoft.EntityFrameworkCore.Migrations;

namespace CarPoolAPI.Migrations
{
    public partial class Migration4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ViaPoints_Location_PlaceId",
                table: "ViaPoints");

            migrationBuilder.DropIndex(
                name: "IX_ViaPoints_PlaceId",
                table: "ViaPoints");

            migrationBuilder.DropColumn(
                name: "PlaceId",
                table: "ViaPoints");

            migrationBuilder.AddColumn<int>(
                name: "LocationId",
                table: "ViaPoints",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Longitude",
                table: "Location",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<string>(
                name: "Lattitude",
                table: "Location",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.CreateIndex(
                name: "IX_ViaPoints_LocationId",
                table: "ViaPoints",
                column: "LocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_ViaPoints_Location_LocationId",
                table: "ViaPoints",
                column: "LocationId",
                principalTable: "Location",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ViaPoints_Location_LocationId",
                table: "ViaPoints");

            migrationBuilder.DropIndex(
                name: "IX_ViaPoints_LocationId",
                table: "ViaPoints");

            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "ViaPoints");

            migrationBuilder.AddColumn<int>(
                name: "PlaceId",
                table: "ViaPoints",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "Longitude",
                table: "Location",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "Lattitude",
                table: "Location",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ViaPoints_PlaceId",
                table: "ViaPoints",
                column: "PlaceId");

            migrationBuilder.AddForeignKey(
                name: "FK_ViaPoints_Location_PlaceId",
                table: "ViaPoints",
                column: "PlaceId",
                principalTable: "Location",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
