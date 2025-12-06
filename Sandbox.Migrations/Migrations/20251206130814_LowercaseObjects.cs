using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sandbox.Migrations.Migrations
{
    /// <inheritdoc />
    public partial class LowercaseObjects : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomerAddresses_Customers_CustomerId",
                schema: "CustomerManagement",
                table: "CustomerAddresses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customers",
                schema: "CustomerManagement",
                table: "Customers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CustomerAddresses",
                schema: "CustomerManagement",
                table: "CustomerAddresses");

            migrationBuilder.EnsureSchema(
                name: "customermanagement");

            migrationBuilder.RenameTable(
                name: "Customers",
                schema: "CustomerManagement",
                newName: "customers",
                newSchema: "customermanagement");

            migrationBuilder.RenameTable(
                name: "CustomerAddresses",
                schema: "CustomerManagement",
                newName: "customeraddresses",
                newSchema: "customermanagement");

            migrationBuilder.RenameIndex(
                name: "IX_CustomerAddresses_CustomerId",
                schema: "customermanagement",
                table: "customeraddresses",
                newName: "IX_customeraddresses_CustomerId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_customers",
                schema: "customermanagement",
                table: "customers",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_customeraddresses",
                schema: "customermanagement",
                table: "customeraddresses",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_customeraddresses_customers_CustomerId",
                schema: "customermanagement",
                table: "customeraddresses",
                column: "CustomerId",
                principalSchema: "customermanagement",
                principalTable: "customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_customeraddresses_customers_CustomerId",
                schema: "customermanagement",
                table: "customeraddresses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_customers",
                schema: "customermanagement",
                table: "customers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_customeraddresses",
                schema: "customermanagement",
                table: "customeraddresses");

            migrationBuilder.EnsureSchema(
                name: "CustomerManagement");

            migrationBuilder.RenameTable(
                name: "customers",
                schema: "customermanagement",
                newName: "Customers",
                newSchema: "CustomerManagement");

            migrationBuilder.RenameTable(
                name: "customeraddresses",
                schema: "customermanagement",
                newName: "CustomerAddresses",
                newSchema: "CustomerManagement");

            migrationBuilder.RenameIndex(
                name: "IX_customeraddresses_CustomerId",
                schema: "CustomerManagement",
                table: "CustomerAddresses",
                newName: "IX_CustomerAddresses_CustomerId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customers",
                schema: "CustomerManagement",
                table: "Customers",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CustomerAddresses",
                schema: "CustomerManagement",
                table: "CustomerAddresses",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CustomerAddresses_Customers_CustomerId",
                schema: "CustomerManagement",
                table: "CustomerAddresses",
                column: "CustomerId",
                principalSchema: "CustomerManagement",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
