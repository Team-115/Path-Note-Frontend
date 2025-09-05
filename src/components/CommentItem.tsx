import { FaUserCircle } from "react-icons/fa";

type Props = {
  author: string;
  date: string;
  text: string;
  profileURL?: string;
};

//          component: 댓글 아이템 컴포넌트          //
export default function CommentItem({ author, date, text, profileURL }: Props) {
    
    //          render: 댓글 아이템 컴포넌트 랜더링          //
    return (
        <div className="rounded-xl bg-gray-50 px-3 py-2 ring-1 ring-black/5">
            <div className="flex items-center gap-2 text-[12px] text-gray-600">
                {profileURL ? (
                <img src={profileURL} alt="profile" className="w-5 h-5 rounded-full" />
                ) : (
                <FaUserCircle />
                )}
                <span className="font-semibold text-gray-800">{author}</span>
                <span className="text-gray-400">{date}</span>
            </div>
            <p className="mt-1 text-[13px] leading-5 text-gray-800 whitespace-pre-wrap">
                {text}
            </p>
        </div>
    );
}