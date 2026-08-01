import re

with open("/Users/pareshtank/TETRA043/frontend/src/lib/agrishield-data.ts", "r") as f:
    content = f.read()

# Update Detection type
old_detection_type = """export type Detection = {
  id: string;
  animal: AnimalKey;
  time: string;
  date: string;
  dayOffset: number;
  confidence: number;
  side: string;
  alert: "Triggered" | "Suppressed";
  deterrent: string;
};"""

new_detection_type = """export type Detection = {
  id: string;
  animal: AnimalKey;
  time: string;
  date: string;
  dayOffset: number;
  confidence: number;
  side: string;
  alert: "Triggered" | "Suppressed";
  deterrent: string;
  status: "Resolved" | "Action Taken" | "Needs Review" | "Monitoring";
  summary: string;
  actions: string[];
  timeline: { time: string; action: string }[];
};"""

content = content.replace(old_detection_type, new_detection_type)


# Update DETECTIONS generator
old_generator = """export const DETECTIONS: Detection[] = Array.from({ length: 64 }, (_, i) => {
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
}).sort((a, b) => a.dayOffset - b.dayOffset);"""

new_generator = """const possibleStatuses = ["Resolved", "Action Taken", "Needs Review", "Monitoring"] as const;

export const DETECTIONS: Detection[] = Array.from({ length: 64 }, (_, i) => {
  const r = Math.abs(seeded(i + 1));
  const animal = ANIMALS[Math.floor(r * ANIMALS.length)]!;
  const dayOffset = Math.floor(Math.abs(seeded(i + 20)) * 30);
  const hour = 5 + Math.floor(Math.abs(seeded(i + 40)) * 19);
  const minute = Math.floor(Math.abs(seeded(i + 60)) * 60);
  const d = new Date(2026, 6, 31 - dayOffset);
  
  const timeStr = `${((hour + 11) % 12) + 1}:${minute.toString().padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
  const timeStr2 = `${((hour + 11) % 12) + 1}:${(minute + 1).toString().padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
  const timeStr3 = `${((hour + 11) % 12) + 1}:${(minute + 2).toString().padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
  
  const side = sides[Math.floor(Math.abs(seeded(i + 100)) * sides.length)]!;
  const confidence = Math.round(78 + Math.abs(seeded(i + 80)) * 21);
  const triggered = Math.abs(seeded(i + 120)) > 0.12;
  
  const status = possibleStatuses[Math.floor(Math.abs(seeded(i + 130)) * possibleStatuses.length)]!;
  
  const actions = triggered 
    ? animal.deterrents.map(d => `${d} Activated`)
    : ["Farmer Notified"];
    
  if (triggered && Math.abs(seeded(i + 140)) > 0.5) {
    actions.push("Farmer Notified");
  }

  const summary = triggered
    ? `${animal.name} entered from the ${side}. The AI detected it with ${confidence}% confidence. The deterrent system was activated immediately. The animal left the protected zone after a few seconds. No crop damage was detected.`
    : `${animal.name} was spotted near the ${side} with ${confidence}% confidence. The system only logged the event and notified the farmer without triggering deterrents.`;

  const timeline = [
    { time: timeStr, action: "Animal detected" },
    ...(triggered ? [{ time: timeStr, action: `${animal.deterrents[0]} activated` }] : []),
    ...(triggered && animal.deterrents[1] ? [{ time: timeStr2, action: `${animal.deterrents[1]} activated` }] : []),
    { time: timeStr3, action: triggered ? "Animal exited" : "Monitoring continued" }
  ];

  return {
    id: `DET-${(1200 + i).toString()}`,
    animal: animal.name,
    time: timeStr,
    date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    dayOffset,
    confidence,
    side,
    alert: (triggered ? "Triggered" : "Suppressed") as Detection["alert"],
    deterrent: animal.deterrents[0]!,
    status,
    summary,
    actions,
    timeline,
  };
}).sort((a, b) => a.dayOffset - b.dayOffset);"""

content = content.replace(old_generator, new_generator)

with open("/Users/pareshtank/TETRA043/frontend/src/lib/agrishield-data.ts", "w") as f:
    f.write(content)

