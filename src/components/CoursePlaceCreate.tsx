import { useState } from "react";
import type { CoursePlaceType } from "../types/CoursePlaceType";

// 서버에 보낼 페이로드 타입
// 코스 생성 시 서버로 전송할 데이터 구조
export type CourseCreatePayload = {
  course_name: string;
  course_category: string;        // 코스 카테고리
  course_description: string;
};

// 부모 컴포넌트에서 전달받은 콜백함수 타입정의
interface CoursePlaceCreateProps {
  onCancel: () => void;                             // 취소 버튼 클릭시 실행되는 콜백
  places: CoursePlaceType[];                        // 선택된 장소리스트
  onSubmit: (payload: CourseCreatePayload) => void; // 입력 완료시 서버에 보낼 데이터를 전달하는 콜백
}

//          component: 코스 장소 등록 컴포넌트          //
export default function CoursePlaceCreate({  onCancel, places, onSubmit,}: CoursePlaceCreateProps) {

  //          states: 폼 데이터 상태 관리          //
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  
  //          event handler: 장소 등록 이벤트 핸들러          //
  // 폼 제출시 실행 입력된 값으로 payload 객체 생성 후 실행
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const payload: CourseCreatePayload = {
      course_name: name.trim(),
      course_category: category.trim(),
      course_description: description.trim(),
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

      {/* 패널 타이틀 */}
      <div className="text-[13px] font-bold leading-8">장소 리스트</div>
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-gray-900 mb-4">
        {places.length === 0 ? (
          <li className="text-[12px] text-gray-400">선택된 장소가 없음</li>
        ) : (
          places.map((p, idx) => (
            <li key={p.id} className="flex items-center gap-1.5">
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-[14px]">{idx + 1}.</span>
                  <span className="text-[14px] text-gray-900 truncate max-w-[12rem]">
                    {p.name}
                  </span>
                </div>
                {/* 서브라벨이 필요하면 카테고리/태그를 붙이고, 지금은 더미 */}
                <span className="text-[12px] text-gray-400 self-end">카테고리</span>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* 일정 요약 */}
      <div className="grid grid-cols-[auto_1fr]  gap-x-4 gap-y-2 items-start mb-4">
        <label className="text-[13px] font-bold leading-8">코스 소요 시간</label>
        <div className="flex items-center gap-8 text-[13px]">
          <div className="text-gray-500">3시간</div>
        </div>
      </div>

      {/* 코스 이름 */}
      <div className="grid grid-cols-[auto_1fr]  font-bold  gap-x-4 gap-y-2 items-start mb-3">
        <label htmlFor="course-name" className="text-[13px] leading-9">코스 이름</label>
        
        <input
          id="course-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예) 빵길"
          className="h-9 w-full rounded-xl bg-main-100 px-3 text-[14px] outline-none focus:ring-2 focus:ring-main-200/50"
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
          className="h-9 w-full rounded-xl bg-main-100 px-3 text-[14px] outline-none focus:ring-2 focus:ring-main-200/50"
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
          className="w-full h-40 md:h-48 rounded-2xl bg-main-100 px-3 py-2 text-[14px] outline-none resize-none focus:ring-2 focus:ring-main-200/50"
        />
      </div>
    </section>
  );
}