import { IoStorefrontOutline } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaTags } from "react-icons/fa6";
import { FcClock } from "react-icons/fc";
import type { CourseData } from "./CourseList";

type Props = {
  course: CourseData | null;
};

export default function CoursePlaces({ course }: Props) {
  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[800px] text-gray-400 text-sm">
        코스를 선택해주세요.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{course.title}</h2>
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <IoStorefrontOutline className="text-2xl" />
          <span>대전대학교</span>
        </div>
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-2xl text-red-400" />
          <span>대전 동구 용운동</span>
        </div>
        <div className="flex items-center gap-2">
          <FaTags className="text-2xl text-blue-400" />
          <span>대학교</span>
        </div>
        <div className="flex items-center gap-2">
          <FcClock className="text-2xl" />
          <span>출발 시간 :</span>
          <span className="ml-0.5 px-2 py-1 bg-gray-200 rounded text-xs">7:30</span>
        </div>
      </div>
    </div>
  );
}
