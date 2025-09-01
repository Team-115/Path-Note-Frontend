import { useRef } from "react";
import { FaRegPaperPlane, FaHashtag } from "react-icons/fa";
import { MdOutlineKeyboardDoubleArrowRight, MdOutlineKeyboardDoubleArrowLeft} from "react-icons/md";
import { FcClock } from "react-icons/fc";
import type { CourseData } from "../types/course";
import type { PlacesData } from "../types/places";

interface CategoryPlaceCardProps {
  course: CourseData[];
}

export default function CategoryPlaceCard({ course }: CategoryPlaceCardProps) {
  if (course.length === 0) return null;
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollNext = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const scrollBack = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-[1800px] flex items-center gap-4">
       <button
        onClick={scrollBack}
        className="p-3 bg-white rounded-full shadow hover:bg-gray-100"
        aria-label="이전 카드 보기"
      >
        <MdOutlineKeyboardDoubleArrowLeft className="text-3xl" />
      </button>
      <div
        ref={containerRef}
        className="overflow-x-auto flex gap-6 flex-grow scrollbar-hide"
        style={{ scrollSnapType: "x mandatory" }}
      >
      {course.map((courseItem) => (
        <div
          key={courseItem.course_id}
          className="min-w-[280px] bg-white/80 p-4 rounded-4xl shadow-md border border-gray-200"
        >
          <p className="font-bold mb-2 flex items-center gap-3"><FaRegPaperPlane className="size-4"/>{courseItem.course_name}</p>
          <p className="text-sm mb-2 flex items-center gap-3"><FcClock className="size-4"/>{courseItem.time}</p>
          <p className="text-xs text-gray-700 mb-2 flex items-center gap-3"><FaHashtag className="size-3.5 text-main-300"/>{courseItem.tags}</p>
          <hr className="border-t border-gray-300 my-2" />
          <div className="text-sm">
              <p className="font-semibold">방문 장소:</p>
              <ul className="list-inside">
                {courseItem.course_places.map((place: PlacesData) => (
                  <li key={place.poi_id}>
                    🚩 {place.place_name}
                  </li>
                ))}
              </ul>
            </div>
        </div>
      ))}
      </div>
      <button
        onClick={scrollNext}
        className="p-3 bg-white rounded-full shadow hover:bg-gray-100"
        aria-label="다음 카드 보기"
      >
        <MdOutlineKeyboardDoubleArrowRight className="text-3xl" />
      </button>
    </div>
  );
}
