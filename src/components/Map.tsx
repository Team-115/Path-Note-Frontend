import { useEffect, useRef } from 'react';

interface MapProps {
  width: string;
  height: string;
}

const Map = ({
  width = '100%',
  height = '400px'
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const {Tmapv3} = window;

  // 지도 초기화
  useEffect(() => {
    if (!Tmapv3 || mapInstanceRef.current) return;

    const initializeMap = () => {
      try {
        const mapOptions = {
          center: new Tmapv3.LatLng(37.56520450, 126.98702028),  // 서울의 위도, 경도
          width: width,  // 지도 너비
          height: height,  // 지도 높이
          zoom: 10  // 초기 줌 레벨
        };

        const map = new Tmapv3.Map('map_div', mapOptions);
        mapInstanceRef.current = map;

        console.log('TMap 지도 초기화 완료');
      } catch (error) {
        console.error('TMap 지도 초기화 실패:', error);
      }
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  },[]);

  return (
    <div>
      <div 
        id="map_div"
        ref={mapRef} 
        style={{ width: '100%', height: '400px' }}  // 지도 크기 설정
        className="w-full h-full"
      />
    </div>
  );
};

export default Map;