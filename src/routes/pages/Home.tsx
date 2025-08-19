import { useState } from "react";
import Map from "../../components/Map"
import { searchPOI } from "../../services/PoiServices";

const Home = () => {
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        const keyword = "대전대";
        const pois = await searchPOI("A", keyword, 10);
        setResults(pois);
    };


   return (
    <div>
      <Map width="100%" height="calc(100vh)" />

      <div className="absolute top-5 left-5 z-50">
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          "대전대" 검색
        </button>
      </div>

      <div className="absolute top-20 left-5 z-50 bg-white p-4 max-h-80 overflow-y-auto rounded shadow w-80">
        <ul className="space-y-2 text-sm">
          {results.map((poi: any, idx: number) => (
            <li key={idx}>
              <span className="font-semibold">{poi.name}</span>
              <br />
              <span className="text-gray-500">
                {poi.newAddressList?.newAddress?.[0]?.fullAddress || "주소 없음"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


export default Home;