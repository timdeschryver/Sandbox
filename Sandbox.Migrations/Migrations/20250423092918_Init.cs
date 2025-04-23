using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sandbox.Migrations.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "CustomerManagement");

            migrationBuilder.CreateTable(
                name: "Customers",
                schema: "CustomerManagement",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name_FirstName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Name_LastName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CustomerAddresses",
                schema: "CustomerManagement",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AddressType = table.Column<string>(type: "character varying(21)", maxLength: 21, nullable: false),
                    CustomerId = table.Column<Guid>(type: "uuid", nullable: false),
                    Address_City = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Address_Street = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Address_ZipCode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Note = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerAddresses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomerAddresses_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalSchema: "CustomerManagement",
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CustomerAddresses_CustomerId",
                schema: "CustomerManagement",
                table: "CustomerAddresses",
                column: "CustomerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CustomerAddresses",
                schema: "CustomerManagement");

            migrationBuilder.DropTable(
                name: "Customers",
                schema: "CustomerManagement");
        }
    }
}
