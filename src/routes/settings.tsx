import { createFileRoute } from "@tanstack/react-router";
import { BellRing, Languages, ShieldCheck, Volume2 } from "lucide-react";
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

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Alert & System Settings — AgriShield AI" },
      {
        name: "description",
        content:
          "Configure app language, voice alert language, notification preference, alert volume and the security system toggle.",
      },
      { property: "og:title", content: "Alert & System Settings — AgriShield AI" },
      {
        property: "og:description",
        content: "Tune how AgriShield AI warns you: language, volume and notification rules.",
      },
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
    <AppShell title="Settings" subtitle="Language, alerts and system control">
      <div className="grid gap-4 lg:grid-cols-2">
        <PanelSection title="Security system" description="Master switch for detection and alerts">
          <div className="flex items-center justify-between rounded-xl border border-border bg-surface/60 p-4">
            <div>
              <p className="flex items-center gap-2 font-display text-lg font-bold">
                <ShieldCheck
                  className={systemOn ? "size-5 text-primary" : "size-5 text-destructive"}
                />
                {systemOn ? "ON" : "OFF"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {systemOn
                  ? "Detection running · notifications and alerts active"
                  : "Detection paused · no notifications or alerts"}
              </p>
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
            />
          </div>
          {!systemOn && offSince && (
            <p className="mt-3 rounded-lg border border-warning/40 bg-warning/10 p-3 text-xs text-warning">
              Idle reminder armed: if monitoring stays off for more than four hours you will get
              “Security system has been disabled for over 4 hours. Please enable monitoring.”
            </p>
          )}
        </PanelSection>

        <PanelSection title="Language" description="Interface and voice alert language">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs">
                <Languages className="size-3.5" /> App language
              </Label>
              <Select
                value={settings.language}
                onValueChange={(v) => updateSettings({ language: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["English", "Hindi", "Gujarati"].map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs">
                <Volume2 className="size-3.5" /> Voice language
              </Label>
              <Select
                value={settings.voiceLanguage}
                onValueChange={(v) => updateSettings({ voiceLanguage: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(VOICE_LINES).map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="mt-4 rounded-lg border border-border bg-surface/60 p-3 text-sm">
            {(VOICE_LINES[settings.voiceLanguage] ?? VOICE_LINES["English"]!)(
              "Wild Boar",
              "North Fence",
            )}
          </p>
        </PanelSection>

        <PanelSection title="Voice alerts" description="Spoken warnings on the connected phone">
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <Label htmlFor="voice-toggle" className="text-sm">
              Enable voice alerts
            </Label>
            <Switch
              id="voice-toggle"
              checked={settings.voiceAlerts}
              onCheckedChange={(v) => updateSettings({ voiceAlerts: v })}
            />
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <Label>Alert volume</Label>
              <span className="text-muted-foreground">{settings.volume}%</span>
            </div>
            <Slider
              value={[settings.volume]}
              max={100}
              step={5}
              onValueChange={([v]) => updateSettings({ volume: v ?? 0 })}
            />
            <Button
              variant="outline"
              size="sm"
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
              <Volume2 className="size-4" />
              Test voice alert
            </Button>
          </div>
        </PanelSection>

        <PanelSection title="Notification preference" description="What reaches your phone">
          <RadioGroup
            value={settings.notifications}
            onValueChange={(v) => updateSettings({ notifications: v as "all" | "high" | "off" })}
            className="space-y-2"
          >
            {(
              [
                ["all", "All detections", "Every animal, every zone"],
                ["high", "High risk only", "Wild boar, nilgai and monkey raids"],
                ["off", "Mute notifications", "Log detections silently"],
              ] as const
            ).map(([value, label, hint]) => (
              <Label
                key={value}
                className="flex items-start gap-3 rounded-lg border border-border p-3 has-[[data-state=checked]]:border-primary/50 has-[[data-state=checked]]:bg-primary/10"
              >
                <RadioGroupItem value={value} className="mt-0.5" />
                <span>
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="block text-xs text-muted-foreground">{hint}</span>
                </span>
              </Label>
            ))}
          </RadioGroup>
          <Button
            className="mt-4 w-full"
            variant="secondary"
            onClick={() =>
              toast.success("Test notification sent", {
                description: "Wild Boar detected · North Fence · 8:12 PM · confidence 97%",
                icon: <BellRing className="size-4" />,
              })
            }
          >
            Send test notification
          </Button>
        </PanelSection>
      </div>
    </AppShell>
  );
}
