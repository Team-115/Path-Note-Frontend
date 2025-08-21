import { IoStorefrontOutline} from "react-icons/io5";
import { FaMapMarkerAlt, FaRegPaperPlane, FaHashtag} from "react-icons/fa";
import { FaTags } from "react-icons/fa6";
import { FcClock } from "react-icons/fc";

export default function CourseBoard() {
  return (
    <div className="p-15 bg-base-100 min-h-screen flex justify-center">
      <div className="w-full max-w-[2000px] grid grid-cols-[1.5fr_2.5fr_1.5fr] gap-8">
        
			{/* 왼쪽 섹션 - 출발지 정보 */}
			<div className="bg-white rounded-xl bg-opacity-50 shadow-md p-6 col-span-1">
				<h2 className="text-xl font-bold mb-4">대전대 IoT의 일상</h2>
				<div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 space-y-3 text-sm">
					<div className="flex items-center gap-2">
						<span><IoStorefrontOutline className="text-2xl"/></span>
						<span>대전대학교</span>
					</div>
					<div className="flex items-center gap-2">
						<span><FaMapMarkerAlt  className="text-2xl text-red-400"/></span>
						<span>대전 동구 용운동</span>
					</div>
					<div className="flex items-center gap-2">
						<span><FaTags className="text-2xl text-blue-400"/></span>
						<span>대학교</span>
					</div>
					<div className="flex items-center gap-2">
						<span><FcClock className="text-2xl"/></span>
						<span>출발 시간 :</span>
						<span className="ml-0.5 px-2 py-1 bg-gray-200 rounded text-xs">7:30</span>
					</div>
				</div>
			</div>

        {/* 중앙 섹션 - 코스 설명 */}
        <div className="bg-white rounded-xl bg-opacity-50 shadow-md p-6 col-span-1">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">대전대 IoT의 일상</h2>
            <div className="space-x-2">
              <button className="px-2 py-1 bg-main-200 hover:bg-main-300 text-sm text-white rounded">수정</button>
              <button className="px-2 py-1 bg-main-200 hover:bg-main-300 text-sm text-white rounded">삭제</button>
            </div>
          </div>
          <img
            src="src/images/school.png"
            alt="대전대"
            className="rounded mb-2 mt-5 mx-auto w-130"
          />

         <div className="flex justify-between mt-5 w-full">
            <div className="flex items-center gap-2 flex-1 justify-center">
             <FaRegPaperPlane className="text-2xl" />
             <span>대전대 IoT의 일상</span>
           </div>

           <div className="flex items-center gap-2 flex-1 justify-center">
             <FcClock className="text-2xl" />
             <span>소요 시간</span>
             <span className="text-gray-400 text-xs">07:30 08:00 /30분</span>
           </div>

           <div className="flex items-center gap-2 flex-1 justify-center">
             <FaHashtag className="text-2xl text-blue-400" />
            <span>대학생 대전 일상</span>
           </div>
         </div>
					<div className="mt-5 p-4 h-90 rounded-lg bg-opacity-50 shadow-md border border-gray-200 space-y-3 text-sm"
           style={{ backgroundColor: "oklch(0.7928 0.0216 248.1 / 0.3)" }}>
						빅데이터 IoT 개발자 양성 과정을 수강하는 학생들의 일상을 체험할 수 있는 코스입니다.
					</div>
        </div>

        {/* 오른쪽 섹션 - 코스 리스트 */}
        <div className="bg-white rounded-xl bg-opacity-50 shadow-md p-6 col-span-1">
          <h2 className="text-xl font-bold mb-4">코스 리스트</h2>
				  <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200 space-y-3 text-sm hover:bg-gray-200">
            <CourseItem 
              title= "대전대 IoT의 일상"
              time="07:30 ~ 08:00"
              duration="30분"
              tags="#대학생 #대전 #일상 #IoT"
              imgSrc="src\images\school.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 리스트 아이템 컴포넌트
type CourseItemProps = {
  title: string;
  time: string;
  duration: string;
  tags: string;
  imgSrc: string;
};

function CourseItem({ title, time, duration, tags, imgSrc }: CourseItemProps) {
  return (
    <div className="flex items-center gap-4">
      <img src={imgSrc} alt={title} className="w-30 h-25 object-cover rounded" />
      <div className="flex flex-col justify-between h-25">
        <h3 className="flex items-center gap-3 text-sm font-semibold"><FaRegPaperPlane/>{title}</h3>
        <div className="flex items-center gap-3 text-sm text-gray-500"><FcClock/>{time} / {duration}</div>
        <div className="flex items-center gap-3 text-sm text-blue-500">{tags}</div>
      </div>
    </div>
  );
}
