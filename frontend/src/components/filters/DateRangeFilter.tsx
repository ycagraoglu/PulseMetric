import { useState } from "react";
import { format, subDays, subMonths, subYears } from "date-fns";
import { Calendar as CalendarIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type DateRange = {
  from: Date;
  to: Date;
};

type PresetOption = {
  label: string;
  value: string;
  getRange: () => DateRange;
};

const presets: PresetOption[] = [
  {
    label: "7 Days",
    value: "7d",
    getRange: () => ({ from: subDays(new Date(), 7), to: new Date() }),
  },
  {
    label: "1 Month",
    value: "1m",
    getRange: () => ({ from: subMonths(new Date(), 1), to: new Date() }),
  },
  {
    label: "6 Months",
    value: "6m",
    getRange: () => ({ from: subMonths(new Date(), 6), to: new Date() }),
  },
  {
    label: "1 Year",
    value: "1y",
    getRange: () => ({ from: subYears(new Date(), 1), to: new Date() }),
  },
];

interface DateRangeFilterProps {
  onChange?: (range: DateRange, preset?: string) => void;
  defaultPreset?: string;
  showPresets?: boolean;
}

export function DateRangeFilter({
  onChange,
  defaultPreset = "7d",
  showPresets = true,
}: DateRangeFilterProps) {
  const [selectedPreset, setSelectedPreset] = useState(defaultPreset);
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const preset = presets.find((p) => p.value === defaultPreset);
    return preset ? preset.getRange() : { from: subDays(new Date(), 7), to: new Date() };
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handlePresetSelect = (preset: PresetOption) => {
    setSelectedPreset(preset.value);
    const range = preset.getRange();
    setDateRange(range);
    onChange?.(range, preset.value);
  };

  const handleDateSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from && range?.to) {
      setDateRange({ from: range.from, to: range.to });
      setSelectedPreset("");
      onChange?.({ from: range.from, to: range.to });
    } else if (range?.from) {
      setDateRange((prev) => ({ ...prev, from: range.from! }));
    }
  };

  const handleApply = () => {
    setIsCalendarOpen(false);
    onChange?.(dateRange);
  };

  const handleClear = () => {
    const preset = presets[0];
    setSelectedPreset(preset.value);
    const range = preset.getRange();
    setDateRange(range);
    setIsCalendarOpen(false);
    onChange?.(range, preset.value);
  };

  const currentPresetLabel = presets.find((p) => p.value === selectedPreset)?.label;

  if (showPresets) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2 h-9">
            <CalendarIcon className="w-4 h-4" />
            <span>{currentPresetLabel || "Custom"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {presets.map((preset) => (
            <DropdownMenuItem
              key={preset.value}
              onClick={() => handlePresetSelect(preset)}
              className="flex items-center justify-between"
            >
              <span>{preset.label}</span>
              {selectedPreset === preset.value && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 h-9">
          <CalendarIcon className="w-4 h-4" />
          <span>Date Range</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange.from}
          selected={{ from: dateRange.from, to: dateRange.to }}
          onSelect={handleDateSelect}
          numberOfMonths={1}
          className={cn("p-3 pointer-events-auto")}
        />
        <div className="flex items-center gap-2 p-3 border-t border-border">
          <Button variant="ghost" size="sm" onClick={handleClear} className="flex-1">
            Clear
          </Button>
          <Button size="sm" onClick={handleApply} className="flex-1">
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
