import { Sticker } from 'lucide-react';

export default function StickerBoard({ tasks, onTaskClick }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-pastel-yellow/50">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Sticker className="w-6 h-6 text-yellow-600" />
        <h2 className="text-2xl font-bold text-yellow-700">스티커 판</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => onTaskClick(task)}
            className={`relative rounded-2xl p-6 text-center transition-all duration-200 ${
              task.sticker
                ? 'bg-gradient-to-br from-pastel-pink to-pastel-purple shadow-md hover:shadow-lg'
                : 'bg-gradient-to-br from-pastel-blue to-pastel-green hover:shadow-md'
            } hover:scale-105 active:scale-95 border-2 ${
              task.sticker ? 'border-pink-300' : 'border-blue-300'
            }`}
          >
            {task.sticker ? (
              <>
                <div className="text-5xl mb-2">{task.sticker}</div>
                <div className="text-sm font-semibold text-purple-700">{task.title}</div>
              </>
            ) : (
              <>
                <div className="text-2xl mb-2">✨</div>
                <div className="text-base font-semibold text-blue-700">{task.title}</div>
                <div className="text-xs text-blue-500 mt-1">클릭하여 시작하기</div>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
