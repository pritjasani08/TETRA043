import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownRight, MapPinned, Radio, Send, Timer, Users } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { AuthGuard, PanelSection, RiskPill, StatCard } from "@/components/shield-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COMMUNITY_FEED, animalByName } from "@/lib/agrishield-data";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Village Safety Network — AgriShield AI" },
      {
        name: "description",
        content:
          "Collaborative farmer feed: nearby intrusion alerts, animal movement direction, distance and estimated arrival.",
      },
      { property: "og:title", content: "Village Safety Network — AgriShield AI" },
      {
        property: "og:description",
        content: "When one farm detects an animal, every neighbouring farm gets warned instantly.",
      },
    ],
  }),
  component: () => (
    <AuthGuard>
      <CommunityPage />
    </AuthGuard>
  ),
});

function CommunityPage() {
  const { profile } = useAppState();
  const nearby = COMMUNITY_FEED.filter((p) => p.severity !== "low");

  return (
    <AppShell
      title="Community"
      subtitle={`Village Safety Network · ${profile.village} cluster · 14 connected farms`}
      actions={
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast.success("Broadcast sent", {
              description: "12 nearby farms notified about activity at your fence line.",
            })
          }
        >
          <Send className="size-4" />
          Broadcast alert
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Connected farms"
          value={14}
          hint="Within 5 km"
          icon={<Users className="size-4" />}
        />
        <StatCard label="Shared alerts today" value={9} hint="6 high severity" tone="warning" />
        <StatCard
          label="Nearest threat"
          value="700 m"
          hint="Wild boar, moving south-east"
          tone="danger"
        />
        <StatCard
          label="Avg. warning lead"
          value="11 min"
          hint="Before arrival at your fence"
          tone="primary"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <PanelSection title="Community feed" description="Live reports from neighbouring farms">
          <ul className="space-y-3">
            {COMMUNITY_FEED.map((p) => {
              const a = animalByName(p.animal);
              return (
                <li key={p.id} className="rounded-xl border border-border bg-surface/60 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="grid size-9 place-items-center rounded-full bg-accent/15 text-lg">
                      {a.emoji}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{p.farmer}</span>
                      <span className="block text-xs text-muted-foreground">
                        {p.farm} · {p.village}
                      </span>
                    </span>
                    <span className="ml-auto flex items-center gap-2">
                      <RiskPill level={p.severity} />
                      <span className="text-xs text-muted-foreground">{p.time}</span>
                    </span>
                  </div>
                  <p className="mt-3 text-sm">
                    <span className="font-semibold text-foreground">{p.animal} detected</span>
                    <span className="text-muted-foreground">
                      {" "}
                      · {p.direction} · {p.distance}
                    </span>
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <Badge variant="outline" className="gap-1">
                      <ArrowDownRight className="size-3" />
                      {p.notified}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Timer className="size-3" />
                      ETA {p.eta}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-auto"
                      onClick={() =>
                        toast.success("Acknowledged", {
                          description: `${p.farmer} notified that you are on alert.`,
                        })
                      }
                    >
                      Acknowledge
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </PanelSection>

        <div className="flex flex-col gap-4">
          <PanelSection
            title="Nearby farm alerts"
            description="Threats heading toward your boundary"
          >
            <ul className="space-y-3">
              {nearby.map((p) => (
                <li
                  key={p.id}
                  className="rounded-xl border border-destructive/30 bg-destructive/10 p-4"
                >
                  <p className="flex items-center gap-2 font-display text-base font-bold">
                    {animalByName(p.animal).emoji} {p.animal}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Detected {p.distance}</p>
                  <p className="mt-2 text-sm">
                    Estimated arrival <span className="font-semibold">{p.eta}</span>
                  </p>
                  <Button
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() =>
                      toast.success("Deterrents armed", {
                        description: `${animalByName(p.animal).deterrents.join(" + ")} ready on the ${p.direction.toLowerCase()} line.`,
                      })
                    }
                  >
                    Arm deterrents
                  </Button>
                </li>
              ))}
            </ul>
          </PanelSection>

          <PanelSection title="Relay chain" description="How an alert travels the village">
            <ol className="relative space-y-4 border-l border-border pl-5 text-sm">
              {[
                ["Farm A detects wild boar", "8:10 PM · confidence 97%"],
                ["AgriShield relays to cluster", "8:10 PM · 12 farms in 5 km"],
                ["Farm B notified", "8:11 PM · voice alert in Gujarati"],
                ["Deterrents activated", "8:11 PM · siren + flash lights"],
              ].map(([t, s], i) => (
                <li key={t}>
                  <span className="absolute -left-[7px] mt-1.5 grid size-3.5 place-items-center rounded-full bg-primary ring-4 ring-background" />
                  <p className="font-medium">{t}</p>
                  <p className="text-xs text-muted-foreground">{s}</p>
                  {i === 3 && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-primary">
                      <Radio className="size-3" /> Chain complete
                    </p>
                  )}
                </li>
              ))}
            </ol>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <MapPinned className="size-3.5" /> Cluster radius 5 km · {profile.village},{" "}
              {profile.district}
            </p>
          </PanelSection>
        </div>
      </div>
    </AppShell>
  );
}
