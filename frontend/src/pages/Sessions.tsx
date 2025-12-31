import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Search, Eye, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { UserAvatar } from "@/components/users/UserAvatar";
import { SessionDetailsDialog } from "@/components/users/SessionDetailsDialog";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { subDays } from "date-fns";

const sessionsData = [
  { id: "s1", userName: "Common Jimmie", date: "24/12/2025 11:37 PM", dateObj: new Date("2025-12-24T23:37:00"), duration: "3m 12s" },
  { id: "s2", userName: "Creative Alysha", date: "24/12/2025 11:37 PM", dateObj: new Date("2025-12-24T23:37:00"), duration: "36 seconds" },
  { id: "s3", userName: "Rough Adelle", date: "24/12/2025 10:31 PM", dateObj: new Date("2025-12-24T22:31:00"), duration: "51 seconds" },
  { id: "s4", userName: "Speedy Edwina", date: "24/12/2025 10:01 PM", dateObj: new Date("2025-12-24T22:01:00"), duration: "1m 42s" },
  { id: "s5", userName: "Inferior Aurore", date: "24/12/2025 09:51 PM", dateObj: new Date("2025-12-24T21:51:00"), duration: "54 seconds" },
  { id: "s6", userName: "Rough Adelle", date: "24/12/2025 09:40 PM", dateObj: new Date("2025-12-24T21:40:00"), duration: "1m 40s" },
  { id: "s7", userName: "Rough Adelle", date: "24/12/2025 09:22 PM", dateObj: new Date("2025-12-24T21:22:00"), duration: "1m 48s" },
  { id: "s8", userName: "Inferior Aurore", date: "24/12/2025 08:36 PM", dateObj: new Date("2025-12-24T20:36:00"), duration: "1m 49s" },
  { id: "s9", userName: "Rough Adelle", date: "24/12/2025 08:27 PM", dateObj: new Date("2025-12-24T20:27:00"), duration: "1m 42s" },
  { id: "s10", userName: "Speedy Edwina", date: "24/12/2025 08:13 PM", dateObj: new Date("2025-12-24T20:13:00"), duration: "2m 43s" },
  { id: "s11", userName: "Wordy Reed", date: "23/12/2025 11:45 AM", dateObj: new Date("2025-12-23T11:45:00"), duration: "2m 15s" },
  { id: "s12", userName: "Simplistic Efren", date: "23/12/2025 10:30 AM", dateObj: new Date("2025-12-23T10:30:00"), duration: "3m 20s" },
  { id: "s13", userName: "Utilized Alexa", date: "22/12/2025 04:15 PM", dateObj: new Date("2025-12-22T16:15:00"), duration: "1m 55s" },
  { id: "s14", userName: "Eminent Catalina", date: "22/12/2025 02:00 PM", dateObj: new Date("2025-12-22T14:00:00"), duration: "4m 10s" },
  { id: "s15", userName: "Wavy Reggie", date: "21/12/2025 09:30 AM", dateObj: new Date("2025-12-21T09:30:00"), duration: "2m 30s" },
];

const chartData = [
  { date: "18/12/2025", sessions: 3, duration: 180, bounceRate: 5 },
  { date: "19/12/2025", sessions: 5, duration: 140, bounceRate: 8 },
  { date: "20/12/2025", sessions: 4, duration: 225, bounceRate: 3 },
  { date: "21/12/2025", sessions: 6, duration: 390, bounceRate: 6 },
  { date: "22/12/2025", sessions: 8, duration: 440, bounceRate: 4 },
  { date: "23/12/2025", sessions: 7, duration: 300, bounceRate: 7 },
  { date: "24/12/2025", sessions: 10, duration: 775, bounceRate: 5 },
];

const sessionEvents = [
  { type: "action" as const, name: "add_to_cart", time: "11:40 PM" },
  { type: "view" as const, name: "View product_view", time: "11:40 PM" },
  { type: "action" as const, name: "product_search", time: "11:40 PM" },
  { type: "view" as const, name: "View home_view", time: "11:40 PM" },
  { type: "view" as const, name: "View app_open", time: "11:40 PM" },
  { type: "action" as const, name: "support_chat_open", time: "11:40 PM" },
  { type: "action" as const, name: "settings_update", time: "11:40 PM" },
  { type: "view" as const, name: "View profile_view", time: "11:40 PM" },
  { type: "action" as const, name: "purchase_complete", time: "11:40 PM" },
  { type: "action" as const, name: "payment_info_entered", time: "11:40 PM" },
  { type: "view" as const, name: "View checkout_start", time: "11:40 PM" },
];

