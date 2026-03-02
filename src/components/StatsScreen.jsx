import { BarChart3, Sticker } from 'lucide-react';
import Layout from './Layout';
import RewardsSection from './RewardsSection';
import { useProgram } from '../context/ProgramContext';
import { useAuth } from '../context/AuthContext';
import { useTerm } from '../context/TermContext';
import { weekTitles } from '../data/weeksInfo';

export default function StatsScreen() {
  const { user } = useAuth();
  const { term } = useTerm();
  const { countWeekStickers, countAllStickers } = useProgram();
  const total = countAllStickers();
  const weekCounts = [1, 2, 3, 4, 5, 6, 7].map((w) => ({ week: w, count: countWeekStickers(w) }));

  return (
    <Layout title="나의 스티커 통계">
      <div className="space-y-6">
        <p className="text-center text-sm text-amber-800 font-title font-medium">
          {term.year}년 {term.semester}학기
        </p>
        <div className="bg-white rounded-3xl p-6 clay-card">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="clay-icon w-10 h-10 rounded-xl flex items-center justify-center bg-pastel-yellow/40">
              <Sticker className="w-6 h-6 text-amber-600" />
            </span>
            <span className="text-xl font-title font-bold text-amber-800">총 모은 스티커</span>
          </div>
          <p className="text-center text-4xl font-title font-bold text-amber-700">{total}개</p>
          <p className="text-center text-sm text-gray-600 mt-2">{user?.name}님의 기록이에요</p>
        </div>

        <div className="bg-white rounded-3xl p-6 clay-card">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="clay-icon w-10 h-10 rounded-xl flex items-center justify-center bg-pastel-yellow/40">
              <BarChart3 className="w-5 h-5 text-amber-600" />
            </span>
            <span className="text-lg font-title font-bold text-amber-800">주차별 스티커</span>
          </div>
          <ul className="space-y-3">
            {weekCounts.map(({ week, count }) => (
              <li
                key={week}
                className="flex items-center justify-between rounded-2xl clay-card-subtle bg-pastel-yellow/40 px-4 py-3"
              >
                <span className="font-title font-semibold text-amber-800">{weekTitles[week]}</span>
                <span className="font-title font-bold text-amber-700">{count}개</span>
              </li>
            ))}
          </ul>
        </div>

        <RewardsSection />
      </div>
    </Layout>
  );
}
