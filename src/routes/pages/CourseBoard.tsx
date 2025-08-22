import { useState, useEffect } from "react";
import CourseList, { type CourseData } from "../../components/CourseList";
import CoursePlaces from "../../components/CoursePlaces";
import CourseDetail from "../../components/CourseDetail";
import axios from "axios";

export default function CourseBoard() {
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [courseList, setCourselist] = useState<CourseData[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const rawCourses = await axios.get("/api/courses");
        console.log("API응답 데이터 : ", rawCourses.data);
        const convertedCourses: CourseData[] = rawCourses.data.map((course: any) => ({
        title: course.course_name,
        time: "07:30 ~ 08:00",       // 임의 데이터
        duration: "30분",             // 임의 데이터
        tags: "#대학생 #대전 #일상 #IoT", // 임의 데이터
        imgSrc: "src/images/school.png", // 임의 데이터
      }));
      setCourselist(convertedCourses);
      } catch (error) {
        console.error("API 호출 실패 : ", error);
      }
    })();
  }, []);

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
          <CoursePlaces course={selectedCourse} />
        </div>

        <div className="bg-white rounded-xl bg-opacity-50 shadow-md p-6 col-span-1 flex items-center justify-center">
          <CourseDetail course={selectedCourse} />
        </div>

        <div className="bg-white rounded-xl bg-opacity-50 shadow-md p-6 col-span-1">
          <h2 className="text-xl font-bold mb-4">코스 리스트</h2>
          {courseList.map((course, idx) => (
            <CourseList key={idx} course={course} onSelect={setSelectedCourse} />
          ))}
        </div>
      </div>
    </div>
  );
}
