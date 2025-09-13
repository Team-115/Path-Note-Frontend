// 유틸: 서버 문자열을 HH:mm로 정규화
export const toHHmm = (s?: string | null) => {
  if (!s) return "";
  const t = s.trim();

  // "YYYY-MM-DD HH:mm"
  const spaceIdx = t.indexOf(" ");
  if (spaceIdx > 0 && /^\d{4}-\d{2}-\d{2}/.test(t)) {
    const timePart = t.slice(spaceIdx + 1);
    return /^\d{2}:\d{2}/.test(timePart) ? timePart.slice(0, 5) : "";
  }

  // ISO "YYYY-MM-DDTHH:mm[:ss]"
  const tIdx = t.indexOf("T");
  if (tIdx > 0 && /^\d{4}-\d{2}-\d{2}/.test(t)) {
    const timePart = t.slice(tIdx + 1);
    return /^\d{2}:\d{2}/.test(timePart) ? timePart.slice(0, 5) : "";
  }

  // 이미 HH:mm인 경우
  if (/^\d{2}:\d{2}$/.test(t)) return t;

  return "";
};
