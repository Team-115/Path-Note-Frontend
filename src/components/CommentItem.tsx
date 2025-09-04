import { FaUserCircle } from "react-icons/fa";

//          component: 댓글 아이템 컴포넌트          //
export default function CommentItem() {
    // 데모용 데이터(표시 전용)
    const demoComments = [
        { id: "c1", author: "핑크공듀", date: "2025-09-04", text: "대전에 가면 꼭 가봐야할 코스만 모여있네." },
        { id: "c2", author: "장나영", date: "2025-09-05", text: "저도 가봤어요." },
    ];
    //          render: 댓글 아이템 컴포넌트 랜더링          //
    return (
    <div className="space-y-3">
                  {demoComments.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-xl bg-gray-50 px-3 py-2 ring-1 ring-black/5"
                    >
                      <div className="flex items-center gap-2 text-[12px] text-gray-600">
                        <FaUserCircle />
                        <span className="font-semibold text-gray-800">{c.author}</span>
                        <span className="text-gray-400">{c.date}</span>
                      </div>
                      <p className="mt-1 text-[13px] leading-5 text-gray-800 whitespace-pre-wrap">
                        {c.text}
                      </p>
                    </div>
                  ))}
                </div>
  );
}