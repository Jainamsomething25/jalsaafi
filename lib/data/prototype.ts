export interface HardwareSpec {
  label: string;
  detail: string;
}

export const hardwareSpecs: HardwareSpec[] = [
  { label: "Platform", detail: "Floating platform hull" },
  { label: "Collection", detail: "Magnetic oleophilic sheets — ferric oxide, nanoparticles, sodium hydroxide" },
  { label: "Controller", detail: "ESP32 with Wi-Fi web dashboard" },
  { label: "Drive", detail: "L298 motor driver, differential steering" },
  { label: "Sensors", detail: "pH, TDS, turbidity, DS18B20 temperature, ultrasonic" },
  { label: "Power", detail: "Li-ion battery with solar top-up" },
];

export type MediaKind = "photo" | "video";

export interface MediaSlot {
  id: string;
  kind: MediaKind;
  caption: string;
  /** Populate once the real file is dropped into public/photos or public/videos. */
  src?: string;
}

export const mediaSlots: MediaSlot[] = [
  { id: "hull", kind: "photo", caption: "Floating platform, assembled", src: "/photos/hull.png" },
  { id: "oleophilic-sheet", kind: "photo", caption: "Magnetic oleophilic sheet close-up", src: "/photos/oleophilic-sheet.jpeg" },
  { id: "electronics", kind: "photo", caption: "ESP32 + sensor wiring", src: "/photos/electronics.jpeg" },
  { id: "cleanup-demo", kind: "video", caption: "Cleanup run, oleophilic sheet test", src: "/videos/cleanup-demo.mov" },
];
