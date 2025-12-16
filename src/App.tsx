import './App.css'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Write } from './pages/Write'
import { useEffect, useState } from 'react'
import { WriteDetail } from './pages/WriteDetail'
import { Mypage } from './pages/Mypage'

function AppContent() {
  // 앱 시작 시 인증 상태 복원 (refreshToken으로 accessToken + user 정보 가져오기)
  useAuth();

  const location = useLocation();
  const [headerActive, setHeaderActive] = useState(false);

  useEffect(() => {
    setHeaderActive(location.pathname !== '/write');
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full max-w-full">
      {headerActive && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/write" element={<Write />} />
        <Route path="/detail/:postId" element={<WriteDetail />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
