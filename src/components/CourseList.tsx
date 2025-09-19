import { FaClock, FaStore, FaTag } from "react-icons/fa";
import type { CourseData } from "../types/course";

type Props = {
  course: CourseData;
  onSelect: (course: CourseData) => void; // CourseData 객체를 인자로 받고 반환값은 없어.(상태 변경 같은 작업은 하지만 호출 결과로 값을 돌려주지는 x)
};

// 오른쪽 컴포넌트(코스 리스트 + 코스 선택)
export default function CourseList({ course, onSelect }: Props) {
  return (
    <div
      className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-md border border-gray-200 hover:bg-gray-100 cursor-pointer mt-4"
      onClick={() => onSelect(course)}
    >
      <img src={course.imgSrc} alt={course.course_name} className="w-24 h-20 object-cover rounded" />
      <div className="flex flex-col justify-between h-20">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <FaStore className="text-[20px] text-gray-500 translate-y-[1px]" aria-hidden />
          {course.course_name}
        </h3>
        <div className="flex items-center gap-2 text-sm mt-1 text-gray-500">
          <FaTag className="text-[16px] text-gray-500 translate-y-[1px]" aria-hidden />
          {course.course_category?.content}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FaClock className="flex h-8 items-center justify-center text-gray-500 text-[18px]"/>
          {course.created_at?.substring(0, 10)}
        </div>
      </div>
    </div>
  );
}
