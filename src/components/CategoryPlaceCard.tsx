import { useRef } from "react";
import { FaRegPaperPlane, FaHashtag } from "react-icons/fa";
import { MdOutlineKeyboardDoubleArrowRight, MdOutlineKeyboardDoubleArrowLeft} from "react-icons/md";
import { FcClock } from "react-icons/fc";

interface Place {
  id: number;
  category: string;
  title: string;
  time: string;
  tags: string[];
  details: string;
}

interface CategoryPlaceCardProps {
  places: Place[];
}

export default function CategoryPlaceCard({ places }: CategoryPlaceCardProps) {
  if (places.length === 0) return null;
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollNext = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const scrollBack = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-[1800px] flex items-center gap-4">
       <button
        onClick={scrollBack}
        className="p-3 bg-white rounded-full shadow hover:bg-gray-100"
        aria-label="이전 카드 보기"
      >
        <MdOutlineKeyboardDoubleArrowLeft className="text-3xl" />
      </button>
      <div
        ref={containerRef}
        className="overflow-x-auto flex gap-6 flex-grow scrollbar-hide"
        style={{ scrollSnapType: "x mandatory" }} // 스냅 효과 추가 가능
      >
      {places.map(place => (
        <div
          key={place.id}
          className="min-w-[280px] bg-white/80 p-4 rounded-4xl shadow-md border border-gray-200"
        >
          <p className="font-bold mb-2 flex items-center gap-3"><FaRegPaperPlane className="size-4"/>{place.title}</p>
          <p className="text-sm mb-2 flex items-center gap-3"><FcClock className="size-4"/>{place.time}</p>
          <p className="text-xs text-gray-700 mb-2 flex items-center gap-3"><FaHashtag className="size-3.5 text-main-300"/>{place.tags.join(' ')}</p>
          <hr className="border-t border-gray-300 my-2" />
          <p className="text-sm">🚗 {place.details}</p>
        </div>
      ))}
      </div>
      <button
        onClick={scrollNext}
        className="p-3 bg-white rounded-full shadow hover:bg-gray-100"
        aria-label="다음 카드 보기"
      >
        <MdOutlineKeyboardDoubleArrowRight className="text-3xl" />
      </button>
    </div>
  );
}
