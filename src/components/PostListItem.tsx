import { useNavigate } from "react-router-dom";
import type { Posts } from "../types";
import { API_BASE_URL } from "../lib/api";

export const PostListItem = ({ post }: { post: Posts }) => {
    const navigate = useNavigate();

    return (
        <div
            className="cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow mb-4"
            onClick={() => {
                // 임시저장글인 경우 Write 페이지로 이동
                if (post.post_status === 'T') {
                    navigate(`/write?postId=${post.post_id}`);
                } else {
                    navigate(`/detail/${post.post_id}`);
                }
            }}
        >
            <div className="flex flex-row gap-4 p-4">
                {/* 썸네일 영역 */}
                <div className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40">
                    {post.post_thumbnail && post.post_thumbnail !== 'noimage' ? (
                        <img
                            className="w-full h-full object-cover rounded-lg"
                            src={post.post_thumbnail.startsWith('http') ? post.post_thumbnail : API_BASE_URL + post.post_thumbnail}
                            alt={post.post_title}
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                    )}
                </div>

                {/* 내용 영역 */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                        <h2 className="text-lg font-bold mb-2 line-clamp-2 text-left text-gray-900">
                            {post.post_title}
                        </h2>

                        {/* 컨텐츠 미리보기 */}
                        {post.post_content && (
                            <p className="text-sm text-gray-500 mb-2 line-clamp-2 text-left">
                                {post.post_content.replace(/[#*`]/g, '').replace(/!\[.*?\]\(.*?\)/g, '').substring(0, 150)}...
                            </p>
                        )}

                        {/* 날짜 */}
                        <div className="text-xs text-gray-400 mb-2 text-left">
                            {post.post_created_at ? new Date(post.post_created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '날짜 없음'}
                        </div>
                    </div>

                    {/* 작성자 정보 */}
                    <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0">
                                {post.author?.user_image ? (
                                    <img
                                        src={API_BASE_URL + post.author?.user_image}
                                        alt={post.author?.user_nickname}
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-4 h-4 text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">by {post.author?.user_nickname || post.user_nickname}</p>
                        </div>
                        {(post as any).like_count !== undefined && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <span>❤</span>
                                <span>{(post as any).like_count}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

