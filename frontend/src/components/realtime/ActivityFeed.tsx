import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Pause, Play, SkipBack, SkipForward, Volume2, Eye, MousePointer2, Monitor, DollarSign, ShoppingCart, CreditCard, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CountryFlag } from "@/components/ui/country-flag";
import { cn } from "@/lib/utils";

interface ActivityEvent {
  id: string;
  type: "event" | "session" | "device";
  name: string;
  user: string;
  country: string;
  countryCode: string;
  timestamp: Date;
  location: [number, number];
  isScreen?: boolean;
}

interface ActivityFeedProps {
  events: ActivityEvent[];
  isPlaying: boolean;
  onTogglePlay: () => void;
  onlineCount: number;
  platformCount: number;
}

const getActivityIcon = (eventName: string, isScreen?: boolean) => {
  if (isScreen) return Eye;
  if (eventName.includes("purchase")) return DollarSign;
  if (eventName.includes("cart")) return ShoppingCart;
  if (eventName.includes("checkout")) return CreditCard;
  if (eventName.includes("payment")) return Package;
  return MousePointer2;
};

export function ActivityFeed({
  events,
  isPlaying,
  onTogglePlay,
  onlineCount,
  platformCount,
}: ActivityFeedProps) {
  const displayEvents = events.slice(0, 50);

  return (
    <div className="flex flex-col h-full w-full max-w-md">
      {/* Header Card */}
      <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-4 space-y-4">
        {/* App Info Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-muted-foreground" />
            <span className="font-semibold text-foreground">Phase</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Connected
            </Badge>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-border"
              onClick={onTogglePlay}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono font-medium text-foreground">{onlineCount}</span>
            <span className="text-muted-foreground">Online</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Monitor className="w-3.5 h-3.5" />
            <span>Platforms</span>
            {platformCount > 0 && (
              <Badge variant="secondary" className="font-mono text-xs h-5 px-1.5">
                {platformCount}
              </Badge>
            )}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={onTogglePlay}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <SkipForward className="w-4 h-4" />
          </Button>
          <div className="flex-1 px-2">
            <Slider defaultValue={[0]} max={100} step={1} className="w-full" />
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Activity List */}
      <ScrollArea className="flex-1 mt-4">
        <div className="space-y-2 pr-4">
          <AnimatePresence initial={false} mode="popLayout">
            {displayEvents.map((event, index) => {
              const Icon = getActivityIcon(event.name, event.isScreen);
              return (
                <motion.button
                  key={event.id}
                  initial={{ opacity: 0, y: -25, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  layout
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.06, 0.4),
                    ease: [0.16, 1, 0.3, 1],
                    layout: { duration: 0.35, ease: "easeInOut" },
                  }}
                  className="w-full cursor-pointer space-y-1 rounded-lg border border-border bg-card/50 backdrop-blur-sm p-3 text-left transition-colors hover:bg-accent"
                  type="button"
                >
                  {/* Event Name Row */}
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="font-medium text-sm text-foreground font-mono">
                      {event.isScreen ? `View ${event.name}` : event.name}
                    </span>
                  </div>

                  {/* User & Location Row */}
                  <div className="flex items-center justify-between gap-1.5 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary/60 to-primary flex items-center justify-center">
                        <span className="text-[8px] text-primary-foreground font-bold">
                          {event.user.charAt(0)}
                        </span>
                      </div>
                      <span className="text-muted-foreground">{event.user}</span>
                      {event.countryCode && (
                        <>
                          <span className="text-muted-foreground">from</span>
                          <CountryFlag countryCode={event.countryCode} size="sm" />
                        </>
                      )}
                    </div>
                    <span className="text-muted-foreground font-mono">
                      {event.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
