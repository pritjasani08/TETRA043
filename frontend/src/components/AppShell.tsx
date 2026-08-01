import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Camera,
  History,
  LayoutDashboard,
  Map,
  Settings as SettingsIcon,
  ShieldCheck,
  Users,
  Menu,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/detection", label: "Animal Detection", icon: Camera },
  { to: "/history", label: "Detection History", icon: History },
  { to: "/heatmap", label: "Heatmap", icon: Map },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/community", label: "Community", icon: Users },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
            {active && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/dashboard" className="flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
        <ShieldCheck className="size-5" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-base font-bold tracking-tight">AgriShield AI</span>
        <span className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Crop Guard Network
        </span>
      </span>
    </Link>
  );
}

export function AppShell({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  const { systemOn, setSystemOn, offSince, profile } = useAppState();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (systemOn || !offSince) return;
    const check = () => {
      if (Date.now() - offSince > 4 * 60 * 60 * 1000) {
        toast.warning("Idle reminder", {
          description:
            "Security system has been disabled for over 4 hours. Please enable monitoring.",
        });
      }
    };
    check();
    const id = window.setInterval(check, 60_000);
    return () => window.clearInterval(id);
  }, [systemOn, offSince]);

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col gap-6 border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <Brand />
        <NavList />
        <div className="mt-auto rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Security System
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span
              className={cn(
                "font-display text-lg font-bold",
                systemOn ? "text-primary" : "text-destructive",
              )}
            >
              {systemOn ? "ON" : "OFF"}
            </span>
            <Switch checked={systemOn} onCheckedChange={setSystemOn} aria-label="Security system" />
          </div>
          <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
            {systemOn
              ? "Detection, alerts and notifications are live."
              : "Detection paused. No alerts will be generated."}
          </p>
        </div>
        <Link
          to="/profile"
          className="flex items-center gap-3 rounded-xl border border-sidebar-border px-3 py-2.5 transition-colors hover:bg-sidebar-accent/60"
        >
          <span className="grid size-9 place-items-center rounded-full bg-accent/20 font-display text-sm font-bold text-accent">
            {profile.fullName.slice(0, 1)}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-medium">{profile.fullName}</span>
            <span className="block truncate text-[11px] text-muted-foreground">
              {profile.village}, {profile.district}
            </span>
          </span>
        </Link>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-border bg-background/85 px-4 py-4 backdrop-blur-md md:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-sidebar p-5">
              <div className="mb-6">
                <Brand />
              </div>
              <NavList onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="min-w-0">
            <h1 className="truncate font-display text-xl font-bold md:text-2xl">{title}</h1>
            {subtitle && (
              <p className="truncate text-xs text-muted-foreground md:text-sm">{subtitle}</p>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {actions}
            <Badge
              variant="outline"
              className={cn(
                "gap-1.5 border-primary/40 bg-primary/10 py-1.5 text-primary",
                !systemOn && "border-destructive/40 bg-destructive/10 text-destructive",
              )}
            >
              <span
                className={cn(
                  "size-2 rounded-full",
                  systemOn ? "bg-primary pulse-dot" : "bg-destructive",
                )}
              />
              <Activity className="size-3" />
              {systemOn ? "Monitoring" : "Paused"}
            </Badge>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
