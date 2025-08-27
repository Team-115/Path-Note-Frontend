import axios from "axios";

const APP_KEY = import.meta.env.VITE_TMAP_APP_KEY as string;

// 공통 axios 인스턴스: 헤더에 appKey 세팅
const tmap = axios.create({
  baseURL: "https://apis.openapi.sk.com",
  headers: {
    Accept: "application/json",
  },
});

// Reverse Label
export async function reverseLabelRequest(lat: number, lon: number) {
  const { data } = await tmap.get("/tmap/geo/reverseLabel", {
    params: {
      version: 1,
      format: "json",
      centerLat: lat,
      centerLon: lon,
      reqLevel: 15, 
      reqCoordType: "WGS84GEO", // 요청 좌표계
      resCoordType: "WGS84GEO", // 응답 좌표계
      appKey: APP_KEY,
    },
  });

  const poi = data?.poiInfo;
  if (!poi) return null;

  return {
    id: poi.id,
    name: poi.name ?? "",
    lat: Number(poi.poiLat),
    lon: Number(poi.poiLon),
  };
}

// POI 상세조회
export async function getPoiDetailRequest(poiId: string) {
  const { data } = await tmap.get(`/tmap/pois/${poiId}`, {
    params: {
      version: 1,
      resCoordType: "WGS84GEO",
      appKey: APP_KEY,
    },
  });

  const d = data?.poiDetailInfo;
  if (!d) return null;

  return {
    id: d.id ?? poiId,
    name: d.name ?? "",
    bizCatName: d.bizCatName ?? "",
    tel: d.tel ?? "",
    address: d.address ?? "",
    bldAddr: d.bldAddr ?? "",
    lat: d.lat ? Number(d.lat) : undefined,
    lon: d.lon ? Number(d.lon) : undefined,
    frontLat: d.frontLat ? Number(d.frontLat) : undefined,
    frontLon: d.frontLon ? Number(d.frontLon) : undefined,
    routeInfo: d.routeInfo ?? "",
    additionalInfo: d.additionalInfo ?? "",
  };
}
