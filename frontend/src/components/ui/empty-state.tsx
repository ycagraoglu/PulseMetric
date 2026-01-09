import { Inbox, Users, Calendar, Activity, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type EmptyIcon = "inbox" | "users" | "calendar" | "activity" | "chart";

interface EmptyStateProps {
    icon?: EmptyIcon;
    title?: string;
    message?: string;
    action?: React.ReactNode;
}

const icons: Record<EmptyIcon, React.ElementType> = {
    inbox: Inbox,
    users: Users,
    calendar: Calendar,
    activity: Activity,
    chart: BarChart3,
};

/**
 * Veri olmadığında gösterilecek component
 */
export function EmptyState({
    icon = "inbox",
    title = "Henüz veri yok",
    message = "Bu alanda gösterilecek veri bulunmuyor.",
    action
}: EmptyStateProps) {
    const IconComponent = icons[icon];

    return (
        <Card className="bg-muted/30 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md">{message}</p>
                {action}
            </CardContent>
        </Card>
    );
}
