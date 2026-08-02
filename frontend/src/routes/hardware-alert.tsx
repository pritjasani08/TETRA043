import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AuthGuard } from "@/components/shield-ui";
import { AlertTriangle, Power, ShieldCheck, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiClient } from "@/lib/api";

export const Route = createFileRoute("/hardware-alert")({
  head: () => ({
    meta: [
      { title: "Hardware Deterrent Device" },
    ],
  }),
  component: () => (
    <AuthGuard>
      <HardwareAlertPage />
    </AuthGuard>
  ),
});

function HardwareAlertPage() {
  const [activeAlert, setActiveAlert] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoClearTimerRef = useRef<any>(null);

  const startSiren = () => {
    if (!audioRef.current) {
      // Using a reliable, loud alarm sound
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.loop = true;
      audio.volume = 1.0;
      audioRef.current = audio;
    }
    
    // Play the audio
    audioRef.current.play().catch(e => console.warn('Audio play failed', e));

    // Auto-clear after 2 minutes (120000 ms)
    if (autoClearTimerRef.current) clearTimeout(autoClearTimerRef.current);
    autoClearTimerRef.current = setTimeout(() => {
      clearAlert();
    }, 120000);
  };

  const stopSiren = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (autoClearTimerRef.current) {
      clearTimeout(autoClearTimerRef.current);
      autoClearTimerRef.current = null;
    }
  };

  const clearAlert = async () => {
    try {
      await ApiClient.post('/alerts/clear', {});
      setActiveAlert(null);
      stopSiren();
    } catch (e) {
      console.error("Failed to clear alert", e);
    }
  };

  // Poll for alerts every 1 second
  useEffect(() => {
    const poll = async () => {
      try {
        const response: any = await ApiClient.get('/alerts/poll');
        if (response && response.animal) {
          if (!activeAlert || activeAlert.id !== response.id) {
            setActiveAlert(response);
          }
        } else {
          setActiveAlert(null);
        }
      } catch (e) {
        console.warn("Polling failed", e);
      }
    };

    const timer = setInterval(poll, 1000);
    return () => {
      clearInterval(timer);
      stopSiren(); // cleanup
    };
  }, [activeAlert]);

  // Handle siren play/stop based on alert state
  useEffect(() => {
    if (activeAlert) {
      startSiren();
    } else {
      stopSiren();
    }
  }, [activeAlert]);

  if (activeAlert) {
    return (
      <div className="fixed inset-0 bg-red-600 animate-pulse flex flex-col items-center justify-center p-6 text-center z-50">
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="size-48 bg-white/10 rounded-full flex items-center justify-center mb-8 animate-bounce">
            <AlertTriangle className="size-24 text-white drop-shadow-2xl" />
          </div>
          
          <h1 className="text-white text-6xl font-black mb-2 tracking-tighter uppercase drop-shadow-lg">
            INTRUSION
          </h1>
          <p className="text-white/90 text-2xl font-bold mb-12 uppercase tracking-widest drop-shadow-md">
            {activeAlert.animal} DETECTED
          </p>

          <Button 
            size="lg" 
            variant="secondary"
            className="rounded-full h-20 px-12 text-2xl font-bold bg-white text-red-600 hover:bg-white/90 shadow-2xl transition-transform active:scale-95"
            onClick={clearAlert}
          >
            <Power className="size-8 mr-4" />
            DISARM SYSTEM
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="size-32 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <ShieldCheck className="size-16 text-primary" />
      </div>
      
      <h1 className="text-white text-3xl font-bold mb-2 tracking-tight">
        Hardware Deterrent
      </h1>
      <p className="text-zinc-400 font-medium mb-12">
        System is armed and listening for alerts.
      </p>

      <div className="flex items-center gap-2 text-primary font-bold bg-primary/10 px-6 py-3 rounded-full border border-primary/20">
        <Volume2 className="size-5 animate-pulse" />
        Audio Ready
      </div>
    </div>
  );
}
