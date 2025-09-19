import { FaClock, FaMapMarkerAlt, FaStore, FaTag } from "react-icons/fa";
import type { CourseData } from "../types/course";
import type { PlacesData } from "../types/places";

type Props = {
  course: CourseData | null;
  places: PlacesData[];
};

// 왼쪽 컴포넌트 (코스에 담긴 장소 정보들)
export default function CoursePlaces({ course, places }: Props) {
  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[800px] text-gray-400 text-sm">
        코스를 선택해주세요.
      </div>
    );
  }

return (
  <div>
    <h2 className="text-xl font-bold mb-4">{course.course_name}</h2>

    {places.length === 0 ? (
      <div className="text-sm text-gray-400">장소가 없습니다.</div>
    ) : (
      <div className="space-y-4">
        {places.map((place) => (
          <div
            key={place.poi_id}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200 space-y-2 text-sm"
          >
            <div className="flex items-center gap-2">
              <FaStore className="text-[20px] text-gray-500 translate-y-[1px]" aria-hidden />
              <span>{place.place_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-[20px] mt-0.5 -translate-x-0.5 text-gray-500" aria-hidden />
              <span>{place.place_address}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaTag className="text-[18px] text-gray-500 translate-y-[1px]" aria-hidden />
              <span>{place.place_category}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="flex h-8 items-center justify-center text-gray-500 text-[18px]"/>
              <span>
                출발 : {new Date(place.place_enter_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span>
                / 도착 : {new Date(place.place_leave_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)};
