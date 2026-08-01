import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Pencil, Phone, Smartphone, Sprout, Wheat } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { AuthGuard, PanelSection } from "@/components/shield-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppState, type Profile } from "@/lib/app-state";
import { COMMUNITY_FEED, RECENT_ALERTS } from "@/lib/agrishield-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Farmer Profile & Mobile App — AgriShield AI" },
      {
        name: "description",
        content:
          "Farmer profile, farm details and a preview of the AgriShield companion mobile app for alerts and history.",
      },
      { property: "og:title", content: "Farmer Profile & Mobile App — AgriShield AI" },
      {
        property: "og:description",
        content: "Manage your farm profile and see the companion mobile alert experience.",
      },
    ],
  }),
  component: () => (
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  ),
});

const FIELDS: Array<[keyof Profile, string]> = [
  ["fullName", "Full name"],
  ["mobile", "Mobile number"],
  ["email", "Email"],
  ["village", "Village"],
  ["district", "District"],
  ["state", "State"],
  ["farmName", "Farm name"],
  ["farmSize", "Farm size"],
  ["cropType", "Crop type"],
];

function ProfilePage() {
  const { profile, updateProfile, logout, systemOn, setSystemOn, settings, updateSettings } =
    useAppState();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const navigate = useNavigate();

  return (
    <AppShell title="Profile" subtitle="Farmer identity, farm details and mobile companion">
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="panel relative overflow-hidden p-6">
            <div className="grid-lines absolute inset-0 opacity-30" />
            <div className="relative flex flex-wrap items-center gap-5">
              <span className="grid size-20 place-items-center rounded-2xl bg-primary/15 font-display text-3xl font-bold text-primary ring-1 ring-primary/30">
                {profile.fullName.slice(0, 1)}
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-2xl font-bold">{profile.fullName}</h2>
                <p className="text-sm text-muted-foreground">
                  {profile.village}, {profile.district}, {profile.state}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Sprout className="size-3.5 text-primary" /> {profile.farmName}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wheat className="size-3.5 text-primary" /> {profile.cropType}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="size-3.5 text-primary" /> {profile.mobile}
                  </span>
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDraft(profile);
                    setEditing((v) => !v);
                  }}
                >
                  <Pencil className="size-4" />
                  {editing ? "Cancel" : "Edit profile"}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    logout();
                    toast.success("Logged out");
                    navigate({ to: "/auth" });
                  }}
                >
                  <LogOut className="size-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          <PanelSection
            title={editing ? "Edit farm details" : "Farm details"}
            description="Used for community alerts and district risk mapping"
          >
            {editing ? (
              <form
                className="grid gap-3 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  updateProfile(draft);
                  setEditing(false);
                  toast.success("Profile updated");
                }}
              >
                {FIELDS.map(([key, label]) => (
                  <div key={key} className="space-y-1.5">
                    <Label htmlFor={key} className="text-xs">
                      {label}
                    </Label>
                    <Input
                      id={key}
                      value={draft[key]}
                      onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                    />
                  </div>
                ))}
                <Button type="submit" className="sm:col-span-2">
                  Save changes
                </Button>
              </form>
            ) : (
              <dl className="grid gap-3 sm:grid-cols-2">
                {FIELDS.map(([key, label]) => (
                  <div key={key} className="rounded-lg border border-border bg-surface/60 p-3">
                    <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="mt-0.5 text-sm font-medium">{profile[key]}</dd>
                  </div>
                ))}
              </dl>
            )}
          </PanelSection>
        </div>

        <PanelSection
          title="Farmer mobile app"
          description="Flutter companion preview (simulated)"
          right={<Smartphone className="size-4 text-muted-foreground" />}
        >
          <div className="mx-auto w-full max-w-[300px] rounded-[2rem] border border-border bg-background/80 p-3 shadow-[0_30px_60px_-30px_oklch(0_0_0/0.9)]">
            <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-border" />
            <div className="space-y-3">
              <div className="rounded-xl border border-primary/30 bg-primary/10 p-3">
                <p className="text-[11px] uppercase tracking-wider text-primary">Current status</p>
                <p className="font-display text-lg font-bold">
                  {systemOn ? "Protected 🟢" : "Paused 🔴"}
                </p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">System</span>
                  <Switch checked={systemOn} onCheckedChange={setSystemOn} />
                </div>
              </div>

              <div className="rounded-xl border border-border p-3">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Active alerts
                </p>
                <ul className="mt-2 space-y-2">
                  {RECENT_ALERTS.slice(0, 3).map((a) => (
                    <li key={a.id} className="text-xs">
                      <span className="font-semibold">{a.animal}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        · {a.side} · {a.time} · {a.confidence}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border p-3">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Community feed
                </p>
                <ul className="mt-2 space-y-2">
                  {COMMUNITY_FEED.slice(0, 2).map((c) => (
                    <li key={c.id} className="text-xs">
                      <span className="font-semibold">{c.farm}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        · {c.animal} · {c.distance}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border p-3 text-xs">
                <span className="text-muted-foreground">Voice alerts</span>
                <Switch
                  checked={settings.voiceAlerts}
                  onCheckedChange={(v) => updateSettings({ voiceAlerts: v })}
                />
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Push notifications, background detection and emergency SOS ship with the native build.
          </p>
        </PanelSection>
      </div>
    </AppShell>
  );
}
