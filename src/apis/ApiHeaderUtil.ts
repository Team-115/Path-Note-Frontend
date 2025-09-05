// src/libs/api.ts
import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE_URL,   // 항상 백엔드로 보냄
  withCredentials: false,  // JWT Bearer면 false, 세션이면 true
});

// 요청 인터셉터: Bearer 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")?.trim();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 401이면 브라우저 네비게이션으로 로그인 시작
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao`;
      return;
    }
    return Promise.reject(err);
  }
);
