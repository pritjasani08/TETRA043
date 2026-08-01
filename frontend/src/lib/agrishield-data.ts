export type AnimalKey = "Wild Boar" | "Nilgai" | "Cow" | "Buffalo" | "Goat" | "Monkey" | "Dog";

export type Severity = "high" | "medium" | "low";

export type Animal = {
  name: AnimalKey;
  emoji: string;
  today: number;
  week: number;
  severity: Severity;
  deterrents: string[];
  note: string;
};

export const ANIMALS: Animal[] = [
  {
    name: "Wild Boar",
    emoji: "🐗",
    today: 6,
    week: 27,
    severity: "high",
    deterrents: ["Activate Siren", "Flash Lights", "Alert Neighbours"],
    note: "Crop-root damage, moves in groups after dusk.",
  },
  {
    name: "Nilgai",
    emoji: "🦌",
    today: 4,
    week: 19,
    severity: "high",
    deterrents: ["Activate Siren", "Flash Lights"],
    note: "Jumps low fences, grazes young shoots.",
  },
  {
    name: "Monkey",
    emoji: "🐒",
    today: 5,
    week: 22,
    severity: "medium",
    deterrents: ["Flash Lights", "Ultrasonic Pulse"],
    note: "Daytime raids on fruiting crops.",
  },
  {
    name: "Cow",
    emoji: "🐄",
    today: 3,
    week: 14,
    severity: "low",
    deterrents: ["Voice Warning"],
    note: "Stray cattle from village road.",
  },
  {
    name: "Buffalo",
    emoji: "🐃",
    today: 2,
    week: 9,
    severity: "medium",
    deterrents: ["Voice Warning", "Flash Lights"],
    note: "Heavy trampling near irrigation channel.",
  },
  {
    name: "Goat",
    emoji: "🐐",
    today: 2,
    week: 11,
    severity: "low",
    deterrents: ["Voice Warning"],
    note: "Small herds nibbling boundary rows.",
  },
  {
    name: "Dog",
    emoji: "🐕",
    today: 1,
    week: 6,
    severity: "low",
    deterrents: ["Voice Warning", "Ultrasonic Pulse"],
    note: "Chases livestock, low crop risk.",
  },
];

export const animalByName = (name: string) => ANIMALS.find((a) => a.name === name) ?? ANIMALS[0]!;

export type Detection = {
  id: string;
  animal: AnimalKey;
  time: string;
  date: string;
  dayOffset: number;
  confidence: number;
  side: string;
  alert: "Triggered" | "Suppressed";
  deterrent: string;
};

const sides = ["North Fence", "East Gate", "South Canal", "West Boundary", "Well Corner"];

function seeded(i: number) {
  return (Math.sin(i * 12.9898) * 43758.5453) % 1;
}

export const DETECTIONS: Detection[] = Array.from({ length: 64 }, (_, i) => {
  const r = Math.abs(seeded(i + 1));
  const animal = ANIMALS[Math.floor(r * ANIMALS.length)]!;
  const dayOffset = Math.floor(Math.abs(seeded(i + 20)) * 30);
  const hour = 5 + Math.floor(Math.abs(seeded(i + 40)) * 19);
  const minute = Math.floor(Math.abs(seeded(i + 60)) * 60);
  const d = new Date(2026, 6, 31 - dayOffset);
  return {
    id: `DET-${(1200 + i).toString()}`,
    animal: animal.name,
    time: `${((hour + 11) % 12) + 1}:${minute.toString().padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`,
    date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    dayOffset,
    confidence: Math.round(78 + Math.abs(seeded(i + 80)) * 21),
    side: sides[Math.floor(Math.abs(seeded(i + 100)) * sides.length)]!,
    alert: (Math.abs(seeded(i + 120)) > 0.12 ? "Triggered" : "Suppressed") as Detection["alert"],
    deterrent: animal.deterrents[0]!,
  };
}).sort((a, b) => a.dayOffset - b.dayOffset);

export const RECENT_ALERTS = DETECTIONS.slice(0, 5);

export const DAILY_TREND = [
  { day: "Mon", intrusions: 9, confidence: 91 },
  { day: "Tue", intrusions: 14, confidence: 93 },
  { day: "Wed", intrusions: 7, confidence: 88 },
  { day: "Thu", intrusions: 18, confidence: 95 },
  { day: "Fri", intrusions: 12, confidence: 90 },
  { day: "Sat", intrusions: 21, confidence: 96 },
  { day: "Sun", intrusions: 15, confidence: 92 },
];

