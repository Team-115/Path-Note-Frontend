import { create } from 'zustand';
import type { TMapLatLng } from '../types/map';

interface MapState {
  center: TMapLatLng;
  zoom: number;

  moveToLocation: (lat: number, lng: number) => void;
  changeZoom: (newZoom: number) => void;
  setCurrentCenter: (center: TMapLatLng) => void;
  setZoom: (zoom: number) => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  center: { lat: 37.5665, lng: 126.9780 }, // 서울 시청 기본값
  zoom: 15,

  moveToLocation: (lat: number, lng: number) => {
    set({ center: { lat, lng } });
  },

  changeZoom: (newZoom: number) => {
    set({ zoom: Math.max(1, Math.min(20, newZoom)) }); // 1-20 사이로 제한
  },

  setCurrentCenter: (center: TMapLatLng) => {
    set({ center });
  },

  setZoom: (zoom: number) => {
    set({ zoom });
  },
}));