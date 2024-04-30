using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WriteWave.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ArticleStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Articles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "ArticleId",
                keyValue: 1,
                columns: new[] { "PublicationDate", "Status" },
                values: new object[] { new DateTime(2024, 4, 22, 11, 54, 15, 713, DateTimeKind.Utc).AddTicks(6037), 0 });

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "ArticleId",
                keyValue: 2,
                columns: new[] { "PublicationDate", "Status" },
                values: new object[] { new DateTime(2024, 4, 22, 11, 54, 15, 713, DateTimeKind.Utc).AddTicks(6040), 0 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Articles");

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "ArticleId",
                keyValue: 1,
                column: "PublicationDate",
                value: new DateTime(2024, 4, 11, 19, 55, 48, 73, DateTimeKind.Utc).AddTicks(6888));

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "ArticleId",
                keyValue: 2,
                column: "PublicationDate",
                value: new DateTime(2024, 4, 11, 19, 55, 48, 73, DateTimeKind.Utc).AddTicks(6890));
        }
    }
}
