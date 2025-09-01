import { create } from 'zustand';


// POI 검색 결과 타입 정의
// 검색된 장소의 기본정보 저장 
export interface POIResult {
  poiId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  frontLat?: string;
  frontLon?: string;
}

// 검색 상태 관리에 사용할 상태 정의
// Zustand 스토어에서 관리할 데이터와 이를 조작하는 함수들을 포함한다.
interface SearchState {
  keyword: string;
  searchResults: POIResult[];
  isSearching: boolean;
  selectedPOI: POIResult | null;
  isResultsVisible: boolean;

  // 상태를 업데이트하기 위한  함수들
  setKeyword: (keyword: string) => void;
  setSearchResults: (results: POIResult[]) => void;
  setIsSearching: (isSearching: boolean) => void;
  setSelectedPOI: (poi: POIResult | null) => void;
  setIsResultsVisible: (visible: boolean) => void;
  clearSearch: () => void;
}

// zustand 스토어 생성
// create 함수로 상태와 상태 변경 함수를 정의
export const useSearchStore = create<SearchState>((set) => ({
  keyword: '',
  searchResults: [],
  isSearching: false,
  selectedPOI: null,
  isResultsVisible: false,

  // 상태 업데이트하기 위한 함수들
  setKeyword: (keyword) => set({ keyword }),
  setSearchResults: (searchResults) => set({ searchResults }),
  setIsSearching: (isSearching) => set({ isSearching }),
  setSelectedPOI: (selectedPOI) => set({ selectedPOI }),
  setIsResultsVisible: (isResultsVisible) => set({ isResultsVisible }),

  // 모든 검색 관련 상태를 초기화하는 함수
  clearSearch: () => set({ 
    keyword: '', 
    searchResults: [], 
    isSearching: false, 
    selectedPOI: null,
    isResultsVisible: false 
  }),
}));