const Sessions = () => {
  const [chartMetric, setChartMetric] = useState<"sessions" | "duration" | "bounceRate">("sessions");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedSession, setSelectedSession] = useState<typeof sessionsData[0] | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({ from: subDays(new Date(), 7), to: new Date() });

  const filteredSessions = useMemo(() => {
    return sessionsData.filter((session) => {
      const matchesSearch = session.userName.toLowerCase().includes(search.toLowerCase());
      const matchesDate = session.dateObj >= dateRange.from && session.dateObj <= dateRange.to;
      return matchesSearch && matchesDate;
    });
  }, [search, dateRange]);

  const totalPages = Math.ceil(filteredSessions.length / perPage) || 1;
  const paginatedSessions = filteredSessions.slice((page - 1) * perPage, page * perPage);

  const getChartDataKey = () => {
    switch (chartMetric) {
      case "duration": return "duration";
      case "bounceRate": return "bounceRate";
      default: return "sessions";
    }
  };

  const getChartDescription = () => {
    switch (chartMetric) {
      case "duration": return "Average session duration in seconds";
      case "bounceRate": return "Bounce rate percentage over time";
      default: return "Number of sessions started each day";
    }
  };

  return (
    <DashboardLayout
      title="Sessions"
      description="Track and analyze user sessions in your application"
      headerAction={<DateRangeFilter showPresets={true} defaultPreset="7d" onChange={(range) => { setDateRange(range); setPage(1); }} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <span className="stat-label">TOTAL SESSIONS</span>
            <div className="stat-value text-foreground mt-2">{filteredSessions.length}</div>
            <div className="flex items-center gap-1 text-sm mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">150%</span>
              <span className="text-muted-foreground">from yesterday</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <span className="stat-label">DAILY SESSIONS</span>
            <div className="stat-value text-foreground mt-2">{Math.ceil(filteredSessions.length / 7)}</div>
            <div className="flex items-center gap-1 text-sm mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">120%</span>
              <span className="text-muted-foreground">from yesterday</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <span className="stat-label">BOUNCE RATE</span>
            <div className="stat-value text-foreground mt-2">6%</div>
            <span className="text-sm text-muted-foreground">Total bounce rate</span>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <span className="stat-label">AVERAGE DURATION</span>
            <div className="stat-value text-foreground mt-2">2m 57s</div>
            <span className="text-sm text-muted-foreground">Avg time per session</span>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border mb-6">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <Tabs defaultValue="sessions" onValueChange={(v) => setChartMetric(v as typeof chartMetric)}>
              <TabsList className="bg-muted h-9">
                <TabsTrigger value="sessions" className="text-xs font-mono uppercase tracking-wider">Daily Sessions</TabsTrigger>
                <TabsTrigger value="duration" className="text-xs font-mono uppercase tracking-wider">Average Duration</TabsTrigger>
                <TabsTrigger value="bounceRate" className="text-xs font-mono uppercase tracking-wider">Bounce Rate</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <p className="text-sm text-muted-foreground mb-6">{getChartDescription()}</p>
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
                <Area type="monotone" dataKey={getChartDataKey()} stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorSessions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-5">
          <div className="mb-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">ALL SESSIONS</h3>
            <p className="text-sm text-muted-foreground">Complete list of all sessions</p>
          </div>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Input placeholder="Search User" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-64 bg-secondary border-border" />
              <Button variant="outline" size="sm" className="flex items-center gap-2"><Search className="w-4 h-4" />Search</Button>
            </div>
            <DateRangeFilter showPresets={false} onChange={(range) => { setDateRange(range); setPage(1); }} />
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground p-4">USER</th>
                  <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground p-4">DATE</th>
                  <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground p-4">DURATION</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedSessions.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No sessions found</td></tr>
                ) : (
                  paginatedSessions.map((session) => (
                    <tr key={session.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => setSelectedSession(session)}>
                      <td className="p-4"><div className="flex items-center gap-3"><UserAvatar name={session.userName} className="w-8 h-8" /><span className="text-foreground">{session.userName}</span></div></td>
                      <td className="p-4"><div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" />{session.date}</div></td>
                      <td className="p-4"><div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" />{session.duration}</div></td>
                      <td className="p-4"><Eye className="w-4 h-4 text-muted-foreground" /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center gap-1"><ChevronLeft className="w-4 h-4" />Previous</Button>
            <span className="text-sm text-muted-foreground">Page {page} of {totalPages} ({filteredSessions.length} total)</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows:</span>
              <Select value={perPage.toString()} onValueChange={(v) => { setPerPage(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-16 h-8"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="5">5</SelectItem><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem></SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex items-center gap-1">Next<ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <SessionDetailsDialog
        open={!!selectedSession}
        onOpenChange={(open) => !open && setSelectedSession(null)}
        session={selectedSession ? { 
          id: selectedSession.id, 
          userName: selectedSession.userName, 
          userId: "01KD919QKK7PCKVZ9N37D5XX9A", 
          date: selectedSession.date, 
          duration: selectedSession.duration, 
          events: sessionEvents 
        } : null}
      />
    </DashboardLayout>
  );
};

export default Sessions;
