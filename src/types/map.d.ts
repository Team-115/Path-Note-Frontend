interface TmapAPI {
  InfoWindow: any;
  Event: any;
  Map: new (id: string, options: Record<string, unknown>) => TmapInstance;
  LatLng: new (lat: number, lng: number) => TmapLatLng;
}

declare global {
  interface Window {
    Tmapv3: TmapAPI;
  }
}

export interface TMapLatLng {
  lat: number;
  lng: number;
}

export {};