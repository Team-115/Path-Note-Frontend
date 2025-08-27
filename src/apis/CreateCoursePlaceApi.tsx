import axios from 'axios';
import type {CourseCreateRequestDto} from "../types/CoursePlaceDto";

const API_BASE_URL = "http://localhost:8080"; // 실제 서버 주소로 교체

export const createCourse = async (requestBody: CourseCreateRequestDto, accessToken: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/courses`,   // 실제 엔드포인트에 맞게 수정
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // JWT 토큰 사용 시
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
