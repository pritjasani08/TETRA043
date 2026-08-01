import { createFileRoute } from "@tanstack/react-router";
import { BellRing, FileVideo, ImageUp, Loader2, Radar, Volume2, Zap, Play, UploadCloud, AlertTriangle, Camera, ShieldCheck } from "lucide-react";
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
import { VOICE_LINES, ANIMALS } from "@/lib/agrishield-data";
import { speakAlert, useAppState } from "@/lib/app-state";
import { useDetection } from "@/hooks/useDetection";

export const Route = createFileRoute("/detection")({
  head: () => ({
    meta: [
      { title: "Live Cameras & Detection — AgriShield AI" },
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
  const detectionMutation = useDetection();
  
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [frame, setFrame] = useState(0);
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const [voiceLang, setVoiceLang] = useState(settings.voiceLanguage);

  const runDetection = async (kind: "image" | "video", file?: File) => {
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    setResult(null);
    setProgress(0);
    const timer = window.setInterval(() => {
      setProgress((p) => {
        const next = p + (kind === "video" ? 6 : 12);
        setFrame(Math.round(next * 1.8));
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
              x: 20 + Math.random() * 20,
              y: 20 + Math.random() * 20,
              w: 25 + Math.random() * 15,
              h: 30 + Math.random() * 15,
            },
            media: url,
            kind,
          });
          setRunning(false);
          if (systemOn) {
            toast.error(`${animal.name} detected`, {
              description: `${side} · ${confidence}% confidence`,
              icon: <BellRing className="size-5" />,
            });
            if (settings.voiceAlerts) {
              const line = (VOICE_LINES[voiceLang] ?? VOICE_LINES["English"]!)(animal.name, side);
              speakAlert(line, voiceLang, settings.volume);
            }
          } else {
            toast.warning("Detection saved but alert suppressed", {
              description: "System is paused.",
            });
          }
          return 100;
        }
        return next;
      });
    }, 150);
  };

  const animal = result ? { emoji: "⚠️", name: result.animal, severity: "high" as const, deterrents: ["Siren", "Flash"], note: "Detected via AI" } : null;
  const voiceLine = result ? `Attention! ${result.animal} detected near ${result.side}` : "";

  return (
    <AppShell
      title="Live Cameras & AI Analysis"
      subtitle="Real-time perimeter monitoring powered by AgriVision-v3 Edge AI"
    >
      <div className="mx-auto max-w-[1400px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          
          {/* LEFT COLUMN: Media Input & Feed */}
          <div className="space-y-6">
            <PanelSection title="Input Source" description="Select the feed to analyze" className="p-6">
              <Tabs defaultValue="live">
                <TabsList className="grid w-full grid-cols-3 bg-surface/50 p-1 rounded-2xl h-14 border border-border">
                  <TabsTrigger value="live" className="rounded-xl font-bold h-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Live Feed</TabsTrigger>
                  <TabsTrigger value="video" className="rounded-xl font-bold h-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Video Clip</TabsTrigger>
                  <TabsTrigger value="image" className="rounded-xl font-bold h-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Still Image</TabsTrigger>
                </TabsList>

                <TabsContent value="image" className="mt-6">
                  <input ref={imageInput} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) runDetection("image", f); }} />
                  <UploadDrop icon={<ImageUp className="size-8" />} label="Upload Image" hint="Drag & drop a camera trap photo (JPG/PNG)" onClick={() => imageInput.current?.click()} />
                </TabsContent>

                <TabsContent value="video" className="mt-6">
                  <input ref={videoInput} type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) runDetection("video", f); }} />
                  <UploadDrop icon={<FileVideo className="size-8" />} label="Upload Video" hint="Drag & drop a recorded clip (MP4)" onClick={() => videoInput.current?.click()} />
                </TabsContent>

                <TabsContent value="live" className="mt-6">
                  <div className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-surface to-background p-8 flex flex-col items-center text-center shadow-inner">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="p-5 bg-white rounded-full shadow-lg border border-primary/10">
                        <Radar className="size-10 text-primary animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-foreground">Connect to Edge Camera</h3>
                        <p className="mt-1 max-w-sm text-sm text-muted-foreground font-medium mx-auto">
                          Simulate a real-time stream from your perimeter cameras to test the AI detector.
                        </p>
                      </div>
                      <Button size="lg" onClick={() => runDetection("video")} disabled={running} className="mt-2 rounded-2xl px-8 shadow-xl shadow-primary/20">
                        {running ? <Loader2 className="size-5 animate-spin mr-2" /> : <Play className="size-5 mr-2" />}
                        {running ? "Processing Stream..." : "Start Live Simulation"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </PanelSection>

            {running && (
              <div className="panel p-6 bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-l-primary animate-in fade-in">
                <div className="flex items-center justify-between text-sm font-bold text-primary mb-3">
                  <span className="flex items-center gap-2"><Loader2 className="size-4 animate-spin" /> Analyzing Input...</span>
                  <span className="tabular-nums">Frame {frame}</span>
                </div>
                <Progress value={progress} className="h-2 bg-primary/10 [&>div]:bg-primary" />
              </div>
            )}

            <div className="panel overflow-hidden p-2 bg-white">
              <div className="aspect-[16/10] sm:aspect-video w-full overflow-hidden rounded-[1.5rem] bg-black relative shadow-inner">
                {result ? (
                  <div className="relative size-full animate-in zoom-in-95 duration-500">
                    {result.media ? (
                      result.kind === "video" ? (
                        <video src={result.media} className="size-full object-cover" muted autoPlay loop />
                      ) : (
                        <img src={result.media} alt={`${result.animal} detection`} className="size-full object-cover" />
                      )
                    ) : (
                      <div className="size-full bg-surface-2 opacity-80" />
                    )}
                    
                    {/* Glassmorphic Bounding Box */}
                    <div
                      className="absolute rounded-xl border-4 border-destructive bg-destructive/10 backdrop-blur-[2px] transition-all duration-500 ease-out shadow-[0_0_30px_rgba(255,107,107,0.3)]"
                      style={{
                        left: `${result.box.x}%`, top: `${result.box.y}%`, width: `${result.box.w}%`, height: `${result.box.h}%`,
                      }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-destructive/90 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white shadow-lg border border-white/20 flex items-center gap-2">
                        <AlertTriangle className="size-3" />
                        {result.animal} • {result.confidence}%
                      </div>
                    </div>

                    {/* HUD Footer */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
                       <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white shadow-lg">
                          <p className="text-[10px] font-bold tracking-widest opacity-70 uppercase">Location</p>
                          <p className="font-medium text-sm">{result.side}</p>
                       </div>
                       <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white shadow-lg text-right">
                          <p className="text-[10px] font-bold tracking-widest opacity-70 uppercase">Timestamp</p>
                          <p className="font-medium text-sm tabular-nums">{result.time}</p>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid size-full place-items-center text-sm font-medium text-muted-foreground bg-gradient-to-b from-surface to-surface-2 border border-border/50 rounded-[1.5rem]">
                    <div className="flex flex-col items-center gap-3">
                       <Camera className="size-12 opacity-20" />
                       <p>Feed offline. Awaiting input.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Results & Actions */}
          <div className="space-y-6">
            <PanelSection title="Analysis Results" description="AI insights and automated actions" className="p-6 md:p-8">
              {result && animal ? (
                <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                  <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-border">
                    <div className="flex items-center gap-4">
                      <span className="flex size-14 items-center justify-center rounded-full bg-white shadow-sm text-3xl border border-border">
                        {animal.emoji}
                      </span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Detected</p>
                        <h4 className="font-display text-2xl font-bold text-foreground">{result.animal}</h4>
                      </div>
                    </div>
                    <RiskPill level={animal.severity} />
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      ["AI Confidence", `${result.confidence}%`],
                      ["Target Zone", result.side],
                      ["Time Logged", result.time],
                      ["System Status", systemOn ? "Armed (Actions Taken)" : "Paused (No Actions)"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center py-2.5 border-b border-border/50 last:border-0">
                        <span className="text-sm font-medium text-muted-foreground">{k}</span>
                        <span className="text-sm font-bold text-foreground">{v}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-bold text-foreground mb-3">Recommended Deterrents</p>
                    <div className="flex flex-wrap gap-2">
                      {animal.deterrents.map((d) => (
                        <Button
                          key={d}
                          size="sm"
                          variant="secondary"
                          className="rounded-full font-bold bg-primary/10 text-primary hover:bg-primary/20 border-0"
                          onClick={() => toast.success(`${d} activated`, { description: `${result.side} zone` })}
                        >
                          Trigger {d}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
                  <div className="p-4 bg-surface rounded-full"><ShieldCheck className="size-8 text-muted-foreground/50" /></div>
                  <p className="text-sm font-medium text-muted-foreground max-w-[200px] leading-relaxed">
                    Awaiting detection data. Run a simulation to see AI insights.
                  </p>
                </div>
              )}
            </PanelSection>

            <PanelSection title="Smart Voice Alerts" description="Automated regional warnings" className="p-6 md:p-8">
              <div className="space-y-5">
                <div className="flex items-end gap-3">
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Language</label>
                    <Select value={voiceLang} onValueChange={setVoiceLang}>
                      <SelectTrigger className="w-full rounded-xl bg-surface border-border font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {Object.keys(VOICE_LINES).map((l) => (
                          <SelectItem key={l} value={l} className="rounded-lg">{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    size="icon"
                    className="size-10 rounded-xl bg-primary text-white shadow-md hover:scale-105 transition-transform"
                    disabled={!result}
                    onClick={() => speakAlert(voiceLine, voiceLang, settings.volume)}
                  >
                    <Volume2 className="size-4" />
                  </Button>
                </div>
                
                <div className="rounded-2xl border border-border bg-surface p-4 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                  <p className="text-sm font-medium leading-relaxed italic text-foreground">
                    "{result ? voiceLine : "Attention! Wild Boar detected near North Fence."}"
                  </p>
                </div>
              </div>
            </PanelSection>
          </div>
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
      className="flex w-full flex-col items-center gap-3 rounded-[2rem] border-2 border-dashed border-border bg-white px-6 py-12 text-center transition-all hover:border-primary hover:bg-primary/5 group"
    >
      <span className="grid size-16 place-items-center rounded-2xl bg-surface text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
        {icon}
      </span>
      <div>
        <span className="block text-base font-bold text-foreground">{label}</span>
        <span className="block mt-1 text-sm font-medium text-muted-foreground">{hint}</span>
      </div>
    </button>
  );
}
