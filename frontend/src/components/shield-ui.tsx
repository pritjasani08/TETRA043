import { useNavigate } from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/agrishield-data";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthed, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthed) navigate({ to: "/auth", replace: true });
  }, [isLoading, isAuthed, navigate]);

  if (isLoading || !isAuthed) {
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
    <div className="panel p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <p className={cn("mt-2 font-display text-2xl font-bold", tones[tone])}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function RiskPill({ level }: { level: Severity }) {
  const map = {
    high: "border-destructive/40 bg-destructive/15 text-destructive",
    medium: "border-warning/40 bg-warning/15 text-warning",
    low: "border-primary/40 bg-primary/15 text-primary",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
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
    <section className={cn("panel p-5", className)}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-display text-base font-semibold">{title}</h2>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}
