import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface ActivityCalendarProps {
  activities: { date: string; count: number }[];
}

export function ActivityCalendar({ activities }: ActivityCalendarProps) {
  const weeks = useMemo(() => {
    const weeksCount = 20;
    const daysInWeek = 7;
    const today = new Date();
    const cells: { date: Date; count: number }[] = [];

    // Generate cells for the past weeks
    for (let i = weeksCount * daysInWeek - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const activity = activities.find(a => a.date === dateStr);
      cells.push({ date, count: activity?.count || 0 });
    }

    // Group by weeks
    const grouped: { date: Date; count: number }[][] = [];
    for (let i = 0; i < cells.length; i += daysInWeek) {
      grouped.push(cells.slice(i, i + daysInWeek));
    }

    return grouped;
  }, [activities]);

  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-muted/30";
    if (count === 1) return "bg-primary/20";
    if (count === 2) return "bg-primary/40";
    if (count <= 4) return "bg-primary/60";
    return "bg-primary/80";
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-[3px]">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-[3px]">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={cn(
                  "w-3 h-3 rounded-sm",
                  getIntensityClass(day.count)
                )}
                title={`${day.date.toLocaleDateString()}: ${day.count} activities`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-muted/30" />
          <div className="w-3 h-3 rounded-sm bg-primary/20" />
          <div className="w-3 h-3 rounded-sm bg-primary/40" />
          <div className="w-3 h-3 rounded-sm bg-primary/60" />
          <div className="w-3 h-3 rounded-sm bg-primary/80" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
