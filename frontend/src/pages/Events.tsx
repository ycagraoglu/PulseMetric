import { useState, useMemo, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import {
  StatCardSkeleton,
  ChartSkeleton,
  UsersTableSkeleton,
  TopListSkeleton,
} from "@/components/ui/skeletons";
import { Calendar, Search, Eye, ChevronLeft, ChevronRight, TrendingUp, MousePointer } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { UserAvatar } from "@/components/users/UserAvatar";
import { EventDetailsSheet } from "@/components/events/EventDetailsSheet";
import { TopEvents } from "@/components/events/TopEvents";
import { TopScreens } from "@/components/events/TopScreens";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { subDays, format } from "date-fns";
import {
  useEvents,
  useEventsCount,
  useEventsChart,
  useEventAggregations,
  eventKeys,
} from "@/hooks/useEvents";
import {
  getEventType,
  formatEventUserName,
  transformToTopEvents,
  type EventType,
} from "@/services/events";

// ============================================
// Types
// ============================================

interface DateRange {
  from: Date;
  to: Date;
}

interface EventDisplay {
  id: string;
  userName: string;
  eventName: string;
  eventType: EventType;
  date: string;
  dateObj: Date;
}

// ============================================
// Constants
// ============================================

const PAGE_TITLE = "Activity";
const PAGE_DESCRIPTION = "Track and analyze events in your application";
const DEFAULT_PAGE_SIZE = 10;

const DEFAULT_DATE_RANGE: DateRange = {
  from: subDays(new Date(), 7),
  to: new Date(),
};

// ============================================
// Sub-Components
// ============================================

interface StatCardProps {
  label: string;
  value: number;
  subtitle?: string;
  showTrend?: boolean;
}

const StatCard = ({ label, value, subtitle, showTrend }: StatCardProps) => (
  <Card className="bg-card border-border">
    <CardContent className="p-5">
      <span className="stat-label">{label}</span>
      <div className="stat-value text-foreground mt-2">{value.toLocaleString()}</div>
      {showTrend && value > 0 ? (
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

interface EventRowProps {
  event: EventDisplay;
  onClick: () => void;
}

const EventRow = ({ event, onClick }: EventRowProps) => (
  <tr
    className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer"
    onClick={onClick}
  >
    <td className="p-4">
      <div className="flex items-center gap-3">
        <UserAvatar name={event.userName} className="w-8 h-8" />
        <span className="text-foreground">{event.userName}</span>
      </div>
    </td>
    <td className="p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {event.eventType === "view" ? (
          <Eye className="w-4 h-4" />
        ) : (
          <MousePointer className="w-4 h-4" />
        )}
        <span className="font-mono">{event.eventName}</span>
      </div>
    </td>
    <td className="p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Calendar className="w-4 h-4" />
        {event.date}
      </div>
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

interface ChartSectionProps {
  isLoading: boolean;
  isError: boolean;
  data: { date: string; events: number }[];
}

const ChartSection = ({ isLoading, isError, data }: ChartSectionProps) => {
  if (isLoading) return <ChartSkeleton />;
  if (isError) return <ErrorState title="Grafik verileri yüklenemedi" />;
  if (data.length === 0) {
    return <EmptyState icon="chart" title="Grafik verisi yok" message="Seçilen tarih aralığında event verisi bulunmuyor." />;
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <Tabs defaultValue="daily">
            <TabsList className="bg-muted h-9">
              <TabsTrigger value="daily" className="text-xs font-mono uppercase tracking-wider">Daily Events</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Daily event count over selected period</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dy={10} />
              <YAxis axisLine={false} tickLine={false} hide />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="events" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorEvents)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// Main Component
// ============================================

const Events = () => {
  const queryClient = useQueryClient();

  // State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [selectedEvent, setSelectedEvent] = useState<EventDisplay | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(DEFAULT_DATE_RANGE);

  // Queries using existing hooks
  const eventsQuery = useEvents({
    from: format(dateRange.from, "yyyy-MM-dd"),
    to: format(dateRange.to, "yyyy-MM-dd"),
    page,
    pageSize: perPage,
  });
  const countQuery = useEventsCount();
  const chartQuery = useEventsChart(7);
  const aggQuery = useEventAggregations();

  // Transform events
  const events: EventDisplay[] = useMemo(() => {
    if (!eventsQuery.data?.length) return [];
    return eventsQuery.data.map((e) => ({
      id: e.id,
      userName: formatEventUserName(e.visitorId),
      eventName: e.eventName,
      eventType: getEventType(e.eventName),
      date: e.timestamp,
      dateObj: new Date(e.timestamp),
    }));
  }, [eventsQuery.data]);

  // Filter events
  const filteredEvents = useMemo(() => {
    if (!search) return events;
    const searchLower = search.toLowerCase();
    return events.filter(
      (e) =>
        e.userName.toLowerCase().includes(searchLower) ||
        e.eventName.toLowerCase().includes(searchLower)
    );
  }, [events, search]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / perPage) || 1;
  const paginatedEvents = filteredEvents.slice((page - 1) * perPage, page * perPage);

  // Chart data
  const chartData = useMemo(
    () => chartQuery.data?.map((d) => ({ date: d.date, events: d.value })) ?? [],
    [chartQuery.data]
  );

  // Top events
  const topEventsData = useMemo(
    () => (aggQuery.data ? transformToTopEvents(aggQuery.data) : []),
    [aggQuery.data]
  );

  // KPIs
  const totalEvents = countQuery.data?.total ?? 0;
  const dailyEvents = countQuery.data?.todayCount ?? 0;

  // Derived state
  const hasError = eventsQuery.isError || countQuery.isError;
  const hasNoData = !eventsQuery.isLoading && !eventsQuery.isError && events.length === 0;

  // Handlers
  const handleRetryAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: eventKeys.all });
  }, [queryClient]);

  const handleDateRangeChange = useCallback((range: DateRange) => {
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
            title="Event verileri yüklenemedi"
            message="Backend API'ye bağlanılamadı. Lütfen backend servisinin çalıştığından emin olun."
            onRetry={handleRetryAll}
          />
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {countQuery.isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : countQuery.isError ? null : (
          <>
            <StatCard label="TOTAL EVENTS" value={totalEvents} showTrend />
            <StatCard label="TODAY'S EVENTS" value={dailyEvents} subtitle="Events today" />
          </>
        )}
      </div>

      {/* Chart */}
      <div className="mb-6">
        <ChartSection isLoading={chartQuery.isLoading} isError={chartQuery.isError} data={chartData} />
      </div>

      {/* Top Events & Screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {aggQuery.isLoading ? (
          <>
            <TopListSkeleton />
            <TopListSkeleton />
          </>
        ) : aggQuery.isError ? (
          <>
            <ErrorState title="Top events yüklenemedi" />
            <ErrorState title="Top screens yüklenemedi" />
          </>
        ) : topEventsData.length === 0 ? (
          <>
            <EmptyState icon="activity" title="Event verisi yok" message="Henüz kaydedilmiş event bulunmuyor." />
            <EmptyState icon="activity" title="Screen verisi yok" message="Henüz kaydedilmiş screen view bulunmuyor." />
          </>
        ) : (
          <>
            <TopEvents events={topEventsData} />
            <TopScreens screens={[]} />
          </>
        )}
      </div>

      {/* Events Table */}
      {eventsQuery.isLoading ? (
        <UsersTableSkeleton rows={5} />
      ) : eventsQuery.isError ? (
        <ErrorState title="Event listesi yüklenemedi" onRetry={() => eventsQuery.refetch()} />
      ) : hasNoData ? (
        <EmptyState
          icon="activity"
          title="Henüz event yok"
          message="Seçilen tarih aralığında kaydedilmiş event bulunmuyor. Web sitenize pulse.js scriptini ekleyerek veri toplamaya başlayabilirsiniz."
        />
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <div className="mb-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">ALL EVENTS</h3>
              <p className="text-sm text-muted-foreground">Complete list of all events</p>
            </div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search events"
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
                    <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground p-4">EVENT</th>
                    <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground p-4">DATE</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEvents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground">
                        No events match your search
                      </td>
                    </tr>
                  ) : (
                    paginatedEvents.map((event) => (
                      <EventRow
                        key={event.id}
                        event={event}
                        onClick={() => setSelectedEvent(event)}
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
              totalItems={filteredEvents.length}
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              onPerPageChange={handlePerPageChange}
            />
          </CardContent>
        </Card>
      )}

      <EventDetailsSheet
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
        event={
          selectedEvent
            ? {
              name: selectedEvent.eventName,
              userName: selectedEvent.userName,
              userId: "01KD919QKK7PCKVZ9N37D5XX9A",
              date: selectedEvent.date,
              parameters: [
                { key: "event_type", value: selectedEvent.eventType },
                { key: "session_id", value: "01KD919Y" },
                { key: "version", value: "1.0.0" },
              ],
            }
            : null
        }
      />
    </DashboardLayout>
  );
};

export default Events;
