import axios from "axios";
const TMAP_API_BASE = 'https://apis.openapi.sk.com/tmap';

// POI 검색 API
export const searchPOI = async (
  sortType: string,
  keyword: string,
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
        },
    });

    return response.data.searchPoiInfo.pois.poi; // 보통 이 구조입니다.
  } catch (error) {
    console.error('POI 검색 실패:', error);
    return [];
  }
};
