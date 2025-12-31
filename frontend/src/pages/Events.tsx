import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Eye, ChevronLeft, ChevronRight, TrendingUp, MousePointer } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { UserAvatar } from "@/components/users/UserAvatar";
import { EventDetailsSheet } from "@/components/events/EventDetailsSheet";
import { TopEvents } from "@/components/events/TopEvents";
import { TopScreens } from "@/components/events/TopScreens";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { subDays } from "date-fns";

const eventsData = [
  { id: "e1", userName: "Common Jimmie", eventName: "View cart_view", eventType: "view", date: "24/12/2025 11:41 PM", dateObj: new Date("2025-12-24T23:41:00") },
  { id: "e2", userName: "Common Jimmie", eventName: "add_to_cart", eventType: "action", date: "24/12/2025 11:41 PM", dateObj: new Date("2025-12-24T23:41:00") },
  { id: "e3", userName: "Common Jimmie", eventName: "View product_view", eventType: "view", date: "24/12/2025 11:41 PM", dateObj: new Date("2025-12-24T23:41:00") },
  { id: "e4", userName: "Common Jimmie", eventName: "product_search", eventType: "action", date: "24/12/2025 11:41 PM", dateObj: new Date("2025-12-24T23:41:00") },
  { id: "e5", userName: "Common Jimmie", eventName: "View home_view", eventType: "view", date: "24/12/2025 11:41 PM", dateObj: new Date("2025-12-24T23:41:00") },
  { id: "e6", userName: "Common Jimmie", eventName: "View app_open", eventType: "view", date: "24/12/2025 11:40 PM", dateObj: new Date("2025-12-24T23:40:00") },
  { id: "e7", userName: "Common Jimmie", eventName: "support_chat_open", eventType: "action", date: "24/12/2025 11:40 PM", dateObj: new Date("2025-12-24T23:40:00") },
  { id: "e8", userName: "Common Jimmie", eventName: "settings_update", eventType: "action", date: "24/12/2025 11:40 PM", dateObj: new Date("2025-12-24T23:40:00") },
  { id: "e9", userName: "Common Jimmie", eventName: "View profile_view", eventType: "view", date: "24/12/2025 11:40 PM", dateObj: new Date("2025-12-24T23:40:00") },
  { id: "e10", userName: "Common Jimmie", eventName: "purchase_complete", eventType: "action", date: "24/12/2025 11:40 PM", dateObj: new Date("2025-12-24T23:40:00") },
  { id: "e11", userName: "Creative Alysha", eventName: "View checkout_start", eventType: "view", date: "24/12/2025 11:39 PM", dateObj: new Date("2025-12-24T23:39:00") },
  { id: "e12", userName: "Creative Alysha", eventName: "payment_info_entered", eventType: "action", date: "24/12/2025 11:38 PM", dateObj: new Date("2025-12-24T23:38:00") },
  { id: "e13", userName: "Rough Adelle", eventName: "View cart_view", eventType: "view", date: "24/12/2025 10:35 PM", dateObj: new Date("2025-12-24T22:35:00") },
  { id: "e14", userName: "Rough Adelle", eventName: "add_to_cart", eventType: "action", date: "24/12/2025 10:34 PM", dateObj: new Date("2025-12-24T22:34:00") },
  { id: "e15", userName: "Speedy Edwina", eventName: "View product_view", eventType: "view", date: "24/12/2025 10:05 PM", dateObj: new Date("2025-12-24T22:05:00") },
];

const chartData = [
  { date: "18/12/2025", events: 150 },
  { date: "19/12/2025", events: 280 },
  { date: "20/12/2025", events: 320 },
  { date: "21/12/2025", events: 250 },
  { date: "22/12/2025", events: 380 },
  { date: "23/12/2025", events: 420 },
  { date: "24/12/2025", events: 410 },
];

const topEventsData = [
  { name: "action_3", count: 262, percentage: 18.9 },
  { name: "action_2", count: 262, percentage: 18.9 },
  { name: "action_1", count: 262, percentage: 18.9 },
  { name: "action_5", count: 171, percentage: 12.3 },
  { name: "session_end", count: 170, percentage: 12.3 },
  { name: "product_search", count: 16, percentage: 1.2 },
  { name: "purchase_complete", count: 15, percentage: 1.1 },
];

const topScreensData = [
  { path: "session_start", count: 262, percentage: 37.2 },
  { path: "action_4", count: 219, percentage: 31.1 },
  { path: "session_end", count: 92, percentage: 13.1 },
  { path: "action_8", count: 37, percentage: 5.3 },
  { path: "app_open", count: 16, percentage: 2.3 },
  { path: "profile_view", count: 15, percentage: 2.1 },
  { path: "checkout_start", count: 15, percentage: 2.1 },
];

