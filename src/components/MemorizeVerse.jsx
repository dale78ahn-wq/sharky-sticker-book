import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Check, Eye, EyeOff } from 'lucide-react';
import Layout from './Layout';
import { week1Verses } from '../data/bibleVerses';

export default function MemorizeVerse() {
  const navigate = useNavigate();
  const [showHint, setShowHint] = useState(true);
  const [completed, setCompleted] = useState(false);
  const verse = week1Verses.verses[0]; // 첫 번째 구절로 암송 연습

  const handleFinish = () => {
    navigate('/', { state: { completedTask: 'memorize' } });
  };

  return (
    <Layout title="암송하기" showBack={true}>
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border-2 border-pastel-purple/50">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Brain className="w-8 h-8 text-purple-600" />
          <span className="text-lg font-bold text-purple-700">암송해보세요!</span>
        </div>

        {!completed ? (
          <>
            <div className="bg-pastel-purple/50 rounded-2xl p-6 mb-6 relative">
              <p className="text-sm text-purple-600 mb-2 font-semibold">{verse.reference}</p>
              <p
                className={`text-2xl font-bold text-purple-700 leading-relaxed transition-all ${
                  showHint ? '' : 'blur-md select-none'
                }`}
              >
                {verse.simplified}
              </p>
              <button
                onClick={() => setShowHint(!showHint)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/80 hover:bg-white transition-colors"
              >
                {showHint ? (
                  <EyeOff className="w-5 h-5 text-purple-600" />
                ) : (
                  <Eye className="w-5 h-5 text-purple-600" />
                )}
              </button>
            </div>
            <p className="text-center text-gray-600 mb-6">
              {showHint ? '👁️ 힌트 숨기고 암송해보기' : '👁️ 힌트 보기'}
            </p>

            <button
              onClick={() => setCompleted(true)}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-pastel-pink to-pastel-purple font-bold text-purple-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Check className="w-5 h-5" />
              암송 완료!
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-purple-700 mb-2">훌륭해요!</h3>
            <p className="text-gray-600 mb-6">말씀을 잘 암송했어요. 스티커를 받아가세요!</p>
            <button
              onClick={handleFinish}
              className="flex items-center justify-center gap-2 mx-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-pastel-pink to-pastel-purple font-bold text-purple-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Check className="w-5 h-5" />
              스티커 판으로 돌아가기
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
