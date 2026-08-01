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
  { to: "/detection", label: "Camera Feed", icon: Camera },
  { to: "/history", label: "History & Logs", icon: History },
  { to: "/heatmap", label: "Zone Heatmap", icon: Map },
  { to: "/analytics", label: "Data Analytics", icon: BarChart3 },
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
              "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300",
              active
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
            )}
          >
            <Icon className="size-[18px] transition-transform group-hover:scale-110" />
            {label}
            {active && <span className="ml-auto size-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] pulse-dot" />}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/dashboard" className="flex items-center gap-3 pl-2">
      <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-primary to-[#2E7D32] text-white shadow-lg shadow-primary/30">
        <ShieldCheck className="size-6" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-lg font-bold tracking-tight text-foreground">AgriShield AI</span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Premium Guard
        </span>
      </span>
    </Link>
  );
}

export function AppShell({
  title,
  children,
  actions,
}: {
  title: string;
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
    <div className="flex min-h-screen bg-background">
      {/* Floating Sidebar */}
      <aside className="sticky top-4 m-4 hidden h-[calc(100vh-32px)] w-[280px] shrink-0 flex-col gap-8 rounded-[2rem] border border-sidebar-border bg-sidebar px-5 py-8 shadow-xl shadow-black/[0.02] lg:flex z-50">
        <Brand />
        <NavList />
        
        <div className="mt-auto">
          {/* Status Card inside Sidebar */}
          <div className="rounded-3xl border border-sidebar-border bg-gradient-to-b from-sidebar to-sidebar-accent/50 p-5 shadow-sm mb-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
              System Control
            </p>
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "font-display text-xl font-bold transition-colors",
                  systemOn ? "text-primary" : "text-destructive",
                )}
              >
                {systemOn ? "Secured" : "Paused"}
              </span>
              <Switch checked={systemOn} onCheckedChange={setSystemOn} aria-label="Security system" className={cn("data-[state=checked]:bg-primary")} />
            </div>
            <p className="mt-3 text-xs font-medium leading-relaxed text-muted-foreground">
              {systemOn
                ? "AI actively analyzing perimeter."
                : "Monitoring disabled. Farm exposed."}
            </p>
          </div>

          {/* Profile Pill */}
          <Link
            to="/profile"
            className="flex items-center gap-3 rounded-[1.5rem] border border-sidebar-border bg-white px-3 py-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <span className="grid size-10 place-items-center rounded-full bg-accent text-white font-display text-sm font-bold shadow-sm">
              {profile.fullName.slice(0, 1)}
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-bold text-foreground">{profile.fullName}</span>
              <span className="block truncate text-xs font-medium text-muted-foreground">
                {profile.farmName}
              </span>
            </span>
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Seamless Header */}
        <header className="sticky top-4 z-40 mx-4 md:mx-10 mb-6 flex flex-wrap items-center gap-4 bg-white/70 px-6 py-4 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] rounded-[2rem]">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-xl lg:hidden bg-white shadow-sm border-border">
                <Menu className="size-5 text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] border-r-0 bg-sidebar p-6 sm:max-w-sm rounded-r-[2rem]">
              <div className="mb-8 mt-2">
                <Brand />
              </div>
              <NavList onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          
          <div className="min-w-0 flex-1 flex flex-col items-start gap-1">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {title}
            </h1>
          </div>
          
          <div className="ml-auto flex items-center gap-3">
            {actions}
            <Badge
              variant="outline"
              className={cn(
                "hidden gap-2 rounded-full border-0 px-4 py-2 font-semibold shadow-sm sm:flex transition-colors duration-500",
                systemOn 
                  ? "bg-white text-primary ring-1 ring-border" 
                  : "bg-destructive/10 text-destructive ring-1 ring-destructive/20",
              )}
            >
              <span
                className={cn(
                  "size-2.5 rounded-full",
                  systemOn ? "bg-primary pulse-dot" : "bg-destructive",
                )}
              />
              <Activity className="size-4" />
              {systemOn ? "System Active" : "System Offline"}
            </Badge>
          </div>
        </header>
        
        <main className="flex-1 px-4 pb-12 pt-6 md:px-10">{children}</main>
      </div>
    </div>
  );
}
