import { FaRegPaperPlane, FaHashtag, FaRegHeart, FaHeart, FaCommentDots, FaChevronDown, FaChevronUp,} from "react-icons/fa";
import { FcClock } from "react-icons/fc";
import type { CourseData } from "../types/course";
import { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import { getFavoriteCountRequest, postFavoriteRequest, getIsLikedRequest } from "../apis/FavoriteApi";
import { getCommentsRequest, postCommentRequest} from "../apis/CommentApi";
import type { CommentResponse } from "../apis/CommentApi";
import { useNavigate } from "react-router";

type Props = {  // 부모 -> 자식 데이터 넘겨주기 위해.
  course: CourseData | null;  // null 사용 이유 : 선택된 코스가 없음을 알려주기 위해.
};

const MAP_ROUTE ="/";


//          component: 중앙 코스 상세 정보 컴포넌트          //
export default function CourseDetail({ course }: Props) {
  //          state: 좋아요 상태          //
  const [liked, setLiked] = useState(false);
  //          state: 좋아요 수 상태          //
  const [likeCount, setLikeCount] = useState(0);
  //          state: 좋아요 클릭 중복 방지 상태          //
  const [loading, setLoading] = useState(false);
  //          state: 댓글 상태          //
  const [comments, setComments] = useState<CommentResponse[]>([]);
  //          state: 댓글 창 상태          //
  const [showComments, setShowComments] = useState(false);
  //          state: 댓글 입력 상태          //
  const [commentText, setCommentText] = useState("");
  //          state: 댓글 등록 중복 방지 상태          //
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  //          event handler: 수정 버튼 이벤트 핸들러          //
  const onUpdateButtonClick = () => {
    if (!course) return;
    navigate(MAP_ROUTE, {
      state: {
        openPanels: true,
        courseId: course.course_id
      }
    });
  } 
  
  //          event handler: 댓글 작성 이벤트 핸들러          //
  const onSubmitComment = async () => {
  if (!course?.course_id || submitting) return;
  const content = commentText.trim();
  if (content.length === 0) return;

  setSubmitting(true);
  try {
    await postCommentRequest(course.course_id, content);
    const list = await getCommentsRequest(course.course_id); // 등록 후 재조회
    setComments(list);
    setCommentText("");
  } catch (e) {
    console.error("댓글 등록 실패:", e);
  } finally {
    setSubmitting(false);
  }
};

//          event handler: 댓글 작성 엔터키 이벤트 핸들러          //
const onCommentKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    e.preventDefault();
    onSubmitComment(); 
  }
};

  //          effect: 좋아요 수, 과거 좋아요 여부 동시 조회          //
  useEffect(() => {
    if (!course) {
      setLiked(false);
      setLikeCount(0);
      return;
    }
    const load = async () => {
      try {
        const [count, isLiked] = await Promise.all([
          getFavoriteCountRequest(course.course_id),
          getIsLikedRequest(course.course_id),
        ]);
        setLikeCount(count);
        setLiked(isLiked);
      } catch (e) {
        console.error("좋아요 초기값 조회 실패:", e);
      }
    };
    load();
  }, [course?.course_id]);

  //          effect: 코스가 바뀌면 댓글 목록 초기화          //
  useEffect(() => {
    if (!course?.course_id) {
      setComments([]);
      return;
    }
    (async () => {
      try {
        const list = await getCommentsRequest(course.course_id);
        setComments(list);
      } catch (e) {
        console.error("댓글 초기 조회 실패:", e);
      }
    })();
  }, [course?.course_id]);


  //          function: 좋아요 토글 함수          //
  const onToggleLike = async () => {
    if (!course?.course_id || loading) return;
    setLoading(true);
    try {
      await postFavoriteRequest(course.course_id); // 서버에 토글
      // 토글 성공 후 “항상” 최신값 재조회
      const [count, isLiked] = await Promise.all([
        getFavoriteCountRequest(course.course_id),
        getIsLikedRequest(course.course_id),
      ]);
      console.log("좋아요 수:", count, "좋아요 여부:", isLiked);
      setLikeCount(count);
      setLiked(!!isLiked);
    } catch (e) {
      console.error("좋아요 토글/재조회 실패:", e);
    } finally {
      setLoading(false);
    }
  };
  
  if (!course) {  // 선택된 코스가 없을 경우
    return (
      <p className="text-center text-gray-400 text-sm">코스를 선택해주세요.</p>
    );
  }

  //          render: 중앙 코스 상세 정보 컴포넌트          //
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{course.course_name}</h2>
        <div className="space-x-2">
          <button 
            className="px-2 py-1 bg-main-200 hover:bg-main-300 text-sm text-white rounded"
            onClick={onUpdateButtonClick}  
            >수정</button>
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
              disabled={loading}
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
                리뷰 {comments.length}
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
            {comments.map((c) => (
              <CommentItem
                key={c.comment_id}
                author={c.user.nickname}
                text={c.content}
                date={c.created_at}
                profileURL={c.user.profilePresetURL}
              />
            ))}
            {/* 댓글 입력창 */}
            <div className="mt-3 flex items-center gap-2">
              <input
                className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-main-200"
                placeholder="리뷰를 입력해주세요."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={onCommentKeyDown}
                disabled={submitting}
              />
              <button
                className="rounded-xl bg-main-200 text-white text-sm px-4 py-2 hover:bg-main-300 disabled:opacity-50"
                onClick={onSubmitComment}
                disabled={submitting || commentText.trim().length === 0}
              >
                등록
              </button>
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
