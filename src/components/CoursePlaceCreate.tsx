import { useState, useMemo, useEffect } from "react";
import type { CoursePlaceType } from "../types/CoursePlaceType";
import type { CourseCreateRequestDto, CoursePlaceDto } from "../types/CoursePlaceDto";
import type { CourseSubmitType } from "../types/UpdateStateType";
import { fetchCategoriesByPrefix } from "../apis/CourseCategoryApi";
import { useDebounce } from "../hooks/useDebounce";
import { FaRegPaperPlane, FaHashtag, FaRegStickyNote, FaRegImage, FaClock, FaStore} from "react-icons/fa";

// 부모 컴포넌트에서 전달받은 콜백함수 타입정의
interface CoursePlaceCreateProps {
  onCancel: () => void;                             // 취소 버튼 클릭시 실행되는 콜백
  places: CoursePlaceType[];                        // 선택된 장소리스트
  onSubmit: (args: CourseSubmitType) => void; // 입력 완료시 서버에 보낼 데이터를 전달하는 콜백
  initialValues?: { name: string; description: string; categoryName: string };
  submitLabel?: string;
  courseId?: number;                                 // 코스 수정시 넘길 코스ID
}

//          component: 코스 장소 등록 컴포넌트          //
export default function CoursePlaceCreate({  onCancel, places, onSubmit, initialValues, submitLabel = "입력 완료", courseId,}: CoursePlaceCreateProps) {

  //          states: 폼 데이터 상태 관리          //
  const [name, setName] = useState(initialValues?.name ?? "");
  const [category, setCategory] = useState(initialValues?.categoryName ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");

  //          states: 코스 카테고리 상태 관리          //
  const [catQuery, setCatQuery] = useState(initialValues?.categoryName ?? "");
  const [catOptions, setCatOptions] = useState<{ id: number; content: string }[]>([]);
  const [catOpen, setCatOpen] = useState(false);
  const [catActive, setCatActive] = useState(0);
  const debouncedCat = useDebounce(catQuery, 250);

  //          effect: initialValues 반영할 때 catQuery 동기화           //
  useEffect(() => {
    if (!initialValues) return;
    setCatQuery(initialValues.categoryName ?? "");
  }, [initialValues]);

  //          effect: 입력 디바운스 후 서버 조회           //
  useEffect(() => {
    let ignore = false;
    const run = async () => {
      const q = debouncedCat.trim();
      if (q.length < 1) { setCatOptions([]); setCatOpen(false); return; }

      try {
        const list = await fetchCategoriesByPrefix(q);
        if (!ignore) {
          setCatOptions(list.map(c => ({ id: c.category_id, content: c.content })));
          setCatOpen(list.length > 0);
          setCatActive(0);
        }
      } catch {
        if (!ignore) { setCatOptions([]); setCatOpen(false); }
      }
    };
    run();
    return () => { ignore = true; };
  }, [debouncedCat]);

  //          effect: 바깥 클릭시 닫기          //
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest?.("#cat-autocomplete")) setCatOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  //           event handler: 코스 카테고리 입력 이벤트 핸들러           //
  const handleCategoryChange = (v: string) => {
    setCategory(v);      // 실제 폼 필드
    setCatQuery(v);      // 검색어
    setCatOpen(true);
  };
  //           event handler: 코스 카테고리 선택 이벤트 핸들러          //
  const pickCategory = (text: string) => {
    setCategory(text);
    setCatQuery(text);
    setCatOpen(false);
  };

  //          event handler: 키보드 입력 이벤트 핸들러          //
  const onCatKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!catOpen || catOptions.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setCatActive(i => (i + 1) % catOptions.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCatActive(i => (i - 1 + catOptions.length) % catOptions.length); }
    else if (e.key === "Enter") { e.preventDefault(); pickCategory(catOptions[catActive].content); }
    else if (e.key === "Escape") { setCatOpen(false); }
  };

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
  if (!t || !t.includes(":")) return "00:00";           // 비입력 시 기본값
  const [h, m] = t.split(":");
  // NaN 방지
  const hh = isNaN(Number(h)) ? "00" : pad(Number(h));
  const mm = isNaN(Number(m)) ? "00" : pad(Number(m));
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
    if (firstArr == null || lastArr == null) return "총 소요 시간";

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
    
    onSubmit({courseId, payload});
  };

    //          render: 코스 장소 등록 컴포넌트 랜더링          //
    return (
    <section className="rounded-3xl bg-white/90 shadow-lg ring-1 ring-black/5 md:p-5">
      
      {/* 패널 타이틀 */}
      <div className="flex items-center justify-between mb-3">
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
            {submitLabel} 
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
      <div className="mb-1 flex items-start gap-3">
        <FaStore aria-hidden className="text-gray-500 text-[20px] mt-1" />
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-5 text-[13px] text-gray-900">
          {places.length === 0 ? (
            <li className="text-[12px] text-gray-400">선택된 장소가 없음</li>
          ) : (
            places.map((p, idx) => (
              <li key={p.id} className="flex items-start gap-1.5 min-w-0">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="w-5 text-right font-semibold text-[14px]">{idx + 1}.</span>
                    <span className="text-[14px] text-gray-900 truncate max-w-[12rem]">{p.name}</span>
                  </div>
                  {!!p.category && (
                    <span className="text-[12px] text-gray-400 self-end min-h-[16px]">{p.category}</span>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="flex justify-between mb-2">
        {/* 일정 소요 시간 */}
        <div className="grid grid-cols-[auto_1fr] gap-x-3 items-center mb-1">
          <div className="flex items-center gap-5">
            <FaClock className="flex h-8 items-center justify-center text-gray-500 text-[18px]"/>
            <span className="text-[14px] text-gray-400">{courseDurationLabel}</span>
          </div>
        </div>
        {/* 이미지 업로드 */}
        <button type="button" className="flex items-center gap-2 text-[12px] text-gray-500 hover:text-main-300">
          <FaRegImage className="flex h-8 items-center justify-center text-gray-500 text-[24px]  hover:text-main-300"/>
          <span>업로드</span>
        </button>
      </div>
      {/* 코스 이름 */}
      <div className="grid grid-cols-[auto_1fr] gap-x-4 font-bold items-start mb-3">
        <label htmlFor="course-name">
          <FaRegPaperPlane className="flex h-8 items-center justify-center text-gray-500 text-[18px]"/>
        </label>
        <input
          id="course-name"
          value={name}
          name="course_name"              // 브라우저 기록 키(바꾸면 과거 기록 매칭 끊김)
          autoComplete="off"              // 자동완성/제안 끔
          autoCorrect="off"               // iOS 자동교정 끔
          onChange={(e) => setName(e.target.value)}
          placeholder="코스 이름"
          className="h-8 w-full rounded-xl bg-main-100/30 px-3 text-[14px] focus:outline-none focus-within:ring-2 focus-within:ring-main-200/50"
        />
      </div>

      {/* 코스 해시 태그 */}
      <div className="grid grid-cols-[auto_1fr] font-bold gap-x-4 items-start mb-3">
        <label htmlFor="course-category">
          <FaHashtag className="flex h-8 items-center justify-center text-gray-500 text-[18px]"/>
        </label>
        {/* 인풋처럼 보이는 래퍼 */}
        <div
          id="cat-combobox"
          className="h-8 w-full rounded-xl bg-main-100/30 ring-1 ring-transparent
                    focus-within:ring-2 focus-within:ring-main-200/50
                    flex items-center px-2"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={false}
        >
          {/* 실제 입력칸: 배경 투명, 왼쪽 정렬 */}
          <input
            id="course-category"
            value={catQuery}
            name="course_category"
            autoComplete="off"
            autoCorrect="off"
            onChange={(e) => handleCategoryChange(e.target.value)}
            onFocus={() => { if (catOptions.length) setCatOpen(true); }}
            onKeyDown={onCatKeyDown}
            placeholder="코스 해시태그"
            className="flex-1 bg-transparent text-[14px] outline-none px-1"
          />

          {/* 오른쪽 추천 pill 집합 */}
          {catOptions.length > 0 && (
            <div className="ml-2 hidden sm:flex items-center gap-1 overflow-x-auto scrollbar-none">
              {catOptions.slice(0, 5).map(opt => (
                <button
                  key={opt.id}
                  onMouseDown={(e) => { e.preventDefault(); pickCategory(opt.content); }}
                  className="shrink-0 rounded-full px-2.5 py-1 text-[12px]
                            bg-main-200  hover:bg-main-300 text-white"
                  title={opt.content}
                >
                  {opt.content}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 코스 설명 */}
      <div className="grid grid-cols-[auto_1fr] font-bold  gap-x-4 gap-y-2 items-start">
        <label htmlFor="course-desc" className="text-[15px] leading-10 inline-flex items-center gap-2">
          <FaRegStickyNote className="flex h-8 items-center justify-center text-gray-500 text-[18px]"/>
        </label>
        <textarea
          id="course-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="코스에 대해 설명해주세요"
          className="w-full h-40 md:h-48 rounded-2xl bg-main-100/30 px-3 py-2 text-[14px] outline-none resize-none focus:ring-2 focus:ring-main-200/50"
        />
      </div>
    </section>
  );
}