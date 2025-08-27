// 검색 완료 or 클릭시 부모에게서 내려오는 장소 정보와 콜백 타입 
interface MapPlaceInfoProps {
  visible: boolean;               // 컴포넌트 표시 여부
  lat: number | null;
  lng: number | null;
  poi?: {                         // 현재 검색결과 조회정보만 있고 상세조회 결과는 없음, 추후 보완 필요
    name?: string;
    address?: string;
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

    const title   = poi?.name;
    const addr    = poi?.address;

    //          render: 맵 장소 정보 컴포넌트 랜더링          //
    return (
    <div className="relative">
      {/* 카드 */}
      <div className="relative z-10 rounded-2xl bg-white/95 backdrop-blur shadow-md ring-1 ring-black/5 px-4 py-3">
        {/* 헤더 */}
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="text-[15px] font-extrabold text-gray-900 truncate">
                {title}
              </h3>
              {/* 태그/배지 */}
              <span className="ml-2 shrink-0 rounded-full bg-main-100 text-gray-600 text-[11px] px-2 py-0.5 border border-gray-200">
                태그
              </span>
            </div>

            {/* 주소 라인 */}
            {addr && (
              <div className="mt-1 flex items-start gap-2 text-gray-800">
                <span className="mt-0.5 text-gray-500">
                  <svg viewBox="0 0 24 24" className="w-4 h-4">
                    <path
                      d="M12 2a6 6 0 0 0-6 6c0 4.2 6 12 6 12s6-7.8 6-12a6 6 0 0 0-6-6zm0 8.2A2.2 2.2 0 1 1 12 6a2.2 2.2 0 0 1 0 4.2z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span className="text-[14px] leading-5 break-keep">{addr}</span>
              </div>
            )}

            {/* 전화 라인 */}
            <div className="mt-1 flex items-center gap-2 text-gray-800">
              <span className="text-gray-500">
                <svg viewBox="0 0 24 24" className="w-4 h-4">
                  <path
                    d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1.1-.2c1.1.4 2.3.6 3.5.6a1 1 0 0 1 1 1V20a2 2 0 0 1-2 2C10.4 22 2 13.6 2 3a2 2 0 0 1 2-2h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.6 3.6a1 1 0 0 1-.2 1.1l-2.3 2.3z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span className="text-[14px] leading-5">042-280-2114</span>

            </div>

            {/* 액션 버튼 */}
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={() => onOpenCoursePanel?.({})}
                className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-main-200 hover:bg-blue-100 text-[12px] font-medium px-3 py-1.5 transition"
              >
                코스에 추가하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 말풍선 꼬리 */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-6 h-5 rotate-45 bg-white/95 shadow-md ring-1 ring-black/5" />
    </div>
  );
}