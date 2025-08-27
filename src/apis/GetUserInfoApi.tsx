import axios from "axios";
import type { UserType } from "../types/UserType";

const API_DOMAIN = 'http://localhost:8080'

/** 카카오 로그인 백엔드에 최초 요청 URL 함수
 *  백엔드(Spring Security OAuth2 Client)가 제공하는 인증 엔드포인트로 리다이렉트한다.
 *  클릭 시 백엔드가 카카오 OAuth 서버로 자동 연결
 */
export const KAKAO_LOG_IN_URL = () => `${API_DOMAIN}/oauth2/authorization/kakao`

/**
 * 현재 로그인된 사용자 정보 조회 요청
 * accessToken을 인자로 받아 /api/users/me API 호출
 * 응답으로 UserType 형태의 객체를 반환한다
 */
export const getSignInUserRequest = async (token: string): Promise<UserType> => {
  const response = await axios.get(`${API_DOMAIN}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  });
  return response.data;
};

