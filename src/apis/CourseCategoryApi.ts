// apis/category.ts
import axios from "axios";
const API_BASE_URL = "http://localhost:8080";

export type CategoryDTO = { category_id: number; content: string };

export async function fetchCategoriesByPrefix(q: string): Promise<CategoryDTO[]> {
  if (!q) return [];
  const { data } = await axios.get<CategoryDTO[]>(
    `${API_BASE_URL}/api/categories/${encodeURIComponent(q)}`
  );
  return data;
}
