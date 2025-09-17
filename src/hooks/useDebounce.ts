import { useEffect, useState } from "react";
/**
 * useDebounce
 * 입력값이 짧은 시간 안에 계속 바뀔 때 마지막 변경 후 일정 시간(delay) 지나서야 값을 반영해 주는 훅.
 * 검색어 자동완성, 실시간 필터링, 윈도우 리사이즈 처리 같은 데서 불필요한 연산/네트워크 호출을 줄이는 목적.
 *
 * 제네릭 <T>
 * - 어떤 타입이든 그대로 받아서 같은 타입으로 반환해 주려고 제네릭을 사용.
 *   예) string, number, boolean, 객체, 배열 등 모두 가능.
 */
export const useDebounce = <T,>(value: T, delay = 300) => {
  //           state: 디바운스 된 값 보관 상태          //
  
  const [debounced, setDebounced] = useState<T>(value);      // 초기 값을 즉시 value로 두기 때문에 첫 렌더에서는 지연 없이 그대로 노출된다.

  //          effect: 값, 지연 변경시 새로운 타이머 시작          //
  useEffect(() => {
    
    const id = setTimeout(() => setDebounced(value), delay); // 타이머 예약: delay가 지나면 최신 value를 debounced에 반영
    
    return () => clearTimeout(id);                           // cleanup: 다음 렌더 전에 이전 타이머 취소(중복 실행/메모리 누수 방지)
  }, [value, delay]);

  return debounced;                                          // “디바운스된 값”만 돌려준다.
};
