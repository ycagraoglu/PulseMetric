import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/users/UserAvatar";
import { ActivityCalendar } from "@/components/users/ActivityCalendar";
import { SessionDetailsDialog } from "@/components/users/SessionDetailsDialog";
import { CountryFlag } from "@/components/ui/country-flag";
import { ArrowLeft, Copy, UserX, Calendar, Clock, Monitor, Smartphone, Eye } from "lucide-react";
import { useUserDetails, type UserSession, type UserDetailsData } from "@/hooks/useUserDetails";

// ============================================
// Constants
// ============================================

const PAGE_TITLE = "User Details";
const PAGE_DESCRIPTION = "View detailed information about this user";

// ============================================
// Sub-Components
// ============================================

interface HeaderActionsProps {
  onBack: () => void;
  onBan: () => void;
}

const HeaderActions = ({ onBack, onBan }: HeaderActionsProps) => (
  <div className="flex items-center justify-between mb-6">
    <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
      <ArrowLeft className="w-4 h-4" />
      Back
    </Button>
    <Button variant="destructive" onClick={onBan} className="flex items-center gap-2">
      <UserX className="w-4 h-4" />
      Ban User
    </Button>
  </div>
);

interface InfoRowProps {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const InfoRow = ({ label, icon, children }: InfoRowProps) => (
  <div>
    <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
    <div className="flex items-center gap-2 mt-1 text-foreground">
      {icon}
      {children}
    </div>
  </div>
);

interface UserInfoCardProps {
  user: UserDetailsData;
  onCopyId: () => void;
}

const UserInfoCard = ({ user, onCopyId }: UserInfoCardProps) => (
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
            onClick={onCopyId}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-1"
          >
            <Copy className="w-3 h-3" />
            <span className="font-mono text-xs">{user.id}</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <InfoRow label="GEO">
          <CountryFlag countryCode={user.countryCode} showName />
          <span className="text-muted-foreground">,</span> {user.city}
        </InfoRow>

        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">DEVICE</span>
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
);

interface ActivityCardProps {
  user: UserDetailsData;
}

const ActivityCard = ({ user }: ActivityCardProps) => (
  <Card className="bg-card border-border">
    <CardContent className="p-5">
      <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">
        ACTIVITY CALENDAR
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <InfoRow label="TOTAL SESSIONS" icon={<Monitor className="w-4 h-4 text-muted-foreground" />}>
          {user.totalSessions}
        </InfoRow>
        <InfoRow label="AVG SESSION DURATION" icon={<Clock className="w-4 h-4 text-muted-foreground" />}>
          {user.avgSessionDuration}
        </InfoRow>
        <InfoRow label="FIRST SEEN" icon={<Calendar className="w-4 h-4 text-muted-foreground" />}>
          {user.firstSeen}
        </InfoRow>
        <InfoRow label="LAST ACTIVITY" icon={<Calendar className="w-4 h-4 text-muted-foreground" />}>
          {user.lastActivity}
        </InfoRow>
      </div>

      <ActivityCalendar activities={user.activities} />
    </CardContent>
  </Card>
);

interface SessionRowProps {
  session: UserSession;
  onClick: () => void;
}

const SessionRow = ({ session, onClick }: SessionRowProps) => (
  <tr
    className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer"
    onClick={onClick}
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
);

interface SessionsTableProps {
  sessions: UserSession[];
  onSelectSession: (session: UserSession) => void;
}

const SessionsTable = ({ sessions, onSelectSession }: SessionsTableProps) => (
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
              <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground p-4">DATE</th>
              <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground p-4">DURATION</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <SessionRow key={session.id} session={session} onClick={() => onSelectSession(session)} />
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

const NotFoundState = () => (
  <DashboardLayout title="User Not Found" description="">
    <p className="text-muted-foreground">The user you're looking for doesn't exist.</p>
  </DashboardLayout>
);

// ============================================
// Main Component
// ============================================

const UserDetails = () => {
  const {
    user,
    selectedSession,
    isNotFound,
    goBack,
    copyUserId,
    selectSession,
    closeSessionDialog,
    banUser,
  } = useUserDetails();

  if (isNotFound || !user) {
    return <NotFoundState />;
  }

  return (
    <DashboardLayout title={PAGE_TITLE} description={PAGE_DESCRIPTION}>
      <HeaderActions onBack={goBack} onBan={banUser} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <UserInfoCard user={user} onCopyId={copyUserId} />
        <ActivityCard user={user} />
      </div>

      <SessionsTable sessions={user.sessions} onSelectSession={selectSession} />

      <SessionDetailsDialog
        open={!!selectedSession}
        onOpenChange={(open) => !open && closeSessionDialog()}
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
