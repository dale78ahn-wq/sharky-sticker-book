import { useState, useEffect } from 'react';
import { Users, ChevronDown, ChevronUp, BookOpen, Save } from 'lucide-react';
import Layout from './Layout';
import { getStudentsList } from '../context/AuthContext';
import { loadStudentData } from '../context/ProgramContext';
import { useTerm } from '../context/TermContext';
import { loadVerses, saveVerses } from '../data/versesStorage';
import { weekTitles } from '../data/weeksInfo';

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = [CURRENT_YEAR + 1, CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

function StudentRow({ name, year, semester }) {
  const [open, setOpen] = useState(false);
  const data = loadStudentData(name, year, semester);
  let totalStickers = 0;
  for (let w = 1; w <= 7; w++) {
    for (let day = 1; day <= 7; day++) {
      const key = `${w}-${day}`;
      const row = data.daily?.[key] || {};
      if (row.말씀암송) totalStickers++;
      if (row.감사한것) totalStickers++;
      if (row.순종) totalStickers++;
      if (row.존댓말) totalStickers++;
    }
  }

  const weekStickerCounts = [1, 2, 3, 4, 5, 6, 7].map((w) => {
    let c = 0;
    for (let day = 1; day <= 7; day++) {
      const key = `${w}-${day}`;
      const row = data.daily?.[key] || {};
      if (row.말씀암송) c++;
      if (row.감사한것) c++;
      if (row.순종) c++;
      if (row.존댓말) c++;
    }
    return { week: w, count: c };
  });

  const audioWeeks = [1, 2, 3, 4, 5, 6, 7].filter((w) => data.weeklyAudio?.[w]);
  const diaryWeeks = [1, 2, 3, 4, 5, 6, 7].filter((w) => data.weeklyDiary?.[w]);
  const bookReport = data.weeklyBookReport?.[5];
  const testimony = data.weeklyTestimony?.[6];

  return (
    <div className="rounded-3xl bg-white clay-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-pastel-yellow/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-600" />
          <span className="font-bold text-amber-800">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-blue-600">스티커 {totalStickers}개</span>
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-pastel-purple/30 pt-3">
          <div>
            <p className="text-sm font-bold text-amber-800 mb-2">주차별 스티커</p>
            <div className="flex flex-wrap gap-2">
              {weekStickerCounts.map(({ week, count }) => (
                <span key={week} className="px-2 py-1 rounded-lg bg-pastel-blue/50 text-sm">
                  {week}주: {count}개
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-amber-800 mb-2">파일 제출 현황</p>
            <ul className="text-sm space-y-1">
              <li>오디오 암송: {audioWeeks.length ? `${audioWeeks.join(', ')}주차` : '없음'}</li>
              <li>암송 일기/필사: {diaryWeeks.length ? `${diaryWeeks.join(', ')}주차` : '없음'}</li>
              <li>5주차 독후감: {bookReport ? `제출 (${bookReport.name})` : '미제출'}</li>
              <li>6주차 간증문: {testimony ? `제출 (${testimony.name})` : '미제출'}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function VersesEditor({ year, semester }) {
  const [verses, setVerses] = useState(() => loadVerses(year, semester));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setVerses(loadVerses(year, semester));
  }, [year, semester]);

  const handleSave = () => {
    saveVerses(year, semester, verses);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const setWeekVerse = (week, index, field, value) => {
    const key = String(week);
    const list = [...(verses[key] || [])];
    if (!list[index]) list[index] = { reference: '', text: '', simplified: '' };
    list[index] = { ...list[index], [field]: value };
    setVerses((prev) => ({ ...prev, [key]: list }));
  };

  const addWeekVerse = (week) => {
    const key = String(week);
    const list = [...(verses[key] || []), { reference: '', text: '', simplified: '' }];
    setVerses((prev) => ({ ...prev, [key]: list }));
  };

  const removeWeekVerse = (week, index) => {
    const key = String(week);
    const list = (verses[key] || []).filter((_, i) => i !== index);
    setVerses((prev) => ({ ...prev, [key]: list }));
  };

  return (
    <div className="bg-white rounded-3xl p-5 clay-card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-yellow-600" />
          <span className="font-bold text-yellow-700">이번 학기 성경 구절 (연도/학기별)</span>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="clay-btn flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-br from-pastel-yellow-btn to-pastel-pink-btn font-title font-semibold text-amber-800"
        >
          <Save className="w-4 h-4" />
          저장
          {saved && <span className="text-xs">✓</span>}
        </button>
      </div>
      {[1, 2, 3, 4, 5, 6, 7].map((week) => (
        <div key={week} className="clay-card-subtle rounded-2xl p-3 bg-pastel-purple/10">
          <p className="font-semibold text-amber-800 mb-2">{weekTitles[week]}</p>
          {(verses[String(week)] || []).map((v, i) => (
            <div key={i} className="mb-3 p-2 clay-card-subtle bg-white rounded-xl space-y-1">
              <input
                type="text"
                value={v.reference || ''}
                onChange={(e) => setWeekVerse(week, i, 'reference', e.target.value)}
                placeholder="예: 창세기 1장 3절"
                className="clay-input w-full text-sm px-2 py-1 rounded-xl text-slate-800"
              />
              <input
                type="text"
                value={v.text || ''}
                onChange={(e) => setWeekVerse(week, i, 'text', e.target.value)}
                placeholder="원문"
                className="clay-input w-full text-sm px-2 py-1 rounded-xl text-slate-800"
              />
              <input
                type="text"
                value={v.simplified || ''}
                onChange={(e) => setWeekVerse(week, i, 'simplified', e.target.value)}
                placeholder="어린이용 요약"
                className="clay-input w-full text-sm px-2 py-1 rounded-xl text-slate-800"
              />
              <button
                type="button"
                onClick={() => removeWeekVerse(week, i)}
                className="text-xs text-slate-600"
              >
                삭제
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addWeekVerse(week)}
            className="text-sm text-amber-700 font-medium"
          >
            + 구절 추가
          </button>
        </div>
      ))}
    </div>
  );
}

export default function AdminScreen() {
  const { term, setCurrentTerm } = useTerm();
  const [yearSelect, setYearSelect] = useState(term.year);
  const [semesterSelect, setSemesterSelect] = useState(term.semester);

  useEffect(() => {
    setYearSelect(term.year);
    setSemesterSelect(term.semester);
  }, [term]);

  const applyTerm = () => {
    setCurrentTerm(Number(yearSelect), Number(semesterSelect));
  };

  const students = getStudentsList().filter((n) => n && !['admin', '관리자'].includes(String(n).trim().toLowerCase()));

  return (
    <Layout title="관리자 - 학생 현황">
      <div className="space-y-6">
        {/* 연도/학기 선택 */}
        <div className="bg-white rounded-3xl p-4 clay-card">
          <p className="text-sm font-bold text-amber-800 mb-2">현재 학기 (데이터 조회 기준)</p>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={yearSelect}
              onChange={(e) => setYearSelect(Number(e.target.value))}
              className="clay-input rounded-2xl px-3 py-2 text-slate-800"
            >
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>{y}년</option>
              ))}
            </select>
            <select
              value={semesterSelect}
              onChange={(e) => setSemesterSelect(Number(e.target.value))}
              className="clay-input rounded-2xl px-3 py-2 text-slate-800"
            >
              <option value={1}>1학기</option>
              <option value={2}>2학기</option>
            </select>
            <button
              type="button"
              onClick={applyTerm}
              className="clay-btn px-4 py-2 rounded-2xl bg-gradient-to-br from-pastel-yellow-btn to-pastel-pink-btn font-title font-semibold text-amber-800"
            >
              적용
            </button>
            <span className="text-sm text-gray-600">
              현재: {term.year}년 {term.semester}학기
            </span>
          </div>
        </div>

        {/* 성경 구절 편집 */}
        <VersesEditor year={term.year} semester={term.semester} />

        {/* 학생 목록 */}
        <div>
          <p className="text-gray-600 text-sm mb-2">
            {term.year}년 {term.semester}학기 학생별 스티커 및 제출 현황입니다.
          </p>
          {students.length === 0 ? (
            <div className="rounded-3xl bg-white p-6 text-center text-slate-600 clay-card">
              아직 등록된 학생이 없어요. 학생이 로그인하면 목록에 나타납니다.
            </div>
          ) : (
            students.map((name) => (
              <StudentRow key={name} name={name} year={term.year} semester={term.semester} />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
