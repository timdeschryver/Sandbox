using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sandbox.ApiService.Migrations.Migrations
{
    /// <inheritdoc />
    public partial class ModulesSetup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "CustomerManagement");

            migrationBuilder.RenameTable(
                name: "Customers",
                schema: "Customer",
                newName: "Customers",
                newSchema: "CustomerManagement");

            migrationBuilder.RenameTable(
                name: "CustomerAddresses",
                schema: "Customer",
                newName: "CustomerAddresses",
                newSchema: "CustomerManagement");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Customer");

            migrationBuilder.RenameTable(
                name: "Customers",
                schema: "CustomerManagement",
                newName: "Customers",
                newSchema: "Customer");

            migrationBuilder.RenameTable(
                name: "CustomerAddresses",
                schema: "CustomerManagement",
                newName: "CustomerAddresses",
                newSchema: "Customer");
        }
    }
}
