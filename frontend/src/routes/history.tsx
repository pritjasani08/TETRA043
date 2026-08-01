import { createFileRoute } from "@tanstack/react-router";
import { Download, Search, Calendar, MapPin, Activity, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { AuthGuard, PanelSection } from "@/components/shield-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ANIMALS, DETECTIONS, animalByName } from "@/lib/agrishield-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Detection History Log — AgriShield AI" },
    ],
  }),
  component: () => (
    <AuthGuard>
      <HistoryPage />
    </AuthGuard>
  ),
});

function HistoryPage() {
  const [range, setRange] = useState("week");
  const [animal, setAnimal] = useState("all");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const limit = range === "today" ? 1 : range === "week" ? 7 : 31;
    return DETECTIONS.filter(
      (d) =>
        d.dayOffset < limit &&
        (animal === "all" || d.animal === animal) &&
        (q.trim() === "" ||
          `${d.animal} ${d.side} ${d.id}`.toLowerCase().includes(q.trim().toLowerCase())),
    );
  }, [range, animal, q]);

  return (
    <AppShell title="Event History" subtitle="Comprehensive log of all verified field interventions">
      <div className="mx-auto max-w-[1200px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Controls Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Tabs value={range} onValueChange={setRange} className="bg-surface/50 p-1 rounded-xl border border-border">
              <TabsList className="bg-transparent border-none">
                <TabsTrigger value="today" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Today</TabsTrigger>
                <TabsTrigger value="week" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Past 7 Days</TabsTrigger>
                <TabsTrigger value="month" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Past 30 Days</TabsTrigger>
              </TabsList>
            </Tabs>
            <Select value={animal} onValueChange={setAnimal}>
              <SelectTrigger className="w-[180px] bg-white rounded-xl border-border h-10 shadow-sm">
                <SelectValue placeholder="All Species" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-xl">
                <SelectItem value="all">All Species</SelectItem>
                {ANIMALS.map((a) => (
                  <SelectItem key={a.name} value={a.name}>
                    <span className="flex items-center gap-2">
                      <span>{a.emoji}</span>
                      <span>{a.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-[240px]">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search logs..."
                className="pl-9 h-10 rounded-xl bg-white border-border shadow-sm focus-visible:ring-primary/20"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-xl border-border bg-white shadow-sm hover:bg-surface text-primary"
              onClick={() => {
                const csv = [
                  "id,animal,date,time,confidence,location,alert",
                  ...rows.map(
                    (r) =>
                      `${r.id},${r.animal},${r.date},${r.time},${r.confidence},${r.side},${r.alert}`,
                  ),
                ].join("\n");
                const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
                const a = document.createElement("a");
                a.href = url;
                a.download = "agrishield-detections.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="size-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* List Section */}
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
            {range === 'today' ? "Today's Events" : range === 'week' ? "This Week's Events" : "Monthly Events"}
          </h2>
          <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 font-bold">
            {rows.length} Total
          </Badge>
        </div>

        <div className="space-y-4">
          {rows.map((d) => (
            <div 
              key={d.id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 bg-white rounded-[1.5rem] border border-border shadow-sm hover:shadow-md transition-shadow group gap-4 sm:gap-6"
            >
              <div className="flex items-center gap-5">
                <div className="flex-shrink-0 size-14 bg-surface rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-border/50 group-hover:scale-105 transition-transform">
                  {animalByName(d.animal).emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-foreground tracking-tight">{d.animal}</h3>
                    <Badge variant="outline" className={cn(
                      "text-[10px] uppercase tracking-wider font-bold border-transparent px-2 py-0.5 rounded-full",
                      d.alert === "Triggered" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                    )}>
                      {d.alert === "Triggered" ? (
                        <span className="flex items-center gap-1"><ShieldAlert className="size-3" /> Deterrent Triggered</span>
                      ) : (
                        <span className="flex items-center gap-1"><CheckCircle2 className="size-3" /> Logged Only</span>
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Calendar className="size-3.5 text-primary/60" /> {d.date} at {d.time}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="size-3.5 text-primary/60" /> {d.side}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center sm:justify-end gap-6 sm:w-auto w-full border-t sm:border-t-0 border-border pt-4 sm:pt-0">
                <div className="flex flex-col sm:items-end gap-1">
                   <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">AI Confidence</span>
                   <span className="text-lg font-bold tabular-nums flex items-center gap-1.5 text-foreground">
                     <Activity className="size-4 text-primary" />
                     {d.confidence}%
                   </span>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto sm:ml-0 rounded-xl hover:bg-surface font-semibold text-primary">
                  View Frame
                </Button>
              </div>
            </div>
          ))}

          {rows.length === 0 && (
            <div className="p-12 bg-surface/50 border border-border border-dashed rounded-[2rem] flex flex-col items-center justify-center text-center">
              <div className="size-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <ShieldAlert className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-2">No Intrusions Found</h3>
              <p className="text-muted-foreground max-w-sm">
                Your fields are secure. No events match the current filters.
              </p>
            </div>
          )}
        </div>

      </div>
    </AppShell>
  );
}
