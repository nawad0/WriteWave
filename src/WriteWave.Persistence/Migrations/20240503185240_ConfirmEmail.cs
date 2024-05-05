using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WriteWave.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ConfirmEmail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "EmailConfirmed",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "ArticleId",
                keyValue: 1,
                column: "PublicationDate",
                value: new DateTime(2024, 5, 3, 18, 52, 37, 908, DateTimeKind.Utc).AddTicks(9083));

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "ArticleId",
                keyValue: 2,
                column: "PublicationDate",
                value: new DateTime(2024, 5, 3, 18, 52, 37, 908, DateTimeKind.Utc).AddTicks(9085));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "EmailConfirmed",
                value: false);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                column: "EmailConfirmed",
                value: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailConfirmed",
                table: "Users");

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "ArticleId",
                keyValue: 1,
                column: "PublicationDate",
                value: new DateTime(2024, 4, 22, 11, 54, 15, 713, DateTimeKind.Utc).AddTicks(6037));

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "ArticleId",
                keyValue: 2,
                column: "PublicationDate",
                value: new DateTime(2024, 4, 22, 11, 54, 15, 713, DateTimeKind.Utc).AddTicks(6040));
        }
    }
}
