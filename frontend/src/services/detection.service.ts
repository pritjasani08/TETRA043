import { ApiClient } from "../lib/api";

export class DetectionService {
  static get useMocks() {
    return import.meta.env.VITE_USE_MOCKS === "true";
  }

  static async analyze(file: File) {
    if (this.useMocks) {
      return new Promise<any>((resolve) => {
        setTimeout(() => {
          resolve({
            detection: {
              animal: "Wild Boar",
              confidence: 94,
              side: "North Fence",
              time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
              distance: 12,
              direction: "Inbound",
              speed: 3.5,
              threatLevel: "High",
              cameraId: "CAM-01",
              weather: "Clear / 24°C",
              speciesType: "Mammal",
            },
            boundingBox: { x: 30, y: 30, w: 20, h: 25 },
          });
        }, 1200);
      });
    }

    const formData = new FormData();
    formData.append('image', file);
    return ApiClient.post<any>('/detection/process-image', formData);
  }

  static async getHistory() {
    return ApiClient.get<any[]>('/detection/history');
  }
}
