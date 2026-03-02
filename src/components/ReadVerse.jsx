import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Check } from 'lucide-react';
import Layout from './Layout';
import { week1Verses } from '../data/bibleVerses';

export default function ReadVerse() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const verse = week1Verses.verses[currentIndex];

  const handleNext = () => {
    if (currentIndex < week1Verses.verses.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinish = () => {
    navigate('/', { state: { completedTask: 'read' } });
  };

  return (
    <Layout title="성경 구절 읽기" showBack={true}>
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border-2 border-pastel-blue/50">
        <div className="flex items-center justify-center gap-2 mb-6">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <span className="text-lg font-bold text-blue-700">1주차 말씀</span>
        </div>

        {!completed ? (
          <>
            <div className="bg-pastel-blue/50 rounded-2xl p-6 mb-6">
              <p className="text-sm text-blue-600 mb-2 font-semibold">{verse.reference}</p>
              <p className="text-2xl font-bold text-purple-700 leading-relaxed">
                {verse.simplified}
              </p>
            </div>

            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-6 py-3 rounded-2xl bg-pastel-purple font-semibold text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-200 transition-colors"
              >
                이전
              </button>
              <span className="text-gray-600">
                {currentIndex + 1} / {week1Verses.verses.length}
              </span>
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-2xl bg-pastel-green font-semibold text-green-700 hover:bg-green-200 transition-colors"
              >
                {currentIndex === week1Verses.verses.length - 1 ? '완료' : '다음'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-purple-700 mb-2">잘 읽었어요!</h3>
            <p className="text-gray-600 mb-6">오늘의 말씀을 모두 읽었어요. 스티커를 받아가세요!</p>
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
