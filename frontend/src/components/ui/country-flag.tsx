import { getCountryFlag, getCountryName } from "@/lib/countries";
import { cn } from "@/lib/utils";

interface CountryFlagProps {
  countryCode: string;
  showName?: boolean;
  showCode?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CountryFlag({
  countryCode,
  showName = false,
  showCode = false,
  className,
  size = "md",
}: CountryFlagProps) {
  const flag = getCountryFlag(countryCode);
  const name = getCountryName(countryCode);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className={cn(sizeClasses[size])}>{flag}</span>
      {showCode && (
        <span className="text-xs font-mono text-muted-foreground uppercase">
          {countryCode}
        </span>
      )}
      {showName && (
        <span className="text-sm text-foreground">{name}</span>
      )}
    </span>
  );
}
