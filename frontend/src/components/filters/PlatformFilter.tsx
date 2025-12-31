import { useState } from "react";
import { Monitor, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Platform = "all" | "iOS" | "Android" | "Web";

interface PlatformFilterProps {
  onChange?: (platform: Platform) => void;
  defaultPlatform?: Platform;
}

const platforms: { label: string; value: Platform }[] = [
  { label: "All Platforms", value: "all" },
  { label: "iOS", value: "iOS" },
  { label: "Android", value: "Android" },
  { label: "Web", value: "Web" },
];

export function PlatformFilter({
  onChange,
  defaultPlatform = "all",
}: PlatformFilterProps) {
  const [selected, setSelected] = useState<Platform>(defaultPlatform);

  const handleSelect = (platform: Platform) => {
    setSelected(platform);
    onChange?.(platform);
  };

  const currentLabel = platforms.find((p) => p.value === selected)?.label || "Platform";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 h-9">
          <Monitor className="w-4 h-4" />
          <span>{selected === "all" ? "Platform" : currentLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {platforms.map((platform) => (
          <DropdownMenuItem
            key={platform.value}
            onClick={() => handleSelect(platform.value)}
            className="flex items-center justify-between"
          >
            <span>{platform.label}</span>
            {selected === platform.value && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
