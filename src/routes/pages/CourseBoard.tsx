import { useState } from "react";
import { IoStorefrontOutline } from "react-icons/io5";
import { FaMapMarkerAlt, FaRegPaperPlane, FaHashtag } from "react-icons/fa";
import { FaTags } from "react-icons/fa6";
import { FcClock } from "react-icons/fc";

// 타입 정의
type CourseData = {
  title: string;
  time: string;
  duration: string;
  tags: string;
  imgSrc: string;
};

export default function CourseBoard() {
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);

  return (
    <div className="p-15 bg-base-100 min-h-screen flex justify-center">
      <div className="w-full max-w-[2000px] grid grid-cols-[1.5fr_2.5fr_1.5fr] gap-8">
      {/* 왼쪽 섹션 */}
      <div className="bg-white rounded-xl bg-opacity-50 shadow-md p-6 col-span-1">
        {selectedCourse ? (
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">{selectedCourse.title}</h2>
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <IoStorefrontOutline className="text-2xl" />
                <span>대전대학교</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-2xl text-red-400" />
                <span>대전 동구 용운동</span>
              </div>
              <div className="flex items-center gap-2">
                <FaTags className="text-2xl text-blue-400" />
                <span>대학교</span>
              </div>
              <div className="flex items-center gap-2">
                <FcClock className="text-2xl" />
                <span>출발 시간 :</span>
                <span className="ml-0.5 px-2 py-1 bg-gray-200 rounded text-xs">7:30</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[800px]">
            <p className="text-center text-gray-400 text-sm">코스를 선택해주세요.</p>
          </div>
        )}
      </div>

        {/* 중앙 섹션 */}
        <div className="bg-white rounded-xl bg-opacity-50 shadow-md p-6 col-span-1 flex items-center justify-center">
          {selectedCourse ? (
            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">{selectedCourse.title}</h2>
                <div className="space-x-2">
                  <button className="px-2 py-1 bg-main-200 hover:bg-main-300 text-sm text-white rounded">수정</button>
                  <button className="px-2 py-1 bg-main-200 hover:bg-main-300 text-sm text-white rounded">삭제</button>
                </div>
              </div>
              <img
                src={selectedCourse.imgSrc}
                alt={selectedCourse.title}
                className="rounded mb-2 mt-5 mx-auto w-130"
              />

              <div className="flex justify-between mt-5 w-full">
                <div className="flex items-center gap-2 flex-1 justify-center">
                  <FaRegPaperPlane className="text-2xl" />
                  <span>{selectedCourse.title}</span>
                </div>
                <div className="flex items-center gap-2 flex-1 justify-center">
                  <FcClock className="text-2xl" />
                  <span>소요 시간</span>
                  <span className="text-gray-400 text-xs">
                    {selectedCourse.time} / {selectedCourse.duration}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-1 justify-center">
                  <FaHashtag className="text-2xl text-blue-400" />
                  <span>{selectedCourse.tags}</span>
                </div>
              </div>

              <div
                className="mt-5 p-4 h-90 rounded-lg bg-opacity-50 shadow-md border border-gray-200 space-y-3 text-sm"
                style={{
                  backgroundColor: "oklch(0.7928 0.0216 248.1 / 0.3)",
                }}
              >
                빅데이터 IoT 개발자 양성 과정을 수강하는 학생들의 일상을 체험할 수 있는 코스입니다.
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-400 text-sm">코스를 선택해주세요.</p>
          )}
        </div>

        {/* 오른쪽 섹션 */}
        <div className="bg-white rounded-xl bg-opacity-50 shadow-md p-6 col-span-1">
          <h2 className="text-xl font-bold mb-4">코스 리스트</h2>
          <div
            className="bg-white p-3 rounded-lg shadow-md border border-gray-200 space-y-3 text-sm hover:bg-gray-200 cursor-pointer"
            onClick={() =>
              setSelectedCourse({
                title: "대전대 IoT의 일상",
                time: "07:30 ~ 08:00",
                duration: "30분",
                tags: "#대학생 #대전 #일상 #IoT",
                imgSrc: "src/images/school.png",
              })
            }
          >
            <CourseItem
              title="대전대 IoT의 일상"
              time="07:30 ~ 08:00"
              duration="30분"
              tags="#대학생 #대전 #일상 #IoT"
              imgSrc="src/images/school.png"
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
        <h3 className="flex items-center gap-3 text-sm font-semibold">
          <FaRegPaperPlane />
          {title}
        </h3>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <FcClock />
          {time} / {duration}
        </div>
        <div className="flex items-center gap-3 text-sm text-blue-500">{tags}</div>
      </div>
    </div>
  );
}
