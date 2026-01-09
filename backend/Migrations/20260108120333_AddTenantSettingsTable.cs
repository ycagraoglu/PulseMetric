using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Analytics.API.Migrations
{
    /// <inheritdoc />
    public partial class AddTenantSettingsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "updated_at",
                table: "users",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "tenant_settings",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    tenant_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    project_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    project_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    data_retention_days = table.Column<int>(type: "integer", nullable: false),
                    timezone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    email_notifications = table.Column<bool>(type: "boolean", nullable: false),
                    push_notifications = table.Column<bool>(type: "boolean", nullable: false),
                    weekly_reports = table.Column<bool>(type: "boolean", nullable: false),
                    daily_digest = table.Column<bool>(type: "boolean", nullable: false),
                    two_factor_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    session_timeout_minutes = table.Column<int>(type: "integer", nullable: false),
                    ip_whitelist = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    updated_at = table.Column<long>(type: "bigint", nullable: true),
                    created_at = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tenant_settings", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tenant_settings");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "users");
        }
    }
}
