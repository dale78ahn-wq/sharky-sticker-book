// 7주 프로그램 주차별 제목
export const weekTitles = {
  1: '1주차',
  2: '2주차',
  3: '3주차',
  4: '4주차',
  5: '5주차',
  6: '6주차',
  7: '7주차',
};

// 1~6주차 스티커 1개 이상 시 획득 보상 (에베소서 6장 전신갑주)
const BASE = process.env.PUBLIC_URL || '';
export const WEEK_REWARDS = {
  1: { name: '진리의 허리띠', image: `${BASE}/reward-1.png` },
  2: { name: '의의 호심경', image: `${BASE}/reward-2.png` },
  3: { name: '평안의 신발', image: `${BASE}/reward-3.png` },
  4: { name: '믿음의 방패', image: `${BASE}/reward-4.png` },
  5: { name: '구원의 투구', image: `${BASE}/reward-5.png` },
  6: { name: '성령의 검', image: `${BASE}/reward-6.png` },
};

export const CHECK_COLUMNS = [
  { id: '말씀암송', label: '말씀암송' },
  { id: '감사한것', label: '감사한 것' },
  { id: '순종', label: '순종' },
  { id: '존댓말', label: '존댓말' },
];
