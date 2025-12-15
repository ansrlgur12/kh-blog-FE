import { useEffect, useState } from "react";
import { postApi } from "../api/post";
import type { Posts } from "../types";
import { PostCard } from "../components/PostCard";


export function Home() {

  const [posts, setPosts] = useState<Posts[]>([]);
  const [sortType, setSortType] = useState<string>('post_created_at');
  // const [page, setPage] = useState(1);

  useEffect(() => {
    getPosts();
  }, [sortType])


  const getPosts = async () => {
    const response = await postApi.getPosts({ page: 1, sort: sortType });
    const posts: Posts[] = response.posts || [];
    setPosts(posts);
  }

  const handleSortClick = (type: string) => {
    setSortType(type);
  }

  return (
    <main className="w-full py-8 sm:py-10 md:py-12">
      {/* 탭 메뉴 */}
      <div className="flex gap-4 sm:gap-6 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
        <button 
          onClick={() => handleSortClick('post_created_at')}
          className={`pb-3 sm:pb-4 px-1 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap ${
            sortType === 'post_created_at' 
              ? 'border-gray-900 text-gray-900' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          전체
        </button>
        <button 
          onClick={() => handleSortClick('post_view')}
          className={`pb-3 sm:pb-4 px-1 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap ${
            sortType === 'post_view' 
              ? 'border-gray-900 text-gray-900' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          조회수
        </button>
        {/* <button className="pb-3 sm:pb-4 px-1 border-b-2 border-transparent text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">
          최신
        </button> */}
      </div>

      {posts.length > 0 ? (
        <div className="flex flex-wrap items-start justify-start gap-4 sm:gap-6">
          {posts.map((post) => (
            <PostCard key={post.post_id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 md:py-20 text-gray-400">
          <p className="text-base sm:text-lg">아직 작성된 글이 없습니다.</p>
          <p className="text-xs sm:text-sm mt-2">첫 번째 글을 작성해보세요!</p>
        </div>
      )}
    </main>
  );
}

