using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WriteWave.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Roles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Role",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "ArticleId",
                keyValue: 1,
                column: "PublicationDate",
                value: new DateTime(2024, 4, 10, 7, 0, 33, 637, DateTimeKind.Utc).AddTicks(8989));

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "ArticleId",
                keyValue: 2,
                column: "PublicationDate",
                value: new DateTime(2024, 4, 10, 7, 0, 33, 637, DateTimeKind.Utc).AddTicks(8992));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "Role",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                column: "Role",
                value: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "ArticleId",
                keyValue: 1,
                column: "PublicationDate",
                value: new DateTime(2024, 4, 8, 10, 42, 29, 654, DateTimeKind.Utc).AddTicks(8952));

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "ArticleId",
                keyValue: 2,
                column: "PublicationDate",
                value: new DateTime(2024, 4, 8, 10, 42, 29, 654, DateTimeKind.Utc).AddTicks(8955));
        }
    }
}
