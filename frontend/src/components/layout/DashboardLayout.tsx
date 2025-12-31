import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  hideHeader?: boolean;
  fullWidth?: boolean;
  headerAction?: ReactNode;
}

export function DashboardLayout({ 
  children, 
  title, 
  description, 
  hideHeader = false,
  fullWidth = false,
  headerAction
}: DashboardLayoutProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn(
        "transition-all duration-300",
        isCollapsed ? "ml-16" : "ml-64"
      )}>
        {!hideHeader && <Header />}
        <main className={cn(!fullWidth && "p-6")}>
          {title && (
            <div className="mb-6 animate-fade-in flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                {description && (
                  <p className="text-muted-foreground mt-1">{description}</p>
                )}
              </div>
              {headerAction && <div>{headerAction}</div>}
            </div>
          )}
          <div className="animate-fade-in" style={{ animationDelay: "50ms" }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
