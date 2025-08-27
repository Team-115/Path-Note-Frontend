import { useSearchStore } from "../stores/SearchStores";
import type { POIResult } from "../stores/SearchStores";
import { useMapStore } from "../stores/MapStores";

//          component: 검색 결과 컴포넌트          //
const SearchResults = () => {
  const { 
    searchResults, 
    isResultsVisible, 
    setSelectedPOI, 
    setIsResultsVisible 
  } = useSearchStore();

  const { moveToLocation } = useMapStore();

  //          event handler: 검색 결과 장소 클릭시 이벤트 핸들러          //
  const handlePOIClick = (poi: POIResult) => {
    setSelectedPOI(poi);
    moveToLocation(poi.lat, poi.lng);

    console.log('[RESULT CLICK]', poi);

    setIsResultsVisible(false);
  };

  //          event handler: 검색 결과 창 외부 클릭시 이벤트 핸들러          //
  const handleOverlayClick = () => {
    setIsResultsVisible(false);
  };

  if (!isResultsVisible || searchResults.length === 0) {
    return null;
  }

  //          render: 검색 결과 컴포넌트 랜더링          //
  return (
    <div className="fixed inset-0 z-40" onClick={handleOverlayClick}>
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md mx-4 z-50">
        <div className="bg-white/85 rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">검색 결과</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {searchResults.map((poi, index) => (
              <div
                key={`${poi.id}-${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePOIClick(poi);
                }}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-main-200/70 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {poi.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {poi.address}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <svg 
                      className="w-4 h-4 text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-200 text-center">
            <button
              onClick={handleOverlayClick}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;