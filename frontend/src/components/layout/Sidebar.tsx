import { Link, useLocation } from "react-router-dom";
import {
  Users,
  Activity,
  Zap,
  Radio,
  PieChart,
  GitBranch,
  Settings,
  Key,
  UsersRound,
  FlaskConical,
  FileText,
  HelpCircle,
  Signal,
  Github,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from "@/contexts/SidebarContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const analyticsLinks = [
  { label: "Users", icon: Users, href: "/" },
  { label: "Sessions", icon: Activity, href: "/sessions" },
  { label: "Events", icon: Zap, href: "/events" },
  { label: "Realtime", icon: Radio, href: "/realtime" },
  { label: "Segments", icon: PieChart, href: "/segments", badge: "SOON" },
  { label: "Funnels", icon: GitBranch, href: "/funnels", badge: "SOON" },
];

const applicationLinks = [
  { label: "Settings", icon: Settings, href: "/settings" },
  { label: "API Keys", icon: Key, href: "/api-keys" },
  { label: "Team", icon: UsersRound, href: "/team" },
  { label: "Test", icon: FlaskConical, href: "/test" },
];

const bottomLinks = [
  { label: "Docs", icon: FileText, href: "/docs" },
  { label: "Support", icon: HelpCircle, href: "/support" },
  { label: "Status", icon: Signal, href: "/status" },
  { label: "Github", icon: Github, href: "/github" },
];

export function Sidebar() {
  const location = useLocation();
  const { isCollapsed, toggle } = useSidebar();

  const NavLink = ({ link }: { link: typeof analyticsLinks[0] }) => {
    const isActive = location.pathname === link.href;
    const content = (
      <Link
        to={link.href}
        className={cn(
          "nav-link",
          isActive && "nav-link-active",
          isCollapsed && "justify-center px-2"
        )}
      >
        <link.icon className="w-4 h-4 shrink-0" />
        {!isCollapsed && (
          <>
            <span>{link.label}</span>
            {link.badge && (
              <span className="ml-auto text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {link.badge}
              </span>
            )}
          </>
        )}
      </Link>
    );

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right">
            <span>{link.label}</span>
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-2 py-5 border-b border-sidebar-border",
        isCollapsed ? "justify-center px-2" : "px-4"
      )}>
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Activity className="w-5 h-5 text-primary-foreground" />
        </div>
        {!isCollapsed && <span className="text-xl font-bold text-foreground">PulseMetric</span>}
      </div>

      {/* Toggle Button */}
      <div className={cn("px-3 py-2", isCollapsed && "px-2")}>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          className={cn("w-full", isCollapsed ? "justify-center px-2" : "justify-start")}
        >
          {isCollapsed ? (
            <PanelLeft className="w-4 h-4" />
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 overflow-y-auto py-4", isCollapsed ? "px-2" : "px-3")}>
        {!isCollapsed && <div className="section-label">Analytics</div>}
        <ul className="space-y-1 mb-6">
          {analyticsLinks.map((link) => (
            <li key={link.href}>
              <NavLink link={link} />
            </li>
          ))}
        </ul>

        {!isCollapsed && <div className="section-label">Application</div>}
        <ul className="space-y-1">
          {applicationLinks.map((link) => (
            <li key={link.href}>
              <NavLink link={link} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Links */}
      <div className={cn("border-t border-sidebar-border py-4", isCollapsed ? "px-2" : "px-3")}>
        <ul className="space-y-1">
          {bottomLinks.map((link) => (
            <li key={link.href}>
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={link.href}
                      className="nav-link text-muted-foreground hover:text-foreground justify-center px-2"
                    >
                      <link.icon className="w-4 h-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{link.label}</TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  to={link.href}
                  className="nav-link text-muted-foreground hover:text-foreground"
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* User Profile */}
      <div className="border-t border-sidebar-border p-3">
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-theme cursor-pointer",
          isCollapsed && "justify-center gap-0"
        )}>
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarImage src="" />
            <AvatarFallback className="bg-destructive text-destructive-foreground text-xs font-bold">
              M
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Miraç</p>
                <p className="text-xs text-muted-foreground truncate">berk@mirac.dev</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
