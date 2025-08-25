import { FaRegPaperPlane, FaHashtag } from "react-icons/fa";
import { FcClock } from "react-icons/fc";
import type { CourseData } from "../types/course";

type Props = {
  course: CourseData | null;
};

export default function CourseDetail({ course }: Props) {
  if (!course) {
    return (
      <p className="text-center text-gray-400 text-sm">코스를 선택해주세요.</p>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{course.course_name}</h2>
        <div className="space-x-2">
          <button className="px-2 py-1 bg-main-200 hover:bg-main-300 text-sm text-white rounded">수정</button>
          <button className="px-2 py-1 bg-main-200 hover:bg-main-300 text-sm text-white rounded">삭제</button>
        </div>
      </div>
      <img src={course.imgSrc} alt={course.course_name} className="rounded mb-2 mt-5 mx-auto w-130" />

      <div className="flex justify-between mt-5 w-full">
        <div className="flex items-center gap-2 flex-1 justify-center">
          <FaRegPaperPlane className="text-2xl" />
          <span>{course.course_name}</span>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-center">
          <FcClock className="text-2xl" />
          <span>소요 시간</span>
          <span className="text-gray-400 text-xs">
            {course.time} / {course.duration}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-center">
          <FaHashtag className="text-2xl text-blue-400" />
          <span>{course.tags}</span>
        </div>
      </div>

      <div
        className="mt-5 p-4 h-90 rounded-lg bg-opacity-50 shadow-md border border-gray-200 space-y-3 text-sm"
        style={{ backgroundColor: "oklch(0.7928 0.0216 248.1 / 0.3)" }}
      >
        {course.description}
      </div>
    </div>
  );
}