const Events = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedEvent, setSelectedEvent] = useState<typeof eventsData[0] | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({ from: subDays(new Date(), 7), to: new Date() });

  const filteredEvents = useMemo(() => {
    return eventsData.filter((event) => {
      const matchesSearch = event.userName.toLowerCase().includes(search.toLowerCase()) || event.eventName.toLowerCase().includes(search.toLowerCase());
      const matchesDate = event.dateObj >= dateRange.from && event.dateObj <= dateRange.to;
      return matchesSearch && matchesDate;
    });
  }, [search, dateRange]);

  const totalPages = Math.ceil(filteredEvents.length / perPage) || 1;
  const paginatedEvents = filteredEvents.slice((page - 1) * perPage, page * perPage);

  return (
    <DashboardLayout
      title="Activity"
      description="Track and analyze events in your application"
      headerAction={<DateRangeFilter showPresets={true} defaultPreset="7d" onChange={(range) => { setDateRange(range); setPage(1); }} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <span className="stat-label">TOTAL EVENTS</span>
            <div className="stat-value text-foreground mt-2">2146</div>
            <div className="flex items-center gap-1 text-sm mt-1"><TrendingUp className="w-3 h-3 text-green-500" /><span className="text-green-500">23.72%</span><span className="text-muted-foreground">from yesterday</span></div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <span className="stat-label">DAILY EVENTS</span>
            <div className="stat-value text-foreground mt-2">410</div>
            <div className="flex items-center gap-1 text-sm mt-1"><TrendingUp className="w-3 h-3 text-green-500" /><span className="text-green-500">15.45%</span><span className="text-muted-foreground">from yesterday</span></div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border mb-6">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <Tabs defaultValue="daily"><TabsList className="bg-muted h-9"><TabsTrigger value="daily" className="text-xs font-mono uppercase tracking-wider">Daily Events</TabsTrigger></TabsList></Tabs>
            <DateRangeFilter showPresets={true} defaultPreset="7d" onChange={(range) => setDateRange(range)} />
          </div>
          <p className="text-sm text-muted-foreground mb-6">Daily event count over selected period</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs><linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dx={-10} hide />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} labelStyle={{ color: "hsl(var(--foreground))" }} />
                <Area type="monotone" dataKey="events" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorEvents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <TopEvents events={topEventsData} />
        <TopScreens screens={topScreensData} />
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-5">
          <div className="mb-4"><h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">ALL EVENTS</h3><p className="text-sm text-muted-foreground">Complete list of all events</p></div>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Input placeholder="Search events" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-64 bg-secondary border-border" />
              <Button variant="outline" size="sm" className="flex items-center gap-2"><Search className="w-4 h-4" />Search</Button>
            </div>
            <DateRangeFilter showPresets={false} onChange={(range) => { setDateRange(range); setPage(1); }} />
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-border bg-secondary/30">
                <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground p-4">USER</th>
                <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground p-4">EVENT</th>
                <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground p-4">DATE</th>
                <th className="w-10"></th>
              </tr></thead>
              <tbody>
                {paginatedEvents.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No events found</td></tr>
                ) : (
                  paginatedEvents.map((event) => (
                    <tr key={event.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => setSelectedEvent(event)}>
                      <td className="p-4"><div className="flex items-center gap-3"><UserAvatar name={event.userName} className="w-8 h-8" /><span className="text-foreground">{event.userName}</span></div></td>
                      <td className="p-4"><div className="flex items-center gap-2 text-muted-foreground">{event.eventType === "view" ? <Eye className="w-4 h-4" /> : <MousePointer className="w-4 h-4" />}<span className="font-mono">{event.eventName}</span></div></td>
                      <td className="p-4"><div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" />{event.date}</div></td>
                      <td className="p-4"><Eye className="w-4 h-4 text-muted-foreground" /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center gap-1"><ChevronLeft className="w-4 h-4" />Previous</Button>
            <span className="text-sm text-muted-foreground">Page {page} of {totalPages} ({filteredEvents.length} total)</span>
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

      <EventDetailsSheet
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
        event={selectedEvent ? { 
          name: selectedEvent.eventName, 
          userName: selectedEvent.userName, 
          userId: "01KD919QKK7PCKVZ9N37D5XX9A", 
          date: selectedEvent.date, 
          parameters: [
            { key: "index", value: String(Math.floor(Math.random() * 200) + 100) },
            { key: "session_id", value: "01KD919Y" },
            { key: "version", value: "1.0.4" },
          ]
        } : null}
      />
    </DashboardLayout>
  );
};

export default Events;
