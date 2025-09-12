import axios from 'axios';
import type {CourseCreateRequestDto} from "../types/CoursePlaceDto";
import type { GetUpdateCourseDto } from '../types/getUpdateCourseDto';

const API_BASE_URL = "http://localhost:8080"; // 실제 서버 주소로 교체

export const createCourse = async (requestBody: CourseCreateRequestDto, accessToken: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/courses`,   // 실제 엔드포인트에 맞게 수정
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken.trim()}`, // JWT 토큰 사용 시
        },
      }
    );
    console.log("[SUCCESS] 코스 생성 응답:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("[ERROR]", error.response.data);
      return error.response.data;
    } else {
      console.error("[NETWORK ERROR]", error.message);
      return null;
    }
  }
};

export const updateCourse = async (
  courseId: number,
  requestBody: CourseCreateRequestDto, // 또는 CourseRequestDTO
  accessToken: string
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/courses/${courseId}`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken.trim()}`,
        },
      }
    );
    console.log("[SUCCESS] 코스 수정 응답:", response.data);
    return response.data; // 백엔드는 CourseDTO 반환
  } catch (error: any) {
    if (error.response) {
      console.error("[ERROR]", error.response.data);
      return error.response.data;
    } else {
      console.error("[NETWORK ERROR]", error.message);
      return null;
    }
  }
};

export const getCourseDetail = async (courseId: number, accessToken: string) => {
  const { data } = await axios.get<GetUpdateCourseDto>(
    `${API_BASE_URL}/api/courses/${courseId}`,
    { headers: { Authorization: `Bearer ${accessToken.trim()}` } }
  );
  return data;
};
