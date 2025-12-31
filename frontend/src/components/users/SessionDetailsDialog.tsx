import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserAvatar } from "./UserAvatar";
import { Calendar, Clock, Eye, MousePointer, ExternalLink, Copy } from "lucide-react";
import { EventDetailsSheet } from "@/components/events/EventDetailsSheet";
import { useState } from "react";

interface SessionEvent {
  type: "view" | "action" | "click" | "session_started" | "session_ended";
  name: string;
  time: string;
}

interface SessionDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: {
    id: string;
    userName: string;
    userId: string;
    date: string;
    duration: string;
    events: SessionEvent[];
  } | null;
}

export function SessionDetailsDialog({ open, onOpenChange, session }: SessionDetailsProps) {
  const [selectedEvent, setSelectedEvent] = useState<SessionEvent | null>(null);

  if (!session) return null;

  const getEventIcon = (type: string, name: string) => {
    if (name.startsWith("View ") || type === "view" || type === "session_started" || type === "session_ended") {
      return <Eye className="w-4 h-4 text-muted-foreground" />;
    }
    return <MousePointer className="w-4 h-4 text-muted-foreground" />;
  };

  const handleEventClick = (event: SessionEvent) => {
    setSelectedEvent(event);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg bg-card border-border max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Session Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 overflow-y-auto flex-1 pr-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                USER
              </span>
              <div className="flex items-center gap-3 mt-2">
                <UserAvatar name={session.userName} className="w-10 h-10" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{session.userName}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-foreground" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                    <Copy className="w-3 h-3" />
                    <span>{session.userId}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  DATE
                </span>
                <div className="flex items-center gap-2 mt-2 text-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {session.date}
                </div>
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  DURATION
                </span>
                <div className="flex items-center gap-2 mt-2 text-foreground">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  {session.duration}
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="space-y-1">
                {session.events.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-2 hover:bg-secondary/30 rounded-md cursor-pointer transition-colors"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-center gap-3">
                      {getEventIcon(event.type, event.name)}
                      <span className="text-foreground font-mono text-sm">{event.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{event.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EventDetailsSheet
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
        event={selectedEvent ? {
          name: selectedEvent.name,
          userName: session.userName,
          userId: session.userId,
          date: `${session.date.split(" ")[0]} ${selectedEvent.time}`,
          parameters: [
            { key: "index", value: String(Math.floor(Math.random() * 200) + 100) },
            { key: "session_id", value: session.id.substring(0, 8).toUpperCase() },
            { key: "version", value: "1.0.4" },
          ],
        } : null}
      />
    </>
  );
}
