import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/users/UserAvatar";
import { ActivityCalendar } from "@/components/users/ActivityCalendar";
import { SessionDetailsDialog } from "@/components/users/SessionDetailsDialog";
import { CountryFlag } from "@/components/ui/country-flag";
import { ArrowLeft, Copy, UserX, Calendar, Clock, Monitor, Smartphone, Eye } from "lucide-react";
import { toast } from "sonner";

// Mock user data
const mockUsers: Record<string, {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  city: string;
  platform: string;
  version: string;
  deviceType: string;
  totalSessions: number;
  avgSessionDuration: string;
  firstSeen: string;
  lastActivity: string;
  activities: { date: string; count: number }[];
  sessions: {
    id: string;
    date: string;
    duration: string;
    events: { type: "session_started" | "session_ended" | "view" | "click"; name: string; time: string }[];
  }[];
}> = {
  "01KCR8XTGQ5W7HR0MAV22YXDHC": {
    id: "01KCR8XTGQ5W7HR0MAV22YXDHC",
    name: "Antique Alex",
    country: "Türkiye",
    countryCode: "TR",
    city: "Ankara",
    platform: "iOS",
    version: "18.6",
    deviceType: "Phone",
    totalSessions: 12,
    avgSessionDuration: "1m 50s",
    firstSeen: "18/12/2025 11:23 AM",
    lastActivity: "18/12/2025 11:56 AM",
    activities: [
      { date: "2025-12-18", count: 5 },
      { date: "2025-12-17", count: 2 },
    ],
    sessions: [
      {
        id: "s1",
        date: "18/12/2025 11:52 AM",
        duration: "4m 5s",
        events: [
          { type: "session_started", name: "Session Started", time: "11:52 AM" },
          { type: "view", name: "View /home", time: "11:52 AM" },
          { type: "click", name: "button_click", time: "11:56 AM" },
          { type: "view", name: "View /details", time: "11:56 AM" },
          { type: "session_ended", name: "Session Ended", time: "11:56 AM" },
        ],
      },
      { id: "s2", date: "18/12/2025 11:51 AM", duration: "10 seconds", events: [] },
      { id: "s3", date: "18/12/2025 11:51 AM", duration: "20 seconds", events: [] },
      { id: "s4", date: "18/12/2025 11:50 AM", duration: "1m 5s", events: [] },
      { id: "s5", date: "18/12/2025 11:48 AM", duration: "1m 41s", events: [] },
      { id: "s6", date: "18/12/2025 11:48 AM", duration: "40 seconds", events: [] },
      { id: "s7", date: "18/12/2025 11:47 AM", duration: "5 seconds", events: [] },
      { id: "s8", date: "18/12/2025 11:43 AM", duration: "4m 45s", events: [] },
    ],
  },
  "01KCQAE9RP013RTJZE10SQX5TR": {
    id: "01KCQAE9RP013RTJZE10SQX5TR",
    name: "Emotional Tyrese",
    country: "Türkiye",
    countryCode: "TR",
    city: "Istanbul",
    platform: "iOS",
    version: "18.6",
    deviceType: "Phone",
    totalSessions: 10,
    avgSessionDuration: "2m 30s",
    firstSeen: "18/12/2025 02:31 AM",
    lastActivity: "19/12/2025 12:51 AM",
    activities: [
      { date: "2025-12-19", count: 3 },
      { date: "2025-12-18", count: 7 },
    ],
    sessions: [
      { id: "s1", date: "19/12/2025 12:51 AM", duration: "5 seconds", events: [] },
      { id: "s2", date: "18/12/2025 07:13 PM", duration: "1m 29s", events: [] },
      { id: "s3", date: "18/12/2025 07:10 PM", duration: "30 seconds", events: [] },
    ],
  },
};

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState<typeof mockUsers[string]["sessions"][0] | null>(null);

  const user = userId ? mockUsers[userId] : null;

  if (!user) {
    return (
      <DashboardLayout title="User Not Found" description="">
        <p className="text-muted-foreground">The user you're looking for doesn't exist.</p>
      </DashboardLayout>
    );
  }

  const copyUserId = () => {
    navigator.clipboard.writeText(user.id);
    toast.success("User ID copied to clipboard");
  };

  return (
    <DashboardLayout
      title="User Details"
      description="View detailed information about this user"
    >
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/users")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button variant="destructive" className="flex items-center gap-2">
          <UserX className="w-4 h-4" />
          Ban User
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* User Information */}
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">
              USER INFORMATION
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <UserAvatar name={user.name} className="w-16 h-16" />
              <div>
                <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
                <button
                  onClick={copyUserId}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-1"
                >
                  <Copy className="w-3 h-3" />
                  <span className="font-mono text-xs">{user.id}</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  GEO
                </span>
                <div className="flex items-center gap-2 mt-1 text-foreground">
                  <CountryFlag countryCode={user.countryCode} showName />
                  <span className="text-muted-foreground">,</span> {user.city}
                </div>
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  DEVICE
                </span>
                <div className="space-y-1 mt-1">
                  <div className="flex items-center gap-2 text-foreground">
                    <Monitor className="w-4 h-4 text-muted-foreground" />
                    {user.platform} {user.version}
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    {user.deviceType}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Calendar */}
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                ACTIVITY CALENDAR
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  TOTAL SESSIONS
                </span>
                <div className="flex items-center gap-2 mt-1 text-foreground">
                  <Monitor className="w-4 h-4 text-muted-foreground" />
                  {user.totalSessions}
                </div>
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  AVG SESSION DURATION
                </span>
                <div className="flex items-center gap-2 mt-1 text-foreground">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  {user.avgSessionDuration}
                </div>
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  FIRST SEEN
                </span>
                <div className="flex items-center gap-2 mt-1 text-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {user.firstSeen}
                </div>
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  LAST ACTIVITY
                </span>
                <div className="flex items-center gap-2 mt-1 text-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {user.lastActivity}
                </div>
              </div>
            </div>

            <ActivityCalendar activities={user.activities} />
          </CardContent>
        </Card>
      </div>

      {/* Sessions & Events */}
      <Card className="bg-card border-border">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                SESSIONS & EVENTS
              </h3>
              <p className="text-sm text-muted-foreground">User session history with events</p>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </Button>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground p-4">
                    DATE
                  </th>
                  <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground p-4">
                    DURATION
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {user.sessions.map((session) => (
                  <tr
                    key={session.id}
                    className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedSession(session)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-foreground">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
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
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <SessionDetailsDialog
        open={!!selectedSession}
        onOpenChange={(open) => !open && setSelectedSession(null)}
        session={
          selectedSession
            ? {
                id: selectedSession.id,
                userName: user.name,
                userId: user.id,
                date: selectedSession.date,
                duration: selectedSession.duration,
                events: selectedSession.events,
              }
            : null
        }
      />
    </DashboardLayout>
  );
};

export default UserDetails;
