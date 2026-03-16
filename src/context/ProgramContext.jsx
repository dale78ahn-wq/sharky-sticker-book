import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useTerm } from './TermContext';
import { apiGetProgram, apiSetProgram } from '../api/client';

const defaultDay = () => ({
  말씀암송: null,
  감사한것: null,
  순종: null,
  존댓말: null,
});

const defaultData = () => ({
  daily: {},
  weeklyAudio: {},
  weeklyDiary: {},
  weeklyBookReport: {},
  weeklyTestimony: {},
});

const ProgramContext = createContext(null);

export function ProgramProvider({ children }) {
  const { user } = useAuth();
  const { year, semester } = useTerm();
  const userName = user?.name || null;
  const [data, setData] = useState(() => defaultData());
  const [loading, setLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!userName) {
      setData(defaultData());
      setLoading(false);
      hasLoadedRef.current = false;
      return;
    }
    let cancelled = false;
    setLoading(true);
    apiGetProgram(year, semester, userName)
      .then((loaded) => {
        if (!cancelled) {
          setData({ ...defaultData(), ...loaded });
          hasLoadedRef.current = true;
        }
      })
      .catch((e) => {
        console.warn('Program load failed', e);
        if (!cancelled) setData(defaultData());
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [year, semester, userName]);

  useEffect(() => {
    if (!userName || !hasLoadedRef.current) return;
    apiSetProgram(year, semester, userName, data).catch((e) =>
      console.warn('Program save failed', e)
    );
  }, [year, semester, userName, data]);

  const getDay = useCallback((week, day) => {
    const key = `${week}-${day}`;
    return data.daily[key] || defaultDay();
  }, [data.daily]);

  const setSticker = useCallback((week, day, column, sticker) => {
    const key = `${week}-${day}`;
    setData((prev) => ({
      ...prev,
      daily: {
        ...prev.daily,
        [key]: {
          ...(prev.daily[key] || defaultDay()),
          [column]: sticker,
        },
      },
    }));
  }, []);

  const getWeeklyAudio = useCallback((week) => data.weeklyAudio[week] ?? null, [data.weeklyAudio]);
  const setWeeklyAudio = useCallback((week, fileInfo) => {
    setData((prev) => ({
      ...prev,
      weeklyAudio: { ...prev.weeklyAudio, [week]: fileInfo },
    }));
  }, []);

  const getWeeklyDiary = useCallback((week) => data.weeklyDiary[week] ?? null, [data.weeklyDiary]);
  const setWeeklyDiary = useCallback((week, fileInfo) => {
    setData((prev) => ({
      ...prev,
      weeklyDiary: { ...prev.weeklyDiary, [week]: fileInfo },
    }));
  }, []);

  const getWeeklyBookReport = useCallback((week) => data.weeklyBookReport[week] ?? null, [data.weeklyBookReport]);
  const setWeeklyBookReport = useCallback((week, fileInfo) => {
    setData((prev) => ({
      ...prev,
      weeklyBookReport: { ...prev.weeklyBookReport, [week]: fileInfo },
    }));
  }, []);

  const getWeeklyTestimony = useCallback((week) => data.weeklyTestimony[week] ?? null, [data.weeklyTestimony]);
  const setWeeklyTestimony = useCallback((week, fileInfo) => {
    setData((prev) => ({
      ...prev,
      weeklyTestimony: { ...prev.weeklyTestimony, [week]: fileInfo },
    }));
  }, []);

  const countWeekStickers = useCallback((week) => {
    let count = 0;
    for (let day = 1; day <= 7; day++) {
      const d = getDay(week, day);
      if (d.말씀암송) count++;
      if (d.감사한것) count++;
      if (d.순종) count++;
      if (d.존댓말) count++;
    }
    return count;
  }, [getDay]);

  const countAllStickers = useCallback(() => {
    let total = 0;
    for (let w = 1; w <= 7; w++) total += countWeekStickers(w);
    return total;
  }, [countWeekStickers]);

  return (
    <ProgramContext.Provider
      value={{
        data,
        loading,
        getDay,
        setSticker,
        getWeeklyAudio,
        setWeeklyAudio,
        getWeeklyDiary,
        setWeeklyDiary,
        getWeeklyBookReport,
        setWeeklyBookReport,
        getWeeklyTestimony,
        setWeeklyTestimony,
        countWeekStickers,
        countAllStickers,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
}

export function useProgram() {
  const ctx = useContext(ProgramContext);
  if (!ctx) throw new Error('useProgram must be used inside ProgramProvider');
  return ctx;
}
