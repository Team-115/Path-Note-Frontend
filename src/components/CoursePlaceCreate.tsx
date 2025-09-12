import { useState, useMemo, useEffect } from "react";
import type { CoursePlaceType } from "../types/CoursePlaceType";
import type { CourseCreateRequestDto, CoursePlaceDto } from "../types/CoursePlaceDto";

// 부모 컴포넌트에서 전달받은 콜백함수 타입정의
interface CoursePlaceCreateProps {
  onCancel: () => void;                             // 취소 버튼 클릭시 실행되는 콜백
  places: CoursePlaceType[];                        // 선택된 장소리스트
  onSubmit: (payload: CourseCreateRequestDto) => void; // 입력 완료시 서버에 보낼 데이터를 전달하는 콜백
  initialValues?: { name: string; description: string; categoryName: string };
}

//          component: 코스 장소 등록 컴포넌트          //
export default function CoursePlaceCreate({  onCancel, places, onSubmit, initialValues,}: CoursePlaceCreateProps) {

  //          states: 폼 데이터 상태 관리          //
  const [name, setName] = useState(initialValues?.name ?? "");
  const [category, setCategory] = useState(initialValues?.categoryName ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");

  //          effect: 코스 수정시 가져온 코스 데이터 반영          //
  useEffect(() => {
    if (!initialValues) return;
    setName(initialValues.name ?? "");
    setCategory(initialValues.categoryName ?? "");
    setDescription(initialValues.description ?? "");
  }, [initialValues]);

  //          function: 날짜 시간 포맷터 (문서 예시: "YYYY-MM-DD HH:mm")          //
  const pad = (n: number) => String(n).padStart(2, "0");
  // 오늘 날짜를 "YYYY-MM-DD"로 반환 (로컬 타임존 기준)
  const todayStr = (d = new Date()) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  // "HH:MM" 형태로 정규화
  const fommaterHHmm = (t?: string | null) => {
  if (!t) return "00:00";                  // 비입력 시 기본값
  const [h, m] = t.split(":");
  const hh = pad(Number(h ?? 0));
  const mm = pad(Number(m ?? 0));
  return `${hh}:${mm}`;
  };
  // CoursePlaceType -> CoursePlaceDto 매핑
  const toCoursePlaceDto = (p: CoursePlaceType, idx: number): CoursePlaceDto => {
    const baseDate = todayStr();              // 작성 시점의 오늘 날짜
    const enter = fommaterHHmm((p as any).arrivalTime); // "HH:MM"
    const leave = fommaterHHmm((p as any).departureTime); // "HH:MM"

    return {
      poi_id: String(p.poiId),
      sequence_index: idx + 1,
      place_name: p.name ?? "",
      place_category: p.category ?? "",
      place_address: p.address ?? "",
      place_coordinate_x: String((p as any).lng ?? (p as any).lon ?? (p as any).x ?? ""),
      place_coordinate_y: String((p as any).lat ?? (p as any).y ?? ""),
      place_enter_time: `${baseDate} ${enter}`,
      place_leave_time: `${baseDate} ${leave}`,
    };
  };

  //          function: 소요 시간 계산 함수          //
    // "HH:MM" → 분
  const toMinutes = (hhmm?: string | null) => {
    if (!hhmm || !/^\d{2}:\d{2}$/.test(hhmm)) return null;
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };

  // 125 → "2시간 5분" / 60 → "1시간" / 45 → "45분"
  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${h}시간 ${m}분`;
    if (h > 0) return `${h}시간`;
    return `${m}분`;
  };

  // 첫 도착과 마지막 도착 차이
  const courseDurationLabel = useMemo(() => {
    if (places.length === 0) return "—";
    const firstArr = toMinutes((places[0] as any).arrivalTime);
    const lastArr  = toMinutes((places[places.length - 1] as any).arrivalTime);
    if (firstArr == null || lastArr == null) return "—";

    let diff = lastArr - firstArr;
    if (diff < 0) diff += 24 * 60; // 자정 넘김 처리(예: 23:30 → 01:00)

    return formatDuration(diff);
  }, [places]);

  //          event handler: 장소 등록 이벤트 핸들러          //
  // 폼 제출시 실행 입력된 값으로 payload 객체 생성 후 실행
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const course_places: CoursePlaceDto[] = places.map(toCoursePlaceDto);

    const payload: CourseCreateRequestDto = {
      course_name: name.trim(),
      course_category: category.trim(),
      course_description: description.trim(),
      course_places,                                
    };
    
    onSubmit(payload);
  };

    //          render: 코스 장소 등록 컴포넌트 랜더링          //
    return (
    <section className="rounded-3xl bg-white shadow-lg ring-1 ring-black/5 p-5 md:p-6">
      
      {/* 패널 타이틀 */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-extrabold leading-8 text-gray-900">
            코스 생성
        </div>
        <div className="flex space-x-2">
            <button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim() || !category.trim()}
            className="inline-flex items-center rounded-xl bg-main-200 px-3 py-1.5 
                        text-white text-[13px] font-medium shadow-sm 
                        hover:bg-main-300 focus:outline-none focus:ring-2 
                        focus:ring-main-200/40"
            >
            입력 완료
            </button>
            <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-xl bg-main-200 px-3 py-1.5 
                        text-white text-[13px] font-medium shadow-sm 
                        hover:bg-main-300 focus:outline-none focus:ring-2 
                        focus:ring-main-200/40"
            >
            취소
            </button>
        </div>
        </div>

      {/* 장소리스트 */}
      <div className="text-[13px] font-bold leading-8">장소 리스트</div>
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-gray-900 mb-4">
        {places.length === 0 ? (
          <li className="text-[12px] text-gray-400">선택된 장소가 없음</li>
        ) : (
          places.map((p, idx) => (
            <li key={p.id} className="flex items-start gap-1.5">
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="w-5 text-right font-semibold text-[14px]">{idx + 1}.</span>
                  <span className="text-[14px] text-gray-900 truncate max-w-[12rem]">
                    {p.name}
                  </span>
                </div>
        
                <span className="text-[12px] text-gray-400 self-end min-h-[16px] ${cat ? '' : 'invisible'">{p.category}</span>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* 일정 요약 */}
      <div className="grid grid-cols-[auto_1fr]  gap-x-4 items-center mb-4">
        <label className="text-[13px] font-bold">코스 소요 시간</label>
          <div className="text-[13px] text-gray-500">{courseDurationLabel}</div>
      </div>

      {/* 코스 이름 */}
      <div className="grid grid-cols-[auto_1fr]  font-bold  gap-x-4 gap-y-2 items-start mb-3">
        <label htmlFor="course-name" className="text-[13px] leading-9">코스 이름</label>
        
        <input
          id="course-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예) 빵길"
          className="h-9 w-full rounded-xl bg-main-100/50 px-3 text-[14px] outline-none focus:ring-2 focus:ring-main-200/50"
        />
      </div>

      {/* 코스 테마 해시 태그 */}
      <div className="grid grid-cols-[auto_1fr] font-bold gap-x-4 gap-y-2 items-start mb-3">
        <label htmlFor="course-category" className="text-[13px] leading-9">코스 테마 해시 태그</label>
        <input
          id="course-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="예) 맛집투어"
          className="h-9 w-full rounded-xl bg-main-100/50 px-3 text-[14px] outline-none focus:ring-2 focus:ring-main-200/50"
        />
      </div>

      {/* 이미지 업로드 */}
      <div className="grid grid-cols-[auto_1fr] font-bold gap-x-4 gap-y-2 items-start mb-4">
        <label className="text-[13px] leading-9">이미지 업로드</label>
        <div className="w-12">
          <div className=" rounded-2xl border-2 border-dashed border-main-100 bg-slate-100/70 flex items-center justify-center">
            <span className="text-2xl text-main-200 select-none">＋</span>
          </div>
        </div>
      </div>

      {/* 코스 설명 */}
      <div className="grid grid-cols-[auto_1fr] font-bold  gap-x-4 gap-y-2 items-start">
        <label htmlFor="course-desc" className="text-[13px] leading-10">코스 설명</label>
        <textarea
          id="course-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="예) 성심당에 대전이 있지"
          className="w-full h-40 md:h-48 rounded-2xl bg-main-100/50 px-3 py-2 text-[14px] outline-none resize-none focus:ring-2 focus:ring-main-200/50"
        />
      </div>
    </section>
  );
}