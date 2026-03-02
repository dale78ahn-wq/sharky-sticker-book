import { createContext, useContext, useState, useEffect } from 'react';

const TERM_KEY = 'shining_kids_current_term';

function getDefaultTerm() {
  const now = new Date();
  const year = now.getFullYear();
  const semester = now.getMonth() < 6 ? 1 : 2; // 1~6월=1학기, 7~12월=2학기
  return { year, semester };
}

function loadTerm() {
  try {
    const raw = localStorage.getItem(TERM_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.year && (parsed?.semester === 1 || parsed?.semester === 2)) {
        return { year: parsed.year, semester: parsed.semester };
      }
    }
  } catch (e) {
    console.warn('Term load failed', e);
  }
  return getDefaultTerm();
}

function saveTerm(term) {
  try {
    localStorage.setItem(TERM_KEY, JSON.stringify(term));
  } catch (e) {
    console.warn('Term save failed', e);
  }
}

const TermContext = createContext(null);

export function TermProvider({ children }) {
  const [term, setTermState] = useState(loadTerm);

  useEffect(() => {
    saveTerm(term);
  }, [term]);

  const setCurrentTerm = (year, semester) => {
    setTermState({ year: Number(year), semester: Number(semester) });
  };

  return (
    <TermContext.Provider value={{ term, setCurrentTerm, year: term.year, semester: term.semester }}>
      {children}
    </TermContext.Provider>
  );
}

export function useTerm() {
  const ctx = useContext(TermContext);
  if (!ctx) throw new Error('useTerm must be used inside TermProvider');
  return ctx;
}
