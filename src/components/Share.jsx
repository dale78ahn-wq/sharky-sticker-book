import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, Check } from 'lucide-react';
import Layout from './Layout';
import { week1Verses } from '../data/bibleVerses';

export default function Share() {
  const navigate = useNavigate();
  const [shared, setShared] = useState(false);
  const verse = week1Verses.verses[0];

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: '샤키 스티커북 - 오늘의 말씀',
          text: `${verse.reference}: ${verse.simplified}`,
        })
        .then(() => setShared(true))
        .catch(() => setShared(true)); // 실패해도 완료 처리 (데스크톱 등)
    } else {
      // 공유 API 미지원 시 클립보드 복사
      navigator.clipboard
        .writeText(`${verse.reference}: ${verse.simplified}`)
        .then(() => setShared(true));
    }
  };

  const handleFinish = () => {
    navigate('/', { state: { completedTask: 'share' } });
  };

  return (
    <Layout title="나눔하기" showBack={true}>
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border-2 border-pastel-green/50">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Share2 className="w-8 h-8 text-green-600" />
          <span className="text-lg font-bold text-green-700">말씀을 나눠요</span>
        </div>

        {!shared ? (
          <>
            <div className="bg-pastel-green/50 rounded-2xl p-6 mb-6">
              <p className="text-sm text-green-600 mb-2 font-semibold">{verse.reference}</p>
              <p className="text-xl font-bold text-purple-700 leading-relaxed">
                {verse.simplified}
              </p>
            </div>
            <p className="text-center text-gray-600 mb-6">
              오늘 배운 말씀을 가족이나 친구에게 나눠보세요!
            </p>
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-pastel-green to-pastel-blue font-bold text-green-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Share2 className="w-5 h-5" />
              말씀 나누기
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">💖</div>
            <h3 className="text-2xl font-bold text-purple-700 mb-2">잘했어요!</h3>
            <p className="text-gray-600 mb-6">말씀을 나눠줘서 고마워요. 스티커를 받아가세요!</p>
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
