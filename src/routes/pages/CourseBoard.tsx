import { useState, useEffect } from "react";
import CourseList from "../../components/CourseList";
import type { CourseData } from "../../types/course";
import type { PlacesData } from "../../types/places";
import CoursePlaces from "../../components/CoursePlaces";
import CourseDetail from "../../components/CourseDetail";
import axios from "axios";

export default function CourseBoard() {
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [courseList, setCourselist] = useState<CourseData[]>([]);
  const [places, setPlaces] = useState<PlacesData[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const rawCourses = await axios.get(`/api/courses`);
        const convertedCourses: CourseData[] = rawCourses.data.map((course: any) => ({
          course_id: course.course_id,
          course_name: course.course_name,
          time: "07:30 ~ 08:00",       // 임의
          duration: "30분",
          tags: "#대학생 #대전 #일상 #IoT",
          imgSrc: "src/images/school.png",
          description: course.course_description
        }));
        setCourselist(convertedCourses);
      } catch (error) {
        console.error("API 호출 실패 : ", error);
      }
    })();
  }, []);

  const handleSelectCourse = async (course: CourseData) => {
    setSelectedCourse(course);

    try {
      const response = await axios.get(`/api/courses/${course.course_id}`);
      setPlaces(response.data.coursePlaces || []);
    } catch (error) {
      console.error("코스 상세 불러오기 실패:", error);
      setPlaces([]);
    }
  };

  // const courseList: CourseData[] = [
  //   {
  //     title: "대전대 IoT의 일상",
  //     time: "07:30 ~ 08:00",
  //     duration: "30분",
  //     tags: "#대학생 #대전 #일상 #IoT",
  //     imgSrc: "src/images/school.png",
  //   },
  // ];

  return (
    <div className="p-15 bg-base-100 min-h-screen flex justify-center">
      <div className="w-full max-w-[2000px] grid grid-cols-[1.5fr_2.5fr_1.5fr] gap-8">
        <div className="bg-white rounded-xl bg-opacity-50 shadow-md p-6 col-span-1">
          <CoursePlaces course={selectedCourse} places={places} />
        </div>

        <div className="bg-white rounded-xl bg-opacity-50 shadow-md p-6 col-span-1 flex items-center justify-center">
          <CourseDetail course={selectedCourse} places={places} />
        </div>

        <div className="bg-white rounded-xl bg-opacity-50 shadow-md p-6 col-span-1">
          <h2 className="text-xl font-bold mb-4">코스 리스트</h2>
          {courseList.map((course, idx) => (
             <CourseList key={idx} course={course} onSelect={handleSelectCourse} />
          ))}
        </div>
      </div>
    </div>
  );
}
