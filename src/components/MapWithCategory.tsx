import { useState, useEffect } from 'react';
import axios from 'axios';
import type { CourseData } from '../types/course';
import CategoryFilter from './CategoryFilter';
import CategoryPlaceCard from './CategoryPlaceCard';
import Swal from 'sweetalert2';
import { useMapStore } from '../stores/MapStores';

const regionCoordinates = {
  '서울': { lat: 37.5665, lng: 126.9780, zoom: 11 },
  '인천': { lat: 37.4563, lng: 126.7052, zoom: 11 },
  '대전': { lat: 36.3504, lng: 127.3845, zoom: 11 },
  '대구': { lat: 35.8714, lng: 128.6014, zoom: 11 },
  '광주': { lat: 35.1595, lng: 126.8526, zoom: 11 },
  '부산': { lat: 35.1595, lng: 129.0756, zoom: 11 },
  '울산': { lat: 35.5384, lng: 129.3114, zoom: 11 },
  '제주도': { lat: 33.4996, lng: 126.5312, zoom: 10 },
  '경기도': { lat: 37.4138, lng: 127.5183, zoom: 9 },
  '강원도': { lat: 37.8228, lng: 128.1555, zoom: 9 },
  '충청북도': { lat: 36.6357, lng: 127.4917, zoom: 9 },
  '충청남도': { lat: 36.5184, lng: 126.8000, zoom: 9 },
  '전라북도': { lat: 35.7175, lng: 127.1530, zoom: 9 },
  '전라남도': { lat: 34.8161, lng: 126.4630, zoom: 9 },
  '경상북도': { lat: 36.4919, lng: 128.8889, zoom: 9 },
  '경남': { lat: 35.4606, lng: 128.2132, zoom: 9 },
};

export default function MapWithCategory() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [courseList, setCourselist] = useState<CourseData[]>([]);


  const { moveToLocation, setZoom } = useMapStore(); 

  const filteredCourses = selectedCategory
    ? courseList.filter(course =>
        course.course_places.some((place: { place_address: string | string[]; }) => place.place_address.includes(selectedCategory))
      )
    : courseList;

  useEffect(() => {
    if (selectedCategory && selectedCategory !== '+') {
      const coords = regionCoordinates[selectedCategory as keyof typeof regionCoordinates];
      if (coords) {
        moveToLocation(coords.lat, coords.lng);
        setZoom(coords.zoom);
      }
      
      (async () => {
        try {
          const response = await axios.get(`/api/courses?region=${selectedCategory}`);
          
          if (Array.isArray(response.data)) {
            const convertedCourses: CourseData[] = response.data.map((course: any) => ({
              course_id: course.course_id,
              course_name: course.course_name,
              time: "07:30 ~ 08:00",
              duration: "30분",
              tags: "#대학생 #대전 #일상 #IoT",
              imgSrc: "src/images/school.png",
              description: course.course_description,
              category: course.course_category,
              course_places: course.course_places,
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
  }, [moveToLocation, setZoom, selectedCategory]);

  console.log('Filtered Courses:', filteredCourses);

  return (
    <>
      <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
      <CategoryPlaceCard course={filteredCourses} />
    </>
  );
}