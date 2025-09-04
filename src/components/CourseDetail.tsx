import { FaRegPaperPlane, FaHashtag, FaRegHeart, FaHeart, FaCommentDots, FaChevronDown, FaChevronUp,} from "react-icons/fa";
import { FcClock } from "react-icons/fc";
import type { CourseData } from "../types/course";
import { useState } from "react";
import CommentItem from "./CommentItem";

type Props = {  // 부모 -> 자식 데이터 넘겨주기 위해.
  course: CourseData | null;  // null 사용 이유 : 선택된 코스가 없음을 알려주기 위해.
};

// 중앙 컴포넌트 (코스 상세 정보)
export default function CourseDetail({ course }: Props) {
  //          state: 좋아요 상태          //
  const [liked, setLiked] = useState(false);
  //          state: 좋아요 수 상태          //
  const [likeCount, setLikeCount] = useState(0);
  //          state: 댓글 보여주기 상태          //
  const [showComments, setShowComments] = useState(false);

  // 데모용 데이터(표시 전용)
  const demoComments = [
    { id: "c1", author: "핑크공듀", date: "2025-09-04", text: "대전에 가면 꼭 가봐야할 코스만 모여있네." },
    { id: "c2", author: "장나영", date: "2025-09-05", text: "저도 가봤어요." },
  ];

  const onToggleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((n) => (liked ? n - 1 : n + 1));
  };
  
  if (!course) {  // 선택된 코스가 없을 경우
    return (
      <p className="text-center text-gray-400 text-sm">코스를 선택해주세요.</p>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{course.course_name}</h2>
        <div className="space-x-2">
          <button className="px-2 py-1 bg-main-200 hover:bg-main-300 text-sm text-white rounded">수정</button>
          <button className="px-2 py-1 bg-main-200 hover:bg-main-300 text-sm text-white rounded">삭제</button>
        </div>
      </div>
      <img src={course.imgSrc} alt={course.course_name} className="rounded mb-2 mt-5 mx-auto w-130" />

      <div className="flex justify-between mt-5 w-full">
        <div className="flex items-center gap-2 flex-1 justify-center">
          <FaRegPaperPlane className="text-2xl" />
          <span>{course.course_name}</span>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-center">
          <FcClock className="text-2xl" />
          <span>소요 시간</span>
          <span className="text-gray-400 text-xs">
            {course.time} / {course.duration}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-center">
          <FaHashtag className="text-2xl text-blue-400" />
          <span>{course.tags}</span>
        </div>
      </div>

      {/* ===== 좋아요/댓글 바 ===== */}
      <div className="mt-4 px-1 py-2">
        <div className="flex items-center">
          {/* 좋아요 */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleLike}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-gray-100 active:scale-[0.98] transition"
            >
              {liked ? (
                <FaHeart className="text-rose-500 text-lg" />
              ) : (
                <FaRegHeart className="text-gray-700 text-lg" />
              )}
              <span className="text-sm tabular-nums">좋아요 {likeCount}</span>
            </button>
          </div>

          {/* 댓글 */}
          <div className="flex items-center">
            <div className="inline-flex items-center gap-2 rounded-full px-3">
              <FaCommentDots className="text-gray-700 text-lg" />
              <span className="text-sm tabular-nums">
                리뷰 {demoComments.length}
              </span>
            </div>

            <button
              onClick={() => setShowComments((v) => !v)}
              className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800"
            >
              {showComments ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
        </div>

        {/* 댓글 리스트(접힘) */}
        {showComments && (
          <div className="mt-4">
            <CommentItem/>

            {/* 댓글 입력창 */}
            <div className="mt-3 flex items-center gap-2">
              <input className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-main-200" placeholder="리뷰를 입력해주세요." />
              <button className="rounded-xl bg-main-200 text-white text-sm px-4 py-2 hover:bg-main-300">등록</button>
            </div> 
          </div>
        )}
      </div>

      <div
        className="mt-5 p-4 h-90 rounded-lg bg-opacity-50 shadow-md border border-gray-200 space-y-3 text-sm"
        style={{ backgroundColor: "oklch(0.7928 0.0216 248.1 / 0.3)" }}
      >
        {course.description}
      </div>
    </div>
  );
}
