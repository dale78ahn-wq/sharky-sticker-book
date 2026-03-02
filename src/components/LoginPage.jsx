import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = login(name.trim(), password);
    if (result.ok) {
      navigate('/', { replace: true });
    } else {
      setError(result.message || '로그인에 실패했어요.');
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
