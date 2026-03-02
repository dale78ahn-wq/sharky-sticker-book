import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles, LogOut, Sticker, BarChart3, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isAdmin } from '../context/AuthContext';

export default function Layout({ children, title, showBack = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn, logout } = useAuth();
  const isHome = location.pathname === '/';
  const isStats = location.pathname === '/stats';
  const isAdminPage = location.pathname === '/admin';
  const showAdminTab = isAdmin(user);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen p-4 pb-8">
      <header className="max-w-2xl mx-auto mb-4">
        <div className="bg-white rounded-3xl p-4 clay-card flex items-center justify-between">
          {showBack && !isHome && !isStats && !isAdminPage ? (
            <button
              onClick={() => navigate(-1)}
              className="clay-btn clay-icon w-10 h-10 rounded-2xl bg-gradient-to-br from-pastel-yellow-btn to-pastel-yellow/90 text-amber-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-10" />
          )}
          <div className="flex items-center gap-2">
            <span className="clay-icon w-9 h-9 rounded-xl flex items-center justify-center bg-pastel-pink/30">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </span>
            <span className="font-title font-bold text-amber-800 text-lg">샤이닝 키즈 스티커북</span>
          </div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="clay-btn clay-icon w-10 h-10 rounded-2xl bg-gradient-to-br from-pastel-pink-btn to-pastel-pink/80 text-amber-800"
              title="로그아웃"
            >
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-10" />
          )}
        </div>

        {/* 탭: 스티커북 | 통계 | 관리자(관리자만) */}
        {isLoggedIn && (
          <nav className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl font-title font-semibold clay-btn ${
                isHome ? 'bg-gradient-to-br from-pastel-yellow-btn to-pastel-yellow/90 text-amber-800' : 'bg-white text-slate-600'
              }`}
            >
              <Sticker className="w-4 h-4" />
              스티커북
            </button>
            <button
              type="button"
              onClick={() => navigate('/stats')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl font-title font-semibold clay-btn ${
                isStats ? 'bg-gradient-to-br from-pastel-yellow-btn to-pastel-yellow/90 text-amber-800' : 'bg-white text-slate-600'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              통계
            </button>
            {showAdminTab && (
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl font-title font-semibold clay-btn ${
                  isAdminPage ? 'bg-gradient-to-br from-pastel-yellow-btn to-pastel-yellow/90 text-amber-800' : 'bg-white text-slate-600'
                }`}
              >
                <Shield className="w-4 h-4" />
                관리자
              </button>
            )}
          </nav>
        )}

        {title && (
          <h2 className="text-xl font-title font-bold text-center mt-3 text-amber-800">{title}</h2>
        )}
      </header>

      <main className="max-w-2xl mx-auto">{children}</main>

      {/* 온누리교회 로고 - 서비스 첫 화면 하단 */}
      {isLoggedIn && (
        <footer className="max-w-2xl mx-auto mt-8 pt-6 pb-4 text-center">
          <img
            src={`${process.env.PUBLIC_URL || ''}/onnuri-logo.png`}
            alt="온누리교회"
            className="h-8 mx-auto object-contain opacity-80"
          />
        </footer>
      )}
    </div>
  );
}
