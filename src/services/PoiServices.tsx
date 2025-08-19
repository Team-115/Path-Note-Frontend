import axios from "axios";
import type { TMapLatLng } from "../types/map";
const TMAP_API_BASE = 'https://apis.openapi.sk.com/tmap';

// POI 검색 API
export const searchPOI = async (
  sortType: string,
  keyword: string,
  center: TMapLatLng,
  count: number = 12
) => {
  try {
    const response = await axios.get(`${TMAP_API_BASE}/pois`, {
      headers: {
         appKey: import.meta.env.VITE_TMAP_API_KEY || ''
      },
      params: {
        version: 1,
        format: 'json',
        searchKeyword: keyword,
        resCoordType: 'WGS84GEO',
        count: count,
        searchtypCd: sortType,
        radius: sortType == 'R' ? '5' : '0',
        centerLon: center.lng,
        centerLat: center.lat
        },
    });

    return response.data.searchPoiInfo.pois.poi; 
  } catch (error) {
    console.error('POI 검색 실패:', error);
    return [];
  }
};
