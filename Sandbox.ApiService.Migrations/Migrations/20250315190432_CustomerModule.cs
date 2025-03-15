using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sandbox.ApiService.Migrations.Migrations
{
    /// <inheritdoc />
    public partial class CustomerModule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "customer");

            migrationBuilder.CreateTable(
                name: "Customers",
                schema: "customer",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name_FirstName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Name_LastName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CustomerAddresses",
                schema: "customer",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AddressType = table.Column<string>(type: "nvarchar(21)", maxLength: 21, nullable: false),
                    CustomerId = table.Column<int>(type: "int", nullable: false),
                    Address_City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Address_Street = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Address_ZipCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerAddresses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomerAddresses_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalSchema: "customer",
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CustomerAddresses_CustomerId",
                schema: "customer",
                table: "CustomerAddresses",
                column: "CustomerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CustomerAddresses",
                schema: "customer");

            migrationBuilder.DropTable(
                name: "Customers",
                schema: "customer");
        }
    }
}
