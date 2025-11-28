import './App.css'
import { useAuth } from './hooks/useAuth'

function App() {
  // 앱 시작 시 인증 상태 복원 (refreshToken으로 accessToken + user 정보 가져오기)
  useAuth();

  return (
    <>
      <h1 className="text-3xl font-bold">
        Hello world!
      </h1>
    </>
  )
}

export default App