export const WEEKLY_ACTIVITY = [
  { week: "W1", intrusions: 64, deterred: 58 },
  { week: "W2", intrusions: 79, deterred: 71 },
  { week: "W3", intrusions: 52, deterred: 49 },
  { week: "W4", intrusions: 96, deterred: 88 },
];

export const MONTHLY_ACTIVITY = [
  { month: "Feb", intrusions: 180 },
  { month: "Mar", intrusions: 224 },
  { month: "Apr", intrusions: 268 },
  { month: "May", intrusions: 312 },
  { month: "Jun", intrusions: 286 },
  { month: "Jul", intrusions: 341 },
];

export const PEAK_HOURS = [
  { hour: "04", count: 6 },
  { hour: "06", count: 11 },
  { hour: "09", count: 8 },
  { hour: "12", count: 5 },
  { hour: "15", count: 9 },
  { hour: "18", count: 17 },
  { hour: "20", count: 26 },
  { hour: "22", count: 21 },
  { hour: "00", count: 13 },
  { hour: "02", count: 8 },
];

export const REGIONS = [
  { name: "Ahmedabad", risk: "high" as Severity, detections: 128, x: 46, y: 44 },
  { name: "Gandhinagar", risk: "medium" as Severity, detections: 71, x: 52, y: 36 },
  { name: "Rajkot", risk: "medium" as Severity, detections: 83, x: 26, y: 54 },
  { name: "Surat", risk: "low" as Severity, detections: 34, x: 55, y: 74 },
  { name: "Bhavnagar", risk: "medium" as Severity, detections: 62, x: 37, y: 68 },
  { name: "Kutch", risk: "high" as Severity, detections: 112, x: 15, y: 30 },
  { name: "Vadodara", risk: "low" as Severity, detections: 41, x: 60, y: 56 },
  { name: "Junagadh", risk: "low" as Severity, detections: 29, x: 21, y: 72 },
];

export type CommunityPost = {
  id: string;
  farmer: string;
  farm: string;
  village: string;
  animal: AnimalKey;
  time: string;
  direction: string;
  severity: Severity;
  distance: string;
  eta: string;
  notified: string;
};

export const COMMUNITY_FEED: CommunityPost[] = [
  {
    id: "C1",
    farmer: "Rameshbhai Patel",
    farm: "Farm A · Shivgadh",
    village: "Shivgadh",
    animal: "Wild Boar",
    time: "8:10 PM",
    direction: "Moving south-east",
    severity: "high",
    distance: "700 m away",
    eta: "12 minutes",
    notified: "Farm B, Farm C notified",
  },
  {
    id: "C2",
    farmer: "Jayaben Chaudhari",
    farm: "Farm D · Vadgam",
    village: "Vadgam",
    animal: "Nilgai",
    time: "7:42 PM",
    direction: "Moving north",
    severity: "high",
    distance: "1.4 km away",
    eta: "24 minutes",
    notified: "Farm E notified",
  },
  {
    id: "C3",
    farmer: "Suresh Thakor",
    farm: "Farm F · Ranpur",
    village: "Ranpur",
    animal: "Monkey",
    time: "5:20 PM",
    direction: "Along canal line",
    severity: "medium",
    distance: "300 m away",
    eta: "6 minutes",
    notified: "Farm A notified",
  },
  {
    id: "C4",
    farmer: "Kiran Solanki",
    farm: "Farm G · Shivgadh",
    village: "Shivgadh",
    animal: "Cow",
    time: "4:05 PM",
    direction: "Village road side",
    severity: "low",
    distance: "2.1 km away",
    eta: "35 minutes",
    notified: "No action needed",
  },
];

export const VOICE_LINES: Record<string, (animal: string, place: string) => string> = {
  English: (a, p) => `Attention! ${a} detected near ${p}. Please activate deterrents.`,
  Hindi: (a, p) => `सावधान! ${p} के पास ${a} देखा गया है। कृपया सुरक्षा चालू करें।`,
  Gujarati: (a, p) => `સાવધાન! ${p} નજીક ${a} જોવા મળ્યું છે. કૃપા કરીને સુરક્ષા ચાલુ કરો.`,
};

export const severityLabel: Record<Severity, string> = {
  high: "High Risk",
  medium: "Medium Risk",
  low: "Low Risk",
};
