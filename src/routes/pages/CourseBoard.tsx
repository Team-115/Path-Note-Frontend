import { useState, useEffect } from "react";
import CourseList from "../../components/CourseList";
import type { CourseData } from "../../types/course";
import type { PlacesData } from "../../types/places";
import CoursePlaces from "../../components/CoursePlaces";
import CourseDetail from "../../components/CourseDetail";
import axios from "axios";
import { useSearchStore } from "../../stores/SearchStores";

export default function CourseBoard() {
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [courseList, setCourselist] = useState<CourseData[]>([]);
  const [places, setPlaces] = useState<PlacesData[]>([]);

  // 검색 상태 가져오기
  const { courseResults, isResultsVisible, clearSearch } = useSearchStore();

  // 코스 리스트 조회
  useEffect(() => { // 컴포넌트가 처음 렌더링 될 때 코스 리스트를 불러오기 위함
    (async () => {  // () 없으면 안됨!! 즉시 실행 함수(IIFE) 형태이기 때문임. 즉, () 빼면 함수만 선언한 꼴이고 그 함수를 실행을 못 해서 api 호출x, 상태 업데이트x
      try {
        const rawCourses = await axios.get(`/api/courses`); // 백엔드 api로부터 코스 리스트 가져옴
        const convertedCourses: CourseData[] = rawCourses.data.map((course: any) => ({  // 백엔드 응답 데이터를 프론트에서 사용하는 형태로 변환
          course_id: course.course_id,
          course_name: course.course_name,
          time: "07:30 ~ 08:00",       // 임의
          duration: "30분",
          tags: "#대학생 #대전 #일상 #IoT",
          imgSrc: "src/images/school.png",
          description: course.course_description
        
        }));
        setCourselist(convertedCourses);  // 변환된 코스 리스트를 상태에 저장
      } catch (error) {
        console.error("API 호출 실패 : ", error);
      }
    })();
  }, []); // []빈배열 : 마운트 시 딱 한 번 실행

  // 코스 단건 조회
  const handleSelectCourse = async (course: CourseData) => {
    setSelectedCourse(course);
    try {
      const response = await axios.get(`/api/courses/${course.course_id}`); // 백엔드 api로부터 코스의 상세 데이터 가져옴.
      setPlaces(response.data.course_places || []);
    } catch (error) {
      console.error("코스 상세 불러오기 실패:", error);
      setPlaces([]);
    }
  };

  // 코스보드 페이지를 벗어날 때 검색 결과 초기화
  useEffect(() => {
    return () => {
      clearSearch();
    };
  }, []);

  return (
    <div className="p-15 bg-base-100 min-h-screen flex justify-center">
      <div className="w-full max-w-[2000px] grid grid-cols-[1.5fr_2.5fr_1.5fr] gap-8 mt-11">
        <div className="bg-white rounded-xl bg-opacity-50 shadow-md p-6 col-span-1">
          <CoursePlaces course={selectedCourse} places={places} />
        </div>

        <div className="bg-white rounded-xl bg-opacity-50 shadow-md p-6 col-span-1 flex items-center justify-center">
          <CourseDetail course={selectedCourse} />
        </div>

        <div className="bg-white rounded-xl bg-opacity-50 shadow-md p-6 col-span-1">
          {/* 검색 결과가 있을 때만 검색 결과를 보여줌 */}
          {isResultsVisible && courseResults.length > 0 ? (
            <div className="h-full overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">검색 결과</h2>
              {courseResults.map((course, idx) => (
                <CourseList key={idx} course={course} onSelect={handleSelectCourse} />
              ))}
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4">코스 리스트</h2>
              {courseList.map((course, idx) => (
                <CourseList key={idx} course={course} onSelect={handleSelectCourse} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}