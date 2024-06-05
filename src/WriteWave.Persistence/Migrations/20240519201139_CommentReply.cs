using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WriteWave.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CommentReply : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ParentCommentId",
                table: "Comments",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PublicationDate",
                table: "Comments",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "ArticleId",
                keyValue: 1,
                columns: new[] { "PublicationDate", "Status" },
                values: new object[] { new DateTime(2024, 5, 19, 20, 11, 37, 421, DateTimeKind.Utc).AddTicks(2717), 1 });

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "ArticleId",
                keyValue: 2,
                columns: new[] { "PublicationDate", "Status" },
                values: new object[] { new DateTime(2024, 5, 19, 20, 11, 37, 421, DateTimeKind.Utc).AddTicks(2721), 1 });

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

            migrationBuilder.CreateIndex(
                name: "IX_Comments_ParentCommentId",
                table: "Comments",
                column: "ParentCommentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Comments_ParentCommentId",
                table: "Comments",
                column: "ParentCommentId",
                principalTable: "Comments",
                principalColumn: "CommentId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Comments_ParentCommentId",
                table: "Comments");

            migrationBuilder.DropIndex(
                name: "IX_Comments_ParentCommentId",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "ParentCommentId",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "PublicationDate",
                table: "Comments");

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "ArticleId",
                keyValue: 1,
                columns: new[] { "PublicationDate", "Status" },
                values: new object[] { new DateTime(2024, 5, 4, 12, 20, 2, 883, DateTimeKind.Utc).AddTicks(5997), 0 });

            migrationBuilder.UpdateData(
                table: "Articles",
                keyColumn: "ArticleId",
                keyValue: 2,
                columns: new[] { "PublicationDate", "Status" },
                values: new object[] { new DateTime(2024, 5, 4, 12, 20, 2, 883, DateTimeKind.Utc).AddTicks(5999), 0 });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "VerifiedAt",
                value: null);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                column: "VerifiedAt",
                value: null);
        }
    }
}
