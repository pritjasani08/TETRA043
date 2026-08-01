import { createFileRoute } from "@tanstack/react-router";
import { BellRing, FileVideo, ImageUp, Loader2, Radar, Volume2, Zap } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { AuthGuard, PanelSection, RiskPill } from "@/components/shield-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ANIMALS, VOICE_LINES, animalByName } from "@/lib/agrishield-data";
import { speakAlert, useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/detection")({
  head: () => ({
    meta: [
      { title: "Animal Detection Studio — AgriShield AI" },
      {
        name: "description",
        content:
          "Upload an image, video or CCTV clip and let AgriShield AI identify the animal, confidence and best deterrent.",
      },
      { property: "og:title", content: "Animal Detection Studio — AgriShield AI" },
      {
        property: "og:description",
        content:
          "Simulated AI vision pipeline with bounding boxes, confidence scores and deterrent recommendations.",
      },
    ],
  }),
  component: () => (
    <AuthGuard>
      <DetectionPage />
    </AuthGuard>
  ),
});

type Result = {
  animal: string;
  confidence: number;
  side: string;
  time: string;
  box: { x: number; y: number; w: number; h: number };
  media: string | null;
  kind: "image" | "video";
};

const SIDES = ["North Fence", "East Gate", "South Canal", "West Boundary"];

