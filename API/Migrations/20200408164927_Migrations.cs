using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CarPoolAPI.Migrations
{
    public partial class Migrations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Location",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Longitude = table.Column<long>(nullable: false),
                    LocationName = table.Column<string>(nullable: true),
                    Lattitude = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Location", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: true),
                    Password = table.Column<string>(nullable: true),
                    Age = table.Column<int>(nullable: false),
                    Gender = table.Column<string>(nullable: true),
                    ImageUploadedName = table.Column<string>(nullable: true),
                    Active = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Vechicles",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NumberPlate = table.Column<string>(nullable: true),
                    Type = table.Column<string>(type: "nvarchar(10)", nullable: false),
                    Capacity = table.Column<int>(nullable: false),
                    Active = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vechicles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Offerrings",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Active = table.Column<bool>(nullable: false),
                    StartTime = table.Column<DateTime>(nullable: false),
                    EndTime = table.Column<DateTime>(nullable: false),
                    Discount = table.Column<string>(type: "nvarchar(15)", nullable: false),
                    CurrentLocationId = table.Column<int>(nullable: true),
                    SourceId = table.Column<int>(nullable: true),
                    DestinationId = table.Column<int>(nullable: true),
                    PricePerKM = table.Column<float>(nullable: false),
                    TotalEarning = table.Column<float>(nullable: false),
                    VechicleRef = table.Column<int>(nullable: false),
                    UserId = table.Column<int>(nullable: false),
                    SeatsOffered = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Offerrings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Offerrings_Location_CurrentLocationId",
                        column: x => x.CurrentLocationId,
                        principalTable: "Location",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Offerrings_Location_DestinationId",
                        column: x => x.DestinationId,
                        principalTable: "Location",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Offerrings_Location_SourceId",
                        column: x => x.SourceId,
                        principalTable: "Location",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Offerrings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Offerrings_Vechicles_VechicleRef",
                        column: x => x.VechicleRef,
                        principalTable: "Vechicles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Active = table.Column<bool>(nullable: false),
                    BookingStatus = table.Column<string>(type: "nvarchar(15)", nullable: false),
                    FarePrice = table.Column<float>(nullable: false),
                    DateTime = table.Column<DateTime>(nullable: false),
                    DepartingTime = table.Column<DateTime>(nullable: false),
                    EndTime = table.Column<DateTime>(nullable: false),
                    SourceId = table.Column<int>(nullable: true),
                    DestinationId = table.Column<int>(nullable: true),
                    UserId = table.Column<int>(nullable: false),
                    OfferId = table.Column<int>(nullable: false),
                    SeatsBooked = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bookings_Location_DestinationId",
                        column: x => x.DestinationId,
                        principalTable: "Location",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Bookings_Offerrings_OfferId",
                        column: x => x.OfferId,
                        principalTable: "Offerrings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Bookings_Location_SourceId",
                        column: x => x.SourceId,
                        principalTable: "Location",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Bookings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "ViaPoints",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlaceId = table.Column<int>(nullable: true),
                    OfferId = table.Column<int>(nullable: false),
                    Active = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ViaPoints", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ViaPoints_Offerrings_OfferId",
                        column: x => x.OfferId,
                        principalTable: "Offerrings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ViaPoints_Location_PlaceId",
                        column: x => x.PlaceId,
                        principalTable: "Location",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Active", "Age", "Gender", "ImageUploadedName", "Name", "Password" },
                values: new object[,]
                {
                    { 3301, false, 20, "MALE", null, "Monu", "monu" },
                    { 3302, false, 22, "MALE", null, "Abhinav", "abhinav" },
                    { 3306, false, 24, "MALE", null, "Sreyash", "sreyash" },
                    { 3305, false, 21, "FEMALE", null, "Priya", "priya" },
                    { 3308, false, 24, "MALE", null, "Devansh", "devansh" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_DestinationId",
                table: "Bookings",
                column: "DestinationId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_OfferId",
                table: "Bookings",
                column: "OfferId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_SourceId",
                table: "Bookings",
                column: "SourceId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_UserId",
                table: "Bookings",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Offerrings_CurrentLocationId",
                table: "Offerrings",
                column: "CurrentLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_Offerrings_DestinationId",
                table: "Offerrings",
                column: "DestinationId");

            migrationBuilder.CreateIndex(
                name: "IX_Offerrings_SourceId",
                table: "Offerrings",
                column: "SourceId");

            migrationBuilder.CreateIndex(
                name: "IX_Offerrings_UserId",
                table: "Offerrings",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Offerrings_VechicleRef",
                table: "Offerrings",
                column: "VechicleRef",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ViaPoints_OfferId",
                table: "ViaPoints",
                column: "OfferId");

            migrationBuilder.CreateIndex(
                name: "IX_ViaPoints_PlaceId",
                table: "ViaPoints",
                column: "PlaceId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.DropTable(
                name: "ViaPoints");

            migrationBuilder.DropTable(
                name: "Offerrings");

            migrationBuilder.DropTable(
                name: "Location");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Vechicles");
        }
    }
}
