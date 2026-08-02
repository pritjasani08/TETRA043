import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Profile = {
  fullName: string;
  mobile: string;
  email: string;
  village: string;
  district: string;
  state: string;
  farmName: string;
  farmSize: string;
  cropType: string;
  farmBoundary?: {
    name: string;
    coordinates: [number, number][]; // Array of [Lat, Lng]
    area: number; // in acres
  };
};

export type Settings = {
  language: string;
  voiceLanguage: string;
  notifications: "all" | "high" | "off";
  volume: number;
  voiceAlerts: boolean;
};

const DEFAULT_PROFILE: Profile = {
  fullName: "Rameshbhai Patel",
  mobile: "+91 98250 41122",
  email: "ramesh.patel@agrishield.in",
  village: "Shivgadh",
  district: "Ahmedabad",
  state: "Gujarat",
  farmName: "Shivgadh Green Fields",
  farmSize: "12 acres",
  cropType: "Cotton & Groundnut",
};

const DEFAULT_SETTINGS: Settings = {
  language: "English",
  voiceLanguage: "Gujarati",
  notifications: "all",
  volume: 70,
  voiceAlerts: true,
};

type AppState = {
  ready: boolean;
  authed: boolean;
  profile: Profile;
  settings: Settings;
  systemOn: boolean;
  offSince: number | null;
  login: (profile?: Partial<Profile>) => void;
  logout: () => void;
  updateProfile: (p: Partial<Profile>) => void;
  updateSettings: (s: Partial<Settings>) => void;
  setSystemOn: (on: boolean) => void;
  farmBoundary: { lat: number; lng: number }[] | null;
  setFarmBoundary: (points: { lat: number; lng: number }[] | null) => void;
};

const Ctx = createContext<AppState | null>(null);
const KEY = "agrishield-state-v1";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [systemOn, setSystem] = useState(true);
  const [offSince, setOffSince] = useState<number | null>(null);
  const [farmBoundary, setFarmBoundaryState] = useState<{ lat: number; lng: number }[] | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.authed) setAuthed(true);
      if (parsed.profile) setProfile({ ...DEFAULT_PROFILE, ...parsed.profile });
      if (parsed.settings) setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
      if (typeof parsed.systemOn === "boolean") setSystem(parsed.systemOn);
      if (parsed.offSince) setOffSince(parsed.offSince);
      if (parsed.farmBoundary !== undefined) setFarmBoundaryState(parsed.farmBoundary);
    } catch {
      /* ignore */
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(
        KEY,
        JSON.stringify({ authed, profile, settings, systemOn, offSince, farmBoundary }),
      );
    } catch {
      /* ignore */
    }
  }, [ready, authed, profile, settings, systemOn, offSince, farmBoundary]);

  const setSystemOn = useCallback((on: boolean) => {
    setSystem(on);
    setOffSince(on ? null : Date.now());
  }, []);

  const value = useMemo<AppState>(
    () => ({
      ready,
      authed,
      profile,
      settings,
      systemOn,
      offSince,
      login: (p) => {
        setAuthed(true);
        if (p) setProfile((prev) => ({ ...prev, ...p }));
      },
      logout: () => setAuthed(false),
      updateProfile: (p) => setProfile((prev) => ({ ...prev, ...p })),
      updateSettings: (s) => setSettings((prev) => ({ ...prev, ...s })),
      setSystemOn,
      farmBoundary,
      setFarmBoundary: setFarmBoundaryState,
    }),
    [ready, authed, profile, settings, systemOn, offSince, farmBoundary, setSystemOn],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}

export function speakAlert(text: string, lang: string, volume: number) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang === "Hindi" ? "hi-IN" : lang === "Gujarati" ? "gu-IN" : "en-IN";
  utter.volume = Math.min(1, Math.max(0, volume / 100));
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}
