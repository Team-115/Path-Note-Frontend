// 검색 완료 or 클릭시 부모에게서 내려오는 장소 정보와 콜백 타입 
interface MapPlaceInfoProps {
  visible: boolean;               // 컴포넌트 표시 여부
  lat: number | null;
  lng: number | null;
  poi?: {                         // 현재 검색결과 조회정보만 있고 상세조회 결과는 없음, 추후 보완 필요
    name?: string;
    address?: string;
    tel?: string;
    category?: string;
  } | null;
  onClose: () => void;
  onOpenCoursePanel?: () => void; // 코스에 추가하기 버튼 클릭시 실행되는 콜백
}


//          component: 맵 장소 정보 컴포넌트          //
export default function MapPlaceInfo({
  visible,
  lat,
  lng,
  poi,
  onClose,
  onOpenCoursePanel,
}: MapPlaceInfoProps) {
    if (!visible) return null;    // false일때 아무것도 랜더링하지 않음 

    const title = poi?.name ?? (lat && lng ? `${lat.toFixed(5)}, ${lng.toFixed(5)}` : '위치');
    const addr  = poi?.address;
    const tel   = poi?.tel;
    const tag   = poi?.category;
    
    //          render: 맵 장소 정보 컴포넌트 랜더링          //
    return (
    <div className="relative">
      <div className="relative z-10 rounded-2xl bg-white/95 backdrop-blur shadow-md ring-1 ring-black/5 px-4 py-3 min-w-[260px]">
        {/* 헤더: 제목 + 닫기 버튼 */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h3 className="text-[16px] font-extrabold text-gray-900 truncate">{title}</h3>
            {/* 태그(카테고리) - 제목 바로 아래 */}
            {tag && (
              <div className="self-end ">
                <span className="text-main-100 text-[11px]">
                  {tag}
                </span>
              </div>
            )}

          </div>
          
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="shrink-0 rounded-lg bg-main-200 text-white text-[12px] px-2 py-1 hover:bg-main-300 focus:outline-none"
          >
            닫기
          </button>
        </div>

       
        {/* 주소 */}
        {addr && (
          <div className="mt-2 flex items-start gap-2 text-gray-800">
            <span className="mt-0.5 text-gray-500">
              <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
                <path d="M12 2a6 6 0 0 0-6 6c0 4.2 6 12 6 12s6-7.8 6-12a6 6 0 0 0-6-6zm0 8.2A2.2 2.2 0 1 1 12 6a2.2 2.2 0 0 1 0 4.2z" fill="currentColor"/>
              </svg>
            </span>
            <span className="text-[14px] leading-5 break-keep">{addr}</span>
          </div>
        )}

        {/* 전화 */}
        {tel && (
          <div className="mt-1 flex items-center gap-2 text-gray-800">
            <span className="text-gray-500">
              <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
                <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1.1-.2c1.1.4 2.3.6 3.5.6a1 1 0 0 1 1 1V20a2 2 0 0 1-2 2C10.4 22 2 13.6 2 3a2 2 0 0 1 2-2h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.6 3.6a1 1 0 0 1-.2 1.1l-2.3 2.3z" fill="currentColor"/>
              </svg>
            </span>
            <span className="text-[14px] leading-5">{tel}</span>
          </div>
        )}

        {/* 액션 */}
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => onOpenCoursePanel?.()}
            className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-main-200 hover:bg-blue-100 text-[12px] font-medium px-3 py-1.5 transition"
          >
            코스에 추가하기
          </button>
        </div>
      </div>

    </div>
  );
}