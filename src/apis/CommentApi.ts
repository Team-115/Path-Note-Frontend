import { api } from "./ApiHeaderUtil";
// 댓글 등록: POST /api/courses/{courseId}/comments
export const postCommentRequest = async (courseId: number, content: string): Promise<{content : string}> => {
  const { data } = await api.post<{content: string}>(
    `/api/courses/${courseId}/comments`,
    {content}    
  );
  return data;
};