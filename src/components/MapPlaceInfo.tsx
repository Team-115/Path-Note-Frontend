
import { FaMapMarkerAlt, FaPhoneAlt, FaTag, FaPlus,} from "react-icons/fa";
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
        <div className="relative z-10 rounded-2xl bg-white/60 backdrop-blur shadow-md ring-1 ring-black/5 px-4 py-3 min-w-[260px]">
          {/* 헤더: 제목 + 닫기 버튼 */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <h3 className="text-[16px] font-extrabold text-gray-900 truncate">{title}</h3>

              {/* 태그(카테고리) */}
              {tag && (
                <div className="self-end inline-flex items-center gap-1">
                  <FaTag className="text-main-100 text-[11px]" aria-hidden />
                  <span className="text-main-100 text-[11px]">{tag}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-main-200 text-white text-[12px] px-2 py-1 hover:bg-main-300 focus:outline-none"
            >
              닫기
            </button>
          </div>

          {/* 주소 */}
          {addr && (
            <div className="mt-2 flex items-start gap-2 text-gray-800">
              <FaMapMarkerAlt className="text-gray-500 text-[14px] mt-0.5" aria-hidden />
              <span className="text-[14px] leading-5 break-keep">{addr}</span>
            </div>
          )}

          {/* 전화 */}
          {tel && (
            <div className="mt-1 flex items-center gap-2 text-gray-800">
              <FaPhoneAlt className="text-gray-500 text-[14px]" aria-hidden />
              <span className="text-[14px] leading-5">{tel}</span>
            </div>
          )}

          {/* 액션 */}
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => onOpenCoursePanel?.()}
              className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 text-main-200 hover:bg-blue-100 text-[12px] font-medium px-3 py-1.5 transition"
            >
              <FaPlus aria-hidden />
              코스에 추가하기
            </button>
          </div>
        </div>
      </div>
    );
}