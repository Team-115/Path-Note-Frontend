import { create } from 'zustand';

export interface POIResult {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  frontLat?: string;
  frontLon?: string;
}

interface SearchState {
  keyword: string;
  searchResults: POIResult[];
  isSearching: boolean;
  selectedPOI: POIResult | null;
  isResultsVisible: boolean;
  setKeyword: (keyword: string) => void;
  setSearchResults: (results: POIResult[]) => void;
  setIsSearching: (isSearching: boolean) => void;
  setSelectedPOI: (poi: POIResult | null) => void;
  setIsResultsVisible: (visible: boolean) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  keyword: '',
  searchResults: [],
  isSearching: false,
  selectedPOI: null,
  isResultsVisible: false,
  setKeyword: (keyword) => set({ keyword }),
  setSearchResults: (searchResults) => set({ searchResults }),
  setIsSearching: (isSearching) => set({ isSearching }),
  setSelectedPOI: (selectedPOI) => set({ selectedPOI }),
  setIsResultsVisible: (isResultsVisible) => set({ isResultsVisible }),
  clearSearch: () => set({ 
    keyword: '', 
    searchResults: [], 
    isSearching: false, 
    selectedPOI: null,
    isResultsVisible: false 
  }),
}));