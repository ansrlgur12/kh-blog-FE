import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { postApi } from "../api/post";
import type { Posts } from "../types";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

export function WriteDetail() {
    const { postId } = useParams();
    const [post, setPost] = useState<Posts>();
    const [likes, setLikes] = useState(105);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        getPost();
    }, [postId])

    const getPost = async () => {
        try {
            const rsp = await postApi.getPost(postId as string);
            if (rsp.success) {
                setPost(rsp.post);
                console.log(rsp.post);

                window.scrollTo(0, 0);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}년 ${month}월 ${day}일`;
    }

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
    }

    // 기술 스킬 리스트 (예시 데이터)
    const techSkills = [
        { name: "Linux", description: "모든 기술 스킬의 기반" },
        { name: "Bash / Python", description: "자동화의 첫걸음" },
        { name: "Docker", description: "\"환경 구축 지옥\"에서 해방" },
        { name: "Git", description: "개발자라고 불리기 위한 필수 스킬" },
        { name: "CI/CD", description: "\"코드 작성자\"에서 \"소프트웨어 전달자\"로" },
        { name: "API 개발과 테스트", description: "올바른 도구 선택이 학습 효율을 바꾼다" },
        { name: "Apidog", description: "API 개발의 번거로움을 한 번에 해결" },
        { name: "클라우드 (AWS/GCP/Azure)", description: "하나를 선택해서 시작하라" },
        { name: "IaC", description: "중급 개발자로 가는 계단" },
        { name: "AI 활용", description: "왜 \"기초\"가 예전보다 중요한가" },
    ];

    // 태그 예시 (실제 데이터가 없으므로 임시)
    const tags = ["AI 활용", "API 개발", "개발 도구", "비전공 개발자", "프로그래밍 학습"];

    if (!post) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">로딩 중...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex gap-8">
              
                {/* 메인 콘텐츠 영역 */}
                <div className="flex-1">
                    {/* 제목 */}
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8 leading-tight text-left">
                        {post.post_title}
                    </h1>

                    {/* 작성자 정보 및 팔로우 버튼 */}
                    <div className="flex items-center justify-between mb-16">
                        <div className="flex items-center gap-3">
                            <span className="text-base text-gray-900 font-medium">
                                {post.user_nickname || post.author?.user_nickname}
                            </span>
                            <span className="text-gray-400">·</span>
                            <span className="text-sm text-gray-500">
                                {formatDate(post.post_created_at)}
                            </span>
                        </div>
                       
                    </div>

                  

                  
                    {/* 본문 콘텐츠 */}
                    <div className="prose prose-lg max-w-none text-left">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            components={{
                                br: () => <br />,
                                h1: ({ children }) => <h1 className="text-3xl font-bold mt-10 mb-6 text-gray-900">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-2xl font-bold mt-9 mb-5 text-gray-900">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-xl font-bold mt-8 mb-4 text-gray-900">{children}</h3>,
                                h4: ({ children }) => <h4 className="text-lg font-bold mt-7 mb-4 text-gray-900">{children}</h4>,
                                p: (props: any) => {
                                    const children = props.children;
                                    if (Array.isArray(children) && children.length === 1) {
                                        const firstChild = children[0];
                                        if (firstChild && typeof firstChild === 'object' && 'type' in firstChild && firstChild.type === 'img') {
                                            return <div className="my-8 flex justify-center">{children}</div>;
                                        }
                                    }
                                    if (children && typeof children === 'object' && 'type' in children && children.type === 'img') {
                                        return <div className="my-8 flex justify-center">{children}</div>;
                                    }
                                    return <p className="mb-8 text-gray-700 leading-relaxed text-base">{children}</p>;
                                },
                                strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                                em: ({ children }) => <em className="italic">{children}</em>,
                                ul: ({ children }) => <ul className="list-disc pl-6 mb-8 space-y-2">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal pl-6 mb-8 space-y-2">{children}</ol>,
                                li: ({ children }) => <li className="text-gray-700">{children}</li>,
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-gray-300 pl-4 my-8 italic text-gray-600">
                                        {children}
                                    </blockquote>
                                ),
                                code: ({ children, className }) => {
                                    const isInline = !className;
                                    return isInline ? (
                                        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-gray-800 font-mono">
                                            {children}
                                        </code>
                                    ) : (
                                        <code className={className}>{children}</code>
                                    );
                                },
                                pre: ({ children }) => (
                                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-8">
                                        {children}
                                    </pre>
                                ),
                                a: ({ href, children }) => (
                                    <a href={href} className="text-teal-600 hover:text-teal-700 underline" target="_blank" rel="noopener noreferrer">
                                        {children}
                                    </a>
                                ),
                                img: ({ src, alt }) => (
                                    <div className="my-8 flex justify-center">
                                        <img src={src} alt={alt} className="max-w-full h-auto rounded-lg" />
                                    </div>
                                ),
                            }}
                        >
                            {post.post_content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>

            {/* 모바일용 좋아요/공유 버튼 */}
            <div className="lg:hidden flex items-center justify-center gap-6 mt-8 pt-8 border-t border-gray-200">
                <button
                    onClick={handleLike}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                    <svg
                        className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                        fill={isLiked ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">{likes}</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                    <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">공유</span>
                </button>
            </div>
        </div>
    );
}