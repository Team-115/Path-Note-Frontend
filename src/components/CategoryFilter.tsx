import { useState } from "react";

const categories = ['서울', '인천', '대전', '대구', '광주', '부산', '+'];
const plus = ['경기도', '강원도', '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', '울산', '제주도'];

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const [showPlus, setShowPlus] = useState(false);
  const leftPlus = plus.slice(0, 5);
  const rightPlus = plus.slice(5);

  const handleClick = (category: string) => {
    if (category === '+') {
      setShowPlus(!showPlus);
      onSelect('+');
      return;
    }
    setShowPlus(false);
    onSelect(category);
  };

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex justify-center gap-3 py-4 rounded-full" style={{ width: 'fit-content' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleClick(cat)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all
              ${selected === cat
                ? 'bg-main-200/70 text-white backdrop-blur-md'
                : 'bg-white/70 text-black hover:bg-main-100 hover:text-white font-semibold backdrop-blur-md'}
            `}
          >
            {cat}
          </button>
        ))}
      </nav>

      {showPlus && (
        <div className="absolute left-full top-4 ml-2 p-4 rounded-xl bg-white/70 backdrop-blur-md shadow-md flex gap-5 border border-main-200">
          <div className="flex flex-col gap-2">
            {leftPlus.map((region) => (
              <p
                key={region}
                onClick={() => {
                  onSelect(region);
                  setShowPlus(false);
                }}
                className={`text-sm font-semibold whitespace-nowrap cursor-pointer select-none
                  ${selected === region ? 'text-white bg-main-200/70 rounded px-2 py-1' : 'text-black hover:text-main-200'}
                `}
              >
                {region}
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {rightPlus.map((region) => (
              <p
                key={region}
                onClick={() => {
                  onSelect(region);
                  setShowPlus(false);
                }}
                className={`text-sm font-semibold whitespace-nowrap cursor-pointer select-none
                  ${selected === region ? 'text-white bg-main-200/70 rounded px-2 py-1' : 'text-black hover:text-main-200'}
                `}
              >
                {region}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
