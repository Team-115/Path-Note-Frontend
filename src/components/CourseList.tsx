import { FaRegPaperPlane } from "react-icons/fa";
import { FcClock } from "react-icons/fc";
import type { CourseData } from "../types/course";

type Props = {
  course: CourseData;
  onSelect: (course: CourseData) => void;
};

// 오른쪽 컴포넌트(코스 리스트 + 코스 선택)
export default function CourseList({ course, onSelect }: Props) {
  return (
    <div
      className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-md border border-gray-200 hover:bg-gray-100 cursor-pointer"
      onClick={() => onSelect(course)}
    >
      <img src={course.imgSrc} alt={course.course_name} className="w-24 h-20 object-cover rounded" />
      <div className="flex flex-col justify-between h-20">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <FaRegPaperPlane />
          {course.course_name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FcClock />
          {course.time} / {course.duration}
        </div>
        <div className="text-sm text-blue-500">{course.tags}</div>
      </div>
    </div>
  );
}
