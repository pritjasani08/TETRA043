import { createFileRoute } from "@tanstack/react-router";
import { BellRing, Languages, ShieldCheck, Volume2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { AuthGuard, PanelSection } from "@/components/shield-ui";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { VOICE_LINES } from "@/lib/agrishield-data";
import { speakAlert, useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Alert & System Settings — AgriShield AI" },
    ],
  }),
  component: () => (
    <AuthGuard>
      <SettingsPage />
    </AuthGuard>
  ),
});

function SettingsPage() {
  const { settings, updateSettings, systemOn, setSystemOn, offSince } = useAppState();

  return (
    <AppShell title="System & Alerts" subtitle="Configure language, notification routing, and master security controls">
      <div className="mx-auto max-w-[1200px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="grid gap-8 lg:grid-cols-2">
          
          <PanelSection title="Master Control" description="Global toggle for detection and AI alerts" className="p-6 md:p-8">
            <div className={cn(
              "flex flex-col sm:flex-row sm:items-center justify-between rounded-[1.5rem] border p-6 transition-colors shadow-sm",
              systemOn ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"
            )}>
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <div className={cn(
                  "size-12 rounded-full flex items-center justify-center",
                  systemOn ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-destructive text-white shadow-lg shadow-destructive/30"
                )}>
                  {systemOn ? <ShieldCheck className="size-6" /> : <ShieldAlert className="size-6" />}
                </div>
                <div>
                  <h3 className={cn("font-display text-xl font-bold tracking-tight", systemOn ? "text-primary" : "text-destructive")}>
                    {systemOn ? "System Armed" : "System Disarmed"}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                    {systemOn
                      ? "Full perimeter monitoring active"
                      : "Detection paused. No alerts will be sent."}
                  </p>
                </div>
              </div>
              <Switch
                checked={systemOn}
                onCheckedChange={(v) => {
                  setSystemOn(v);
                  toast[v ? "success" : "warning"](
                    v ? "Security system enabled" : "Security system disabled",
                    {
                      description: v
                        ? "Monitoring resumed on all fence zones."
                        : "You will be reminded if it stays off for 4 hours.",
                    },
                  );
                }}
                aria-label="Security system"
                className="data-[state=checked]:bg-primary ml-auto sm:ml-0"
              />
            </div>
            {!systemOn && offSince && (
              <div className="mt-4 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-warning font-semibold flex items-start gap-3">
                <BellRing className="size-5 shrink-0 mt-0.5" />
                <p>Idle reminder armed: if monitoring stays off for more than four hours you will be prompted to re-enable monitoring.</p>
              </div>
            )}
          </PanelSection>

          <PanelSection title="Localization" description="Interface and localized voice alert settings" className="p-6 md:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  <Languages className="size-4" /> App Interface
                </Label>
                <Select
                  value={settings.language}
                  onValueChange={(v) => updateSettings({ language: v })}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-surface border-border shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {["English", "Hindi", "Gujarati"].map((l) => (
                      <SelectItem key={l} value={l} className="font-medium">
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  <Volume2 className="size-4" /> Voice Alerts
                </Label>
                <Select
                  value={settings.voiceLanguage}
                  onValueChange={(v) => updateSettings({ voiceLanguage: v })}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-surface border-border shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {Object.keys(VOICE_LINES).map((l) => (
                      <SelectItem key={l} value={l} className="font-medium">
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-border bg-surface/50 p-4 text-sm font-medium italic text-muted-foreground border-l-4 border-l-primary flex items-center gap-3">
               <Volume2 className="size-5 text-primary opacity-50 shrink-0" />
               <p>"{ (VOICE_LINES[settings.voiceLanguage] ?? VOICE_LINES["English"]!)("Wild Boar", "North Fence") }"</p>
            </div>
          </PanelSection>

          <PanelSection title="Voice Alerts" description="Hardware speaker volume and controls" className="p-6 md:p-8">
            <div className="flex items-center justify-between rounded-2xl border border-border p-4 bg-surface/50 shadow-sm mb-6">
              <Label htmlFor="voice-toggle" className="text-base font-bold">
                Enable Hardware Voice Alerts
              </Label>
              <Switch
                id="voice-toggle"
                checked={settings.voiceAlerts}
                onCheckedChange={(v) => updateSettings({ voiceAlerts: v })}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between text-sm">
                <Label className="font-bold text-muted-foreground uppercase tracking-wider">Output Volume</Label>
                <span className="font-bold text-lg tabular-nums text-foreground">{settings.volume}%</span>
              </div>
              <Slider
                value={[settings.volume]}
                max={100}
                step={5}
                onValueChange={([v]) => updateSettings({ volume: v ?? 0 })}
                className="py-2"
              />
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-xl font-bold shadow-sm hover:bg-surface border-border mt-2"
                onClick={() =>
                  speakAlert(
                    (VOICE_LINES[settings.voiceLanguage] ?? VOICE_LINES["English"]!)(
                      "Wild Boar",
                      "North Fence",
                    ),
                    settings.voiceLanguage,
                    settings.volume,
                  )
                }
              >
                <Volume2 className="size-4 mr-2 text-primary" />
                Test Voice Output
              </Button>
            </div>
          </PanelSection>

          <PanelSection title="Notification Routing" description="Configure what alerts reach your smartphone" className="p-6 md:p-8">
            <RadioGroup
              value={settings.notifications}
              onValueChange={(v) => updateSettings({ notifications: v as "all" | "high" | "off" })}
              className="space-y-3"
            >
              {(
                [
                  ["all", "All Detections", "Notify for every animal across all zones"],
                  ["high", "High Risk Only", "Notify only for wild boar, nilgai, and monkey raids"],
                  ["off", "Mute Notifications", "Log detections silently without pushing to phone"],
                ] as const
              ).map(([value, label, hint]) => (
                <Label
                  key={value}
                  className="flex items-start gap-4 rounded-xl border border-border p-4 cursor-pointer transition-all hover:bg-surface/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 has-[[data-state=checked]]:shadow-md"
                >
                  <RadioGroupItem value={value} className="mt-1" />
                  <span className="flex-1">
                    <span className="block text-base font-bold text-foreground">{label}</span>
                    <span className="block text-sm font-medium text-muted-foreground mt-0.5">{hint}</span>
                  </span>
                </Label>
              ))}
            </RadioGroup>
            
            <Button
              className="mt-6 w-full rounded-xl font-bold shadow-sm"
              variant="secondary"
              size="lg"
              onClick={() =>
                toast.success("Test notification sent", {
                  description: "Wild Boar detected · North Fence · 8:12 PM · confidence 97%",
                  icon: <BellRing className="size-4 text-primary" />,
                })
              }
            >
              Push Test Notification
            </Button>
          </PanelSection>
        </div>
      </div>
    </AppShell>
  );
}
