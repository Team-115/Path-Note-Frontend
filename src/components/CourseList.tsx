import { FaRegPaperPlane } from "react-icons/fa";
import { FcClock } from "react-icons/fc";

export type CourseData = {
  title: string;
  time: string;
  duration: string;
  tags: string;
  imgSrc: string;
};

type Props = {
  course: CourseData;
  onSelect: (course: CourseData) => void;
};

export default function CourseList({ course, onSelect }: Props) {
  return (
    <div
      className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-md border border-gray-200 hover:bg-gray-100 cursor-pointer"
      onClick={() => onSelect(course)}
    >
      <img src={course.imgSrc} alt={course.title} className="w-24 h-20 object-cover rounded" />
      <div className="flex flex-col justify-between h-20">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <FaRegPaperPlane />
          {course.title}
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
