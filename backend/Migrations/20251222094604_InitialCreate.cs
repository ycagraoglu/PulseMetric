using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Analytics.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "analytics_events",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    tenant_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    visitor_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    event_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    url_path = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    page_title = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    referrer = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    device = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    browser = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    os = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    country = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: true),
                    screen_width = table.Column<int>(type: "integer", nullable: true),
                    screen_height = table.Column<int>(type: "integer", nullable: true),
                    language = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    session_duration = table.Column<int>(type: "integer", nullable: true),
                    timestamp = table.Column<long>(type: "bigint", nullable: false),
                    data = table.Column<string>(type: "jsonb", nullable: true),
                    created_at = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_analytics_events", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "tenants",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    domain = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    api_key = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<long>(type: "bigint", nullable: false),
                    updated_at = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tenants", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_events_event_name",
                table: "analytics_events",
                column: "event_name");

            migrationBuilder.CreateIndex(
                name: "ix_events_tenant_timestamp",
                table: "analytics_events",
                columns: new[] { "tenant_id", "timestamp" });

            migrationBuilder.CreateIndex(
                name: "ix_events_timestamp",
                table: "analytics_events",
                column: "timestamp");

            migrationBuilder.CreateIndex(
                name: "ix_events_visitor_id",
                table: "analytics_events",
                column: "visitor_id");

            migrationBuilder.CreateIndex(
                name: "ix_tenants_api_key",
                table: "tenants",
                column: "api_key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_tenants_domain",
                table: "tenants",
                column: "domain");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "analytics_events");

            migrationBuilder.DropTable(
                name: "tenants");
        }
    }
}
