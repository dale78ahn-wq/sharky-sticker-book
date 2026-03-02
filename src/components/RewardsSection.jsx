import { Gift } from 'lucide-react';
import { useProgram } from '../context/ProgramContext';
import { WEEK_REWARDS } from '../data/weeksInfo';

export default function RewardsSection() {
  const { countWeekStickers } = useProgram();

  return (
    <div className="bg-white rounded-3xl p-5 clay-card">
      <div className="flex items-center gap-2 mb-4">
        <span className="clay-icon w-9 h-9 rounded-xl flex items-center justify-center bg-pastel-yellow/40">
          <Gift className="w-5 h-5 text-amber-600" />
        </span>
        <span className="font-title font-bold text-amber-800">나의 보상</span>
      </div>
      <p className="text-sm text-slate-600 mb-4">
        각 주차에서 스티커 1개 이상을 받으면 보상을 획득해요!
      </p>
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4, 5, 6].map((week) => {
          const count = countWeekStickers(week);
          const earned = count >= 1;
          return (
            <div
              key={week}
              className={`rounded-2xl p-3 clay-card-subtle flex items-center gap-3 ${
                earned ? 'bg-pastel-yellow/40' : 'bg-slate-50'
              }`}
            >
              <div
                className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden ${
                  earned ? 'bg-white/80' : 'bg-slate-200'
                }`}
              >
                {earned ? (
                  <img
                    src={WEEK_REWARDS[week].image}
                    alt={WEEK_REWARDS[week].name}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <span className="text-sm font-bold text-slate-400">{week}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-500">{week}주차</p>
                <p
                  className={`font-title font-semibold text-sm truncate ${
                    earned ? 'text-amber-800' : 'text-slate-400'
                  }`}
                >
                  {WEEK_REWARDS[week].name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