function DetectionPage() {
  const { systemOn, settings } = useAppState();
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [frame, setFrame] = useState(0);
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const [voiceLang, setVoiceLang] = useState(settings.voiceLanguage);

  const runDetection = (kind: "image" | "video", file?: File) => {
    const url = file ? URL.createObjectURL(file) : null;
    setRunning(true);
    setResult(null);
    setProgress(0);
    const timer = window.setInterval(() => {
      setProgress((p) => {
        const next = p + (kind === "video" ? 9 : 17);
        setFrame(Math.round(next * 1.4));
        if (next >= 100) {
          window.clearInterval(timer);
          const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]!;
          const side = SIDES[Math.floor(Math.random() * SIDES.length)]!;
          const confidence = Math.round(86 + Math.random() * 13);
          const now = new Date();
          setResult({
            animal: animal.name,
            confidence,
            side,
            time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
            box: {
              x: 14 + Math.random() * 28,
              y: 18 + Math.random() * 24,
              w: 30 + Math.random() * 16,
              h: 32 + Math.random() * 16,
            },
            media: url,
            kind,
          });
          setRunning(false);
          if (systemOn) {
            toast.error(`${animal.name} detected`, {
              description: `${side} · confidence ${confidence}% · alert dispatched`,
              icon: <BellRing className="size-4" />,
            });
            if (settings.voiceAlerts) {
              const line = (VOICE_LINES[voiceLang] ?? VOICE_LINES["English"]!)(animal.name, side);
              speakAlert(line, voiceLang, settings.volume);
            }
          } else {
            toast.warning("Detection saved, alert suppressed", {
              description: "Security system is OFF — turn it on to dispatch alerts.",
            });
          }
          return 100;
        }
        return next;
      });
    }, 220);
  };

  const animal = result ? animalByName(result.animal) : null;
  const voiceLine = result
    ? (VOICE_LINES[voiceLang] ?? VOICE_LINES["English"]!)(result.animal, result.side)
    : "";

  return (
    <AppShell
      title="Animal Detection"
      subtitle="Image, video and CCTV frame-by-frame inference (simulated model: AgriVision-v3)"
    >
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <PanelSection title="Input source" description="Choose how you want to feed the model">
          <Tabs defaultValue="image">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="image">Upload image</TabsTrigger>
              <TabsTrigger value="video">Upload video</TabsTrigger>
              <TabsTrigger value="live">CCTV simulation</TabsTrigger>
            </TabsList>

            <TabsContent value="image" className="mt-4">
              <input
                ref={imageInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) runDetection("image", f);
                }}
              />
              <UploadDrop
                icon={<ImageUp className="size-6" />}
                label="Drop a fence camera photo"
                hint="JPG or PNG · single-frame inference"
                onClick={() => imageInput.current?.click()}
              />
            </TabsContent>

            <TabsContent value="video" className="mt-4">
              <input
                ref={videoInput}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) runDetection("video", f);
                }}
              />
              <UploadDrop
                icon={<FileVideo className="size-6" />}
                label="Drop a recorded clip"
                hint="MP4 · frame-by-frame scan"
                onClick={() => videoInput.current?.click()}
              />
            </TabsContent>

            <TabsContent value="live" className="mt-4">
              <div className="relative overflow-hidden rounded-xl border border-border bg-background/70 p-6">
                <div className="grid-lines absolute inset-0 opacity-40" />
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/25 to-transparent scan-line" />
                <div className="relative flex flex-col items-center gap-3 text-center">
                  <Radar className="size-7 text-primary" />
                  <p className="text-sm font-medium">CAM-01 · North Fence · 24 fps</p>
                  <p className="max-w-sm text-xs text-muted-foreground">
                    Replays stored CCTV footage through the detector and streams bounding boxes as
                    frames are processed.
                  </p>
                  <Button onClick={() => runDetection("video")} disabled={running}>
                    {running ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Zap className="size-4" />
                    )}
                    {running ? "Scanning frames…" : "Start live simulation"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {running && (
            <div className="mt-4 rounded-xl border border-border bg-surface/60 p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Running inference…</span>
                <span>frame {frame}</span>
              </div>
              <Progress value={progress} className="mt-2 h-1.5" />
            </div>
          )}

          <div className="mt-4 aspect-video overflow-hidden rounded-xl border border-border bg-background/80">
            {result ? (
              <div className="relative size-full">
                {result.media ? (
                  result.kind === "video" ? (
                    <video
                      src={result.media}
                      className="size-full object-cover"
                      muted
                      autoPlay
                      loop
                    />
                  ) : (
                    <img
                      src={result.media}
                      alt={`${result.animal} detection frame`}
                      className="size-full object-cover"
                    />
                  )
                ) : (
                  <div className="grid-lines size-full opacity-60" />
                )}
                <div
                  className="absolute rounded-md border-2 border-destructive shadow-[0_0_24px_-4px_var(--destructive)]"
                  style={{
                    left: `${result.box.x}%`,
                    top: `${result.box.y}%`,
                    width: `${result.box.w}%`,
                    height: `${result.box.h}%`,
                  }}
                >
                  <span className="absolute -top-6 left-0 whitespace-nowrap rounded bg-destructive px-1.5 py-0.5 text-[11px] font-semibold text-destructive-foreground">
                    {result.animal} {result.confidence}%
                  </span>
                </div>
                <span className="absolute bottom-2 right-2 rounded bg-background/80 px-2 py-1 text-[11px] text-muted-foreground">
                  {result.time} · {result.side}
                </span>
              </div>
            ) : (
              <div className="grid size-full place-items-center text-xs text-muted-foreground">
                Detection preview appears here
              </div>
            )}
          </div>
        </PanelSection>

        <div className="flex flex-col gap-4">
          <PanelSection title="Detection result" description="Model output and dispatched actions">
            {result && animal ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-display text-lg font-bold">
                    <span className="text-2xl">{animal.emoji}</span>
                    {result.animal}
                  </span>
                  <RiskPill level={animal.severity} />
                </div>
                <dl className="space-y-2 text-sm">
                  {[
                    ["Confidence", `${result.confidence}%`],
                    ["Entry side", result.side],
                    ["Timestamp", result.time],
                    [
                      "Alert triggered",
                      systemOn ? "Yes · mobile + dashboard + voice" : "No · system OFF",
                    ],
                    ["Suggested deterrent", animal.deterrents.join(" → ")],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 border-b border-border pb-2">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="text-right font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="rounded-lg border border-border bg-surface/60 p-3 text-xs text-muted-foreground">
                  {animal.note}
                </p>
                <div className="flex flex-wrap gap-2">
                  {animal.deterrents.map((d) => (
                    <Button
                      key={d}
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        toast.success(`${d} activated`, { description: `${result.side} zone` })
                      }
                    >
                      {d}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No detection yet. Upload a frame or start the CCTV simulation.
              </p>
            )}
          </PanelSection>

          <PanelSection title="Voice alert" description="Plays on the connected mobile device">
            <div className="flex items-center gap-2">
              <Select value={voiceLang} onValueChange={setVoiceLang}>
                <SelectTrigger className="w-[150px]">
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
              <Button
                variant="outline"
                disabled={!result}
                onClick={() => speakAlert(voiceLine, voiceLang, settings.volume)}
              >
                <Volume2 className="size-4" />
                Play alert
              </Button>
            </div>
            <p className="mt-3 rounded-lg border border-border bg-surface/60 p-3 text-sm">
              {result ? voiceLine : "Attention! Wild Boar detected near North Fence."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline">Mobile notification</Badge>
              <Badge variant="outline">Dashboard popup</Badge>
              <Badge variant="outline">Detection log</Badge>
            </div>
          </PanelSection>
        </div>
      </div>
    </AppShell>
  );
}

function UploadDrop({
  icon,
  label,
  hint,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-surface/40 px-6 py-10 text-center transition-colors hover:border-primary/50 hover:bg-surface/70"
    >
      <span className="grid size-12 place-items-center rounded-full bg-primary/15 text-primary">
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xs text-muted-foreground">{hint}</span>
    </button>
  );
}
