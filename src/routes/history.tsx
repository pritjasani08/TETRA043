import { createFileRoute } from "@tanstack/react-router";
import { Download, Search } from "lucide-react";
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

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Detection History Log — AgriShield AI" },
      {
        name: "description",
        content:
          "Searchable intrusion log with animal, time, confidence, fence location and alert status filters.",
      },
      { property: "og:title", content: "Detection History Log — AgriShield AI" },
      {
        property: "og:description",
        content: "Filter every recorded animal detection by day, week, month or species.",
      },
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
    <AppShell title="Detection History" subtitle={`${rows.length} records in selected range`}>
      <PanelSection
        title="Intrusion log"
        description="Every detection with its stored frame, confidence and alert state"
        right={
          <Button
            variant="outline"
            size="sm"
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
            <Download className="size-4" />
            Export CSV
          </Button>
        }
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Tabs value={range} onValueChange={setRange}>
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={animal} onValueChange={setAnimal}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Animal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All animals</SelectItem>
              {ANIMALS.map((a) => (
                <SelectItem key={a.name} value={a.name}>
                  {a.emoji} {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative min-w-[180px] flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search id, animal or zone"
              className="pl-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-3 font-semibold">Frame</th>
                <th className="py-2 pr-3 font-semibold">Animal</th>
                <th className="py-2 pr-3 font-semibold">Date</th>
                <th className="py-2 pr-3 font-semibold">Time</th>
                <th className="py-2 pr-3 font-semibold">Confidence</th>
                <th className="py-2 pr-3 font-semibold">Location</th>
                <th className="py-2 font-semibold">Alert</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id} className="border-b border-border/60 hover:bg-surface/50">
                  <td className="py-2.5 pr-3">
                    <span className="grid size-10 place-items-center rounded-lg border border-border bg-surface text-lg">
                      {animalByName(d.animal).emoji}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 font-medium">{d.animal}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{d.date}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{d.time}</td>
                  <td className="py-2.5 pr-3">{d.confidence}%</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{d.side}</td>
                  <td className="py-2.5">
                    <Badge
                      variant="outline"
                      className={
                        d.alert === "Triggered"
                          ? "border-destructive/40 bg-destructive/10 text-destructive"
                          : "border-border text-muted-foreground"
                      }
                    >
                      {d.alert}
                    </Badge>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    No detections match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PanelSection>
    </AppShell>
  );
}
