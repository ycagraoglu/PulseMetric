import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UserAvatar } from "@/components/users/UserAvatar";
import { Calendar, ExternalLink, Eye, Copy } from "lucide-react";

interface EventParameter {
  key: string;
  value: string;
}

interface EventDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: {
    name: string;
    userName: string;
    userId: string;
    date: string;
    parameters: EventParameter[];
  } | null;
}

export function EventDetailsSheet({ open, onOpenChange, event }: EventDetailsProps) {
  if (!event) return null;

  const isViewEvent = event.name.startsWith("View ");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">Event Details</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              EVENT NAME
            </span>
            <div className="flex items-center gap-2 mt-2 text-foreground">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono">{event.name}</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              USER
            </span>
            <div className="flex items-center gap-3 mt-2">
              <UserAvatar name={event.userName} className="w-10 h-10" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{event.userName}</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-foreground" />
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                  <Copy className="w-3 h-3" />
                  <span>{event.userId}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              DATE
            </span>
            <div className="flex items-center gap-2 mt-2 text-foreground">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              {event.date}
            </div>
          </div>

          {event.parameters.length > 0 && (
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                PARAMETERS
              </span>
              <div className="mt-2 border border-border rounded-lg overflow-hidden">
                {event.parameters.map((param, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border-b border-border last:border-0 bg-secondary/30"
                  >
                    <span className="text-sm font-mono text-muted-foreground">{param.key}</span>
                    <span className="text-sm font-mono text-foreground">{param.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
