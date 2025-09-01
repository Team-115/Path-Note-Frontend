// services/PoiServices.ts
import axios from "axios";
import type { TMapLatLng } from "../types/map";
import type { POIResult } from "../stores/SearchStores";

type SortType = 'A' | 'R';
const TMAP_API_BASE = 'https://apis.openapi.sk.com';
const APP_KEY = import.meta.env.VITE_TMAP_API_KEY as string;

const api = axios.create({
  baseURL: TMAP_API_BASE,
  headers: { appKey: APP_KEY, Accept: 'application/json' },
});

const clampRadiusKm = (r: number) => (r === 0 ? 0 : Math.min(33, Math.max(1, Math.floor(r))));

//          function: T map → 우리 앱 타입으로 변환          //
function toPOIResult(poi: any): POIResult {
  const addr =
    poi?.newAddressList?.newAddress?.[0]?.fullAddressRoad ??
    [poi?.upperAddrName, poi?.middleAddrName, poi?.lowerAddrName, poi?.detailAddrName]
      .filter(Boolean)
      .join(' ');

  const lat = Number(poi?.frontLat ?? poi?.noorLat);
  const lng = Number(poi?.frontLon ?? poi?.noorLon);

  return {
    poiId: String(poi?.poiId ?? ''),
    name: String(poi?.name ?? ''),
    address: addr ?? '',
    lat: isFinite(lat) ? lat : 0,
    lng: isFinite(lng) ? lng : 0,
    frontLat: poi?.frontLat,
    frontLon: poi?.frontLon,
  };
}

export const searchPOI = async (
  sortType: SortType,
  keyword: string,
  center?: TMapLatLng,
  count: number = 12,
  radiusKm: number = 1
): Promise<POIResult[]> => {
  const params: Record<string, any> = {
    version: 1,
    page: 1,
    count: Math.min(150, Math.max(1, count)),
    searchKeyword: keyword,
    reqCoordType: 'WGS84GEO',
    resCoordType: 'WGS84GEO',
    searchtypCd: sortType, // 'A' | 'R'
  };

  if (sortType === 'R') {
    if (!center) throw new Error('거리순(R) 검색에는 center가 필요해');
    params.centerLon = center.lng;
    params.centerLat = center.lat;
    params.radius   = clampRadiusKm(radiusKm);  // 0 또는 1~33
  }

  const res = await api.get('/tmap/pois', { params, validateStatus: () => true });
  console.log('[POI] HTTP', res.status, res.statusText);
  console.log(res);

  if (res.status === 204) return [];

  if (res.status >= 400) {
    console.error('[POI] HTTP', res.status, res.statusText);
    console.error('[POI] body =', res.data);
    throw new Error(`요청 실패: HTTP ${res.status}`);
  }

  const poisNode = res.data?.searchPoiInfo?.pois;
  const listRaw = poisNode?.poi ?? [];
  const list = Array.isArray(listRaw) ? listRaw : (listRaw ? [listRaw] : []);

  return list.map(toPOIResult);
};
