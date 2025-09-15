import { FaTimes, FaStore, FaMapMarkerAlt, FaTag } from "react-icons/fa";
// 코스생성시 부모로부터 넘어오는 장소리스트 관련 정보와 콜백 함수 타입 정의
interface CoursePlaceItemProps {
  id: number;
  index: number;
  name: string;
  address: string;
  category?: string;
  arrivalTime?: string | null;
  departureTime?: string | null;
  onRemove: (id: number) => void;           // 선택한 장소를 삭제하는 콜백
  onTimeChange?: (id: number, t: { arrivalTime?: string; departureTime?: string }) => void; // 출발,도착 시간 변경시 실행되는 콜백
  isLast?: boolean; // 마지막 장소인지 여부
}



//          component: 코스 장소 아이템 컴포넌트          //
export default function CoursePlaceItem({ id, index, name, address, category, arrivalTime, departureTime, onRemove, onTimeChange, isLast = false,}: CoursePlaceItemProps) {
  const cat = (category ?? '').trim();

    //          render: 코스 장소 아이템 컴포넌트 랜더링          //
    return (
    <div className="rounded-2xl bg-white shadow-md ring-1 ring-black/5 px-4 py-3">
      <div className="space-y-2">
        {/* 0) 순번 + 삭제 버튼 */}
        <div className="flex items-center justify-between">
          <div className="text-[13px] font-bold text-gray-600">{index}</div>
          <button
            type="button"
            className="text-gray-400 hover:text-red-500 transition-colors"
            onClick={() => onRemove(id)}
            aria-label="삭제"
          >
            <FaTimes className="text-[20px]" aria-hidden />
          </button>
        </div>

        {/* 1) 장소명 행: 상점 아이콘 + 제목 */}
        <div className="flex items-start gap-3">
          <FaStore className="text-[20px] text-gray-500 translate-y-[1px]" aria-hidden />
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-semibold text-gray-900 truncate">{name}</h3>
          </div>
        </div>

        {/* 2) 주소 행: 위치 아이콘 + 주소 */}
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt className="text-[18px] mt-0.5 text-gray-500" aria-hidden />
          <div className="text-[13px] text-gray-700 leading-5 break-keep">{address}</div>
        </div>

        {/* 3) 카테고리 행: 태그 아이콘 + 세부 카테고리 */}
        {cat && (
          <div className="flex items-start gap-3">
            <FaTag className="text-[16px] text-gray-500 translate-y-[1px]" aria-hidden />
            <div className="text-[13px] text-gray-700 leading-5 break-keep">{cat}</div>
          </div>
        )}

        {/* 4) 시간 영역 */}
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-[12px] text-gray-600">도착</span>
            <input
              type="time"
              value={arrivalTime ?? ""}
              onChange={(e) => onTimeChange?.(id, { arrivalTime: e.target.value })}
              className="w-32 rounded-full border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:bg-main-100"
            />
          </div>
          {!isLast && (
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-[12px] text-gray-600">출발</span>
              <input
                type="time"
                value={departureTime ?? ""}
                onChange={(e) => onTimeChange?.(id, { departureTime: e.target.value })}
                className="w-32 rounded-full border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:bg-main-100"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}