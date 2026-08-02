import { createFileRoute } from "@tanstack/react-router";
import {
  Download,
  Search,
  Calendar,
  MapPin,
  Activity,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  FileText,
  Printer,
  Share2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";

import { AppShell } from "@/components/AppShell";
import { AuthGuard } from "@/components/shield-ui";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ANIMALS, DETECTIONS, animalByName, Detection } from "@/lib/agrishield-data";
import { cn } from "@/lib/utils";
import { ActivityDetailsDrawer } from "@/components/ActivityDetailsDrawer";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [{ title: "Activity Log — AgriShield AI" }],
  }),
  component: () => (
    <AuthGuard>
      <HistoryPage />
    </AuthGuard>
  ),
});

function HistoryPage() {
  const [dateRange, setDateRange] = useState("all");
  const [animal, setAnimal] = useState("all");
  const [boundary, setBoundary] = useState("all");
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [selectedEvent, setSelectedEvent] = useState<Detection | null>(null);

  const filteredRows = useMemo(() => {
    const limit = dateRange === "today" ? 1 : dateRange === "week" ? 7 : 31;
    return DETECTIONS.filter(
      (d) =>
        (dateRange === "all" || d.dayOffset < limit) &&
        (animal === "all" || d.animal === animal) &&
        (boundary === "all" || d.side === boundary) &&
        (status === "all" || d.status === status) &&
        (q.trim() === "" ||
          `${d.animal} ${d.side} ${d.id} ${d.status}`
            .toLowerCase()
            .includes(q.trim().toLowerCase())),
    );
  }, [dateRange, animal, boundary, status, q]);

  useEffect(() => {
    setCurrentPage(1);
  }, [dateRange, animal, boundary, status, q]);

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const rows = filteredRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = useMemo(() => {
    const todaysEvents = DETECTIONS.filter((d) => d.dayOffset === 0);
    const confidences = DETECTIONS.map((d) => d.confidence);
    const avgConf = Math.round(confidences.reduce((a, b) => a + b, 0) / (confidences.length || 1));

    // Find most active boundary
    const boundaries = DETECTIONS.reduce(
      (acc, curr) => {
        acc[curr.side] = (acc[curr.side] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const mostActiveBoundary =
      Object.entries(boundaries).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

    return {
      todayCount: todaysEvents.length,
      avgConf,
      mostActiveBoundary,
      highestRisk: "Wild Boar",
    };
  }, []);

  const getStatusColor = (s: string) => {
    switch (s) {
      case "Resolved":
        return "bg-primary/10 text-primary border-transparent";
      case "Action Taken":
        return "bg-orange-500/10 text-orange-600 border-transparent";
      case "Needs Review":
        return "bg-destructive/10 text-destructive border-transparent";
      case "Monitoring":
        return "bg-blue-500/10 text-blue-600 border-transparent";
      default:
        return "bg-surface text-foreground";
    }
  };

  return (
    <AppShell
      title="Activity Log"
      subtitle="Farmer-friendly monitoring and historical event records"
    >
      <div className="mx-auto max-w-[1200px] animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        {/* Quick Summary Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-border shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Calendar className="size-4" />{" "}
              <span className="text-xs font-bold uppercase tracking-wider">Today's Events</span>
            </div>
            <p className="text-3xl font-display font-bold text-foreground">{stats.todayCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-border shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <AlertTriangle className="size-4" />{" "}
              <span className="text-xs font-bold uppercase tracking-wider">Highest Risk</span>
            </div>
            <p className="text-xl font-display font-bold text-foreground mt-1">
              {stats.highestRisk}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-border shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <MapPin className="size-4" />{" "}
              <span className="text-xs font-bold uppercase tracking-wider">Most Active</span>
            </div>
            <p className="text-xl font-display font-bold text-foreground mt-1">
              {stats.mostActiveBoundary}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-border shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="size-4" />{" "}
              <span className="text-xs font-bold uppercase tracking-wider">Avg Confidence</span>
            </div>
            <p className="text-3xl font-display font-bold text-foreground">{stats.avgConf}%</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-3xl border border-border shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px] bg-surface rounded-xl border-border h-10">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Past 7 Days</SelectItem>
                <SelectItem value="month">Past 30 Days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={animal} onValueChange={setAnimal}>
              <SelectTrigger className="w-[140px] bg-surface rounded-xl border-border h-10">
                <SelectValue placeholder="Animal" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Animals</SelectItem>
                {ANIMALS.map((a) => (
                  <SelectItem key={a.name} value={a.name}>
                    {a.emoji} {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={boundary} onValueChange={setBoundary}>
              <SelectTrigger className="w-[150px] bg-surface rounded-xl border-border h-10">
                <SelectValue placeholder="Boundary" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Boundaries</SelectItem>
                <SelectItem value="North Fence">North Fence</SelectItem>
                <SelectItem value="South Canal">South Canal</SelectItem>
                <SelectItem value="East Gate">East Gate</SelectItem>
                <SelectItem value="West Boundary">West Boundary</SelectItem>
                <SelectItem value="Well Corner">Well Corner</SelectItem>
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[150px] bg-surface rounded-xl border-border h-10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Action Taken">Action Taken</SelectItem>
                <SelectItem value="Needs Review">Needs Review</SelectItem>
                <SelectItem value="Monitoring">Monitoring</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-[220px]">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search events..."
                className="pl-9 h-10 rounded-xl bg-surface border-border focus-visible:ring-primary/20"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-xl border border-border bg-white shadow-sm hover:bg-surface hover:text-primary text-foreground transition-all active:scale-95"
                >
                  <Download className="size-4 mr-2" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-border shadow-xl">
                <DropdownMenuItem className="cursor-pointer font-medium hover:bg-surface rounded-lg m-1 p-2">
                  <FileText className="size-4 mr-2 text-muted-foreground" /> Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer font-medium hover:bg-surface rounded-lg m-1 p-2">
                  <Download className="size-4 mr-2 text-muted-foreground" /> Download CSV
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer font-medium hover:bg-surface rounded-lg m-1 p-2">
                  <Printer className="size-4 mr-2 text-muted-foreground" /> Print Report
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer font-medium hover:bg-surface rounded-lg m-1 p-2">
                  <Share2 className="size-4 mr-2 text-muted-foreground" /> Share Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* List Section */}
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
            {filteredRows.length} Events Found
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rows.map((d) => (
            <div
              key={d.id}
              className="flex flex-col bg-white rounded-3xl border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden group"
            >
              {/* Card Header (Image + Title) */}
              <div className="p-5 pb-4 border-b border-border/50 bg-gradient-to-br from-surface to-white flex gap-4 items-start relative">
                <Badge
                  className={cn(
                    "absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5",
                    getStatusColor(d.status),
                  )}
                >
                  {d.status}
                </Badge>

                <div className="size-16 rounded-2xl bg-white border border-border shadow-sm flex items-center justify-center text-3xl">
                  {animalByName(d.animal).emoji}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-bold text-lg text-foreground tracking-tight">{d.animal}</h3>
                  <div className="flex flex-col gap-1 text-xs font-medium text-muted-foreground mt-1">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3 text-primary/60" /> {d.side}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3 text-primary/60" /> {d.date} • {d.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Natural Language Summary */}
              <div className="p-5 flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {d.summary}
                </p>
              </div>

              {/* Actions Taken & Confidence */}
              <div className="px-5 pb-5 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {d.actions.map((act, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-surface border-border text-foreground text-xs px-2 py-1 flex items-center gap-1"
                    >
                      <CheckCircle2 className="size-3 text-primary" /> {act}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-surface/50 border-t border-border flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    AI Confidence
                  </span>
                  <span className="text-sm font-bold text-foreground">{d.confidence}%</span>
                </div>

                <Button
                  onClick={() => setSelectedEvent(d)}
                  size="sm"
                  className="rounded-xl font-bold bg-primary text-white hover:bg-primary/90 shadow-md transition-all active:scale-95 px-4 h-9"
                >
                  View Details <ChevronRight className="size-4 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {rows.length === 0 && (
          <div className="p-16 bg-surface/50 border border-border rounded-[2rem] flex flex-col items-center justify-center text-center">
            <div className="size-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
              <ShieldAlert className="size-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-3">
              No animal detections found.
            </h3>
            <p className="text-muted-foreground max-w-sm text-lg">
              Your farm remained protected during this period. Try adjusting your filters.
            </p>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-8 mt-4">
            <p className="text-sm font-medium text-muted-foreground">
              Showing{" "}
              <span className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="text-foreground">
                {Math.min(currentPage * itemsPerPage, filteredRows.length)}
              </span>{" "}
              of <span className="text-foreground">{filteredRows.length}</span> events
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-xl bg-white text-foreground hover:bg-surface border-border shadow-sm h-9"
              >
                <ChevronLeft className="size-4 mr-1" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-xl bg-white text-foreground hover:bg-surface border-border shadow-sm h-9 px-4"
              >
                Next <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <ActivityDetailsDrawer
        event={selectedEvent}
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      />
    </AppShell>
  );
}
