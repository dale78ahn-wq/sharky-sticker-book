// 6개 스티커: 2행 x 3열 스프라이트 (public/stickers.png)
const BASE = process.env.PUBLIC_URL || '';
const STICKERS_IMG = `${BASE}/stickers.png`;

// 스프라이트 위치: background-size 300% 200%, 각 셀 background-position
export const STICKERS = [
  { id: '기도해요', name: '기도해요', pos: '0% 0%' },
  { id: '사랑해요', name: '사랑해요', pos: '50% 0%' },
  { id: '축복해요', name: '축복해요', pos: '100% 0%' },
  { id: '감사해요', name: '감사해요', pos: '0% 100%' },
  { id: '잘했어요', name: '잘했어요', pos: '50% 100%' },
  { id: '최고에요', name: '최고에요', pos: '100% 100%' },
];

export function getStickerStyle(stickerId, size = 48) {
  const s = STICKERS.find((x) => x.id === stickerId);
  if (!s) return null;
  const px = typeof size === 'number' ? `${size}px` : size;
  return {
    backgroundImage: `url(${STICKERS_IMG})`,
    backgroundSize: '300% 200%',
    backgroundPosition: s.pos,
    backgroundRepeat: 'no-repeat',
    width: px,
    height: px,
  };
}

export function isValidStickerId(id) {
  return STICKERS.some((s) => s.id === id);
}
