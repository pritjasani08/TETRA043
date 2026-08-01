import { useNavigate } from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";

import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/agrishield-data";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { ready, authed } = useAppState();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !authed) navigate({ to: "/auth", replace: true });
  }, [ready, authed, navigate]);

  if (!ready || !authed) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Loading secure console…
      </div>
    );
  }
  return <>{children}</>;
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "primary" | "warning" | "danger";
  icon?: ReactNode;
}) {
  const tones = {
    default: "text-foreground",
    primary: "text-primary",
    warning: "text-warning",
    danger: "text-destructive",
  } as const;
  return (
    <div className="panel p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">
          {label}
        </p>
        {icon && <span className={cn("p-2 rounded-2xl bg-muted/50", tones[tone])}>{icon}</span>}
      </div>
      <p className={cn("mt-4 font-display text-4xl font-bold tracking-tight", tones[tone])}>{value}</p>
      {hint && <p className="mt-2 text-xs font-medium text-muted-foreground/80">{hint}</p>}
    </div>
  );
}

export function RiskPill({ level }: { level: Severity }) {
  const map = {
    high: "border-destructive/30 bg-destructive/10 text-destructive",
    medium: "border-warning/30 bg-warning/10 text-warning",
    low: "border-primary/30 bg-primary/10 text-primary",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-widest shadow-sm",
        map[level],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {level}
    </span>
  );
}

export function PanelSection({
  title,
  description,
  children,
  className,
  right,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  right?: ReactNode;
}) {
  return (
    <section className={cn("panel p-6 sm:p-8", className)}>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-foreground">{title}</h2>
          {description && <p className="mt-1 text-sm font-medium text-muted-foreground">{description}</p>}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
      {children}
    </section>
  );
}
