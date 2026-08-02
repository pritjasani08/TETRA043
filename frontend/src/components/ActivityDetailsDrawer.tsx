import {
  Activity,
  Clock,
  MapPin,
  AlertCircle,
  PhoneCall,
  Volume2,
  ShieldAlert,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import { Play, Square } from "lucide-react";
import { Detection, animalByName } from "@/lib/agrishield-data";

export function ActivityDetailsDrawer({
  event,
  open,
  onOpenChange,
}: {
  event: Detection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!event) return null;

  const animal = animalByName(event.animal);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 overflow-y-auto border-l-border bg-surface sm:rounded-l-[2rem]">
        <div className="flex flex-col min-h-full">
          {/* Header Image Area */}
          <div className="relative w-full aspect-[4/3] bg-black">
            {/* Mock placeholder image */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-950 to-stone-900 opacity-80">
              <span className="text-8xl">{animal.emoji}</span>
            </div>
            <div className="absolute top-4 left-4">
              <Badge className="bg-black/50 text-white backdrop-blur-md border-white/20 px-3 py-1 text-sm font-bold">
                {event.animal} Detection
              </Badge>
            </div>
          </div>

          <div className="p-6 flex-1 bg-white sm:rounded-t-[2rem] -mt-6 relative shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
            <SheetHeader className="text-left mb-6">
              <SheetTitle className="text-2xl font-bold text-foreground">Event Details</SheetTitle>
            </SheetHeader>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="p-3 bg-surface rounded-2xl border border-border">
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 flex items-center gap-1.5">
                  <Clock className="size-3" /> Time
                </p>
                <p className="font-bold text-foreground">{event.time}</p>
                <p className="text-xs font-medium text-muted-foreground">{event.date}</p>
              </div>
              <div className="p-3 bg-surface rounded-2xl border border-border">
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 flex items-center gap-1.5">
                  <MapPin className="size-3" /> Location
                </p>
                <p className="font-bold text-foreground">{event.side}</p>
                <p className="text-xs font-medium text-muted-foreground">
                  Confidence: {event.confidence}%
                </p>
              </div>
            </div>

            {/* Timeline */}
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4 border-b border-border pb-2">
              Action Timeline
            </h4>

            <div className="relative pl-3 space-y-6 mb-8 before:absolute before:inset-y-2 before:left-3.5 before:w-0.5 before:bg-border">
              {event.timeline.map((step, i) => (
                <div key={i} className="relative flex gap-4">
                  <div className="absolute -left-1.5 mt-1.5 size-3 rounded-full bg-primary ring-4 ring-white" />
                  <div className="pl-5">
                    <p className="font-bold text-foreground">{step.action}</p>
                    <p className="text-xs font-medium text-muted-foreground">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4 border-b border-border pb-2">
              System Config
            </h4>
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Volume2 className="size-4 text-primary" /> Voice Alert
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white">
                    Hindi
                  </Badge>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-7 rounded-full bg-white hover:bg-primary/10 hover:text-primary transition-all text-muted-foreground"
                    onClick={() => {
                      if (isPlaying) {
                        window.speechSynthesis.cancel();
                        setIsPlaying(false);
                        return;
                      }
                      setIsPlaying(true);
                      const text = `Attention! ${event.animal} detected near ${event.side}.`;
                      toast.success(`Playing Voice Alert`);
                      const utterance = new SpeechSynthesisUtterance(text);
                      utterance.lang = "en-US";
                      utterance.onend = () => setIsPlaying(false);
                      utterance.onerror = () => setIsPlaying(false);
                      window.speechSynthesis.speak(utterance);
                    }}
                  >
                    {isPlaying ? (
                      <Square className="size-3 fill-current" />
                    ) : (
                      <Play className="size-3 fill-current" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                // Generate a downloadable report file
                const reportContent = `FALSE ALARM REPORT\n\nEvent ID: ${event.id}\nAnimal: ${event.animal}\nLocation: ${event.side}\nTime: ${event.time} - ${event.date}\nConfidence: ${event.confidence}%\n\nStatus: Flagged as False Alarm by Farmer\n`;
                const blob = new Blob([reportContent], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `False_Alarm_Report_${event.id}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                toast.success("Report Downloaded", {
                  description: "A false alarm report has been generated and saved.",
                });
                onOpenChange(false);
              }}
              className="w-full rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive mb-4 font-bold h-12"
            >
              <AlertCircle className="size-4 mr-2" /> Report False Alarm
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
