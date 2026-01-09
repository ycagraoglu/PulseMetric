import { useState, useMemo, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Search, Eye, ChevronLeft, ChevronRight, TrendingUp, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { UserAvatar } from "@/components/users/UserAvatar";
import { SessionDetailsDialog } from "@/components/users/SessionDetailsDialog";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCardSkeleton, ChartSkeleton, UsersTableSkeleton } from "@/components/ui/skeletons";
import { subDays, format } from "date-fns";
import { useSessions, useSessionDetails, useSessionsCount, useSessionsChart, sessionKeys } from "@/hooks/useSessions";
import { formatDuration, formatSessionDate, formatSessionTime } from "@/services/sessions";

// ============================================
// Types
// ============================================

type ChartMetric = "sessions" | "duration" | "bounceRate";

interface SessionDisplay {
  id: string;
  visitorId: string;
  userName: string;
  date: string;
  dateObj: Date;
  duration: string;
  eventCount: number;
}

// ============================================
// Constants
// ============================================

const PAGE_TITLE = "Sessions";
const PAGE_DESCRIPTION = "Track and analyze user sessions in your application";
const DEFAULT_PAGE_SIZE = 10;

const CHART_DESCRIPTIONS: Record<ChartMetric, string> = {
  sessions: "Number of sessions started each day",
  duration: "Average session duration in seconds",
  bounceRate: "Bounce rate percentage over time",
};

// ============================================
// Sub-Components
// ============================================

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  showTrend?: boolean;
}

const StatCard = ({ label, value, subtitle, showTrend }: StatCardProps) => (
  <Card className="bg-card border-border">
    <CardContent className="p-5">
      <span className="stat-label">{label}</span>
      <div className="stat-value text-foreground mt-2">{value.toLocaleString()}</div>
      {showTrend ? (
        <div className="flex items-center gap-1 text-sm mt-1">
          <TrendingUp className="w-3 h-3 text-green-500" />
          <span className="text-muted-foreground">All time</span>
        </div>
      ) : subtitle ? (
        <span className="text-sm text-muted-foreground">{subtitle}</span>
      ) : null}
    </CardContent>
  </Card>
);

interface SessionRowProps {
  session: SessionDisplay;
  onClick: () => void;
}

const SessionRow = ({ session, onClick }: SessionRowProps) => (
  <tr
    className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer"
    onClick={onClick}
  >
    <td className="p-4">
      <div className="flex items-center gap-3">
        <UserAvatar name={session.userName} className="w-8 h-8" />
        <span className="text-foreground">{session.userName}</span>
      </div>
    </td>
    <td className="p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Calendar className="w-4 h-4" />
        {session.date}
      </div>
    </td>
    <td className="p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock className="w-4 h-4" />
        {session.duration}
      </div>
    </td>
    <td className="p-4">
      <span className="text-muted-foreground">{session.eventCount} events</span>
    </td>
    <td className="p-4">
      <Eye className="w-4 h-4 text-muted-foreground" />
    </td>
  </tr>
);

interface PaginationProps {
  page: number;
  totalPages: number;
  perPage: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
  onPerPageChange: (value: number) => void;
}

