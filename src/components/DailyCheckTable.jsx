import { useProgram } from '../context/ProgramContext';
import { CHECK_COLUMNS } from '../data/weeksInfo';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

export default function DailyCheckTable({ week, onCellClick }) {
  const { getDay } = useProgram();

  return (
    <div className="overflow-x-auto rounded-3xl bg-white clay-card">
      <table className="w-full text-center border-collapse">
        <thead>
          <tr className="bg-pastel-yellow/40">
            <th className="py-3 px-2 rounded-tl-3xl text-amber-800 font-title font-bold border-b-2 border-r border-pastel-pink/30 min-w-[3rem]">
              일자
            </th>
            {CHECK_COLUMNS.map((col) => (
              <th
                key={col.id}
                className="py-3 px-2 text-amber-800 font-title font-bold border-b-2 border-r border-pastel-pink/30 last:border-r-0 min-w-[4rem]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const row = getDay(week, day);
            return (
              <tr key={day} className="border-b border-pastel-purple/20 last:border-b-0">
                <td className="py-2 px-2 border-r border-pastel-purple/20 font-title font-semibold text-slate-600">
                  {WEEKDAY_LABELS[day - 1]}
                </td>
                {CHECK_COLUMNS.map((col) => (
                  <td
                    key={col.id}
                    className="py-2 px-1 border-r border-pastel-purple/20 last:border-r-0 text-center align-middle"
                  >
                    <button
                      type="button"
                      onClick={() => onCellClick(week, day, col.id)}
                      className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center text-2xl clay-btn transition-all duration-200 ${
                        row[col.id]
                          ? 'bg-gradient-to-br from-pastel-yellow/80 to-pastel-yellow/60 text-amber-800'
                          : 'bg-white text-gray-300'
                      }`}
                    >
                      {row[col.id] || '○'}
                    </button>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
