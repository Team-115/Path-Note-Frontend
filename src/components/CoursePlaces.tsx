import { IoStorefrontOutline } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaTags } from "react-icons/fa6";
import { FcClock } from "react-icons/fc";
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
              <IoStorefrontOutline className="text-2xl" />
              <span>{place.place_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-2xl text-red-400" />
              <span>{place.place_address}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaTags className="text-2xl text-blue-400" />
              <span>{place.place_category}</span>
            </div>
            <div className="flex items-center gap-2">
              <FcClock className="text-2xl" />
              <span>
                입장 시간: {new Date(place.place_enter_time).toLocaleTimeString()}
              </span>
              <span>
                퇴장 시간: {new Date(place.place_leave_time).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)};
