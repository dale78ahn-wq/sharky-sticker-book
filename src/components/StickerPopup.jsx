import { X } from 'lucide-react';
import { STICKERS, getStickerStyle } from '../data/stickers';

export default function StickerPopup({ onSelect, onClose }) {
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

        <div className="grid grid-cols-3 gap-4">
          {STICKERS.map((sticker) => (
            <button
              key={sticker.id}
              type="button"
              onClick={() => onSelect(sticker.id)}
              className="clay-btn rounded-2xl overflow-hidden bg-pastel-yellow/20 flex items-center justify-center p-2 min-w-[100px] min-h-[100px]"
            >
              <div
                className="rounded-xl"
                style={getStickerStyle(sticker.id, 96)}
              />
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
