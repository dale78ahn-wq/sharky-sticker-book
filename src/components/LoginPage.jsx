import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, User, Lock, KeyRound } from 'lucide-react';
import { useAuth, resetAdminPassword } from '../context/AuthContext';
import { apiInitRecovery } from '../api/client';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (searchParams.get('init') === '1') {
      apiInitRecovery()
        .then((r) => {
          alert(r?.message || (r?.ok ? '복구 코드가 damie로 설정되었어요.' : '설정 실패'));
          window.history.replaceState({}, '', '/login');
        })
        .catch((e) => alert('초기화 실패: ' + (e.message || '') + '\n\nAPI가 404라면 Vercel 대시보드에서 Root Directory가 비어있는지 확인해주세요.'));
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(name.trim(), password);
    if (result.ok) {
      navigate('/', { replace: true });
    } else {
      setError(result.message || '로그인에 실패했어요.');
    }
  };

  const handleRecovery = async (e) => {
    e.preventDefault();
    setError('');
    const result = await resetAdminPassword(recoveryCode.trim(), newPassword);
    if (result.ok) {
      setShowRecovery(false);
      setRecoveryCode('');
      setNewPassword('');
      setError('');
      alert('비밀번호가 변경되었어요. 새 비밀번호로 로그인해주세요.');
    } else {
      setError(result.message || '복구에 실패했어요.');
    }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col justify-center">
      <div className="max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl clay-card clay-icon mb-4 bg-pastel-pink/30">
            <Sparkles className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-title font-bold text-amber-800">샤이닝 키즈 스티커북</h1>
          <p className="text-slate-600 mt-1">로그인하고 나만의 스티커를 채워보세요!</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 clay-card"
        >
          <label className="block text-sm font-semibold text-amber-800 mb-2">이름</label>
          <div className="relative mb-4">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              className="clay-input w-full pl-10 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pastel-pink/50 text-slate-800"
              autoComplete="username"
            />
          </div>

          <label className="block text-sm font-semibold text-amber-800 mb-2">비밀번호</label>
          <div className="relative mb-4">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력 (첫 로그인 시 설정)"
              className="clay-input w-full pl-10 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pastel-pink/50 text-slate-800"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-amber-700 text-sm mb-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={!name.trim() || !password}
            className="clay-btn w-full py-3 rounded-2xl bg-gradient-to-r from-pastel-yellow-btn to-pastel-pink-btn font-title font-bold text-amber-900 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            로그인
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-4">
          첫 로그인 시 입력한 비밀번호가 설정돼요. 다음부터는 같은 비밀번호로 로그인해주세요.
        </p>

        <button
          type="button"
          onClick={() => setShowRecovery(true)}
          className="mt-3 w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-amber-700"
        >
          <KeyRound className="w-4 h-4" />
          관리자 비밀번호 복구
        </button>

        {showRecovery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-3xl p-6 clay-card max-w-sm w-full">
              <h3 className="font-title font-bold text-amber-800 mb-3">관리자 비밀번호 복구</h3>
              <p className="text-sm text-slate-600 mb-4">
                미리 설정한 복구 코드를 입력하고 새 비밀번호를 설정해주세요.
              </p>
              <form onSubmit={handleRecovery} className="space-y-3">
                <input
                  type="text"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  placeholder="복구 코드"
                  className="clay-input w-full px-3 py-2 rounded-2xl text-slate-800"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호 (4자 이상)"
                  className="clay-input w-full px-3 py-2 rounded-2xl text-slate-800"
                />
                {error && <p className="text-amber-700 text-sm">{error}</p>}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRecovery(false);
                      setRecoveryCode('');
                      setNewPassword('');
                      setError('');
                    }}
                    className="clay-btn flex-1 py-2 rounded-2xl bg-slate-200 text-slate-700 font-semibold"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={!recoveryCode.trim() || !newPassword}
                    className="clay-btn flex-1 py-2 rounded-2xl bg-gradient-to-r from-pastel-yellow-btn to-pastel-pink-btn font-title font-bold text-amber-900 disabled:opacity-50"
                  >
                    비밀번호 변경
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <footer className="mt-10 pt-6 text-center">
          <img
            src={`${process.env.PUBLIC_URL || ''}/onnuri-logo.png`}
            alt="온누리교회"
            className="h-8 mx-auto object-contain opacity-80"
          />
        </footer>
      </div>
    </div>
  );
}
