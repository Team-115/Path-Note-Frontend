// utils/buildCourseCreateRequest.ts
import type { CourseCreateRequestDto, CoursePlaceDto } from "../types/CoursePlaceDto";
import type { CoursePlaceType } from "../types/CoursePlaceType";

//          function: 코스 생성 최종 요청 DTO 빌더 함수          //
export function buildCourseCreateRequest(
  userId: string,
  payload: { course_name: string; course_category: string; course_description: string; },
  places: CoursePlaceType[],
): CourseCreateRequestDto {
  const course_places: CoursePlaceDto[] = places.map((p, idx) => ({
    poi_id: String(p.id),                        // 서버 스키마에 맞게 문자열
    sequence_index: idx + 1,
    place_name: p.name,
    place_category: p.category ?? "",            // 없으면 빈 문자열
    place_address: p.address ?? "",
    place_coordinate_x: String(p.lng),           // X=경도(lng)
    place_coordinate_y: String(p.lat),           // Y=위도(lat)
    place_enter_time: p.arrivalTime || "",       // "yyyy-MM-dd HH:mm" 포맷이면 그대로
    place_leave_time: p.departureTime || "",
  }));

  return {
    user_id: userId,
    course_name: payload.course_name,
    course_category: payload.course_category,
    course_description: payload.course_description,
    course_places,
  };
}
