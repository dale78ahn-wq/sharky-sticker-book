import { useState } from 'react';
import { User, BookOpen } from 'lucide-react';
import Layout from './Layout';
import DailyCheckTable from './DailyCheckTable';
import StickerPopup from './StickerPopup';
import { WeeklyAudioUpload, WeeklyDiaryUpload, WeeklyBookReportUpload, WeeklyTestimonyUpload } from './WeeklyUploadSection';
import RewardsSection from './RewardsSection';
import { useAuth } from '../context/AuthContext';
import { useProgram } from '../context/ProgramContext';
import { useTerm } from '../context/TermContext';
import { loadVerses, getWeekVerses } from '../data/versesStorage';
import { weekTitles } from '../data/weeksInfo';

const WEEKS = [1, 2, 3, 4, 5, 6, 7];

export default function MainScreen() {
  const { user } = useAuth();
  const { term } = useTerm();
  const { setSticker, countWeekStickers } = useProgram();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [popup, setPopup] = useState(null); // { week, day, column }
  const [showStickerPopup, setShowStickerPopup] = useState(false);
  const versesData = loadVerses(term.year, term.semester);
  const weekVerses = getWeekVerses(versesData, currentWeek);

  const handleCellClick = (week, day, column) => {
    setPopup({ week, day, column });
    setShowStickerPopup(true);
  };

  const handleStickerSelect = (sticker) => {
    if (popup) {
      setSticker(popup.week, popup.day, popup.column, sticker);
    }
    setShowStickerPopup(false);
    setPopup(null);
  };

  const weekStickerCount = countWeekStickers(currentWeek);

  return (
    <Layout>
      {/* 상단: 프로그램명 + 사용자 */}
      <div className="mb-6">
        <div className="bg-white rounded-3xl p-6 clay-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-32 h-32 rounded-2xl overflow-hidden clay-card-subtle">
                <img src={`${process.env.PUBLIC_URL || ''}/shining-character.png`} alt="샤이닝 키즈 캐릭터" className="w-full h-full object-contain object-center" />
              </div>
              <div>
                <h1 className="text-2xl font-title font-bold text-amber-800">
                  {weekTitles[currentWeek]}
                </h1>
                <p className="text-sm text-slate-600 mb-0.5">
                  {term.year}년 {term.semester}학기
                </p>
                <div className="flex items-center gap-2 text-amber-700">
                  <User className="w-4 h-4" />
                  <span className="text-lg font-semibold">{user?.name || '친구'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 이번 주 말씀 (연도/학기별) */}
      {weekVerses.length > 0 && (
        <div className="mb-6 bg-white rounded-3xl p-5 clay-card">
          <div className="flex items-center gap-2 mb-3">
            <span className="clay-icon w-9 h-9 rounded-xl flex items-center justify-center bg-pastel-yellow/40">
              <BookOpen className="w-5 h-5 text-amber-600" />
            </span>
            <span className="font-title font-bold text-amber-800">이번 주 말씀 ({currentWeek}주차)</span>
          </div>
          <ul className="space-y-3">
            {weekVerses.map((v, i) => (
              <li key={i} className="bg-pastel-yellow/30 rounded-2xl p-3 clay-card-subtle">
                {v.reference && <p className="text-sm font-semibold text-amber-700">{v.reference}</p>}
                <p className="text-slate-800 font-medium">{v.simplified || v.text || '-'}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 주차 탭 */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {WEEKS.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => setCurrentWeek(w)}
            className={`flex-shrink-0 px-4 py-2 rounded-2xl font-title font-semibold clay-btn ${
              currentWeek === w
                ? 'bg-gradient-to-br from-pastel-yellow-btn to-pastel-yellow/90 text-amber-800'
                : 'bg-white text-slate-600'
            }`}
          >
            {w}주차
          </button>
        ))}
      </div>

      {/* 일일 체크표 */}
      <div className="mb-6">
        <h2 className="text-lg font-title font-bold text-amber-800 mb-3">매일 체크</h2>
        <DailyCheckTable week={currentWeek} onCellClick={handleCellClick} />
      </div>

      {/* 이번 주 스티커 개수 */}
      <div className="mb-4 bg-white rounded-3xl p-5 clay-card">
        <p className="text-center text-amber-800 font-title font-bold mb-1">
          이번 주({currentWeek}주차) 모은 스티커
        </p>
        <p className="text-center text-3xl font-title font-bold text-amber-700">{weekStickerCount}개</p>
      </div>

      {/* 주차별 보상 */}
      <div className="mb-6">
        <RewardsSection />
      </div>

      {/* 주 1회 업로드 */}
      <div className="space-y-4">
        <WeeklyAudioUpload week={currentWeek} />
        <WeeklyDiaryUpload week={currentWeek} />
        {currentWeek === 5 && <WeeklyBookReportUpload week={5} />}
        {currentWeek === 6 && <WeeklyTestimonyUpload week={6} />}
      </div>

      {showStickerPopup && (
        <StickerPopup
          onSelect={handleStickerSelect}
          onClose={() => {
            setShowStickerPopup(false);
            setPopup(null);
          }}
        />
      )}
    </Layout>
  );
}
