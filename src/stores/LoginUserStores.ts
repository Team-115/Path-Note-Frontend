import { create } from "zustand";
import type { UserType } from "../types/UserType";

// 스토어에 어떤 상태와 메서드가 들어가는지 명시
interface LoginUserStore {
    // 현재 로그인한 사용자 정보
    loginUser: UserType | null;
    // 사용자 정보를 스토어에 저장하는 함수 
    setLoginUser: (loginUser: UserType) => void;
    // 로그인 정보를 초기화하는 함수
    resetLoginUser: () => void;
}

// 스토어 생성
const useLoginUserStore = create<LoginUserStore>((set) => ({
    loginUser: null,
    // 외부에서 User객체를 받아서 상태를 갱신
    setLoginUser: (loginUser) => set({ loginUser }),
    // LoginUser 값을 null로 로그아웃 기능 수행
    resetLoginUser: () => set({ loginUser: null }),
}));

export default useLoginUserStore;