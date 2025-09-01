import { useState, useEffect } from 'react';
import axios from 'axios';
import type { CourseData } from '../types/course';
import CategoryFilter from './CategoryFilter';
import CategoryPlaceCard from './CategoryPlaceCard';
import Swal from 'sweetalert2';

export default function MapWithCategory() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [courseList, setCourselist] = useState<CourseData[]>([]);

  // 선택된 카테고리에 해당하는 코스를 필터링
  const filteredCourses = selectedCategory
    ? courseList.filter(course =>
        // course_places 배열에서 place_address에 '서울'이 포함된 경우 필터링
        course.course_places.some((place: { place_address: string | string[]; }) => place.place_address.includes(selectedCategory))
      )
    : courseList;

  useEffect(() => {
    if (selectedCategory && selectedCategory !== '+') {
      (async () => {
        try {
          const response = await axios.get(`/api/courses?region=${selectedCategory}`);
          
          console.log('API Response:', response.data); // 응답 확인

          // 응답이 정상적인지 체크하고 courses 배열로 처리
          if (Array.isArray(response.data)) {
            const convertedCourses: CourseData[] = response.data.map((course: any) => ({
              course_id: course.course_id,
              course_name: course.course_name,
              time: "07:30 ~ 08:00",       // 임의 데이터
              duration: "30분",            // 임의 데이터
              tags: "#대학생 #대전 #일상 #IoT", // 임의 데이터
              imgSrc: "src/images/school.png", // 임의 이미지
              description: course.course_description,
              category: course.course_category,
              course_places: course.course_places, // course_places 추가
            }));
            setCourselist(convertedCourses);
          } else {
            console.error('Courses data is not available or invalid.');
          }
        } catch (error) {
          Swal.fire({
              icon: 'error',
              title: '해당 지역에 해당하는\n 코스가 없습니다.',
              text: '다른 카테고리를 선택해 주세요.',
            });
        }
      })();
    }
  }, [selectedCategory]);

  // 필터된 데이터 확인
  console.log('Filtered Courses:', filteredCourses);

  return (
    <>
      <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
      <CategoryPlaceCard course={filteredCourses} /> {/* 필터된 데이터를 CategoryPlaceCard에 전달 */}
    </>
  );
}
