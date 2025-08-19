import { useState } from 'react';
import { searchPOI } from '../services/PoiServices';
import { useSearchStore } from '../stores/SearchStores';
import SearchResults from './SearchResults';
import { useMapStore } from '../stores/MapStores';

const Header = () => {
  const [sortType, setSortType] = useState<'A' | 'R'>('A'); // A: 정확도순, R: 거리순
  const { center } = useMapStore();
  const { 
    keyword, 
    isSearching, 
    setKeyword, 
    setSearchResults, 
    setIsSearching,
    setIsResultsVisible 
  } = useSearchStore();

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchPOI(sortType, keyword, center, 10);
      setSearchResults(results);
      setIsResultsVisible(true);
    } catch (error) {
      console.error('검색 실패:', error);
      alert('검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <header className="fixed rounded-full max-h-16 top-3 left-1 right-1 z-150 backdrop-blur-xs bg-white/45 shadow-sm hover:shadow-lg border-b border-gray-200 transition-all hover:bg-white/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 로고 */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img src='./logo.png' className='w-28 h-10'/>
              </div>
            </div>

            {/* 검색바 */}
            <div className="md:flex flex-1 max-w-lg mx-8">
              <div className="flex items-center gap-2 w-full">
                {/* 정렬 선택 버튼 */}
                <div className="hidden md:flex rounded-full bg-gray-100 p-1">
                  <button
                    onClick={() => setSortType('A')}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      sortType === 'A' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    정확도순
                  </button>
                  <button
                    onClick={() => setSortType('R')}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      sortType === 'R' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    거리순
                  </button>
                </div>
                
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="장소를 검색하세요..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsResultsVisible(true)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
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

          {/* 로그인/회원가입 버튼 */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button className="ml-3 bg-main-100 hover:bg-main-200 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                회원가입
              </button>
            </div>
          </div>
        </div>
      </div>
      </header>
      
      {/* 검색 결과 */}
      <SearchResults />
    </>
  );
};

export default Header;