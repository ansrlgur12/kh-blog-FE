import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function Header() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* 로고 */}
          <button onClick={() => navigate('/')} className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 cursor-pointer">KH Blog</h1>
          </button>

          {/* 우측 메뉴 */}
          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated && user ? (
              <>
                <button
                  onClick={() => navigate('/write')}
                  className="px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 transition cursor-pointer"
                >
                  <span className="hidden sm:inline">새 글 작성</span>
                  <span className="sm:hidden">작성</span>
                </button>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm text-gray-700 cursor-pointer hidden sm:inline">{user.user_nickname}</span>
                  <button
                    onClick={handleLogout}
                    className="px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 transition cursor-pointer"
                  >
                    로그아웃
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 transition cursor-pointer"
                >
                  로그인
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition cursor-pointer"
                >
                  회원가입
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

