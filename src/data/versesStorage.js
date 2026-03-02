const VERSES_PREFIX = 'shining_kids_verses_';

function getVersesKey(year, semester) {
  return `${VERSES_PREFIX}${year}_${semester}`;
}

const defaultVerses = () => ({
  '1': [],
  '2': [],
  '3': [],
  '4': [],
  '5': [],
  '6': [],
  '7': [],
});

export function loadVerses(year, semester) {
  try {
    const raw = localStorage.getItem(getVersesKey(year, semester));
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultVerses(), ...parsed };
    }
  } catch (e) {
    console.warn('Verses load failed', e);
  }
  return defaultVerses();
}

export function saveVerses(year, semester, data) {
  try {
    localStorage.setItem(getVersesKey(year, semester), JSON.stringify(data));
  } catch (e) {
    console.warn('Verses save failed', e);
  }
}

export function getWeekVerses(versesData, week) {
  const list = versesData[String(week)];
  return Array.isArray(list) ? list : [];
}
