import { useState, useEffect } from 'react';
import { searchPOI } from '../services/PoiServices';
import { useSearchStore } from '../stores/SearchStores';
import SearchResults from './SearchResults';
import { useMapStore } from '../stores/MapStores';
import { KAKAO_LOG_IN_URL, getSignInUserRequest } from '../apis/GetUserInfoApi';
import useLoginUserStore from '../stores/LoginUserStores';
import { useNavigate, useLocation } from 'react-router';
import axios from 'axios';
import type { CourseData } from '../types/course';

//          component: 헤더 컴포넌트          //
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCourseBoardPage = location.pathname.includes('/courseboard');
  const [sortType, setSortType] = useState<'A' | 'R'>('A'); // A: 정확도순, R: 거리순
  const { center } = useMapStore();
  const { setLoginUser, resetLoginUser, loginUser } = useLoginUserStore();
  const {
    keyword,
    isSearching,
    setKeyword,
    setSearchResults,
    setCourseResults,
    setIsSearching,
    setIsResultsVisible
  } = useSearchStore();

  const goToHome = () => {
    navigate('/'); // 홈 페이지로 이동
  };

  const goToCourseBoard = () => {
    navigate('/courseboard'); // CourseBoard 페이지로 이동
  };

  //          effect: OAuth 리다이렉트후 토큰회수 -> 로컬스토리지 저장 -> 사용자 정보 저장          //
  /**
   * 1. 로그인후 리다이렉트 된 URL 쿼리스트링에서 accessToken에서 토큰을 회수한다.
   * 2. 토큰을 로컬스토리지에 저장
   * 3. 토큰을 사용하여 /me 백엔드 호출 -> 전역 스토어에 로그인 사용자 정보 저장
   */
  useEffect(() => {
    (async () => {
      // 1) URL 쿼리에서 accessToken 회수
      const url = new URL(window.location.href);
      const tokenFromQuery = url.searchParams.get("accessToken");

      if (tokenFromQuery) {
        // 1-1) 저장
        localStorage.setItem("accessToken", tokenFromQuery);
        // 1-2) 주소창에서 토큰 제거(보안/UX)
        url.searchParams.delete("accessToken");
        url.searchParams.delete("refreshToken"); // 넘어왔다면 같이 제거
        window.history.replaceState({}, "", url.pathname + url.search);
      }

      // 2) 최종 사용할 토큰 결정: 쿼리 > localStorage
      const token = tokenFromQuery ?? localStorage.getItem("accessToken");
      if (!token) return;

      // 3) /me 호출 → 스토어 저장
      try {
        const me = await getSignInUserRequest(token);
        setLoginUser(me);
        console.log("[AUTH] /me ok:", me);
      } catch (e) {
        console.error("[AUTH] /me failed:", e);
        // 토큰이 만료/위조면 정리
        localStorage.removeItem("accessToken");
        resetLoginUser();
      }
    })();
  }, [setLoginUser, resetLoginUser]);

  //          event handler: 카카로 로그인 버튼 클릭시 이벤트 핸들러          //
  const onKakaoLoginButtonClickHandler = () => {
    window.location.href = KAKAO_LOG_IN_URL();
  };

  //          event handler: 카카오 로그아웃 버튼 클릭시 이벤트 핸들러          //
  const onLogoutButtonClickHandler = () => {
    localStorage.removeItem("accessToken");
    resetLoginUser();
    // 필요하면 리다이렉트
    // window.location.href = "/";
  };

  //          event handler: 장소 검색 이벤트 핸들러          //
  /**
   * 현재 keyword/정렬/중심좌표를 바탕으로 searchPOI 서비스 호출
   * 성공: 결과 저장 및 결과 패널 오픈 / 실패: 에러 처리 / 종료: 로딩 플래그 해제
   */
  const handleSearch = async () => {
    const kw = keyword.trim();
    if (!kw) return;

    setIsSearching(true);
    try {
      if (isCourseBoardPage) {
        const response = await axios.post(`/api/search/courses`, { keyword: kw });
        const convertedResults: CourseData[] = response.data.map((course: any) => ({
          course_id: course.course_id,
          course_name: course.course_name,
          time: "07:30 ~ 08:00",
          duration: "30분",
          tags: "#대학생 #대전 #일상 #IoT",
          imgSrc: "src/images/school.png",
          description: course.course_description,
        }));
        setCourseResults(convertedResults);
        setSearchResults([]);
      } else {
        const results = await searchPOI(
          sortType,
          kw,
          sortType === 'R' ? center : undefined,  // R일 때만 중심좌표 사용
          10,
          sortType === 'R' ? 1 : 0                // R: 1km, A: 의미 없음
        );
        setSearchResults(results);  
        setCourseResults([]);
      }

      setIsResultsVisible(true);  // 0건이면 "결과 없음" UI 처리 권장
    } catch (error) {
      console.error('검색 실패:', error);
      // 여기서만 진짜 에러(4xx/5xx) 안내
      alert('요청 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  //           event handler: 검색창 Enter 키입력 처리          //
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  //          render:헤더 컴포넌트 랜더링          //
  return (
    <>
      <header className="fixed rounded-full mx-5 max-h-16 top-3 left-1 right-1 z-150 backdrop-blur-xs bg-white/15 shadow-sm hover:shadow-lg border-b border-gray-200 transition-all hover:bg-white/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 로고 */}
            <div className="flex items-center">
              <button onClick={goToHome} className="text-lg font-bold text-main-200 hover:text-main-500 hover:cursor-pointer">
                P A T H N O T E
              </button>
            </div>

            {/* 검색바 */}
            <div className="md:flex flex-1 max-w-lg mx-8">
              <div className="flex items-center gap-2 w-full">
                {/* 정렬 선택 버튼 */}
                {!isCourseBoardPage && (
                  <div className="hidden md:flex rounded-full bg-main-100/55 p-1">
                    <button
                      onClick={() => setSortType('A')}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        sortType === 'A'
                          ? 'bg-white/60 text-main-300 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      정확도순
                    </button>
                    <button
                      onClick={() => setSortType('R')}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        sortType === 'R'
                          ? 'bg-white/60 text-main-300 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      거리순
                    </button>
                  </div>
                )}

                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder={isCourseBoardPage ? "코스를 검색하세요..." : "장소를 검색하세요..."}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsResultsVisible(true)}
                    className="w-full px-4 py-2 pr-10 bg-main-100/55 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-mian-300 focus:border-transparent"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-main-100 hover:text-gray-600 disabled:opacity-50"
                  >
                    {isSearching ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            {/* 코스게시판 버튼 */}
            <button
              onClick={goToCourseBoard}
              className="text-sm text-gray-700 hover:text-gray-900 hover:cursor-pointer"
            >
              코스게시판
            </button>
            {/* 로그인/회원가입 버튼 */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {loginUser ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700">
                      {loginUser.nickname ?? "사용자"}
                    </span>
                    <button
                      onClick={onLogoutButtonClickHandler}
                      className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <img
                    src = "src/images/kakao_login_small.png"
                    onClick={onKakaoLoginButtonClickHandler}
                    className=''
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <SearchResults/>
    </>
  );
};

export default Header;