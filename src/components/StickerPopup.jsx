import { X } from 'lucide-react';

export default function StickerPopup({ onSelect, onClose }) {
  const stickers = [
    { emoji: '🌟', name: '별' },
    { emoji: '❤️', name: '하트' },
    { emoji: '🐶', name: '강아지' },
    { emoji: '🏆', name: '트로피' },
    { emoji: '⭐', name: '별표' },
    { emoji: '💖', name: '반짝하트' },
    { emoji: '🎉', name: '축하' },
    { emoji: '🎈', name: '풍선' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 clay-card max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-title font-bold text-amber-800">스티커를 선택해주세요!</h3>
          <button
            onClick={onClose}
            className="clay-btn clay-icon w-10 h-10 rounded-full bg-gradient-to-br from-pastel-pink-btn to-pastel-pink/80 text-amber-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {stickers.map((sticker, index) => (
            <button
              key={index}
              onClick={() => onSelect(sticker.emoji)}
              className="clay-btn bg-gradient-to-br from-pastel-yellow-btn to-pastel-pink-btn rounded-2xl p-4 text-4xl"
            >
              {sticker.emoji}
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          원하는 스티커를 클릭하면 체크표에 붙어요! 🎨
        </p>
      </div>
    </div>
  );
}
