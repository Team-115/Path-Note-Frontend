// 코스생성시 부모로부터 넘어오는 장소리스트 관련 정보와 콜백 함수 타입 정의
interface CoursePlaceItemProps {
  id: number;
  index: number;
  name: string;
  address: string;
  phone?: string;
  arrivalTime?: string;
  departureTime?: string;
  onRemove: (id: number) => void;           // 선택한 장소를 삭제하는 콜백
  onTimeChange?: (id: number, t: { arrivalTime?: string; departureTime?: string }) => void; // 출발,도착 시간 변경시 실행되는 콜백
}

//          component: 코스 장소 아이템 컴포넌트          //
export default function CoursePlaceItem({ id, index, name, address, phone, arrivalTime, departureTime, onRemove, onTimeChange, }: CoursePlaceItemProps) {

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
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 1) 장소명 행: 상점 아이콘 + 제목/칩 */}
        <div className="flex items-start gap-3">
          {/* 상점 아이콘 */}
          <svg aria-hidden viewBox="0 0 24 24" className="w-6 h-6 text-gray-500">
            <path
              d="M3 9l1-4h16l1 4v9a2 2 0 0 1-2 2h-3v-5H8v5H5a2 2 0 0 1-2-2V9zM4 5h16"
              stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>

          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-semibold text-gray-900 truncate">{name}</h3>
          </div>
        </div>

        {/* 2) 주소 행: 위치 아이콘 + 주소 */}
        <div className="flex items-start gap-3">
          <svg aria-hidden viewBox="0 0 24 24" className="w-5 h-5 mt-0.5 text-gray-500">
            <path
              d="M12 2a6 6 0 0 0-6 6c0 4.6 6 12 6 12s6-7.4 6-12a6 6 0 0 0-6-6zm0 8.2a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4z"
              fill="currentColor"
            />
          </svg>
          <div className="text-[13px] text-gray-700 leading-5 break-keep">{address}</div>
        </div>

        {/* 3) 카테고리 행: 태그 아이콘 + 세부 카테고리 */}
        <div className="flex items-start gap-3">
          {/* 태그(라벨) 아이콘 */}
          <svg aria-hidden viewBox="0 0 24 24" className="w-5 h-5 text-gray-500">
            <path
              d="M20 13.59L10.41 4H5a1 1 0 0 0-1 1v5.41L13.59 20a2 2 0 0 0 2.83 0L20 16.41a2 2 0 0 0 0-2.82zM7.5 7a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"
              fill="currentColor"
            />
          </svg>
          <div className="text-[12px] text-gray-500">빵집</div>
        </div>

        {/* 4) 시간 영역: 아이콘 열 폭만큼 들여쓰기 */}
        <div className="mt-2 space-y-2">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-[12px] text-gray-600">도착</span>
          <input
            type="time"
            value={arrivalTime ?? ''}
            onChange={(e) => onTimeChange?.(id, { arrivalTime: e.target.value })}
            className="w-32 rounded-full border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:bg-main-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-[12px] text-gray-600">출발</span>
          <input
            type="time"
            value={departureTime ?? ''}
            onChange={(e) => onTimeChange?.(id, { departureTime: e.target.value })}    
            className="w-32 rounded-full border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:bg-main-100"
          />
        </div>
      </div>
      </div>
    </div>
  );
}