import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  className?: string;
}

export function UserAvatar({ name, className }: UserAvatarProps) {
  // Generate consistent gradient based on name
  const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  const hue1 = hash % 360;
  const hue2 = (hash * 2) % 360;

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center",
        className
      )}
      style={{
        background: `linear-gradient(135deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 70%, 50%))`,
      }}
    />
  );
}
