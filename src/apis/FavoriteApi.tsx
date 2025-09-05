import axios from "axios";

const API_BASE_URL = "http://localhost:8080"; 

type LikeCountResponse = { likeCount: number};

export const getFavoriteCountRequest = async (courseId: number): Promise<number> => {
  const { data } = await axios.get<LikeCountResponse>(
    `${API_BASE_URL}/api/courses/${courseId}/likes`,
    { headers: { Accept: "application/json" } }
  );
  return data.likeCount ?? 0;
};