import { api } from "./ApiHeaderUtil";
// 댓글 등록: POST /api/courses/{courseId}/comments
export const postCommentRequest = async (courseId: number, content: string): Promise<{content : string}> => {
  const { data } = await api.post<{content: string}>(
    `/api/courses/${courseId}/comments`,
    {content}    
  );
  return data;
};

export type CommentResponse = {
  course_id: number;
  comment_id: number;
  content: string;
  created_at: string;
  user: {
    nickname: string;
    profilePresetURL: string;
  };
};

// 댓글 전체 조회 GET /api/courses/{courseId}/comments
export const getCommentsRequest = async (
  courseId: number
): Promise<CommentResponse[]> => {
  const { data } = await api.get<CommentResponse[]>(`/api/courses/${courseId}/comments`);
  return data;
};