using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WriteWave.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class chat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PrivateMessage",
                columns: table => new
                {
                    MessageId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Content = table.Column<string>(type: "text", nullable: true),
                    SentAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SenderId = table.Column<int>(type: "integer", nullable: false),
                    ReceiverId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrivateMessage", x => x.MessageId);
                    table.ForeignKey(
                        name: "FK_PrivateMessage_Users_ReceiverId",
                        column: x => x.ReceiverId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PrivateMessage_Users_SenderId",
                        column: x => x.SenderId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "ArticleId",
                keyValue: 1,
                column: "PublicationDate",
                value: new DateTime(2024, 5, 27, 20, 3, 2, 151, DateTimeKind.Utc).AddTicks(4304));

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "ArticleId",
                keyValue: 2,
                column: "PublicationDate",
                value: new DateTime(2024, 5, 27, 20, 3, 2, 151, DateTimeKind.Utc).AddTicks(4307));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "VerifiedAt",
                value: new DateTime(2024, 5, 27, 20, 3, 2, 151, DateTimeKind.Utc).AddTicks(4251));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                column: "VerifiedAt",
                value: new DateTime(2024, 5, 27, 20, 3, 2, 151, DateTimeKind.Utc).AddTicks(4259));

            migrationBuilder.CreateIndex(
                name: "IX_PrivateMessage_ReceiverId",
                table: "PrivateMessage",
                column: "ReceiverId");

            migrationBuilder.CreateIndex(
                name: "IX_PrivateMessage_SenderId",
                table: "PrivateMessage",
                column: "SenderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PrivateMessage");

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "ArticleId",
                keyValue: 1,
                column: "PublicationDate",
                value: new DateTime(2024, 5, 19, 20, 11, 37, 421, DateTimeKind.Utc).AddTicks(2717));

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "ArticleId",
                keyValue: 2,
                column: "PublicationDate",
                value: new DateTime(2024, 5, 19, 20, 11, 37, 421, DateTimeKind.Utc).AddTicks(2721));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "VerifiedAt",
                value: new DateTime(2024, 5, 19, 20, 11, 37, 421, DateTimeKind.Utc).AddTicks(2643));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                column: "VerifiedAt",
                value: new DateTime(2024, 5, 19, 20, 11, 37, 421, DateTimeKind.Utc).AddTicks(2652));
        }
    }
}
