import { useEffect, useRef, useState, useCallback } from 'react';
import MapPlaceInfo from './MapPlaceInfo';
import CoursePlaceItem from './CoursePlaceItem';
import CoursePlaceCreate from './CoursePlaceCreate';
import type { CoursePlaceType } from '../types/CoursePlaceType';
import { useSearchStore } from '../stores/SearchStores';
import { createCourse, getCourseDetail, updateCourse } from '../apis/CreateCoursePlaceApi';
import { reverseLabelRequest, getPoiDetailRequest } from '../services/TmapPoiServices';
import type { InfoPoiType } from '../types/InfoPoiType';
import type { UpdateCourseStateType, UpdateStateType, CourseSubmitType } from '../types/UpdateStateType';
import { useMapStore } from '../stores/MapStores';
import { useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';

interface MapProps {
  width: string;
  height: string;
}

const APP_KEY = import.meta.env.VITE_TMAP_API_KEY as string;
console.log('[DEBUG] APP_KEY =', APP_KEY);

//          component: 메인 맵 부모 컴포넌트          //
/** 현재 역할
 * 1.지도 초기화/이벤트 바인딩
 * 2.검색 선택 POI에 대한 마커 갱신
 * 3.코스 장소 상태 관리 및 최종 코스 생성 요청
 * 4.클릭 리버스라벨→POI 상세조회
 */
const Map = ({
  width = '100%',
  height = '400px',
}: MapProps) => {

  //          useRef: 상태 변화시 리랜더링 되지 않는 부분          //
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const coursemarkerRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);

  const { Tmapv3 } = window as any;

  const location = useLocation() as { state?: UpdateStateType };
  const navigate = useNavigate();

  
  //          state: 기본 장소 컴포넌트 정보 상태 관리          //
  const [infoPoi, setInfoPoi] = useState<InfoPoiType | null>(null);
  //          state: 장소 정보 컴포넌트 창 표시 상태 관리          //
  const [infoVisible, setInfoVisible] = useState(false);
  //          state: 장소 정보 컴포넌트 좌표 상태 관리          //
  const [infoLat, setInfoLat] = useState<number | null>(null);
  const [infoLng, setInfoLng] = useState<number | null>(null);
  //          state: 장소 리스트 패널 상태 관리          //
  const [isCoursePanelOpen, setIsCoursePanelOpen] = useState(false);
  //          state: 장소 리스트 상태 관리          //
  const [coursePlaces, setCoursePlaces] = useState<CoursePlaceType[]>([]);
  //          state: 최종 코스 생성 폼 패널 상태 관리          //
  const [isCoursePlaceCreatePanelOpen, setIsCoursePlaceCreatePanelOpen] = useState(false);
  //          state: 코스 생성, 수정 모드 상태 관리          //
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  //          state: 코스 생성, 수정 제출 상태 관리          //
  const [submitting, setSubmitting] = useState(false);

  // 장소 정보 컴포넌트에 표시할 POI정보는 selectedPOI 기반
  // 추후 지도 클릭으로 얻은 상세정보(d)도 보여주려면 컴포넌트 생성 후 별도 로컬 상태(infoPoi) 도입 또는 selectedPOI 전역 업데이트 필요
  const selectedPOI = useSearchStore(s => s.selectedPOI);
  const { center, zoom, markers } = useMapStore();
  // 경로 순서 상태 관리용 단순 증가 ID
  const idRef = useRef(1);

  //          effect: 지도 초기화, 클릭 이벤트 바인딩/해제          //
  useEffect(() => {
    if (!Tmapv3 || mapInstanceRef.current) return;

    const initializeMap = () => {
      try {
        const mapOptions = {
          center: new Tmapv3.LatLng(37.5652045, 126.98702028),
          width,
          height,
          zoom: 15,
        };

        const map = new Tmapv3.Map('map_div', mapOptions);
        mapInstanceRef.current = map;

  

    //          event handler: 클릭 → ReverseLavel PoiId 확보 → 상세정보 이벤트 핸들러          //
    const handleClick = async (e: any) => {
      const T = (window as any).Tmapv3;
      const map = mapInstanceRef.current;
      // 1) 클릭 좌표 추출 변수 정의: 공식 필드 사용
      const lat = e?.data?.lngLat?.lat ?? null;
      const lng = e?.data?.lngLat?.lng ?? null;

      if (lat == null || lng == null) {
        console.warn('[CLICK] lat/lng 없음. raw event:', e);
        return;
      }

      console.log('클릭된 좌표 뽑기 성공', { lat, lng });

      // 단일 선택 마커 갱신(이전 마커 제거 또는 위치 이동)
      const pos = new T.LatLng(lat, lng);
      if (!markerRef.current) {
        markerRef.current = new T.Marker({
          position: pos,
          map,
          title: '선택 위치',
        });
      } else {
        // 기존 마커를 맵에 연결(혹시 null일 수도 있으니)하고 위치만 이동
        markerRef.current.setMap(map);
        markerRef.current.setPosition(pos);
      }

      map.setCenter(pos);
      map.setZoom?.(17);
      

      setInfoLat(lat);      // 장소 기본컴포넌트 좌표갱신
      setInfoLng(lng);
      setInfoVisible(false); // 장소 기본컴포넌트 창 열림
      setInfoPoi(null);     // 이전 값 초기화

      try {
        // 2) Reverse Label → poiId 확보
        const rev = await reverseLabelRequest(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
        if (!rev) {
          console.warn('[STEP1] reverseLabel 결과 없음');
          return;
        }

        // 문서: 해당 지점에 POI 없으면 id = "0"
        if (rev.id === '0') {
          console.log('[STEP1] POI 없음. reverse 좌표만 표시', rev);
          return;
        }
        console.log('[STEP1] poiId 획득:', rev.id);

        // 3) POI 상세조회
        const d = await getPoiDetailRequest(rev.id);

        setInfoPoi({
          poiId: d?.id || rev.id,
          name: d?.name ?? rev.name ?? '이름 없음',
          address: d?.bldAddr || d?.address || '',
          tel: d?.tel || '',
          category: d?.bizCatName || '', // 태그로 표기
        });
        console.log('[STEP3] ReverseLabel → 상세조회 payload');
        console.table(d);

        setInfoVisible(true);
    
        
      } catch (err) {
        console.error('[ERROR] Reverse/상세 조회 실패:', (err as Error).message);
      }
    };

    map.on('Click', handleClick);

    console.log('TMap 지도 초기화 완료');
  } catch (error) {
    console.error('TMap 지도 초기화 실패:', error);
  }
};

    initializeMap();

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (coursemarkerRef.current.length > 0) {
        coursemarkerRef.current.forEach(marker => marker.setMap(null));
        coursemarkerRef.current = [];
      }
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [Tmapv3, width, height]);

  useEffect(() => {
    if (!Tmapv3 || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const pos = new Tmapv3.LatLng(center.lat, center.lng);

    map.setCenter(pos);
    if (typeof map.setZoom === 'function') {
      map.setZoom(zoom);
    }
    
    console.log('[MAP_STORE_EFFECT] 지도 이동:', { center, zoom });
  }, [center, zoom, Tmapv3]);

  //          effect: 선택된 POI가 바뀌면 지도 이동 + 줌 + 마커 갱신 + 콘솔          //
  useEffect(() => {
    if (!Tmapv3 || !mapInstanceRef.current || !selectedPOI) return;

    const map = mapInstanceRef.current;
    const pos = new Tmapv3.LatLng(selectedPOI.lat, selectedPOI.lng);

    // 중심 이동 & 적당한 줌
    map.setCenter(pos);
    if (typeof map.setZoom === 'function') map.setZoom(17);

    // 마커 없으면 생성, 있으면 위치만 갱신
    if (!markerRef.current) {
      markerRef.current = new Tmapv3.Marker({
        position: pos,
        map,
        title: selectedPOI.name,
      });
    } else {
      markerRef.current.setPosition(pos);
      markerRef.current.setMap(map);
    }

    // 카드 초기화 후 좌표 세팅
    setInfoVisible(false);
    setInfoPoi(null);
    setInfoLat(selectedPOI.lat);
    setInfoLng(selectedPOI.lng);
  
    // 상세조회로 동일 카드 형식 맞추기
    (async () => {
      try {
        let detail: Awaited<ReturnType<typeof getPoiDetailRequest>> | null = null;
        if (selectedPOI.poiId) {
          detail = await getPoiDetailRequest(String(selectedPOI.poiId));
        }

        const info: InfoPoiType = {
          poiId: String(selectedPOI.poiId ?? detail?.id ?? ''),
          name: detail?.name ?? selectedPOI.name ?? '이름 없음',
          address: detail?.bldAddr || detail?.address || selectedPOI.address || '',
          tel: detail?.tel || '',                // 클릭 때와 동일하게 채움
          category: detail?.bizCatName || '',   // 클릭 때와 동일하게 채움
        };

        // 한 프레임 비워서 깔끔하게 리렌더
        requestAnimationFrame(() => {
          setInfoPoi(info);
          setInfoVisible(true);
        });

        console.log('[MAP] 검색 선택 상세 적용', { base: selectedPOI, detail });
      } catch (e: any) {
        console.error('[MAP] 검색 선택 상세조회 실패:', e?.message || e);
        // 실패해도 기본 정보로 카드 표출
        requestAnimationFrame(() => {
          setInfoPoi({
            poiId: String(selectedPOI.poiId ?? ''),
            name: selectedPOI.name,
            address: selectedPOI.address,
          });
          setInfoVisible(true);
        });
      }
    })();
  }, [selectedPOI, Tmapv3]);

  useEffect(() => {
  if (!mapInstanceRef.current || !Tmapv3) return;

  // 기존 마커를 모두 제거합니다.
  if (coursemarkerRef.current.length > 0) {
    coursemarkerRef.current.forEach(marker => marker.setMap(null));
    coursemarkerRef.current = [];
  }
  
  // 기존 선을 제거합니다.
  if (polylineRef.current) {
    polylineRef.current.setMap(null);
    polylineRef.current = null;
  }

  // 새로운 마커와 선을 생성하여 지도에 추가합니다.
  if (markers.length > 0) {
    const polylinePoints: any[] = [];
    const bounds = new Tmapv3.LatLngBounds();

    markers.forEach((place: { place_coordinate_x: string; place_coordinate_y: string; }) => {
      const lat = parseFloat(place.place_coordinate_x);
      const lng = parseFloat(place.place_coordinate_y);
      const position = new Tmapv3.LatLng(lat, lng);
      
      // 마커 생성
      const marker = new Tmapv3.Marker({
        position: position,
        map: mapInstanceRef.current,
      });
      coursemarkerRef.current.push(marker);

      // 선을 그릴 좌표와 지도의 경계를 확장합니다.
      polylinePoints.push(position);
      bounds.extend(position);
    });

    // 장소들을 연결하는 선을 그립니다.
    if (polylinePoints.length > 1) {
      polylineRef.current = new Tmapv3.Polyline({
        path: polylinePoints,
        strokeColor: "#ff0000",
        strokeWeight: 4,
        directionColor: "#333333", // 진행 방향 화살표 색상
        map: mapInstanceRef.current
      });
    }

      // 모든 마커가 화면에 보이도록 지도를 맞춥니다.
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [markers, Tmapv3]);

  // 수정 중인 코스 ID 기억
  const editCourseIdRef = useRef<number | null>(null);

  //          state: 코스
  const [initialForm, setInitialForm] = useState<UpdateCourseStateType | null>(null);
  //          effect: 코스 수정시 패널 열림, 데이터 가져오기          //
  useEffect(() => {
    const s = location.state;
    if (!s?.openPanels) return;

    setIsCoursePanelOpen(true);
    setIsCoursePlaceCreatePanelOpen(true);

  // 코스 상세를 불러와서 작성
  if (s.courseId) {
    setMode('edit'); 
    editCourseIdRef.current = s.courseId;
    (async () => {
      const token = localStorage.getItem("accessToken") ?? "";
      const data = await getCourseDetail(s.courseId, token);
      // data.course_places를 CoursePlaceItem 형태로 매핑해서 주입
      setCoursePlaces(
        data.course_places
          .sort((a, b) => Number(a.sequence_index) - Number(b.sequence_index))
          .map((p, i) => ({
            id: i + 1,
            poiId: String(p.poi_id),
            name: p.place_name,
            address: p.place_address,
            category: p.place_category ?? "",
            lat: Number(p.place_coordinate_x),
            lng: Number(p.place_coordinate_y),
            arrivalTime: p.place_enter_time ?? "",
            departureTime: p.place_leave_time ?? "",
          }))
      );
      idRef.current = data.course_places.length + 1;

       setInitialForm({
        name: data.course_name ?? "",
        description: data.course_description ?? "",
        categoryName: data.course_category?.name ?? "",
      })
    })();
  } else {
    setMode('create');
    editCourseIdRef.current = null;
    setInitialForm(null);
  }

  // 뒤로가기/새로고침 시 또 열리지 않도록 state 비우기
  navigate('.', { replace: true, state: {} });
    
  }, [location.state, navigate]);

  //          event handler: 최종 코스 작성 패널 열기 이벤트 핸들러          //
  const handleOpenCoursePanel = () => {
    // ① 클릭 카드 우선: infoPoi + infoLat/lng
    const src = (infoPoi && infoLat != null && infoLng != null)
      ? {
          poiId: infoPoi.poiId ?? '0',
          name: infoPoi.name ?? '이름 없음',
          address: infoPoi.address ?? '',
          category: infoPoi.category ?? '',
          lat: infoLat!,
          lng: infoLng!,
        }
      // ② 폴백: 검색 선택값(selectedPOI)
      : (selectedPOI
        ? {
            poiId: String(selectedPOI.poiId),
            name: selectedPOI.name,
            address: selectedPOI.address,          
            lat: selectedPOI.lat,
            lng: selectedPOI.lng,
          }
        : null);

    if (!src) {
      console.warn('[COURSE] 추가할 장소 정보가 없음');
      return;
    }

    setIsCoursePanelOpen(true);

    const id = idRef.current++;
    setCoursePlaces(prev => [
      ...prev,
      {
        id,
        poiId: src.poiId,
        name: src.name,
        address: src.address,
        category: src.category,
        lat: src.lat,
        lng: src.lng,
        arrivalTime: '',
        departureTime: '',
      },
    ]);
  };
  //          event handler: 시간 변경 핸들러          //
  const handlePlaceTimeChange = (
    id: number,
    t: { arrivalTime?: string; departureTime?: string }
  ) => {
    setCoursePlaces(prev =>
      prev.map(p => (p.id === id ? { ...p, ...t } : p))
    );
    console.log('[COURSE] time changed:', id, t);
  };

  //          event handler: 코스 작성 패널 닫기 핸들러          //
  const handleCloseCoursePlaceCreate = () => {
    setIsCoursePlaceCreatePanelOpen(false);
  };

  //          event handler: 장소 취소 핸들러          //
  const handleRemovePlace = (id: number) => {
    setCoursePlaces((prev) => prev.filter((p) => p.id !== id));
  };

  //          event handler: 코스 최종 등록,수정 공통 이벤트 핸들러          //
  const handleSubmitCourse = async ({courseId, payload}: CourseSubmitType) => {
  try {
      setSubmitting(true);
      const accessToken = localStorage.getItem("accessToken")!; 
    

      // setMode를 바꾸기 전에 현재 모드 저장(알림 메시지용)
      const currentMode = mode;

      const res = (currentMode === 'edit' && courseId)
      ? await updateCourse(courseId, payload, accessToken) // PUT /api/courses/{id}
      : await createCourse(payload, accessToken);          // POST /api/courses
      console.log("[RES] create/update =", res);

      // 성공 후 UI 정리
      setIsCoursePlaceCreatePanelOpen(false);
      setIsCoursePanelOpen(false);
      setCoursePlaces([]);
      setMode('create');
      editCourseIdRef.current = null;

      await Swal.fire({
        icon: "success",
        title: `코스 ${mode === 'edit' ? '수정' : '등록'} 완료!`,
        text: `코스가 성공적으로 ${mode === 'edit' ? '수정' : '등록'}되었습니다.`,
      });
    } catch (e: any) {
      console.error("[ERROR] createCourse failed:", e?.message || e);
    } finally {
      setSubmitting(false);
    }
  };

  //          event handler 기본 장소 정보 패널 닫기 핸들러          //
  const handleCloseInfo = useCallback(() => {
    setInfoVisible(false);
    setInfoPoi(null);
    setInfoLat(null);
    setInfoLng(null);
  }, []);
  // 화면에 표시할 POI를 한 곳에서 결정(클릭 정보 > 검색 선택)
  const displayPoi =
    infoPoi ??
    (selectedPOI
      ? { name: selectedPOI.name, address: selectedPOI.address }
      : null);

  //          render: 메인 맵, 장소기본정보, 장소리스트패널, 코스생성패널 랜더링          //
  return (
    <div>
      <div
        id="map_div"
        ref={mapRef}
        style={{ width, height }}
        className="w-full h-full"
      />

      {/* 맵 장소기본정보 창 */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
        <MapPlaceInfo
          visible={infoVisible}
          lat={infoLat}
          lng={infoLng}
          poi={displayPoi}
          onClose={handleCloseInfo}
          onOpenCoursePanel={handleOpenCoursePanel}
        />
      </div>

      {/* 최종 코스 등록 패널 */}
      {isCoursePlaceCreatePanelOpen && (
        <div className="absolute right-1/8 top-50">
          <CoursePlaceCreate 
            onCancel={handleCloseCoursePlaceCreate} 
            initialValues={initialForm ?? undefined} 
            places={coursePlaces}
            submitLabel={mode === 'edit' ? ('수정 완료') : ('등록 완료')}
            courseId={mode === 'edit' ? editCourseIdRef.current ?? undefined : undefined}
            onSubmit={handleSubmitCourse}
          />
        </div>
      )}

      {/* 좌측 장소 리스트 패널 */}
      {isCoursePanelOpen && (
        <aside className="absolute left-4 top-20 bottom-4 z-10 w-72 rounded-3xl bg-white/80 backdrop-blur shadow-xl ring-1 ring-black/10">
          <div className="flex h-full flex-col">
            <header className="flex items-center justify-between px-4 pt-4 pb-2">
              <h2 className="text-lg font-extrabold text-gray-800">장소 리스트</h2>
              <button
                type="button"
                onClick={() => setIsCoursePlaceCreatePanelOpen(true)}
                className="inline-flex items-center rounded-xl bg-main-200 px-3 py-1.5 text-white text-[13px] font-medium shadow-sm hover:bg-main-300 focus:outline-none focus:ring-2 focus:ring-main-200/40"
              >
                코스 등록
              </button>
              <button
                type="button"
                onClick={() => setIsCoursePanelOpen(false)}
                className="rounded-xl bg-main-200 px-3 py-1.5 text-white text-[13px] hover:bg-main-300"
              >
                닫기
              </button>
            </header>

            <div className="mt-2 h-px w-full bg-black/5" />
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
              {coursePlaces.map((p, idx) => (
                <CoursePlaceItem
                  key={p.id}
                  id={p.id}
                  index={idx + 1}
                  name={p.name}
                  address={p.address}
                  category={p.category}
                  arrivalTime={p.arrivalTime}
                  departureTime={p.departureTime}
                  onTimeChange={handlePlaceTimeChange}
                  onRemove={handleRemovePlace}
                  isLast={idx === coursePlaces.length - 1}
                />
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default Map;
