interface TmapAPI {
  Map: new (id: string, options: Record<string, unknown>) => TmapInstance;
  LatLng: new (lat: number, lng: number) => TmapLatLng;
}

declare global {
  interface Window {
    Tmapv3: TmapAPI;
  }
}

export {};