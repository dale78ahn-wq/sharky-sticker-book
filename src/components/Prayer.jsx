import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Check } from 'lucide-react';
import Layout from './Layout';
import { prayerPrompts } from '../data/bibleVerses';

export default function Prayer() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const prompt = prayerPrompts[currentIndex];

  const handleNext = () => {
    if (currentIndex < prayerPrompts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleFinish = () => {
    navigate('/', { state: { completedTask: 'prayer' } });
  };

  return (
    <Layout title="기도하기" showBack={true}>
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border-2 border-pastel-pink/50">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Heart className="w-8 h-8 text-pink-600" />
          <span className="text-lg font-bold text-pink-700">함께 기도해요</span>
        </div>

        {!completed ? (
          <>
            <div className="bg-pastel-pink/50 rounded-2xl p-8 mb-6 text-center">
              <p className="text-xl font-bold text-purple-700 leading-relaxed">{prompt}</p>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">
                {currentIndex + 1} / {prayerPrompts.length}
              </span>
              <button
                onClick={handleNext}
                className="px-8 py-3 rounded-2xl bg-pastel-purple font-semibold text-purple-700 hover:bg-purple-200 transition-colors"
              >
                {currentIndex === prayerPrompts.length - 1 ? '완료' : '다음'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🙏</div>
            <h3 className="text-2xl font-bold text-purple-700 mb-2">기도 잘했어요!</h3>
            <p className="text-gray-600 mb-6">하나님께 기도했어요. 스티커를 받아가세요!</p>
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