const Pagination = ({
  page,
  totalPages,
  perPage,
  totalItems,
  onPrevious,
  onNext,
  onPerPageChange,
}: PaginationProps) => (
  <div className="flex items-center justify-between mt-4">
    <Button
      variant="outline"
      size="sm"
      onClick={onPrevious}
      disabled={page === 1}
      className="flex items-center gap-1"
    >
      <ChevronLeft className="w-4 h-4" />
      Previous
    </Button>
    <span className="text-sm text-muted-foreground">
      Page {page} of {totalPages} ({totalItems} total)
    </span>
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Rows:</span>
      <Select value={perPage.toString()} onValueChange={(v) => onPerPageChange(Number(v))}>
        <SelectTrigger className="w-16 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={page === totalPages}
        className="flex items-center gap-1"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

// ============================================
// Main Component
// ============================================

const Sessions = () => {
  const queryClient = useQueryClient();

  // State
  const [chartMetric, setChartMetric] = useState<ChartMetric>("sessions");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [selectedSession, setSelectedSession] = useState<SessionDisplay | null>(null);
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  // Queries
  const sessionsQuery = useSessions({
    from: format(dateRange.from, "yyyy-MM-dd"),
    to: format(dateRange.to, "yyyy-MM-dd"),
    page,
    pageSize: perPage,
  });

  const countQuery = useSessionsCount();
  const chartQuery = useSessionsChart(7);
  const detailsQuery = useSessionDetails(selectedSession?.id ?? "");

  // Transform data
  const sessions: SessionDisplay[] = useMemo(() => {
    if (!sessionsQuery.data?.length) return [];
    return sessionsQuery.data.map((s) => ({
      id: s.sessionId,
      visitorId: s.visitorId,
      userName: `User ${s.visitorId?.slice(-6) || "Unknown"}`,
      date: formatSessionDate(s.startTime),
      dateObj: new Date(s.startTime),
      duration: formatDuration(s.durationSeconds),
      eventCount: s.eventCount,
    }));
  }, [sessionsQuery.data]);

  const filteredSessions = useMemo(() => {
    if (!search) return sessions;
    const searchLower = search.toLowerCase();
    return sessions.filter(
      (s) =>
        s.userName.toLowerCase().includes(searchLower) ||
        s.visitorId.toLowerCase().includes(searchLower)
    );
  }, [sessions, search]);

  const chartData = useMemo(() => {
    if (!chartQuery.data) return [];
    return chartQuery.data.map((d) => ({
      date: d.date,
      sessions: d.value,
      duration: 0,
      bounceRate: 0,
    }));
  }, [chartQuery.data]);

  const sessionEvents = useMemo(() => {
    if (!detailsQuery.data?.events) return [];
    return detailsQuery.data.events.map((e) => ({
      type: (e.eventName.includes("view") ? "view" : "action") as "view" | "action",
      name: e.eventName,
      time: formatSessionTime(e.timestamp),
    }));
  }, [detailsQuery.data]);

  // KPIs
  const totalSessions = countQuery.data?.total ?? 0;
  const todaySessions = countQuery.data?.todayCount ?? 0;
  const bounceRate = countQuery.data?.bounceRate ?? 0;
  const avgDuration = countQuery.data?.avgDuration ?? 0;

  // Derived state
  const totalPages = Math.ceil(filteredSessions.length / perPage) || 1;
  const hasError = sessionsQuery.isError || countQuery.isError;
  const hasNoData = !sessionsQuery.isLoading && !sessionsQuery.isError && sessions.length === 0;

  // Handlers
  const handleRetryAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: sessionKeys.all });
  }, [queryClient]);

  const handleDateRangeChange = useCallback((range: { from: Date; to: Date }) => {
    setDateRange(range);
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handlePerPageChange = useCallback((value: number) => {
    setPerPage(value);
    setPage(1);
  }, []);

  return (
    <DashboardLayout
      title={PAGE_TITLE}
      description={PAGE_DESCRIPTION}
      headerAction={
        <DateRangeFilter
          showPresets
          defaultPreset="7d"
          onChange={handleDateRangeChange}
        />
      }
    >
      {/* Global Error State */}
      {hasError && (
        <div className="mb-6">
          <ErrorState
            title="Session verileri yüklenemedi"
            message="Backend API'ye bağlanılamadı. Lütfen backend servisinin çalıştığından emin olun."
            onRetry={handleRetryAll}
          />
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {countQuery.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : countQuery.isError ? null : (
          <>
            <StatCard label="TOTAL SESSIONS" value={totalSessions} showTrend={totalSessions > 0} />
            <StatCard label="TODAY'S SESSIONS" value={todaySessions} subtitle="Sessions today" />
            <StatCard label="BOUNCE RATE" value={`${bounceRate}%`} subtitle="Single event sessions" />
            <StatCard label="AVG DURATION" value={formatDuration(Math.round(avgDuration))} subtitle="Avg time per session" />
          </>
        )}
      </div>

      {/* Chart */}
      {chartQuery.isLoading ? (
        <div className="mb-6">
          <ChartSkeleton />
        </div>
      ) : chartQuery.isError ? (
        <div className="mb-6">
          <ErrorState title="Grafik verileri yüklenemedi" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="mb-6">
          <EmptyState icon="chart" title="Grafik verisi yok" message="Seçilen tarih aralığında session verisi bulunmuyor." />
        </div>
      ) : (
        <Card className="bg-card border-border mb-6">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <Tabs defaultValue="sessions" onValueChange={(v) => setChartMetric(v as ChartMetric)}>
                <TabsList className="bg-muted h-9">
                  <TabsTrigger value="sessions" className="text-xs font-mono uppercase tracking-wider">Daily Sessions</TabsTrigger>
                  <TabsTrigger value="duration" className="text-xs font-mono uppercase tracking-wider">Average Duration</TabsTrigger>
                  <TabsTrigger value="bounceRate" className="text-xs font-mono uppercase tracking-wider">Bounce Rate</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <p className="text-sm text-muted-foreground mb-6">{CHART_DESCRIPTIONS[chartMetric]}</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dx={-10} hide />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} labelStyle={{ color: "hsl(var(--foreground))" }} />
                  <Area type="monotone" dataKey={chartMetric} stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorSessions)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions Table */}
      {sessionsQuery.isLoading ? (
        <UsersTableSkeleton rows={5} />
      ) : sessionsQuery.isError ? (
        <ErrorState title="Session listesi yüklenemedi" onRetry={() => sessionsQuery.refetch()} />
      ) : hasNoData ? (
        <EmptyState
          icon="calendar"
          title="Henüz session yok"
          message="Seçilen tarih aralığında kaydedilmiş session bulunmuyor. Web sitenize pulse.js scriptini ekleyerek veri toplamaya başlayabilirsiniz."
        />
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <div className="mb-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">ALL SESSIONS</h3>
              <p className="text-sm text-muted-foreground">Complete list of all sessions</p>
            </div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search User"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-64 bg-secondary border-border"
                />
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>
            </div>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground p-4">USER</th>
                    <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground p-4">DATE</th>
                    <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground p-4">DURATION</th>
                    <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground p-4">EVENTS</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No sessions found
                      </td>
                    </tr>
                  ) : (
                    filteredSessions.slice(0, perPage).map((session) => (
                      <SessionRow
                        key={session.id}
                        session={session}
                        onClick={() => setSelectedSession(session)}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              perPage={perPage}
              totalItems={filteredSessions.length}
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              onPerPageChange={handlePerPageChange}
            />
          </CardContent>
        </Card>
      )}

      <SessionDetailsDialog
        open={!!selectedSession}
        onOpenChange={(open) => !open && setSelectedSession(null)}
        session={
          selectedSession
            ? {
              id: selectedSession.id,
              userName: selectedSession.userName,
              userId: selectedSession.visitorId,
              date: selectedSession.date,
              duration: selectedSession.duration,
              events: detailsQuery.isLoading ? [] : sessionEvents,
            }
            : null
        }
      />
    </DashboardLayout>
  );
};

export default Sessions;
