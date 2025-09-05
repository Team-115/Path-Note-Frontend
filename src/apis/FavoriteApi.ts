// src/apis/FavoriteApi.ts
import { api } from "./ApiHeaderUtil";

// 백엔드 POST 응답 형태(LikeDTO) — 실제 필드명에 맞춰 조정
type LikeDTO = {
  liked: boolean;     // 서버에서 true/false 내려줌
  likeCount: number;  // 서버에서 최신 카운트 내려줌
};

// 좋아요 수 조회: GET /api/courses/{courseId}/likes
// 백엔드가 Long(숫자 하나)로 반환하므로 number로 받는다.
export const getFavoriteCountRequest = async (courseId: number): Promise<number> => {
  const { data } = await api.get<number>(`/api/courses/${courseId}/likes`);
  // 혹시나 서버가 나중에 {likeCount: n} 으로 바꾸더라도 안전하게 처리
  // @ts-expect-error 런타임 방어
  return typeof data === "number" ? data : Number(data?.likeCount ?? 0);
};

// 좋아요 등록/삭제(토글): POST /api/courses/{courseId}/likes
// 서버가 LikeDTO를 반환
export const postFavoriteRequest = async (courseId: number): Promise<LikeDTO> => {
  const { data } = await api.post<LikeDTO>(`/api/courses/${courseId}/likes`);
  return data;
};

// 과거 좋아요 여부: GET /api/courses/{courseId}/like
// 서버가 boolean을 반환
export const getIsLikedRequest = async (courseId: number): Promise<boolean> => {
  const { data } = await api.get<boolean>(`/api/courses/${courseId}/like`);
  return !!data;
};
